import { generateOGImage } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Services — Duha Media";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return generateOGImage("Services");
}
