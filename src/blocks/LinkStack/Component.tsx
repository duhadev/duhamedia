import config from '@payload-config'
import { getPayload } from 'payload'
import React, { useId } from 'react'

import type { BlockData } from '@/blocks/types'
import { SiteLogo } from '@/components/chrome/SiteLogo'
import { CMSLink, resolveLinkHref, type CMSLinkData } from '@/components/ui'
import { cx } from '@/lib/cx'
import { docPath } from '@/lib/docPath'
import { fillScarcityTokens } from '@/lib/scarcity'
import type { CaseStudy, Scarcity, SiteSetting } from '@/payload-types'


/* -------------------------------------------------------------------------- */
/* Props                                                                       */
/* -------------------------------------------------------------------------- */

/** The generated `linkStack` row type (src/payload-types.ts `LinkStackBlock`), plus one showcase-only prop. */
export type LinkStackData = BlockData<'linkStack'> & {
  /**
   * SHOWCASE ONLY (not a field, never stored): a static, PUBLISHED fixture
   * study standing in for "the latest published case study" so /_showcase can
   * show the populated state without a published DB document. Ignored unless
   * `_status === 'published'`; a page row from the database never carries it.
   */
  previewStudy?: CaseStudy | null
}

type Study = Pick<CaseStudy, 'slug' | 'title' | 'headlineMetric'>
type Social = NonNullable<SiteSetting['socials']>[number]
type Capacity = { statistic: string; label: string | null; reason: string }

/* -------------------------------------------------------------------------- */
/* Icons: Phosphor bold (@phosphor-icons/core 2.1.1, viewBox 256), inlined.   */
/* Social marks duplicate DirectContact's role (Q23: consolidate later).      */
/* -------------------------------------------------------------------------- */

const PATHS: Record<string, string> = {
  'chart-line-up':
    'M236,208a12,12,0,0,1-12,12H32a12,12,0,0,1-12-12V48a12,12,0,0,1,24,0v99l43.51-43.52a12,12,0,0,1,17,0L128,127l43-43H160a12,12,0,0,1,0-24h40a12,12,0,0,1,12,12v40a12,12,0,0,1-24,0V101l-51.51,51.52a12,12,0,0,1-17,0L96,129,44,181v15H224A12,12,0,0,1,236,208Z',
  quotes:
    'M100,52H40A20,20,0,0,0,20,72v64a20,20,0,0,0,20,20H96v4a28,28,0,0,1-28,28,12,12,0,0,0,0,24,52.06,52.06,0,0,0,52-52V72A20,20,0,0,0,100,52Zm-4,80H44V76H96ZM216,52H156a20,20,0,0,0-20,20v64a20,20,0,0,0,20,20h56v4a28,28,0,0,1-28,28,12,12,0,0,0,0,24,52.06,52.06,0,0,0,52-52V72A20,20,0,0,0,216,52Zm-4,80H160V76h52Z',
  'envelope-simple':
    'M224,44H32A12,12,0,0,0,20,56V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A12,12,0,0,0,224,44ZM193.15,68,128,127.72,62.85,68ZM44,188V83.28l75.89,69.57a12,12,0,0,0,16.22,0L212,83.28V188Z',
  'file-text':
    'M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z',
  'arrow-right':
    'M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z',
  'arrow-up-right':
    'M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z',
  linkedin:
    'M216,20H40A20,20,0,0,0,20,40V216a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V40A20,20,0,0,0,216,20Zm-4,192H44V44H212ZM112,176V120a12,12,0,0,1,21.43-7.41A40,40,0,0,1,192,148v28a12,12,0,0,1-24,0V148a16,16,0,0,0-32,0v28a12,12,0,0,1-24,0ZM96,120v56a12,12,0,0,1-24,0V120a12,12,0,0,1,24,0ZM68,80A16,16,0,1,1,84,96,16,16,0,0,1,68,80Z',
  instagram:
    'M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,72a24,24,0,1,1,24-24A24,24,0,0,1,128,152ZM176,20H80A60.07,60.07,0,0,0,20,80v96a60.07,60.07,0,0,0,60,60h96a60.07,60.07,0,0,0,60-60V80A60.07,60.07,0,0,0,176,20Zm36,156a36,36,0,0,1-36,36H80a36,36,0,0,1-36-36V80A36,36,0,0,1,80,44h96a36,36,0,0,1,36,36ZM196,76a16,16,0,1,1-16-16A16,16,0,0,1,196,76Z',
  youtube:
    'M170.49,117.91l-56-36A12,12,0,0,0,96,92v72a12,12,0,0,0,18.49,10.09l56-36a12,12,0,0,0,0-20.18ZM120,142V114l21.81,14Zm118.21-73.5a28.05,28.05,0,0,0-16.93-19.14C186.4,35.91,131.29,36,128,36s-58.4-.09-93.28,13.38A28.05,28.05,0,0,0,17.79,68.52C15.15,78.72,12,97.32,12,128s3.15,49.28,5.79,59.48a28.05,28.05,0,0,0,16.93,19.14C68.21,219.55,120.36,220,127.37,220h1.26c7,0,59.16-.45,92.65-13.38a28.05,28.05,0,0,0,16.93-19.14c2.64-10.2,5.79-28.8,5.79-59.48S240.85,78.72,238.21,68.52ZM215,181.46a4,4,0,0,1-2.34,2.77C182.78,195.76,132.27,196,128.32,196h-.39c-.53,0-53.64.17-84.56-11.77A4,4,0,0,1,41,181.46c-1.88-7.24-5-23.82-5-53.46s3.15-46.22,5-53.46a4,4,0,0,1,2.34-2.77C74.29,59.83,127.39,60,127.92,60h.15c.54,0,53.64-.17,84.56,11.77A4,4,0,0,1,215,74.54c1.88,7.24,5,23.82,5,53.46S216.85,174.22,215,181.46Z',
  x:
    'M218.12,209.56l-61-95.8,59.72-65.69a12,12,0,0,0-17.76-16.14L143.81,92.77,106.12,33.56A12,12,0,0,0,96,28H48A12,12,0,0,0,37.88,46.44l61,95.8L39.12,207.93a12,12,0,1,0,17.76,16.14l55.31-60.84,37.69,59.21A12,12,0,0,0,160,228h48a12,12,0,0,0,10.12-18.44ZM166.59,204,69.86,52H89.41l96.73,152Z',
  facebook:
    'M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm12,191.13V156h20a12,12,0,0,0,0-24H140V112a12,12,0,0,1,12-12h16a12,12,0,0,0,0-24H152a36,36,0,0,0-36,36v20H96a12,12,0,0,0,0,24h20v55.13a84,84,0,1,1,24,0Z',
  github:
    'M212.62,75.17A63.7,63.7,0,0,0,206.39,26,12,12,0,0,0,196,20a63.71,63.71,0,0,0-50,24H126A63.71,63.71,0,0,0,76,20a12,12,0,0,0-10.39,6,63.7,63.7,0,0,0-6.23,49.17A61.5,61.5,0,0,0,52,104v8a60.1,60.1,0,0,0,45.76,58.28A43.66,43.66,0,0,0,92,192v4H76a20,20,0,0,1-20-20,44.05,44.05,0,0,0-44-44,12,12,0,0,0,0,24,20,20,0,0,1,20,20,44.05,44.05,0,0,0,44,44H92v12a12,12,0,0,0,24,0V192a20,20,0,0,1,40,0v40a12,12,0,0,0,24,0V192a43.66,43.66,0,0,0-5.76-21.72A60.1,60.1,0,0,0,220,112v-8A61.5,61.5,0,0,0,212.62,75.17ZM196,112a36,36,0,0,1-36,36H112a36,36,0,0,1-36-36v-8a37.87,37.87,0,0,1,6.13-20.12,11.65,11.65,0,0,0,1.58-11.49,39.9,39.9,0,0,1-.4-27.72,39.87,39.87,0,0,1,26.41,17.8A12,12,0,0,0,119.82,68h32.35a12,12,0,0,0,10.11-5.53,39.84,39.84,0,0,1,26.41-17.8,39.9,39.9,0,0,1-.4,27.72,12,12,0,0,0,1.61,11.53A37.85,37.85,0,0,1,196,104Z',
}

const PLATFORM_NAMES: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  youtube: 'YouTube',
  x: 'X',
  facebook: 'Facebook',
  github: 'GitHub',
}

function Icon({ name, className }: { name: string; className: string }) {
  const d = PATHS[name] ?? PATHS['arrow-right']
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 256 256" fill="currentColor" className={cx('shrink-0', className)}>
      <path d={d} />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Data (public Local API reads; failures are logged and the part degrades)   */
/* -------------------------------------------------------------------------- */

/** Newest PUBLISHED case study (public access + explicit `_status`, `draft: false`), or null. */
async function loadLatestStudy(): Promise<Study | null> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'case-studies',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 1,
      depth: 0,
      draft: false,
      overrideAccess: false,
      pagination: false,
      select: { slug: true, title: true, headlineMetric: true, _status: true },
    })
    const doc = docs[0]
    return doc && doc._status === 'published' ? doc : null
  } catch (error) {
    console.error('[LinkStack] could not load the latest published case study; showing the fallback line', error)
    return null
  }
}

async function loadSocials(): Promise<Social[]> {
  try {
    const payload = await getPayload({ config })
    const s = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: false })
    return (s.socials ?? []).filter((x) => x?.handle?.trim() && /^https:\/\//i.test(x.url ?? ''))
  } catch (error) {
    console.error('[LinkStack] could not read site-settings; social profiles hidden', error)
    return []
  }
}

/**
 * The chosen scarcity statement, filled. Loud/quiet contract (CLAUDE.md rule 2):
 * returns null (line skipped, logged) when the row is missing, a count is
 * missing, or the reason is blank. There is no reason-less result.
 */
async function loadCapacity(key: string): Promise<Capacity | null> {
  let global: Scarcity
  try {
    const payload = await getPayload({ config })
    global = await payload.findGlobal({ slug: 'scarcity', depth: 0, overrideAccess: false })
  } catch (error) {
    console.error('[LinkStack] could not read the scarcity global; capacity line skipped', error)
    return null
  }
  const row = global.statements?.find((s) => s.key === key)
  const statistic = row?.statistic ? fillScarcityTokens(row.statistic, global) : null
  const reason = row?.reason?.trim()
  if (!row || !statistic) {
    console.error(`[LinkStack] scarcity statement "${key}" is missing or has unfilled counts; capacity line skipped`)
    return null
  }
  if (!reason) {
    console.error(`[LinkStack] scarcity statement "${key}" has no reason; capacity line skipped (no bare numbers)`)
    return null
  }
  return { statistic, label: row.label?.trim() || null, reason }
}

/* -------------------------------------------------------------------------- */
/* Block                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * LinkStack (Link-in-Bio.dc.html "Link in bio", desktop + mobile builds: one
 * 480px column, identical structure; mobile padding below `md`). Server
 * component, no interactivity: async because the latest published case
 * study, the social profiles and the capacity line are read at render.
 *
 * Launch state (CLAUDE.md rule 1): with no published study the identity shows
 * `fallbackLine` and the case-study link is not rendered. Scarcity (rule 2):
 * the capacity line renders only with its reason. Nothing optional set →
 * identity + the main button still render.
 */
export async function LinkStackBlock(props: LinkStackData) {
  const { identity, primary, showSocials, latestCaseStudy, previewStudy } = props
  const capacityKey = primary?.capacity ?? 'none'
  const wantStudy = identity?.showStudyMetric !== false || latestCaseStudy !== false

  const fixture = previewStudy && previewStudy._status === 'published' ? previewStudy : null
  const [study, socials, capacity] = await Promise.all([
    fixture ?? (wantStudy ? loadLatestStudy() : null),
    showSocials !== false ? loadSocials() : [],
    capacityKey !== 'none' ? loadCapacity(capacityKey) : null,
  ])

  return <LinkStackView {...props} study={study} socials={socials} capacity={capacity} />
}

/** Wine logo figure (same mask idiom as FinalCTA). */
const LOGO_MASK: React.CSSProperties = {
  WebkitMaskImage: "url('/logo-duha.png')",
  maskImage: "url('/logo-duha.png')",
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
}

const SECTION_LABEL = 'text-[10px] font-bold uppercase tracking-[0.1em] text-gray-warm'
const SITE_ROW =
  'flex min-h-16 items-center gap-3.5 border border-divider p-4.5 text-ink no-underline transition-colors duration-180 ease-out hover:bg-gray-light hover:text-ink focus-visible:bg-gray-light'

/** Pure render (exported for previews/tests): everything resolved, no I/O. */
export function LinkStackView({
  identity,
  primary,
  followLabel,
  siteLabel,
  links,
  latestCaseStudy,
  latestCaseStudyLabel,
  currentPush,
  study,
  socials,
  capacity,
}: LinkStackData & { study: Study | null; socials: Social[]; capacity: Capacity | null }) {
  const uid = useId()

  const metric =
    identity?.showStudyMetric !== false && study?.headlineMetric?.value?.trim() && study.headlineMetric.label?.trim()
      ? study.headlineMetric
      : null
  const fallback = identity?.fallbackLine?.trim() || null
  if (!metric && !fallback) console.error('[LinkStack] identity has no fallback line and no published study metric')

  const studyHref = latestCaseStudy !== false && study ? docPath('case-studies', study) : null
  const studyLabel = latestCaseStudyLabel?.trim() || 'Case study'

  const siteRows: { key: string; icon: string; link: CMSLinkData; extra?: string }[] = [
    ...(links ?? []).map((r, i) => ({ key: r.id ?? `l${i}`, icon: r.icon, link: r.link })),
    ...(studyHref
      ? [{ key: 'study', icon: 'file-text', link: { type: 'custom', url: studyHref, label: studyLabel } as CMSLinkData, extra: study?.title }]
      : []),
    ...(currentPush?.show && currentPush.link
      ? [{ key: 'push', icon: currentPush.icon ?? 'file-text', link: currentPush.link }]
      : []),
  ]
  const followText = followLabel?.trim() || 'Follow'
  const siteText = siteLabel?.trim() || 'On the site'

  return (
    <section aria-labelledby={`${uid}-id`} className="mx-auto flex w-full max-w-120 flex-col">
      {/* Identity strip */}
      <div className="relative flex flex-col gap-3.5 overflow-hidden border-b-2 border-ink bg-gray-light px-5 py-7 md:gap-4 md:px-6 md:py-8">
        <div
          aria-hidden="true"
          style={LOGO_MASK}
          className="pointer-events-none absolute -top-17.5 -right-20 z-0 size-55 bg-ground-accent md:size-60"
        />
        <h1 id={`${uid}-id`} className="relative z-10 m-0">
          <SiteLogo size="lp" className="gap-2.5 [&_img]:size-10 [&>span]:text-[1.0625rem]" />
        </h1>
        {metric ? (
          <p className="relative z-10 m-0">
            <span className="block font-display text-[4rem] leading-[0.92] font-normal tracking-[-0.02em] text-ground-accent md:text-[4.5rem]">
              {metric.value}
            </span>
            <span className="mt-2 block font-display text-[1.0625rem] leading-[1.15] font-normal uppercase md:text-[1.125rem]">
              {metric.label}
            </span>
          </p>
        ) : fallback ? (
          <p className="relative z-10 m-0 max-w-60 font-display text-[1.125rem] leading-[1.15] font-normal text-balance uppercase md:max-w-74 md:text-h3-mobile">{fallback}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-5 px-5 pt-5 pb-7 md:px-6 md:pt-6">
        {/* Primary: Book a call (dominant) + capacity line */}
        <div className="flex flex-col gap-2">
          <CMSLink
            link={primary?.link}
            className="ix-lift flex min-h-target items-center justify-between gap-3.5 bg-ink px-5 py-5.5 text-cream no-underline md:py-6"
          >
            <span className="font-display text-[1.5rem] leading-[1.05] font-normal uppercase">{primary?.link?.label}</span>
            <Icon name="arrow-up-right" className="ix-arrow-ne size-6.5" />
          </CMSLink>
          {capacity ? <CapacityLine c={capacity} /> : null}
        </div>

        {/* Follow (site-settings socials) */}
        {socials.length ? (
          <div className="flex flex-col gap-2">
            <h2 id={`${uid}-follow`} className={cx(SECTION_LABEL, 'm-0')}>
              {followText}
            </h2>
            <ul aria-labelledby={`${uid}-follow`} className="m-0 flex list-none flex-col gap-2 p-0">
              {socials.map((s, i) => (
                <li key={s.id ?? i}>
                  <CMSLink
                    link={{ type: 'custom', url: s.url, label: s.handle, newTab: true }}
                    className="ix-lift flex min-h-15 items-center gap-3.5 bg-gray-light px-4.5 py-4 text-ink no-underline"
                  >
                    <Icon name={s.platform} className="size-6" />
                    <span className="min-w-0 font-display text-[1.125rem] leading-[1.15] font-normal break-words uppercase">
                      <span className="sr-only">{PLATFORM_NAMES[s.platform] ?? s.platform}: </span>
                      {s.handle}
                    </span>
                    <Icon name="arrow-up-right" className="ix-arrow-ne ml-auto size-4" />
                  </CMSLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* On the site */}
        {siteRows.length ? (
          <div className="flex flex-col gap-2">
            <h2 id={`${uid}-site`} className={cx(SECTION_LABEL, 'm-0')}>
              {siteText}
            </h2>
            <ul aria-labelledby={`${uid}-site`} className="m-0 flex list-none flex-col gap-2 p-0">
              {siteRows.map((r) => (
                <SiteRow key={r.key} icon={r.icon} link={r.link} extra={r.extra} />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}

/** One "On the site" row; renders nothing (no empty <li>) when the link does not resolve. */
function SiteRow({ icon, link, extra }: { icon: string; link: CMSLinkData; extra?: string | null }) {
  const external = link.newTab || ((link.type ?? 'internal') === 'custom' && /^https?:/i.test(link.url ?? ''))
  const a = (
    <CMSLink link={link} className={SITE_ROW}>
      <Icon name={icon} className="size-6 text-ground-accent" />
      <span className="min-w-0 font-display text-[1.25rem] leading-[1.15] font-normal break-words uppercase">
        {link.label}
        {extra ? <span className="sr-only">: {extra}</span> : null}
      </span>
      <Icon name={external ? 'arrow-up-right' : 'arrow-right'} className={cx('ml-auto', external ? 'ix-arrow-ne size-4' : 'ix-arrow size-4.5')} />
    </CMSLink>
  )
  // CMSLink renders nothing for an unresolved link; skip the <li> too so the list has no empty items.
  return resolveLinkHref(link) && link.label?.trim() ? <li>{a}</li> : null
}

/** Loud statement + quiet reason, one group for assistive tech (F55 pattern). */
function CapacityLine({ c }: { c: Capacity }) {
  const uid = useId()
  return (
    <div role="group" aria-labelledby={`${uid}-s`} aria-describedby={`${uid}-r`}>
      <p id={`${uid}-s`} className="m-0 flex items-center justify-between gap-3">
        {c.label ? <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-warm">{c.label}</span> : null}
        <span className={cx('font-display text-[0.9375rem] leading-none font-normal text-ground-accent', !c.label && 'mr-auto')}>
          {c.statistic}
        </span>
      </p>
      <p id={`${uid}-r`} className="m-0 mt-1 text-[0.75rem] leading-[1.4] text-gray-warm">
        {c.reason}
      </p>
    </div>
  )
}
