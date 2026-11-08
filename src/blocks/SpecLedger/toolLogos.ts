/**
 * Built-in tool logos for the SpecLedger `tools` row (brochure 2026-11-07 p4).
 * Files are committed under public/brand/tools/ (sources and licences in its
 * README.md), so a page needs no upload to show them.
 */
export const TOOL_LOGOS = {
  shopify: { label: 'Shopify', src: '/brand/tools/shopify.svg' },
  instagram: { label: 'Instagram', src: '/brand/tools/instagram.svg' },
  facebook: { label: 'Facebook', src: '/brand/tools/facebook.svg' },
  tiktok: { label: 'TikTok', src: '/brand/tools/tiktok.svg' },
  meta: { label: 'Meta', src: '/brand/tools/meta.svg' },
  'microsoft-clarity': { label: 'Microsoft Clarity', src: '/brand/tools/microsoft-clarity.png' },
} as const

export type ToolLogo = keyof typeof TOOL_LOGOS

export const toolLogoOptions = (Object.keys(TOOL_LOGOS) as ToolLogo[]).map((value) => ({
  label: TOOL_LOGOS[value].label,
  value,
}))
