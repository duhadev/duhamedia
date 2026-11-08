import React from 'react'

import type { BlockData } from '@/blocks/types'
import { Caption, DiamondHeading, SquareBullet } from '@/components/BrochureParts'
import { InlineBold, paragraphsOf } from '@/components/InlineBold'
import { CMSLink, Container, Section, resolveLinkHref } from '@/components/ui'
import { cx } from '@/lib/cx'

type Props = BlockData<'serviceSheet'>

const has = (s: string | null | undefined): s is string => Boolean(s && s.trim())

function Numbers({ numbers }: { numbers: Props['numbers'] }) {
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
                {n.text}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <dl className={cx('grid grid-cols-3 gap-4', has(numbers?.label) && 'mt-4')}>
          {items.map((n, i) => (
            <div key={n.id ?? i} className="flex flex-col">
              <dt className={cx('font-display text-[1.75rem] leading-none md:text-[2.25rem]', n.accent && 'text-ground-accent')}>{n.value}</dt>
              {has(n.text) ? <dd className="mt-2.5 text-[0.8125rem] leading-[1.45] md:text-[0.875rem]">{n.text}</dd> : null}
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

function NextStep({ next }: { next: Props['nextStep'] }) {
  if (!resolveLinkHref(next?.link) || !has(next?.link?.label)) return null
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

/**
 * ServiceSheet (brochure p2 / p3). Server component, no interactivity.
 * Phones/tablets: one column in brochure reading order (left column, then
 * right). From `lg`: the brochure's two columns.
 */
export function ServiceSheetBlock({ why, numbers, box, nextStep, included, differentiators }: Props) {
  const paragraphs = paragraphsOf(why?.body)
  const groups = (included?.groups ?? []).filter((g) => has(g?.title))
  const diffRows = (differentiators?.rows ?? []).filter((r) => has(r?.label) && has(r?.line))

  return (
    <Section tone="light" pad="none" className="py-12 md:py-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-14">
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
            <Numbers numbers={numbers} />
            <Box box={box} />
            <NextStep next={nextStep} />
          </div>

          <div className="flex flex-col gap-10">
            {groups.length ? (
              <div>
                {has(included?.heading) ? <DiamondHeading>{included.heading}</DiamondHeading> : null}
                <div className="mt-4 flex flex-col gap-6">
                  {groups.map((g, gi) => {
                    const items = (g.items ?? []).filter((it) => has(it?.text))
                    return (
                      <div key={g.id ?? gi}>
                        <h3 className="border-b border-ink/40 pb-2 font-display text-[0.9375rem] font-normal uppercase tracking-[0.04em]">
                          {g.title}
                        </h3>
                        <ul className="mt-3 flex flex-col gap-2.5 text-[0.9375rem] leading-[1.55] md:text-[1rem]">
                          {items.map((it, ii) => (
                            <li key={it.id ?? ii} className="flex gap-3">
                              <SquareBullet />
                              <span>
                                {has(it.lead) ? <strong className="font-bold">{it.lead.trim().replace(/:$/, '')}: </strong> : null}
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
                <dl className="mt-4">
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
          </div>
        </div>
      </Container>
    </Section>
  )
}
