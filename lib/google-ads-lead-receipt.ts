import { createHmac, timingSafeEqual } from "node:crypto";

export const GOOGLE_ADS_LEAD_COOKIE = "lsb_ads_lead";
export const GOOGLE_ADS_LEAD_COOKIE_PATH = "/hochzeitsmappe/online";
export const GOOGLE_ADS_LEAD_RECEIPT_TTL = 30 * 60;

function receiptSecret() {
  // Domain-separated HMACs use the existing server-only mappe key. No contact
  // details or access tokens are included in the advertising receipt.
  const secret = process.env.HOCHZEITSMAPPE_MAGIC_LINK_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : null;
}

export function isGoogleAdsLeadReceiptConfigured() {
  return receiptSecret() !== null;
}

function signature(body: string, secret: string) {
  return createHmac("sha256", secret).update(`google-ads-lead-receipt:v1:${body}`).digest();
}

export function createGoogleAdsLeadReceipt(leadId: string, now = Math.floor(Date.now() / 1000)) {
  const secret = receiptSecret();
  if (!secret || !leadId.trim()) return null;
  const transactionId = `lead_${createHmac("sha256", secret)
    .update(`google-ads-lead-id:v1:${leadId}`)
    .digest("hex")}`;
  const body = Buffer.from(JSON.stringify({
    v: 1,
    transactionId,
    iat: now,
    exp: now + GOOGLE_ADS_LEAD_RECEIPT_TTL
  })).toString("base64url");
  return `${body}.${signature(body, secret).toString("base64url")}`;
}

export function verifyGoogleAdsLeadReceipt(receipt: string | undefined, now = Math.floor(Date.now() / 1000)) {
  const secret = receiptSecret();
  if (!secret || !receipt || receipt.length > 1024) return null;
  try {
    const [body, rawSignature, ...extra] = receipt.split(".");
    if (!body || !rawSignature || extra.length) return null;
    const actual = Buffer.from(rawSignature, "base64url");
    const expected = signature(body, secret);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.v !== 1 || !/^lead_[a-f0-9]{64}$/.test(payload.transactionId) ||
      !Number.isInteger(payload.iat) || !Number.isInteger(payload.exp) ||
      payload.iat > now || payload.exp <= now ||
      payload.exp - payload.iat !== GOOGLE_ADS_LEAD_RECEIPT_TTL) return null;
    return { transactionId: payload.transactionId as string };
  } catch {
    return null;
  }
}
