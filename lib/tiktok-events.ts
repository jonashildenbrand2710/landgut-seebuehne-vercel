export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim() || "";
export const TIKTOK_EVENT_NAME = "CompleteRegistration";

export type TikTokConversionFunnel = "besichtigung" | "erstgespraech";

export const tiktokCompleteRegistrationData = {
  besichtigung: {
    content_name: "besichtigung"
  },
  erstgespraech: {
    content_name: "erstgespraech"
  }
} satisfies Record<TikTokConversionFunnel, Record<string, string>>;
