/**
 * Built-in tool logos for the SpecLedger `tools` row (a file `src`, or an inline Phosphor `icon` path) (brochure 2026-11-07 p4).
 * Files are committed under public/brand/tools/ (sources and licences in its
 * README.md), so a page needs no upload to show them.
 */
const PHOSPHOR_HANDSHAKE =
  'M253.88,108.11l-25.530-51a20,20,0,0,0-26.83-9L178.34,59.7,131.7,44.58a12.14,12.14,0,0,0-7.4,0L77.66,59.7,54.48,48.11a20,20,0,0,0-26.83,9L2.12,108.11a20,20,0,0,0,9,26.83l26.67,13.34,51.18,37.41A12.150,12.150,0,0,0,93,187.62l62,16a12.27,12.27,0,0,0,3,.38,12,12,0,0,0,8.48-3.52l52.62-52.62,25.83-12.92a20,20,0,0,0,8.95-26.830Zm-58.12,29.15-27.52-26a12,12,0,0,0-16.76.26c-9.66,9.74-25.06,16.81-40.81,9.55l38.19-37h22.72l25.81,51.63ZM47.32,71.37,60.59,78l-22,43.9-13.27-6.63Zm107,107.3L101.23,165l-42-30.66L85.17,82.5,128,68.61l1.69.55L90,107.68l-.13.12a20,20,0,0,0,3.4,31c20.95,13.39,46,12.07,66.33-2.73l19.2,18.15Zm63-56.77-22-43.9,13.27-6.63,21.950,43.9ZM118.55,219a12,12,0,0,1-14.62,8.62l-26.6-6.87a12,12,0,0,1-4.08-1.93L48.92,201a12,12,0,0,1,14.16-19.37l22.47,16.42,24.38,6.29A12,12,0,0,1,118.55,219Z'
const PHOSPHOR_SPARKLE =
  'M199,125.31l-49.88-18.39L130.69,57a19.92,19.92,0,0,0-37.38,0L74.92,106.92,25,125.31a19.92,19.92,0,0,0,0,37.38l49.88,18.39L93.31,231a19.92,19.92,0,0,0,37.38,0l18.39-49.88L199,162.690a19.92,19.92,0,0,0,0-37.38Zm-63.38,35.16a12,12,0,0,0-7.11,7.11L112,212.28l-16.47-44.7a12,12,0,0,0-7.11-7.11L43.72,144l44.7-16.47a12,12,0,0,0,7.11-7.11L112,75.72l16.47,44.7a12,12,0,0,0,7.11,7.11L180.28,144ZM140,40a12,12,0,0,1,12-12h12V16a12,12,0,0,1,24,0V28h12a12,12,0,0,1,0,24H188V64a12,12,0,0,1-24,0V52H152A12,12,0,0,1,140,40ZM252,88a12,12,0,0,1-12,12h-4v4a12,12,0,0,1-24,0v-4h-4a12,12,0,0,1,0-24h4V72a12,12,0,0,1,24,0v4h4A12,12,0,0,1,252,88Z'

export type ToolLogoDef = { label: string; src: string; icon?: undefined } | { label: string; icon: string; src?: undefined }

export const TOOL_LOGOS = {
  shopify: { label: 'Shopify', src: '/brand/tools/shopify.svg' },
  instagram: { label: 'Instagram', src: '/brand/tools/instagram.svg' },
  facebook: { label: 'Facebook', src: '/brand/tools/facebook.svg' },
  tiktok: { label: 'TikTok', src: '/brand/tools/tiktok.svg' },
  meta: { label: 'Meta', src: '/brand/tools/meta.svg' },
  'microsoft-clarity': { label: 'Microsoft Clarity', src: '/brand/tools/microsoft-clarity.png' },
  google: { label: 'Google', src: '/brand/tools/google.svg' },
  'google-search-console': { label: 'Google Search Console', src: '/brand/tools/googlesearchconsole.svg' },
  claude: { label: 'Claude', src: '/brand/tools/claude.svg' },
  // Phosphor Bold (MIT), 256-unit viewBox; drawn in the text colour, so ink.
  handshake: { label: 'Handshake (icon)', icon: PHOSPHOR_HANDSHAKE },
  sparkle: { label: 'Sparkle (icon)', icon: PHOSPHOR_SPARKLE },
} as const satisfies Record<string, ToolLogoDef>

export type ToolLogo = keyof typeof TOOL_LOGOS

export const toolLogoOptions = (Object.keys(TOOL_LOGOS) as ToolLogo[]).map((value) => ({
  label: TOOL_LOGOS[value].label,
  value,
}))
