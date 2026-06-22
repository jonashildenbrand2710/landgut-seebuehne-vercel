import fs from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ENV_FILES = [".env.local", ".env"];

export const DEFAULT_GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly"
];

function stripQuotes(value) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");

    if (!process.env[key]) {
      process.env[key] = stripQuotes(valueParts.join("="));
    }
  }
}

export function loadGoogleEnv() {
  for (const envFile of ENV_FILES) {
    loadEnvFile(envFile);
  }
}

export function optionalEnv(key, fallback = "") {
  return process.env[key]?.trim() || fallback;
}

export function requiredEnv(key) {
  const value = optionalEnv(key);

  if (!value) {
    throw new Error(`Missing ${key}. Add it to .env.local.`);
  }

  return value;
}

export function googleScopes() {
  return optionalEnv("GOOGLE_OAUTH_SCOPES")
    .split(/\s+/)
    .map((scope) => scope.trim())
    .filter(Boolean)
    .concat(optionalEnv("GOOGLE_OAUTH_SCOPES") ? [] : DEFAULT_GOOGLE_SCOPES);
}

export function tokenFilePath() {
  return path.resolve(optionalEnv("GOOGLE_OAUTH_TOKEN_FILE", ".secrets/google-oauth-token.json"));
}

export function pendingAuthFilePath() {
  return path.resolve(optionalEnv("GOOGLE_OAUTH_PENDING_FILE", ".secrets/google-oauth-pending.json"));
}

export async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

export async function writeJson(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

export async function refreshAccessToken(token) {
  if (!token.refresh_token) {
    throw new Error("Token file has no refresh_token. Run npm run google:auth again.");
  }

  const params = new URLSearchParams({
    client_id: requiredEnv("GOOGLE_OAUTH_CLIENT_ID"),
    refresh_token: token.refresh_token,
    grant_type: "refresh_token"
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
    throw new Error(`Could not refresh Google token: ${JSON.stringify(body)}`);
  }

  const updatedToken = {
    ...token,
    ...body,
    refresh_token: body.refresh_token || token.refresh_token,
    expiry_date: Date.now() + body.expires_in * 1000
  };

  await writeJson(tokenFilePath(), updatedToken);
  return updatedToken;
}

export async function validAccessToken() {
  const filePath = tokenFilePath();
  let token;

  try {
    token = await readJson(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Missing Google OAuth token at ${filePath}. Run npm run google:auth first.`);
    }

    throw error;
  }

  if (!token.access_token || !token.expiry_date || token.expiry_date < Date.now() + 60000) {
    token = await refreshAccessToken(token);
  }

  return token.access_token;
}
