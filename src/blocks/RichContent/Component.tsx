import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { BlockData } from '@/blocks/types'
import { RichText, type RichTextData } from '@/components/RichText'
import { AccentHeadline, Eyebrow, Media, Section } from '@/components/ui'
import type { Media as MediaDoc } from '@/payload-types'

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
const LINK_CLASS = 'font-bold underline decoration-2 underline-offset-4 hover:text-ground-accent'

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
          <a href={media.url} className="font-bold underline decoration-2 underline-offset-4" rel="noopener noreferrer">
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
              alt={n.fields?.alt ?? undefined}
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
 * RichContent, `article` variant (Case Study.dc.html "Article body", desktop +
 * mobile builds; same prose for About and the SEO article templates). Server
 * component: pure rendering. Nothing renders when the body is empty.
 */
export function RichContentBlock({ eyebrow, eyebrowTick, heading, accentPhrase, numberSections, body }: RichContentProps) {
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
      </div>
    </Section>
  )
}
