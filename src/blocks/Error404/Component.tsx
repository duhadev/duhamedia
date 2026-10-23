import React from 'react'

import { ButtonLink, DotMatrix, Section } from '@/components/ui'
import type { CMSLinkData } from '@/components/ui'

import { ERROR404_DEFAULTS } from './config'

const LOGO_MASK: React.CSSProperties = {
  WebkitMaskImage: "url('/logo-duha.png')",
  maskImage: "url('/logo-duha.png')",
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
}

/** Local type matching the config exactly (swap for `BlockData<'error404'>` once registered). */
export interface Error404Data {
  code?: string | null
  heading?: string | null
  body?: string | null
  links?: { id?: string | null; link: CMSLinkData }[] | null
}

const filled = (v: string | null | undefined): v is string => Boolean(v && v.trim())

/**
 * Pure render of the 404 state (404.dc.html, desktop + mobile). Every part falls
 * back to the shipped wording, and an empty button list falls back to the three
 * default links, so the page can never be a dead end. Also used by not-found.tsx
 * when no `404` page document exists.
 */
export function Error404View({ code, heading, body, links }: Error404Data = {}) {
  const numeral = code === undefined || code === null ? ERROR404_DEFAULTS.code : code.trim()
  const title = filled(heading) ? heading.trim() : ERROR404_DEFAULTS.heading
  const text = body === undefined || body === null ? ERROR404_DEFAULTS.body : body.trim()
  const rows: NonNullable<Error404Data['links']> = links && links.length > 0 ? links : [...ERROR404_DEFAULTS.links]
  const [primary, ...rest] = rows.slice(0, 3)

  return (
    <Section tone="light" pad="none" className="relative min-h-[60vh] overflow-hidden pt-18 pb-20 md:py-30">
      <DotMatrix fade="corner" />
      <div
        aria-hidden="true"
        style={LOGO_MASK}
        className="pointer-events-none absolute top-[12%] -right-30 z-0 size-60 bg-ground-accent md:top-[20%] md:-right-45 md:size-95"
      />
      <div className="relative z-10 mx-auto max-w-site px-container-mobile md:px-container">
        {numeral ? (
          <span
            aria-hidden="true"
            className="block font-display text-[clamp(6rem,30vw,9rem)] leading-[0.9] tracking-[-0.02em] md:text-[clamp(6rem,18vw,14rem)]"
          >
            {numeral}
          </span>
        ) : null}
        <div className="mt-5 max-w-[34ch] text-[1.0625rem] leading-[1.6] md:mt-6 md:max-w-[44ch] md:text-body">
          <h1 className="m-0 inline text-[length:inherit] font-[inherit] leading-[inherit]">{title}</h1>
          {text ? <> {text}</> : null}
        </div>
        {primary ? (
          <div className="mt-7 flex flex-col gap-3 md:mt-8 md:flex-row md:flex-wrap md:gap-3.5">
            <ButtonLink link={primary.link} variant="primary" size="md" className="w-full justify-center md:w-auto" />
            {rest.length > 0 ? (
              <div className="flex gap-3 md:contents">
                {rest.map((r, i) => (
                  <ButtonLink
                    key={r.id ?? i}
                    link={r.link}
                    variant="ghost"
                    size="md"
                    className="flex-1 justify-center md:flex-none"
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Section>
  )
}

/** Block entry point (server component, no interactivity). */
export function Error404Block(props: Error404Data) {
  return <Error404View {...props} />
}
