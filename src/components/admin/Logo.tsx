import Image from 'next/image'
import React from 'react'

/**
 * Admin login / create-first-user logo (`admin.components.graphics.Logo`).
 * Server component; same mark + wordmark as the site header (SiteLogo). Styled by
 * `.duha-admin-logo` in src/app/(payload)/custom.scss (brand fonts are loaded there).
 */
export default function AdminLogo() {
  return (
    <div className="duha-admin-logo">
      <Image src="/logo-duha.png" alt="" width={56} height={56} unoptimized priority />
      <span className="duha-admin-logo__word">DUHA MEDIA</span>
    </div>
  )
}
