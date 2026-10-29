import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { BlockData } from '@/blocks/types'
import { RichText, type RichTextData } from '@/components/RichText'
import { AccentHeadline, ButtonLink, Eyebrow, Media, resolveLinkHref, Section } from '@/components/ui'
import type { Media as MediaDoc } from '@/payload-types'

import { RichContentBand } from './Band'
import { RichContentLegal } from './Legal'

/** Any Lexical editor state saved by a `richText` field (same shape in every collection). */
export type ArticleBodyData = RichTextData

export type RichContentProps = BlockData<'richContent'>

type UploadNode = { value?: unknown; fields?: { caption?: string | null; alt?: string | null } | null }
type HeadingNode = { tag?: string; children: never }

const H2_BASE =
  'font-display text-[1.25rem] font-normal uppercase leading-[1.15] md:text-[1.375rem] [&:not(:first-child)]:mt-2.5 md:[&:not(:first-child)]:mt-3.5'
// 01 / 02 / 03 above the heading (design: wine display numeral, 14px, 8px gap). Counter lives on the prose wrapper.
const H2_NUMBER =
  '[counter-increment:article-section] before:mb-1.5 before:block before:font-display before:text-[0.8125rem] before:leading-[1.7] before:text-ground-accent before:content-[counter(article-section,decimal-leading-zero)] md:before:mb-2 md:before:text-[0.875rem]'

/** Article link style (passed to the shared RichText link converters). */
// Site text-link grammar (interaction system): bold, 2px rule that redraws L->R on hover. Replaces the
// former underline + wine hover, which the final page designs do not use (their links hover to ink).
const LINK_CLASS = 'ix-rule font-bold no-underline'

/**
 * Converters for the article typography (Case Study.dc.html "Article body"),
 * layered over the shared ones in src/components/RichText.tsx (which own the
 * link rules: docPath internal links, unresolved → plain text, safe URLs).
 * - h1 in content becomes h2 (the page's only h1 is the Hero); h5/h6 become h4.
 * - Uploads render through next/image (`Media`) in the 2px ink frame, caption
 *   below. An unpopulated upload is logged and skipped.
 */
const makeConverters =
  (numbered: boolean): JSXConvertersFunction =>
  () => ({
    heading: ({ node, nodesToJSX }) => {
      const n = node as unknown as HeadingNode & { children: Parameters<typeof nodesToJSX>[0]['nodes'] }
      const children = nodesToJSX({ nodes: n.children })
      const tag = n.tag ?? 'h2'
      if (tag === 'h1' || tag === 'h2') {
        return <h2 className={numbered ? `${H2_BASE} ${H2_NUMBER}` : H2_BASE}>{children}</h2>
      }
      if (tag === 'h3') {
        return (
          <h3 className="font-display text-[1.125rem] font-normal uppercase leading-[1.2] [&:not(:first-child)]:mt-1.5 md:text-[1.25rem]">
            {children}
          </h3>
        )
      }
      return <h4 className="text-[1.0625rem] font-bold leading-[1.4] [&:not(:first-child)]:mt-1">{children}</h4>
    },
    quote: ({ node, nodesToJSX }) => (
      <blockquote className="border-l-4 border-ground-accent py-1 pl-4 font-display text-[1.125rem] font-normal uppercase leading-[1.3] md:my-1.5 md:pl-5 md:text-[1.25rem]">
        {nodesToJSX({ nodes: node.children })}
      </blockquote>
    ),
    horizontalrule: <hr className="my-2 border-0 border-t border-divider" />,
    upload: ({ node }) => {
      const n = node as unknown as UploadNode
      const doc = n.value
      if (!doc || typeof doc !== 'object') {
        console.error('[RichContent] an image in the text is not populated (deleted or unreadable); skipped')
        return null
      }
      const media = doc as MediaDoc
      if (!media.mimeType?.startsWith('image')) {
        return media.url ? (
          <a href={media.url} className="ix-rule font-bold no-underline" rel="noopener noreferrer">
            {media.filename ?? media.alt}
          </a>
        ) : null
      }
      const caption = n.fields?.caption?.trim()
      return (
        <figure className="md:mt-1.5">
          <div className="border-2 border-ink bg-gray-light">
            <Media
              resource={media}
              alt={n.fields?.alt?.trim() || undefined}
              sizes="(min-width: 768px) 820px, 100vw"
              className="block h-auto w-full"
            />
          </div>
          {caption ? (
            <figcaption className="mt-2 text-[0.8125rem] leading-[1.5] text-gray-warm md:mt-2.5">{caption}</figcaption>
          ) : null}
        </figure>
      )
    },
  })

/**
 * The article prose on its own (no section band): accepts any Lexical value,
 * wherever it comes from (a block field, or a case study's before / strategy /
 * results narrative). `numbered` adds 01/02/03 above each H2.
 */
export function ArticleBody({ data, numbered = true }: { data: ArticleBodyData; numbered?: boolean }) {
  return (
    <RichText
      data={data}
      converters={makeConverters(numbered)}
      linkClassName={LINK_CLASS}
      className={[
        'flex flex-col gap-5 text-[1.0625rem] leading-[1.7] md:max-w-[66ch] md:gap-5.5',
        '[counter-reset:article-section]',
        '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li+li]:mt-2 [&_li]:marker:text-ground-accent',
        '[&_strong]:font-bold',
      ].join(' ')}
    />
  )
}

/**
 * The article's optional closing box (DEV-SEO / MKT-SEO Article.dc.html "Article
 * body" > "How we do it"): 2px ink frame, muted eyebrow, short text, ghost
 * button (full width in the mobile build). Renders nothing when every part is
 * empty or the link does not resolve and there is no text.
 */
function ArticleCallout({ callout }: { callout: RichContentProps['callout'] }) {
  const eyebrow = callout?.eyebrow?.trim()
  const text = callout?.body?.trim()
  const hasLink = Boolean(resolveLinkHref(callout?.link) && callout?.link?.label?.trim())
  if (!eyebrow && !text && !hasLink) return null
  return (
    <div className="mt-7 border-2 border-ink p-5 text-[1.0625rem] md:mt-8 md:max-w-[66ch] md:px-6 md:py-5.5">
      {eyebrow ? <Eyebrow muted>{eyebrow}</Eyebrow> : null}
      {text ? (
        <p className={eyebrow ? 'mt-2.5 whitespace-pre-line text-[0.9375rem] leading-[1.6]' : 'whitespace-pre-line text-[0.9375rem] leading-[1.6]'}>{text}</p>
      ) : null}
      {hasLink ? (
        <div className={eyebrow || text ? 'mt-4' : undefined}>
          <ButtonLink link={callout?.link} variant="ghost" size="md" className="w-full md:w-auto" />
        </div>
      ) : null}
    </div>
  )
}

/**
 * RichContent (SCHEMA §8.3 item 13): picks the layout by `variant`. `band` and
 * `legal` live in ./Band.tsx and ./Legal.tsx; `article` is below. Server
 * components throughout: pure rendering.
 */
export function RichContentBlock(props: RichContentProps) {
  if (props.variant === 'band') return <RichContentBand {...props} />
  if (props.variant === 'legal') return <RichContentLegal {...props} />
  return <RichContentArticle {...props} />
}

/**
 * RichContent, `article` variant (Case Study.dc.html "Article body", desktop +
 * mobile builds; same prose for About and the SEO article templates). Nothing
 * renders when the body is empty. The optional closing box (`callout`, p13)
 * follows the prose; without one the markup is exactly the pre-S6 article.
 */
function RichContentArticle({ eyebrow, eyebrowTick, heading, accentPhrase, numberSections, body, callout }: RichContentProps) {
  const hasBody = Array.isArray(body?.root?.children) && body.root.children.length > 0
  if (!hasBody && !heading) {
    console.warn('[RichContent] block has no text; rendering nothing')
    return null
  }
  const title = heading?.trim()

  return (
    <Section tone="light" pad="none" className="pt-8 pb-11 md:pt-10 md:pb-16">
      <div className="mx-auto w-full max-w-205 px-container-mobile md:px-container">
        {eyebrow || title ? (
          <div className="mb-6 md:mb-8">
            {eyebrow ? (
              <Eyebrow tick={eyebrowTick !== false} className="mb-3">
                {eyebrow}
              </Eyebrow>
            ) : null}
            {title ? <AccentHeadline text={title} accent={accentPhrase} level={3} as="h2" /> : null}
          </div>
        ) : null}
        {hasBody ? <ArticleBody data={body} numbered={numberSections !== false} /> : null}
        <ArticleCallout callout={callout} />
      </div>
    </Section>
  )
}
