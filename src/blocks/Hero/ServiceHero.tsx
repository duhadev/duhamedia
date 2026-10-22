import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, ButtonLink, Container, Section } from '@/components/ui'
import { cx } from '@/lib/cx'

import { Breadcrumb } from './Breadcrumb'

/**
 * Hero, `service` variant (Shopify Theme Development.dc.html "Breadcrumb" +
 * "Dev hero", Marketing.dc.html "Breadcrumb" + "Marketing hero"; desktop +
 * mobile builds): ink band, breadcrumb bar on top, eyebrow with a yellow
 * diamond, h1, body; to the right (lg) or in full-bleed rows below (mobile) the
 * key figures, the pricing note, the sub-note and the call to action.
 * R13: the design's "$5K" / "$1K/mo" display stat is NOT rendered; the price
 * is the small inline `pricingNote`. Server component. The only h1.
 */
export function ServiceHero({
  eyebrow,
  eyebrowTick,
  heading,
  accentPhrase,
  body,
  pricingNote,
  ctas,
  subNote,
  breadcrumb,
  stats,
}: BlockData<'hero'>) {
  const crumbs = breadcrumb ?? []
  const buttons = (ctas ?? []).slice(0, 2)
  const figures = stats ?? []
  const note = pricingNote?.trim()
  const sub = subNote?.trim()
  const hasActions = buttons.length > 0 || Boolean(note) || Boolean(sub)
  const hasAside = figures.length > 0 || hasActions
  const twoCols = figures.length > 1

  return (
    <>
      {crumbs.some((c) => c.label?.trim()) ? (
        <div className="bg-ink text-cream">
          <Container className="py-2 md:py-2.25">
            <Breadcrumb items={crumbs} tone="dark" />
          </Container>
        </div>
      ) : null}
      <Section tone="dark" pad="none" className="border-t border-cream/20">
        <Container className={cx('lg:pt-14 lg:pb-13', hasAside && 'lg:grid lg:grid-cols-[1fr_300px] lg:items-end lg:gap-14')}>
          <div className={cx('pt-8', hasAside ? 'pb-5' : 'pb-8', 'lg:py-0')}>
            {eyebrow ? (
              <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] opacity-70 md:gap-2.25 md:text-[11px]">
                {eyebrowTick !== false ? <span aria-hidden="true" className="size-2 shrink-0 rotate-45 bg-gold-pale md:size-2.25" /> : null}
                {eyebrow}
              </p>
            ) : null}
            <AccentHeadline
              text={heading}
              accent={accentPhrase}
              level={1}
              as="h1"
              accentColor="ground"
              className={cx('!text-[2.25rem] !leading-[.94] md:!text-[4rem] md:!leading-[.92]', eyebrow ? 'mt-3 md:mt-4.5' : '')}
            />
            {body?.trim() ? (
              <p className="mt-3 max-w-[52ch] text-body-mobile opacity-85 md:mt-5 md:text-[1.0625rem]">{body.trim()}</p>
            ) : null}
          </div>
          {hasAside ? (
            <aside className="-mx-container-mobile md:-mx-container lg:mx-0 lg:border-l lg:border-cream/30 lg:pl-7">
              {figures.length ? (
                <ul
                  className={cx(
                    'grid border-t border-cream/25 lg:flex lg:flex-col lg:gap-5 lg:border-0',
                    twoCols ? 'grid-cols-2' : 'grid-cols-1',
                  )}
                >
                  {figures.map((fig, i) => (
                    <li
                      key={fig.id ?? i}
                      className={cx(
                        'px-container-mobile py-4 md:px-container lg:p-0',
                        twoCols && i % 2 === 0 && 'border-r border-cream/25 lg:border-0',
                        twoCols && i === figures.length - 1 && i % 2 === 0 && 'col-span-2 border-r-0',
                      )}
                    >
                      <p className="font-display text-h2-mobile">{fig.value}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 md:text-[11px]">{fig.label}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
              {hasActions ? (
                <div className="border-t border-cream/25 px-container-mobile pb-6 pt-4 md:px-container lg:mt-5 lg:border-0 lg:p-0">
                  {note ? <p className="mb-1 text-small-mobile font-bold opacity-80 md:text-small">{note}</p> : null}
                  {sub ? <p className="text-small-mobile opacity-60">{sub}</p> : null}
                  {buttons.length ? (
                    <div className={cx('flex flex-col gap-3', (note || sub) && 'mt-4 lg:mt-4.5')}>
                      {buttons.map((cta, i) => (
                        <ButtonLink
                          key={cta.id ?? i}
                          link={cta.link}
                          variant={i === 0 ? 'primary' : 'ghost-light'}
                          size="md"
                          className={cx(
                            'min-h-13 w-full uppercase tracking-[0.04em] lg:min-h-12',
                            i === 0 && '!border-ground-accent !bg-ground-accent !text-cream focus-visible:outline-cream',
                          )}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </aside>
          ) : null}
        </Container>
      </Section>
    </>
  )
}
