import { generateOGImage } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Class B · CRO Core — Duha Media";
export const size = { width: 1200, height: 628 };
export const contentType = "image/png";

export default async function OGImage() {
  return generateOGImage("Class B · CRO Core");
}
