import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes
} from "node:crypto";

export const HOCHZEITSMAPPE_ACCESS_COOKIE = "hochzeitsmappe_access";
export const HOCHZEITSMAPPE_ACCESS_PATH = "/hochzeitsmappe-dornrose";
export const HOCHZEITSMAPPE_ACCESS_TTL_SECONDS = 60 * 60 * 24 * 90;

type AccessPayload = {
  exp: number;
  iat: number;
  sub: string;
  v: 1;
};

function getSecret() {
  const configured = process.env.HOCHZEITSMAPPE_MAGIC_LINK_SECRET?.trim();

  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("HOCHZEITSMAPPE_MAGIC_LINK_SECRET is not configured");
    }

    return "local-development-only-hochzeitsmappe-secret";
  }

  if (configured.length < 32) {
    throw new Error("HOCHZEITSMAPPE_MAGIC_LINK_SECRET must contain at least 32 characters");
  }

  return configured;
}

function encryptionKey() {
  return createHash("sha256").update(getSecret()).digest();
}

function emailSubject(email: string) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("base64url");
}

function decodeBase64Url(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error("Invalid base64url value");
  }

  const decoded = Buffer.from(value, "base64url");

  if (decoded.toString("base64url") !== value) {
    throw new Error("Non-canonical base64url value");
  }

  return decoded;
}

export function createHochzeitsmappeAccessToken(
  email: string,
  now = Math.floor(Date.now() / 1000)
) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const payload: AccessPayload = {
    exp: now + HOCHZEITSMAPPE_ACCESS_TTL_SECONDS,
    iat: now,
    sub: emailSubject(email),
    v: 1
  };
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final()
  ]);
  const authenticationTag = cipher.getAuthTag();

  return ["v1", iv.toString("base64url"), authenticationTag.toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function verifyHochzeitsmappeAccessToken(
  token: string | null | undefined,
  now = Math.floor(Date.now() / 1000)
): AccessPayload | null {
  if (!token) {
    return null;
  }

  try {
    const [version, rawIv, rawAuthenticationTag, rawEncrypted, ...extra] = token.split(".");

    if (version !== "v1" || !rawIv || !rawAuthenticationTag || !rawEncrypted || extra.length) {
      return null;
    }

    const iv = decodeBase64Url(rawIv);
    const authenticationTag = decodeBase64Url(rawAuthenticationTag);
    const encrypted = decodeBase64Url(rawEncrypted);

    if (iv.length !== 12 || authenticationTag.length !== 16 || !encrypted.length) {
      return null;
    }

    const decipher = createDecipheriv(
      "aes-256-gcm",
      encryptionKey(),
      iv
    );

    decipher.setAuthTag(authenticationTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]).toString("utf8");
    const payload = JSON.parse(decrypted) as Partial<AccessPayload>;

    if (
      payload.v !== 1 ||
      typeof payload.exp !== "number" ||
      typeof payload.iat !== "number" ||
      typeof payload.sub !== "string" ||
      payload.exp <= now ||
      payload.iat > now + 300
    ) {
      return null;
    }

    return payload as AccessPayload;
  } catch {
    return null;
  }
}

export function createHochzeitsmappeAccessUrl(token: string, baseUrl: string | URL) {
  const url = new URL("/api/hochzeitsmappe/zugang", baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
}
