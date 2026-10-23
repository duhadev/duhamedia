import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { RichText } from '@/components/RichText'
import { DotMatrix, Eyebrow } from '@/components/ui'
import { cx } from '@/lib/cx'

import { legalAnchors, type LegalAnchor } from './anchors'
import type { RichContentProps } from './Component'

/** The wine logo silhouette (CSS mask of /logo-duha.png), as in Legal.dc.html (same idiom as Hero / FinalCTA). */
const LOGO_MASK: React.CSSProperties = {
  WebkitMaskImage: "url('/logo-duha.png')",
  maskImage: "url('/logo-duha.png')",
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
}

/** Legal.dc.html links in the document: bold with a 2px ink rule beneath. */
const LINK_CLASS = 'border-b-2 border-ink font-bold no-underline'

/**
 * Anchored H2s clear the sticky chrome: mobile header 60 + section nav 45 (+16);
 * md header 72 + nav 45 (+16); lg header 72 + 32 (the sidebar's top offset).
 */
const H2_CLASS =
  'scroll-mt-30 font-display text-[1.125rem] font-normal uppercase md:scroll-mt-34 lg:scroll-mt-26 lg:text-[1.25rem] [&:not(:first-child)]:mt-8 lg:[&:not(:first-child)]:mt-10'

const makeConverters =
  (ids: Map<object, string>): JSXConvertersFunction =>
  () => ({
    heading: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      const tag = (node as { tag?: string }).tag ?? 'h2'
      if (tag === 'h1' || tag === 'h2') {
        return (
          <h2 id={ids.get(node as object)} className={H2_CLASS}>
            {children}
          </h2>
        )
      }
      if (tag === 'h3') {
        return <h3 className="font-display text-[1rem] font-normal uppercase lg:text-[1.0625rem]">{children}</h3>
      }
      return <h4 className="font-bold">{children}</h4>
    },
    quote: ({ node, nodesToJSX }) => (
      <blockquote className="border-l-4 border-ground-accent pl-4 md:pl-5">{nodesToJSX({ nodes: node.children })}</blockquote>
    ),
    horizontalrule: <hr className="border-0 border-t border-divider" />,
    upload: () => {
      console.warn('[RichContent legal] images are not shown in a legal document; skipped')
      return null
    },
  })

function formatDate(value: string | null | undefined): { iso: string; text: string } | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    console.error('[RichContent legal] lastUpdated is not a valid date; line hidden')
    return null
  }
  return {
    iso: date.toISOString().slice(0, 10),
    text: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date),
  }
}

/** Mobile build (Legal.dc.html "Section nav"): sticky horizontal rail under the 60px header; below lg. */
function SectionRail({ anchors, label }: { anchors: LegalAnchor[]; label: string }) {
  return (
    <nav
      aria-label={label}
      className="sticky top-header-mobile z-10 mt-6 border-b border-divider bg-cream md:top-header lg:hidden"
    >
      <ul className="flex gap-1 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {anchors.map((a) => (
          <li key={a.id} className="shrink-0">
            <a
              href={`#${a.id}`}
              className="inline-flex min-h-target items-center whitespace-nowrap px-2.5 py-3.25 text-[0.8125rem] font-bold no-underline"
            >
              {a.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Desktop build (Legal.dc.html "Legal document" nav): sticky "On this page" sidebar, 2px ink rule; from lg. */
function SectionSidebar({ anchors, label }: { anchors: LegalAnchor[]; label: string }) {
  return (
    <nav
      aria-label={label}
      className="sticky top-26 hidden flex-col gap-0.5 border-l-2 border-ink lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:flex"
    >
      <p
        aria-hidden="true"
        className="pt-2 pb-3 pl-5 text-[0.8125rem] font-bold uppercase tracking-eyebrow text-gray-warm"
      >
        {label}
      </p>
      <ul className="flex flex-col gap-0.5">
        {anchors.map((a) => (
          <li key={a.id}>
            <a href={`#${a.id}`} className="flex min-h-target items-center px-5 py-2.5 text-small no-underline">
              {a.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * RichContent `legal` (Legal.dc.html: desktop "Legal document"; mobile "Legal
 * head" + "Section nav" + "Legal document"). Documented exception: this block
 * renders the page's H1 (p20 has no Hero). Section links are generated from the
 * body's H2s (anchors.ts); no H2s → no sidebar / rail. Server component: the
 * links are plain in-page anchors, no client JS.
 *
 * The design has no tablet build: the mobile treatment (head, sticky rail)
 * runs below lg, where the 240px sidebar + 64px gap would squeeze the text.
 */
export function RichContentLegal({ eyebrow, heading, lastUpdated, lastUpdatedLabel, navLabel, body }: RichContentProps) {
  const children = body?.root?.children
  const hasBody = Array.isArray(children) && children.length > 0
  const title = heading?.trim()
  if (!title) console.error('[RichContent legal] no document title: the page has no H1. Add the title in the block.')
  if (!hasBody && !title) return null

  const anchors = hasBody ? legalAnchors(children) : []
  const ids = new Map(anchors.map((a) => [a.node, a.id]))
  const date = formatDate(lastUpdated)
  const dateLabel = lastUpdatedLabel?.trim()
  const nav = navLabel?.trim() || 'On this page'
  const hasNav = anchors.length > 0

  return (
    <section data-tone="light" className="relative overflow-clip bg-cream pt-11 pb-14 text-ink lg:pt-20 lg:pb-24">
      <DotMatrix className="bottom-auto h-48 lg:h-250" />
      <div
        aria-hidden="true"
        style={LOGO_MASK}
        className="pointer-events-none absolute -top-15 -right-30 z-0 size-60 bg-ground-accent lg:-top-20 lg:-right-40 lg:size-85"
      />
      <div
        className={cx(
          'relative z-10 mx-auto w-full max-w-site lg:px-container',
          hasNav && 'lg:grid lg:grid-cols-[240px_1fr] lg:items-start lg:gap-x-16',
        )}
      >
        <header className={cx('max-w-170 px-container-mobile md:px-container lg:px-0', hasNav && 'lg:col-start-2 lg:row-start-1')}>
          {eyebrow?.trim() ? <Eyebrow muted>{eyebrow}</Eyebrow> : null}
          {title ? (
            <h1
              className={cx(
                'font-display text-[1.75rem] font-normal uppercase leading-[1.08] lg:text-h2',
                eyebrow?.trim() && 'mt-3.5 lg:mt-4',
              )}
            >
              {title}
            </h1>
          ) : null}
          {date ? (
            <p className="mt-2.5 text-small text-gray-warm lg:mt-3">
              {dateLabel ? `${dateLabel}: ` : null}
              <time dateTime={date.iso}>{date.text}</time>
            </p>
          ) : null}
        </header>

        {hasNav ? <SectionRail anchors={anchors} label={nav} /> : null}
        {hasNav ? <SectionSidebar anchors={anchors} label={nav} /> : null}

        {hasBody ? (
          <div
            className={cx(
              'max-w-170 px-container-mobile pt-9 md:px-container lg:px-0 lg:pt-12',
              hasNav && 'lg:col-start-2 lg:row-start-2',
            )}
          >
            <RichText
              data={body}
              converters={makeConverters(ids)}
              linkClassName={LINK_CLASS}
              className={cx(
                'text-[1rem] leading-[1.7] lg:text-[1.0625rem]',
                '[&>*+*]:mt-4 [&>h2+*]:mt-2.5 lg:[&>h2+*]:mt-3',
                '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li+li]:mt-2 [&_strong]:font-bold',
              )}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
