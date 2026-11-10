import React from 'react'

import type { BlockData } from '@/blocks/types'
import { Caption, DiamondHeading, SquareBullet } from '@/components/BrochureParts'
import { InlineBold, paragraphsOf } from '@/components/InlineBold'
import { AccentHeadline, CMSLink, Container, Eyebrow, Section, resolveLinkHref } from '@/components/ui'
import { cx } from '@/lib/cx'

type Props = BlockData<'serviceSheet'>
type Group = NonNullable<NonNullable<Props['included']>['groups']>[number]
type Marker = NonNullable<Group['marker']>

const has = (s: string | null | undefined): s is string => Boolean(s && s.trim())

/** Section mode: " / " in a caption starts a new line. */
function withBreaks(text: string | null | undefined, on: boolean): React.ReactNode {
  if (!text) return text
  if (!on || !text.includes(' / ')) return text
  return text.split(' / ').map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 ? <br /> : null}
      {part}
    </React.Fragment>
  ))
}

const NOTE_LINK = /\{link\}/

/** Wine / ink / outlined square before a bullet (fit + duties). 8px, nudged to the first line's x-height. */
function Marker({ kind }: { kind: Marker }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'mt-[0.55em] size-2 shrink-0',
        kind === 'ink' && 'bg-ink',
        kind === 'outlined' && 'box-border border-2 border-ink bg-transparent',
        kind === 'wine' && 'bg-ground-accent',
      )}
    />
  )
}

type RenderedGroup = { group: Group; items: NonNullable<Group['items']> }

/** A micro-caption group title with a marked list under it. */
function MarkedGroup({ g, cols = false }: { g: RenderedGroup; cols?: boolean }) {
  return (
    <>
      <h3 className="m-0 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-gray-warm">{g.group.title}</h3>
      <ul
        className={cx(
          'm-0 mt-4 list-none p-0 text-[1rem] leading-[1.55]',
          cols ? 'grid gap-x-6 gap-y-3.5 md:grid-cols-2' : 'flex flex-col gap-3.5',
        )}
      >
        {g.items.map((it, ii) => (
          <li key={it.id ?? ii} className="flex gap-3">
            <Marker kind={g.group.marker ?? 'wine'} />
            <span>
              {has(it.lead) ? <strong className="font-bold">{it.lead.trim().replace(/[:.]$/, '')}. </strong> : null}
              {it.text}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

/** Eyebrow + wine-accent h2 shared by the three new presentations. */
function SheetHead({ eyebrow, eyebrowTick, heading, accentPhrase }: Pick<Props, 'eyebrow' | 'eyebrowTick' | 'heading' | 'accentPhrase'>) {
  if (!has(eyebrow) && !has(heading)) return null
  return (
    <>
      {has(eyebrow) ? (
        <Eyebrow tick={eyebrowTick ?? true} className="text-ink">
          {eyebrow}
        </Eyebrow>
      ) : null}
      {has(heading) ? (
        <AccentHeadline text={heading} accent={accentPhrase} accentColor="ground" level={2} as="h2" className={cx(has(eyebrow) && 'mt-4')} />
      ) : null}
    </>
  )
}

/** `box.note` with `{link}` replaced by the box link; the link goes at the end when there is no marker. */
function NoteWithLink({ note, link }: { note: string; link: NonNullable<Props['box']>['link'] }) {
  const linked = Boolean(resolveLinkHref(link) && has(link?.label))
  const anchor = linked ? (
    // Inline in a sentence: the 44px target comes from the extended hit area, not from a taller line.
    <CMSLink link={link} className="-my-2.5 inline-flex min-h-target items-center font-bold text-ink no-underline">
      <span className="ix-rule">{link?.label}</span>
    </CMSLink>
  ) : null
  if (!linked) return <>{note.replace(NOTE_LINK, '').trim()}</>
  if (!NOTE_LINK.test(note)) return <>{note} {anchor}</>
  const [before, ...rest] = note.split(NOTE_LINK)
  return (
    <>
      {before}
      {anchor}
      {rest.join('{link}')}
    </>
  )
}

/** Note under a hairline, in a grey card or panel. */
function CardNote({ box, className }: { box: Props['box']; className?: string }) {
  const note = box?.note
  if (!has(note)) return null
  return (
    <p className={cx('m-0 mt-6 border-t border-divider pt-4 text-[0.9375rem] leading-[1.55] text-gray-warm', className)}>
      <NoteWithLink note={note} link={box?.link} />
    </p>
  )
}

function Numbers({ numbers, section }: { numbers: Props['numbers']; section: boolean }) {
  const items = (numbers?.items ?? []).filter((n) => has(n?.value))
  if (!items.length) return null
  const rows = numbers?.layout === 'rows'
  return (
    <div className="bg-gray-light p-5 md:p-6">
      {has(numbers?.label) ? <Caption>{numbers.label}</Caption> : null}
      {rows ? (
        <dl className={cx('flex flex-col gap-5', has(numbers?.label) && 'mt-4')}>
          {items.map((n, i) => (
            <div key={n.id ?? i} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 md:grid-cols-[6.5rem_1fr]">
              <dt className={cx('font-display text-[1.5rem] leading-none md:text-[1.75rem]', n.accent && 'text-ground-accent')}>{n.value}</dt>
              <dd className="text-[0.9375rem] leading-[1.55]">
                {has(n.lead) ? <strong className="font-bold">{n.lead} </strong> : null}
                {withBreaks(n.text, section)}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <dl className={cx('grid grid-cols-3 gap-4', has(numbers?.label) && 'mt-4')}>
          {items.map((n, i) => (
            <div key={n.id ?? i} className="flex flex-col">
              <dt className={cx('font-display text-[1.75rem] leading-none md:text-[2.25rem]', n.accent && 'text-ground-accent')}>{n.value}</dt>
              {has(n.text) ? <dd className="mt-2.5 text-[0.8125rem] leading-[1.45] md:text-[0.875rem]">{withBreaks(n.text, section)}</dd> : null}
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

function Box({ box }: { box: Props['box'] }) {
  if (!has(box?.body)) return null
  const linked = resolveLinkHref(box?.link) && has(box?.link?.label)
  return (
    <div className="border-2 border-ink p-5 md:p-6">
      {has(box?.label) ? <Caption className="text-ink">{box.label}</Caption> : null}
      <p className={cx('text-[0.9375rem] leading-[1.6] md:text-body-mobile', has(box?.label) && 'mt-2.5')}>
        {box.body}
        {linked ? (
          <>
            {' '}
            <CMSLink link={box?.link} className="inline-flex min-h-target items-center font-bold text-ink no-underline">
              <span className="ix-rule">{box?.link?.label}</span>
            </CMSLink>
          </>
        ) : null}
      </p>
    </div>
  )
}

function NextStep({ next, section }: { next: Props['nextStep']; section: boolean }) {
  if (!resolveLinkHref(next?.link) || !has(next?.link?.label)) return null
  if (section) {
    return (
      <div className="-mt-4">
        <CMSLink link={next?.link} className="inline-flex min-h-target items-center font-bold text-ink no-underline">
          <span className="ix-rule">{next?.link?.label}</span>
        </CMSLink>
      </div>
    )
  }
  return (
    <div className="border-t-2 border-ink pt-4">
      {has(next?.label) ? <Caption>{next.label}</Caption> : null}
      <CMSLink
        link={next?.link}
        className="mt-1 inline-flex min-h-target items-center font-display text-[1.125rem] leading-tight text-ink no-underline md:text-[1.25rem]"
      >
        <span className="ix-rule">{next?.link?.label}</span>
      </CMSLink>
    </div>
  )
}

const SHEET_SECTION = 'scroll-mt-31 md:scroll-mt-34'

/** `fit` (service pages "Who it's for"): copy left, grey card of marked lists + note right. */
function FitSheet(props: Props) {
  const { anchorId, why, box, included } = props
  const paragraphs = paragraphsOf(why?.body)
  const groups = (included?.groups ?? []).filter((g) => has(g?.title))
  const rendered: RenderedGroup[] = groups.map((g) => ({ group: g as Group, items: (g.items ?? []).filter((it) => has(it?.text)) }))
  const hasCard = rendered.length > 0 || has(box?.note) || has(box?.body)
  return (
    <Section tone="light" pad="none" id={has(anchorId) ? anchorId : undefined} className={cx('py-14 md:py-24', has(anchorId) && SHEET_SECTION)}>
      <Container>
        <div className={cx('grid items-start gap-10 lg:gap-18', hasCard && 'lg:grid-cols-[7fr_5fr]')}>
          <div>
            <SheetHead {...props} />
            {paragraphs.length ? (
              <div className="mt-6 flex max-w-[62ch] flex-col gap-4 text-[1rem] leading-[1.65] md:mt-7 md:text-[1.0625rem]">
                {paragraphs.map((para, i) => (
                  <p key={i} className="m-0 whitespace-pre-line [&_strong]:font-bold">
                    <InlineBold text={para} />
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          {hasCard ? (
            <div className="bg-gray-light p-6 md:p-8">
              {rendered.map((g, gi) => (
                <div key={g.group.id ?? gi} className={cx(gi > 0 && 'mt-6 border-t border-divider pt-5')}>
                  <MarkedGroup g={g} />
                </div>
              ))}
              {has(box?.body) ? (
                <p className={cx('m-0 text-[1.1875rem] font-bold leading-snug', rendered.length > 0 && 'mt-6')}>{box?.body}</p>
              ) : null}
              <CardNote box={box} className={rendered.length === 0 && !has(box?.body) ? 'mt-0 border-t-0 pt-0' : undefined} />
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}

/** `deliverables` (service pages "What you get"): label/line rows left, grey "You own it" panel right. */
function DeliverablesSheet(props: Props) {
  const { anchorId, box, differentiators } = props
  const rows = (differentiators?.rows ?? []).filter((r) => has(r?.label) && has(r?.line))
  const panel = has(box?.body) || has(box?.label) || has(box?.note)
  return (
    <Section
      tone="light"
      pad="none"
      id={has(anchorId) ? anchorId : undefined}
      className={cx('border-t border-divider pb-10 pt-14 md:pb-14 md:pt-24', has(anchorId) && SHEET_SECTION)}
    >
      <Container>
        <SheetHead {...props} />
        {rows.length || panel ? (
          <div className={cx('mt-8 grid items-start gap-8 md:mt-12 lg:gap-12', rows.length > 0 && panel && 'lg:grid-cols-[7fr_5fr]')}>
            {rows.length ? (
              <dl className="m-0 border-t border-divider">
                {rows.map((r, i) => (
                  <div key={r.id ?? i} className="grid gap-1 border-b border-divider py-5 md:grid-cols-[12.5rem_minmax(0,1fr)] md:gap-6">
                    <dt className="font-bold">{r.label}</dt>
                    <dd className="m-0 text-[1rem] leading-[1.55]">{r.line}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {panel ? (
              <div className="bg-gray-light p-6 md:p-7">
                {has(box?.label) ? <h3 className="m-0 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-gray-warm">{box?.label}</h3> : null}
                {has(box?.body) ? (
                  <p className={cx('m-0 text-[1.1875rem] font-bold leading-snug', has(box?.label) && 'mt-2.5')}>{box?.body}</p>
                ) : null}
                <CardNote box={box} className={!has(box?.body) && !has(box?.label) ? 'mt-0 border-t-0 pt-0' : 'mt-5'} />
              </div>
            ) : null}
          </div>
        ) : null}
      </Container>
    </Section>
  )
}

/** `duties` (service pages "Who does what"): grey band, paragraph, then marked lists in hairline-topped columns. */
function DutiesSheet(props: Props) {
  const { anchorId, why, included } = props
  const paragraphs = paragraphsOf(why?.body)
  const groups: RenderedGroup[] = (included?.groups ?? [])
    .filter((g) => has(g?.title))
    .map((g) => ({ group: g as Group, items: (g.items ?? []).filter((it) => has(it?.text)) }))
  return (
    <Section tone="grey" pad="none" id={has(anchorId) ? anchorId : undefined} className={cx('py-14 md:py-24', has(anchorId) && SHEET_SECTION)}>
      <Container>
        <SheetHead {...props} />
        {paragraphs.length ? (
          <div className="mt-6 flex max-w-[60ch] flex-col gap-3 text-[1rem] leading-[1.65] md:text-[1.0625rem]">
            {paragraphs.map((para, i) => (
              <p key={i} className="m-0 whitespace-pre-line [&_strong]:font-bold">
                <InlineBold text={para} />
              </p>
            ))}
          </div>
        ) : null}
        {groups.length ? (
          <div className={cx('mt-8 grid gap-10 md:mt-12 md:gap-14', groups.length === 2 ? 'md:grid-cols-[5fr_7fr]' : groups.length > 2 && 'md:grid-cols-2')}>
            {groups.map((g, gi) => (
              <div key={g.group.id ?? gi} className="border-t border-divider pt-5">
                <MarkedGroup g={g} cols={g.items.length > 6} />
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  )
}

/**
 * ServiceSheet (brochure p2 / p3). Server component, no interactivity.
 * Phones/tablets: one column in brochure reading order (left column, then
 * right). From `lg`: the brochure's two columns.
 */
export function ServiceSheetBlock(props: Props) {
  if (props.presentation === 'fit') return <FitSheet {...props} />
  if (props.presentation === 'deliverables') return <DeliverablesSheet {...props} />
  if (props.presentation === 'duties') return <DutiesSheet {...props} />
  return <ClassicSheet {...props} />
}

function ClassicSheet({
  presentation,
  eyebrow,
  eyebrowTick,
  heading,
  accentPhrase,
  intro,
  numeral,
  accent,
  why,
  numbers,
  box,
  nextStep,
  included,
  differentiators,
  anchorId,
}: Props) {
  const section = presentation === 'section'
  const paragraphs = paragraphsOf(why?.body)
  const groups = (included?.groups ?? []).filter((g) => has(g?.title))
  const diffRows = (differentiators?.rows ?? []).filter((r) => has(r?.label) && has(r?.line))

  const next = <NextStep next={nextStep} section={section} />
  const cols = section ? 'grid gap-10 md:grid-cols-2 md:gap-12' : 'grid gap-12 lg:grid-cols-2 lg:gap-x-14'

  return (
    <Section
      tone="light"
      pad="none"
      id={has(anchorId) ? anchorId : undefined}
      className={cx(section ? 'border-t border-divider pb-10 pt-16 md:pb-12 md:pt-24' : 'py-12 md:py-16', has(anchorId) && SHEET_SECTION)}
    >
      <Container>
        {section && (has(heading) || has(eyebrow) || has(intro) || has(numeral)) ? (
          <>
            <div className="flex items-end justify-between gap-6">
              <div className="min-w-0">
                {has(eyebrow) ? (
                  <Eyebrow tick={eyebrowTick ?? true} className="text-ink">
                    {eyebrow}
                  </Eyebrow>
                ) : null}
                {has(heading) ? (
                  <AccentHeadline
                    text={heading}
                    accent={accentPhrase}
                    accentColor="ground"
                    level={2}
                    as="h2"
                    className={cx(has(eyebrow) && 'mt-4')}
                  />
                ) : null}
                {has(intro) ? <p className="mt-3.5 max-w-[60ch] text-[1.0625rem] leading-[1.6] text-gray-warm md:text-[1.125rem]">{intro}</p> : null}
              </div>
              {has(numeral) ? (
                <div
                  aria-hidden="true"
                  className={cx(
                    'hidden shrink-0 font-display text-[6rem] leading-[0.8] tracking-[-0.03em] md:block',
                    accent ? 'text-ground-accent' : 'text-ink',
                  )}
                >
                  {numeral}
                </div>
              ) : null}
            </div>
            <div aria-hidden="true" className={cx('mb-8 mt-6 h-0.5 md:mb-10 md:mt-8', accent ? 'bg-ground-accent' : 'bg-ink')} />
          </>
        ) : null}
        <div className={cols}>
          <div className="flex flex-col gap-7">
            {has(why?.heading) || paragraphs.length ? (
              <div>
                {has(why?.heading) ? <DiamondHeading>{why.heading}</DiamondHeading> : null}
                <div className="mt-4 flex max-w-[62ch] flex-col gap-3.5 text-[1rem] leading-[1.65] md:text-[1.0625rem]">
                  {paragraphs.map((para, i) => (
                    <p key={i} className="whitespace-pre-line [&_strong]:font-bold">
                      <InlineBold text={para} />
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
            <Numbers numbers={numbers} section={section} />
            <Box box={box} />
            {section ? null : next}
          </div>

          <div className={cx('flex flex-col', section ? 'gap-6' : 'gap-10')}>
            {groups.length ? (
              <div>
                {has(included?.heading) ? <DiamondHeading>{included.heading}</DiamondHeading> : null}
                <div className="mt-4 flex flex-col gap-6">
                  {groups.map((g, gi) => {
                    const items = (g.items ?? []).filter((it) => has(it?.text))
                    return (
                      <div key={g.id ?? gi}>
                        <h3
                          className={cx(
                            'pb-2 font-display text-[0.9375rem] font-normal uppercase',
                            section ? 'border-b-[1.5px] border-ink tracking-[0.03em]' : 'border-b border-ink/40 tracking-[0.04em]',
                          )}
                        >
                          {g.title}
                        </h3>
                        <ul className="mt-3 flex flex-col gap-2.5 text-[0.9375rem] leading-[1.55] md:text-[1rem]">
                          {items.map((it, ii) => (
                            <li key={it.id ?? ii} className="flex gap-3">
                              <SquareBullet />
                              <span>
                                {has(it.lead) ? (
                                  <strong className="font-bold">
                                    {it.lead.trim().replace(/[:.]$/, '')}
                                    {section ? '.' : ':'}{' '}
                                  </strong>
                                ) : null}
                                {it.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {diffRows.length ? (
              <div>
                {has(differentiators?.heading) ? <DiamondHeading>{differentiators.heading}</DiamondHeading> : null}
                <dl className={cx(has(differentiators?.heading) && 'mt-4')}>
                  {diffRows.map((r, i) => (
                    <div key={r.id ?? i} className={cx('py-3.5', i > 0 && 'border-t border-divider')}>
                      <dt>
                        <Caption className="text-ink">{r.label}</Caption>
                      </dt>
                      <dd className="mt-1.5 text-[0.9375rem] leading-[1.55] md:text-[1rem]">{r.line}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
            {section ? next : null}
          </div>
        </div>
      </Container>
    </Section>
  )
}
