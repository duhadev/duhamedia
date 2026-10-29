import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React, { useId } from 'react'

import type { BlockData } from '@/blocks/types'
import { CMSLink, Container, Eyebrow, Section } from '@/components/ui'
import { cx } from '@/lib/cx'
import { docPath } from '@/lib/docPath'
import type { Post } from '@/payload-types'

/** The generated `postList` row type (src/payload-types.ts `PostListBlock`), plus showcase-only props. */
export type PostListData = BlockData<'postList'> & {
  /**
   * SHOWCASE ONLY (not a field, never stored): static PUBLISHED stand-ins for
   * the query so /_showcase can show populated / one-issue / empty without
   * database documents. `[]` forces the empty state. Ignored when undefined.
   */
  previewPosts?: PostItem[] | null
  previewTotal?: number | null
}

export type PostItem = Pick<Post, 'id' | 'title' | 'slug' | 'track'> &
  Partial<Pick<Post, 'dek' | 'issueNumber' | 'sentAt' | 'publishedAt' | 'issueMetric'>>

const DEFAULT_LABELS = {
  latestLabel: 'Latest —',
  newBadge: 'New',
  previouslyLabel: 'Previously',
  countSuffix: 'issues',
  countSuffixSingular: 'issue',
  readLabel: 'Read issue',
  issueWord: 'Issue',
}

const clampLimit = (n: number | null | undefined): number => Math.min(12, Math.max(1, Math.round(n ?? 3)))

async function loadPosts(track: PostListData['track'], limit: number): Promise<{ docs: PostItem[]; total: number }> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'posts',
      draft: false,
      overrideAccess: false,
      depth: 0,
      limit,
      sort: '-publishedAt',
      where: { and: [{ _status: { equals: 'published' } }, { track: { equals: track } }] },
      select: { title: true, slug: true, track: true, dek: true, issueNumber: true, sentAt: true, publishedAt: true, issueMetric: true, _status: true },
    })
    return { docs: res.docs, total: res.totalDocs }
  } catch (error) {
    console.error('[PostList] could not load published posts; rendering the empty state', error)
    return { docs: [], total: 0 }
  }
}

const pad3 = (n: number): string => String(n).padStart(3, '0')

const formatDate = (iso: string | null | undefined): { iso: string; text: string } | null => {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? null
    : {
        iso: d.toISOString(),
        text: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }),
      }
}

const HOVER_BTN = 'transition-colors duration-180 ease-out hover:bg-ink hover:text-cream'

function FeaturedCard({ post, labels }: { post: PostItem; labels: typeof DEFAULT_LABELS }) {
  const href = docPath('posts', post)
  const num = typeof post.issueNumber === 'number' ? `${labels.issueWord} ${pad3(post.issueNumber)}` : null
  const tag = [labels.latestLabel, num].filter(Boolean).join(' ')
  return (
    <div className="flex flex-col gap-3 border-2 border-ink bg-cream p-5 shadow-card md:gap-3.5 md:px-9 md:py-8.5">
      <div className="flex items-center justify-between gap-3 md:gap-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-warm md:text-[11px]">{tag}</span>
        {labels.newBadge ? (
          <span className="bg-ground-accent px-2.25 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white md:px-2.5">
            {labels.newBadge}
          </span>
        ) : null}
      </div>
      <h3 className="m-0 font-display text-h3-mobile font-normal uppercase md:text-h3">{post.title}</h3>
      {post.dek ? <p className="m-0 whitespace-pre-line text-body-mobile md:text-body-mobile">{post.dek}</p> : null}
      {href && labels.readLabel ? (
        <Link
          href={href}
          className={cx(
            'mt-1 flex min-h-12 items-center justify-center border-2 border-ink text-[13px] font-bold uppercase tracking-[0.06em] text-ink no-underline md:mt-1.5 md:inline-flex md:min-h-target md:self-start md:px-5',
            HOVER_BTN,
          )}
        >
          {[labels.readLabel, typeof post.issueNumber === 'number' ? pad3(post.issueNumber) : null].filter(Boolean).join(' ')}
        </Link>
      ) : null}
    </div>
  )
}

function Row({ post, labels, first, last }: { post: PostItem; labels: typeof DEFAULT_LABELS; first: boolean; last: boolean }) {
  const href = docPath('posts', post)
  const issue = typeof post.issueNumber === 'number' ? `${labels.issueWord} ${pad3(post.issueNumber)}` : null
  const date = formatDate(post.sentAt ?? post.publishedAt)
  const cls = cx(
    'grid min-h-target grid-cols-[1fr_auto] gap-x-3 gap-y-1 py-3.5 text-ink no-underline md:gap-x-4',
    href && 'transition-colors duration-180 ease-out hover:bg-gray-light',
  )
  const body = (
    <>
      <span className="font-mono text-[11px] font-bold uppercase text-gray-warm">
        {issue}
        {issue && date ? ' · ' : null}
        {date ? <time dateTime={date.iso}>{date.text}</time> : null}
      </span>
      {post.issueMetric ? (
        <span className="row-span-2 self-center font-display text-[0.9375rem] text-ground-accent">{post.issueMetric}</span>
      ) : null}
      <span className="font-display text-base leading-[1.15] uppercase md:text-[1.0625rem]">{post.title}</span>
      {post.dek ? (
        <p className="col-span-full m-0 mt-0.5 line-clamp-2 whitespace-pre-line text-small text-gray-warm">{post.dek}</p>
      ) : null}
    </>
  )
  return (
    <li className={cx(first && 'border-t-2 border-ink', last ? 'border-b-2 border-ink' : 'border-b border-divider')}>
      {href ? (
        <Link href={href} className={cls}>
          {body}
        </Link>
      ) : (
        <div className={cls}>{body}</div>
      )}
    </li>
  )
}

export async function PostListBlock(props: PostListData) {
  const labels = { ...DEFAULT_LABELS }
  for (const k of Object.keys(labels) as (keyof typeof labels)[]) {
    const v = props.labels?.[k]
    if (typeof v === 'string' && v.trim() !== '') labels[k] = v.trim()
  }
  const limit = clampLimit(props.limit)
  const loaded =
    props.previewPosts != null
      ? { docs: props.previewPosts.slice(0, limit), total: props.previewTotal ?? props.previewPosts.length }
      : await loadPosts(props.track, limit)
  return <PostListView {...props} labels={undefined} resolvedLabels={labels} docs={loaded.docs} total={loaded.total} />
}

/** Sync child so `useId` (the h2 / aria-labelledby id) never runs inside the async data-loading component. */
function PostListView(
  props: Omit<PostListData, 'labels'> & {
    labels?: undefined
    resolvedLabels: typeof DEFAULT_LABELS
    docs: PostItem[]
    total: number
  },
) {
  const labels = props.resolvedLabels
  const docs = props.docs
  const loaded = { total: props.total }
  const reactId = useId()
  const feature = props.featureLatest !== false && docs.length > 0
  const latest = feature ? docs[0] : null
  const rest = feature ? docs.slice(1) : docs
  const previousCount = Math.max(0, loaded.total - (feature ? 1 : 0))
  const eyebrow = props.eyebrow?.trim()
  const headingText = eyebrow || (props.track === 'newsletter-issue' ? 'Latest newsletter issues' : 'Latest articles')
  const headingId = `postlist-${props.id ?? reactId.replace(/:/g, '')}`
  const archive = <CMSLink link={props.archiveLink} className={cx('mt-4.5 flex min-h-12 items-center justify-center border-2 border-ink px-4.5 text-[12px] font-bold uppercase tracking-[0.08em] text-ink no-underline md:inline-flex md:min-h-target md:self-start', HOVER_BTN)} />

  return (
    <Section tone="grey" pad="default" aria-labelledby={headingId}>
      <Container>
        <h2 id={headingId} className="sr-only">
          {headingText}
        </h2>
        {eyebrow ? (
          <>
            <span aria-hidden="true">
              <Eyebrow tick={props.eyebrowTick !== false} muted>
                {eyebrow}
              </Eyebrow>
            </span>
          </>
        ) : null}

        {docs.length === 0 ? (
          <div className={cx('border-2 border-ink bg-cream p-5 shadow-card md:px-9 md:py-8.5', eyebrow && 'mt-5.5 md:mt-8')}>
            <h3 className="m-0 font-display text-h3-mobile font-normal uppercase md:text-h3">{props.emptyHeading}</h3>
            {props.emptyBody ? <p className="m-0 mt-3 max-w-[60ch] whitespace-pre-line text-body-mobile md:text-body">{props.emptyBody}</p> : null}
          </div>
        ) : (
          <div
            className={cx(
              'grid items-start gap-6 md:gap-7',
              eyebrow && 'mt-5.5 md:mt-8',
              latest && rest.length > 0 && 'md:grid-cols-[1.35fr_1fr]',
            )}
          >
            {latest ? (
              <div className="flex flex-col">
                <FeaturedCard post={latest} labels={labels} />
                {rest.length === 0 ? archive : null}
              </div>
            ) : null}
            {rest.length > 0 ? (
              <div className="flex flex-col">
                <div className="flex items-baseline justify-between gap-3 pb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-warm">{labels.previouslyLabel}</span>
                  {previousCount > 0 ? (
                    <span className="font-mono text-[11px] font-bold text-gray-warm">
                      {previousCount} {previousCount === 1 ? labels.countSuffixSingular : labels.countSuffix}
                    </span>
                  ) : null}
                </div>
                <ul className="m-0 list-none p-0">
                  {rest.map((post, i) => (
                    <Row key={post.id} post={post} labels={labels} first={i === 0} last={i === rest.length - 1} />
                  ))}
                </ul>
                {archive}
              </div>
            ) : null}
          </div>
        )}
      </Container>
    </Section>
  )
}


