import { generateOGImage } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Free 15-Minute Shopify Audit — Duha Media";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return generateOGImage("Free 15-Minute Shopify Audit");
}
