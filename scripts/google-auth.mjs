import crypto from "node:crypto";
import http from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import {
  googleScopes,
  loadGoogleEnv,
  optionalEnv,
  pendingAuthFilePath,
  readJson,
  requiredEnv,
  tokenFilePath,
  writeJson
} from "./google-env.mjs";

const execFileAsync = promisify(execFile);

function base64Url(buffer) {
  return buffer
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/g, "");
}

function makePkcePair() {
  const verifier = base64Url(crypto.randomBytes(64));
  const challenge = base64Url(crypto.createHash("sha256").update(verifier).digest());

  return { verifier, challenge };
}

async function tryOpenBrowser(url) {
  const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];

  try {
    await execFileAsync(command, args);
  } catch {
    // Printing the URL is enough when no desktop opener is available.
  }
}

function waitForOAuthCode(redirectUri, expectedState) {
  const redirectUrl = new URL(redirectUri);
  const port = Number(redirectUrl.port || 80);
  const host = redirectUrl.hostname;

  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      const requestUrl = new URL(request.url ?? "/", redirectUri);

      if (requestUrl.pathname !== redirectUrl.pathname) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      const code = requestUrl.searchParams.get("code");
      const state = requestUrl.searchParams.get("state");
      const error = requestUrl.searchParams.get("error");

      if (error) {
        response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
        response.end(`Google OAuth error: ${error}`);
        server.close();
        reject(new Error(`Google OAuth error: ${error}`));
        return;
      }

      if (!code || state !== expectedState) {
        response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
        response.end("Invalid OAuth response.");
        server.close();
        reject(new Error("Invalid OAuth response."));
        return;
      }

      response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
      response.end("Google access granted. You can close this tab and return to Codex.");
      server.close();
      resolve(code);
    });

    server.on("error", reject);
    server.listen(port, host);
  });
}

async function exchangeCodeForToken({ code, codeVerifier, redirectUri }) {
  const params = new URLSearchParams({
    code,
    client_id: requiredEnv("GOOGLE_OAUTH_CLIENT_ID"),
    code_verifier: codeVerifier,
    grant_type: "authorization_code",
    redirect_uri: redirectUri
  });

  const clientSecret = optionalEnv("GOOGLE_OAUTH_CLIENT_SECRET");

  if (clientSecret) {
    params.set("client_secret", clientSecret);
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(`Could not exchange Google OAuth code: ${JSON.stringify(body)}`);
  }

  return {
    ...body,
    expiry_date: Date.now() + body.expires_in * 1000
  };
}

function callbackUrlFromArgs() {
  const callbackArgIndex = process.argv.indexOf("--callback-url");

  if (callbackArgIndex !== -1) {
    return process.argv[callbackArgIndex + 1] ?? "";
  }

  return optionalEnv("GOOGLE_OAUTH_CALLBACK_URL");
}

async function exchangeCallbackUrl(callbackUrl) {
  const pending = await readJson(pendingAuthFilePath());
  const parsed = new URL(callbackUrl);
  const code = parsed.searchParams.get("code");
  const state = parsed.searchParams.get("state");
  const error = parsed.searchParams.get("error");

  if (error) {
    throw new Error(`Google OAuth error: ${error}`);
  }

  if (!code) {
    throw new Error("Callback URL does not contain an OAuth code.");
  }

  if (state !== pending.state) {
    throw new Error("Callback state does not match the pending OAuth request. Start npm run google:auth again.");
  }

  const token = await exchangeCodeForToken({
    code,
    codeVerifier: pending.codeVerifier,
    redirectUri: pending.redirectUri
  });

  await writeJson(tokenFilePath(), token);
  console.log(`Google OAuth token saved to ${tokenFilePath()}`);
}

async function main() {
  loadGoogleEnv();

  const callbackUrl = callbackUrlFromArgs();

  if (callbackUrl) {
    await exchangeCallbackUrl(callbackUrl);
    return;
  }

  const redirectUri = optionalEnv("GOOGLE_OAUTH_REDIRECT_URI", "http://127.0.0.1:8080/oauth2callback");
  const scopes = googleScopes();
  const state = base64Url(crypto.randomBytes(24));
  const pkce = makePkcePair();

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", requiredEnv("GOOGLE_OAUTH_CLIENT_ID"));
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes.join(" "));
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", pkce.challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  await writeJson(pendingAuthFilePath(), {
    state,
    codeVerifier: pkce.verifier,
    redirectUri,
    scopes,
    createdAt: new Date().toISOString()
  });

  const codePromise = waitForOAuthCode(redirectUri, state);

  console.log("Open this URL and grant Google read access:");
  console.log(authUrl.toString());
  await tryOpenBrowser(authUrl.toString());

  const code = await codePromise;
  const token = await exchangeCodeForToken({
    code,
    codeVerifier: pkce.verifier,
    redirectUri
  });

  await writeJson(tokenFilePath(), token);

  console.log(`Google OAuth token saved to ${tokenFilePath()}`);

  if (!token.refresh_token) {
    console.warn("No refresh_token returned. Re-run with prompt=consent or remove the app access in Google first.");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
