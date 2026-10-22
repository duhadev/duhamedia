import Image from 'next/image'
import React from 'react'

import type { Media as MediaDoc } from '@/payload-types'

type SizeName = keyof NonNullable<MediaDoc['sizes']>

/**
 * Payload builds absolute upload URLs from `serverURL` (SITE_URL). next/image
 * only allows the configured `localPatterns` (`/api/media/file/**`,
 * next.config.ts), so keep the path + query and drop the origin.
 */
const toLocalPath = (url: string): string => {
  if (url.startsWith('/')) return url
  try {
    const parsed = new URL(url)
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
}

/**
 * Renders a media document with `next/image` (B0). Alt comes from the media
 * doc (required and validated on upload, SCHEMA §6.9); pass `alt=""` only for
 * a purely decorative image. With `fill`, the doc's focal point becomes the
 * `object-position`.
 *
 * Renders nothing for an empty or unpopulated (id-only) upload field.
 * `size` picks one of the Media collection's generated sizes when present.
 */
export function Media({
  resource,
  size,
  fill = false,
  sizes,
  preload = false,
  alt,
  className,
}: {
  resource: MediaDoc | number | null | undefined
  size?: SizeName
  fill?: boolean
  /** The `sizes` attribute, e.g. "(min-width: 768px) 50vw, 100vw". Needed with `fill`. */
  sizes?: string
  /** Above-the-fold LCP image (next@16 `preload`, replaces `priority`). */
  preload?: boolean
  alt?: string
  className?: string
}) {
  if (!resource || typeof resource !== 'object') return null
  const variant = size ? resource.sizes?.[size] : undefined
  const url = variant?.url || resource.url
  if (!url) return null

  const src = toLocalPath(url)
  const altText = alt ?? resource.alt ?? ''
  const unoptimized = resource.mimeType === 'image/svg+xml'

  if (fill) {
    const position =
      typeof resource.focalX === 'number' && typeof resource.focalY === 'number'
        ? `${resource.focalX}% ${resource.focalY}%`
        : undefined
    return (
      <Image
        src={src}
        alt={altText}
        fill
        sizes={sizes ?? '100vw'}
        preload={preload}
        unoptimized={unoptimized}
        className={className}
        style={position ? { objectFit: 'cover', objectPosition: position } : { objectFit: 'cover' }}
      />
    )
  }

  const width = (variant?.url ? variant.width : resource.width) ?? undefined
  const height = (variant?.url ? variant.height : resource.height) ?? undefined
  if (!width || !height) return null

  return (
    <Image
      src={src}
      alt={altText}
      width={width}
      height={height}
      sizes={sizes}
      preload={preload}
      unoptimized={unoptimized}
      className={className}
    />
  )
}
