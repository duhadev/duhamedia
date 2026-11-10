import React, { useId } from 'react'

import type { BlockData } from '@/blocks/types'
import { Caption, SquareBullet } from '@/components/BrochureParts'
import { InlineBold } from '@/components/InlineBold'
import { AccentHeadline, CMSLink, Container, Eyebrow, Section, buttonClasses, resolveLinkHref } from '@/components/ui'
import { cx } from '@/lib/cx'

type Props = BlockData<'pricingPlans'>

const has = (s: string | null | undefined): s is string => Boolean(s && s.trim())

function Statement({ text, accent }: { text: string; accent?: string | null }) {
  const at = has(accent) ? text.indexOf(accent.trim()) : -1
  if (at < 0) return <>{text}</>
  const a = accent!.trim()
  return (
    <>
      {text.slice(0, at)}
      <span className="text-ground-accent">{a}</span>
      {text.slice(at + a.length)}
    </>
  )
}

const LBL = 'text-[0.6875rem] leading-[1.3] font-bold uppercase tracking-[0.14em] text-gray-warm'

function Figure({ value, unit }: { value: string; unit?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-[2rem] leading-none">{value}</span>
      {has(unit) ? <span className="text-[0.875rem] leading-[1.35]">{unit}</span> : null}
    </div>
  )
}

/**
 * PricingPlans (brochure p5, services redesign A 2026-11-09). Server component.
 * Layouts: `overview` (today), `build` (headline + build box with price rows), `plans` (full-width wine plans box, terms, statement).
 * Build box (2px ink) and Grow box (2px wine) side by side from `lg`.
 * Plans are ONE semantic <table>: a real table from `md`; below that the same
 * markup is restyled with CSS into one grey card per plan (4px ink top bar,
 * 16px apart), the column headers hidden and re-created from `data-label`.
 * Terms are native <details>, closed by default.
 */
export function PricingPlansBlock({ anchorId, layout, eyebrow, eyebrowTick, heading, accentPhrase, intro, build, marketing, statement, statementAccent, terms }: Props) {
  const isBuild = layout === 'build'
  const isPlans = layout === 'plans'
  const bullets = (build?.bullets ?? []).filter((b) => has(b?.text))
  const buildRows = (build?.rows ?? []).filter((r) => has(r?.label) && has(r?.value))
  const plans = (marketing?.plans ?? []).filter((p) => has(p?.name))
  const termRows = (terms ?? []).filter((t) => has(t?.label) && has(t?.body))
  const firstLabel = marketing?.firstLabel?.trim() || 'First quarter'
  const afterLabel = marketing?.afterLabel?.trim() || 'After that'
  const nextOk = resolveLinkHref(build?.nextLink) && has(build?.nextLink?.label)
  const mktOk = resolveLinkHref(marketing?.nextLink) && has(marketing?.nextLink?.label)
  // One exclusive group for the Terms (native <details name>). useId is legal here: this component is synchronous.
  const termsName = useId()

  const buildBox = has(build?.price) ? (
    <div className={cx('flex min-w-0 flex-col border-2 border-ink p-5.5', isBuild ? 'md:p-9' : 'md:p-7')}>
              {has(build?.label) ? <Caption className="text-ink">{build.label}</Caption> : null}
              {has(build?.lead) ? <p className="mt-3 text-[1rem]">{build.lead}</p> : null}
              <p className={cx('mt-1 font-display leading-none', isBuild ? 'text-[4rem] md:text-[6rem]' : 'text-[3rem] md:text-[4rem]')}>{build.price}</p>
              {buildRows.length ? (
                <ul className="mt-7 border-t border-divider md:mt-7">
                  {buildRows.map((r, i) => (
                    <li key={r.id ?? i} className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-divider py-3.5 last:border-b-0">
                      <span>{r.label}</span>
                      <b className="font-bold">
                        {r.value}
                        {resolveLinkHref(r.link) && has(r.link?.label) ? (
                          <>
                            {' '}
                            <CMSLink link={r.link} className="-my-2.5 inline-flex min-h-target items-center font-bold no-underline">
                              <span className="ix-rule">{r.link?.label}</span>
                            </CMSLink>
                          </>
                        ) : null}
                      </b>
                    </li>
                  ))}
                </ul>
              ) : null}
              {bullets.length ? (
                <ul className="mt-6 flex flex-col gap-2.5 text-[1rem] leading-[1.55]">
                  {bullets.map((b, i) => (
                    <li key={b.id ?? i} className="flex gap-3">
                      <SquareBullet />
                      <span>{b.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {nextOk ? (
                <div className="mt-6">
                  {has(build?.nextLabel) ? <Caption className="mb-2">{build.nextLabel}</Caption> : null}
                  <CMSLink link={build?.nextLink} className={buttonClasses({ variant: 'dark', className: 'max-md:flex max-md:w-full max-md:whitespace-normal! max-md:py-3 max-md:text-center max-md:leading-tight' })}>
                    {build?.nextLink?.label}
                  </CMSLink>
                </div>
              ) : null}
            </div>
  ) : null

  const plansBox = plans.length ? (
    <div className="min-w-0 border-2 border-ground-accent p-5.5 md:p-7">
              {has(marketing?.label) ? <Caption className="text-ground-accent">{marketing.label}</Caption> : null}
              {has(marketing?.intro) ? <p className="mt-3 text-[1rem]">{marketing.intro}</p> : null}
              <table role="table" className="mt-5 w-full border-collapse text-[0.9375rem] leading-[1.5] max-md:block">
                <thead role="rowgroup" className="max-md:sr-only">
                  <tr role="row" className="border-b-2 border-ink">
                    <th role="columnheader" scope="col" className={cx(LBL, 'pr-3 pb-3 text-left')}>
                      Plan
                    </th>
                    <th role="columnheader" scope="col" className={cx(LBL, 'pr-3 pb-3 text-left')}>
                      {firstLabel}
                    </th>
                    <th role="columnheader" scope="col" className={cx(LBL, 'pb-3 text-left')}>
                      {afterLabel}
                    </th>
                  </tr>
                </thead>
                <tbody role="rowgroup" className="max-md:block">
                  {plans.map((p, i) => {
                    const figures = (p.figures ?? []).filter((f) => has(f?.value))
                    return (
                      <tr
                        role="row"
                        key={p.id ?? i}
                        className={cx(
                          'border-b border-divider last:border-b-2 last:border-ink',
                          'max-md:mb-4 max-md:block max-md:border-0 max-md:border-t-4 max-md:border-ink max-md:bg-gray-light max-md:p-4 max-md:last:mb-0 max-md:last:border-b-0',
                        )}
                      >
                        <th role="rowheader" scope="row" className="w-[30%] py-5 pr-3 text-left align-top max-md:block max-md:w-auto max-md:p-0">
                          <span className="block font-display text-[1.25rem] leading-tight font-normal uppercase">{p.name}</span>
                          {has(p.tag) ? <span className="mt-1 block text-[0.8125rem] font-medium text-gray-warm">{p.tag}</span> : null}
                          {has(p.body) ? (
                            <span className="mt-2 block text-[0.8125rem] leading-[1.45] font-normal [&_strong]:font-bold">
                              <InlineBold text={p.body} />
                            </span>
                          ) : null}
                        </th>
                        <td
                          role="cell"
                          data-label={firstLabel}
                          className="py-5 pr-3 align-top max-md:mt-3.5 max-md:block max-md:p-0 max-md:before:mb-2 max-md:before:block max-md:before:text-[0.6875rem] max-md:before:leading-[1.3] max-md:before:font-bold max-md:before:tracking-[0.14em] max-md:before:text-gray-warm max-md:before:uppercase max-md:before:content-[attr(data-label)]"
                        >
                          {figures.length ? (
                            <div className="flex items-center gap-3.5">
                              {figures.map((f, fi) => (
                                <React.Fragment key={f.id ?? fi}>
                                  {fi > 0 ? <span className={LBL}>or</span> : null}
                                  <Figure value={f.value} unit={f.unit} />
                                </React.Fragment>
                              ))}
                            </div>
                          ) : (
                            <span className="font-bold">{p.first}</span>
                          )}
                        </td>
                        <td
                          role="cell"
                          data-label={afterLabel}
                          className="py-5 align-top font-bold max-md:mt-3.5 max-md:flex max-md:items-baseline max-md:gap-3 max-md:p-0 max-md:before:text-[0.6875rem] max-md:before:leading-[1.9] max-md:before:font-bold max-md:before:tracking-[0.14em] max-md:before:text-gray-warm max-md:before:uppercase max-md:before:content-[attr(data-label)]"
                        >
                          {p.after}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {has(marketing?.threshold) ? (
                <p className="mt-4 border-2 border-ink px-4 py-3 text-[0.9375rem] md:px-5 [&_strong]:font-bold">
                  <InlineBold text={marketing.threshold} />
                </p>
              ) : null}
              {!isPlans && mktOk ? (
                <CMSLink link={marketing?.nextLink} className={buttonClasses({ variant: 'ghost', className: 'mt-6 max-md:mt-2 max-md:flex max-md:w-full max-md:whitespace-normal! max-md:py-3 max-md:text-center max-md:leading-tight' })}>
                  {marketing?.nextLink?.label}
                </CMSLink>
              ) : null}
              {!isPlans && has(marketing?.finePrint) ? (
                <p className="mt-4 whitespace-pre-line text-[0.8125rem] leading-[1.5] text-gray-warm">{marketing.finePrint}</p>
              ) : null}
            </div>
  ) : null

  const headBlock = (
    <>
      {has(eyebrow) ? <Eyebrow tick={eyebrowTick === true}>{eyebrow}</Eyebrow> : null}
      {has(heading) ? <AccentHeadline text={heading} accent={accentPhrase} accentColor="ground" level="section" className={cx(has(eyebrow) && 'mt-4')} /> : null}
      {has(intro) ? <p className={cx('max-w-[64ch] text-body-mobile text-gray-warm md:text-body', isBuild || isPlans ? 'mt-5 md:mt-6' : 'mt-3')}>{intro}</p> : null}
    </>
  )
  const hasHead = has(eyebrow) || has(heading)

  const termsEl = termRows.length ? (
    <div className={isPlans ? undefined : cx(has(statement) ? 'mt-7 md:mt-8' : 'mt-12')}>
      {termRows.map((t, i) => (
        <details key={t.id ?? i} name={termsName} className="group border-t border-divider last:border-b">
          <summary className="flex min-h-target cursor-pointer list-none items-center justify-between gap-4 py-2 text-left font-bold [&::-webkit-details-marker]:hidden">
            {t.label}
            <span aria-hidden="true" className="w-5 shrink-0 text-center font-display text-[20px] leading-none group-open:text-accent-primary">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">–</span>
            </span>
          </summary>
          <p className="pt-1 pb-4 text-[0.9375rem] leading-[1.6] md:text-[1rem]">{t.body}</p>
        </details>
      ))}
    </div>
  ) : null

  const sectionClass = 'scroll-mt-31 py-12 md:scroll-mt-34 md:py-24'

  if (isBuild) {
    return (
      <Section id={anchorId || undefined} tone="light" pad="none" className={sectionClass}>
        <Container className="grid grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-14">
          {hasHead ? <div>{headBlock}</div> : null}
          {buildBox}
        </Container>
      </Section>
    )
  }

  if (isPlans) {
    return (
      <Section id={anchorId || undefined} tone="light" pad="none" className={sectionClass}>
        <Container>
          {hasHead ? <div>{headBlock}</div> : null}
          {plansBox ? <div className={cx(hasHead && 'mt-8 md:mt-12')}>{plansBox}</div> : null}
          {has(marketing?.finePrint) ? (
            <p className="mt-4 max-w-[90ch] whitespace-pre-line text-[0.875rem] leading-[1.5] text-gray-warm">{marketing.finePrint}</p>
          ) : null}
          {termRows.length || has(statement) || mktOk ? (
            <div className="mt-10 grid grid-cols-1 items-start gap-8 md:gap-12 lg:grid-cols-2">
              {termsEl}
              {has(statement) || mktOk ? (
                <div>
                  {has(statement) ? (
                    <p className="font-display text-[1.25rem] leading-[1.15] md:text-[1.625rem]">
                      <Statement text={statement} accent={statementAccent} />
                    </p>
                  ) : null}
                  {mktOk ? (
                    <CMSLink link={marketing?.nextLink} className={buttonClasses({ variant: 'ghost', className: cx(has(statement) && 'mt-7', 'max-md:flex max-md:w-full max-md:whitespace-normal! max-md:py-3 max-md:text-center max-md:leading-tight') })}>
                      {marketing?.nextLink?.label}
                    </CMSLink>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </Container>
      </Section>
    )
  }

  return (
    <Section id={anchorId || undefined} tone="light" pad="none" className={sectionClass}>
      <Container>
        {hasHead ? <div className="border-b-2 border-ink pb-6 md:pb-8">{headBlock}</div> : null}

        <div className="mt-8 grid grid-cols-1 items-start gap-12 md:mt-10 lg:grid-cols-2">
          {buildBox}
          {plansBox}
        </div>

        {has(statement) ? (
          <p className="mt-12 font-display text-[1.25rem] leading-[1.3] md:mt-16 md:text-[1.5rem]">
            <Statement text={statement} accent={statementAccent} />
          </p>
        ) : null}

        {termsEl}
      </Container>
    </Section>
  )
}
