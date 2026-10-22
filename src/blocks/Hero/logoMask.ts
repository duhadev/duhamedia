import type React from 'react'

/** The wine logo silhouette (CSS mask of /logo-duha.png), shared by the Hero variants. */
export const LOGO_MASK: React.CSSProperties = {
  WebkitMaskImage: "url('/logo-duha.png')",
  maskImage: "url('/logo-duha.png')",
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
}
