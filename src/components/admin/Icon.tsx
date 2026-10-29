import Image from 'next/image'
import React from 'react'

/** Admin nav mark (`admin.components.graphics.Icon`): the single-colour wine logo. */
export default function AdminIcon() {
  return <Image className="duha-admin-icon" src="/logo-duha.png" alt="Duha Media" width={24} height={24} unoptimized />
}
