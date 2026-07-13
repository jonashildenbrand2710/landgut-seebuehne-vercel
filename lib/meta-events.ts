export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "";
export const META_GRAPH_API_VERSION = "v22.0";
export const META_EVENT_NAME = "CompleteRegistration";

export type MetaConversionFunnel = "erstgespraech" | "hochzeitsmappe";

export const metaConversionCustomData = {
  erstgespraech: {
    content_name: "erstgespraech",
    currency: "EUR",
    funnel: "erstgespraech",
    lead_type: "appointment"
  },
  hochzeitsmappe: {
    content_name: "hochzeitsmappe",
    currency: "EUR",
    funnel: "hochzeitsmappe",
    lead_type: "lead_magnet"
  }
} satisfies Record<MetaConversionFunnel, Record<string, string>>;

export function isMetaConversionFunnel(value: string | null | undefined): value is MetaConversionFunnel {
  return value === "erstgespraech" || value === "hochzeitsmappe";
}
