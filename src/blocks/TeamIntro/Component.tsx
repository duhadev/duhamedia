import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, CMSLink, Container, Eyebrow, Media, Section } from '@/components/ui'
import { resolveLinkHref } from '@/components/ui/CMSLink'
import type { Media as MediaDoc, TeamMember } from '@/payload-types'

type TeamIntroData = BlockData<'teamIntro'>

type Platform = NonNullable<TeamMember['socials']>[number]['platform']

const SOCIAL: Record<Platform, { label: string; path: string }> = {
  linkedin: {
    label: 'LinkedIn',
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z',
  },
  x: {
    label: 'X',
    path: 'M18.9 2H22l-7.2 8.2L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.7-8.8L1.4 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L6.8 3.9H4.9L17.7 20z',
  },
  github: {
    label: 'GitHub',
    path: 'M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z',
  },
  instagram: {
    label: 'Instagram',
    path: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5.25-3.25a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z',
  },
  youtube: {
    label: 'YouTube',
    path: 'M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2C.5 9.1.5 12 .5 12s0 2.9.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8zM9.7 15.5v-7l6 3.5-6 3.5z',
  },
  facebook: {
    label: 'Facebook',
    path: 'M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z',
  },
}

// Padding on the anchor gives the 44px target; the underline lives on the inner
// span so the look is unchanged.
const LINK_CLASS = 'inline-block py-3 text-[15px] font-bold text-ink no-underline'
const LINK_TEXT_CLASS = 'border-b-2 border-ink py-1'

function IntroLink({ link, className }: { link: TeamIntroData['link']; className: string }) {
  const label = resolveLinkHref(link) ? link?.label?.trim() : ''
  if (!label) return null
  return (
    <CMSLink link={link} className={`${LINK_CLASS} ${className}`}>
      <span className={LINK_TEXT_CLASS}>{label}</span>
    </CMSLink>
  )
}

/**
 * TeamIntro (Homepage.dc.html "Founder" x2, desktop + mobile builds).
 * Server component: no interactivity.
 * - `intro`: text column + 4:5 photo (full-bleed under the text on mobile).
 *   No photo: text only, the layout stays single-column.
 * - `founder-card`: headline, body, then the member card. No member, or a
 *   member that is not published/populated: the whole block renders nothing
 *   (console.error), never a half card.
 */
export function TeamIntroBlock({
  variant,
  eyebrow,
  eyebrowTick,
  heading,
  accentPhrase,
  body,
  photo,
  member,
  link,
}: TeamIntroData) {
  if (variant === 'founder-card') {
    const person = member && typeof member === 'object' ? member : null
    if (!person || (person._status && person._status !== 'published')) {
      console.error(
        '[TeamIntro] founder-card has no published team member (empty, unpopulated or draft); rendering nothing.',
      )
      return null
    }
    const socials = (person.socials ?? []).filter((s) => s.url && SOCIAL[s.platform])
    const portrait = person.photo && typeof person.photo === 'object' ? person.photo : null

    return (
      <Section tone="light" pad="none" divider="top" className="pt-10 pb-11 md:py-18">
        <Container>
          {eyebrow ? (
            <Eyebrow muted tick={eyebrowTick === true} className="mb-3.5">
              {eyebrow}
            </Eyebrow>
          ) : null}
          <AccentHeadline text={heading} accent={accentPhrase} level={2} accentColor="ground" className="mb-5 md:mb-4.5" />
          {body ? <p className="max-w-[68ch] text-body-mobile leading-[1.7] text-[#3A3630] md:text-[1.0625rem] md:leading-[1.65]">{body}</p> : null}
          <IntroLink link={link} className="mt-1.5" />
          <div className="mt-7 flex items-center gap-4 border-t border-divider pt-6">
            {portrait ? (
              <div className="relative size-19 flex-none overflow-hidden rounded-full border-2 border-ink md:size-20">
                <Media resource={portrait} fill sizes="80px" alt="" className="object-cover" />
              </div>
            ) : null}
            <div className="flex flex-col gap-1 md:gap-0.75">
              <span className="font-display text-[1.25rem] leading-[1.05] uppercase md:text-[1.375rem]">{person.name}</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-warm">{person.role}</span>
              {socials.length ? (
                <ul className="-mt-1 flex flex-wrap gap-x-4 md:mt-0">
                  {socials.map((s, i) => (
                    <li key={s.id ?? i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-target items-center gap-1.5 text-[13px] font-bold text-ink no-underline md:gap-2 md:text-sm"
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4 md:size-4.5">
                          <path d={SOCIAL[s.platform].path} />
                        </svg>
                        {SOCIAL[s.platform].label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>
    )
  }

  const hasPhoto = Boolean(photo && typeof photo === 'object' && photo.url)

  return (
    <Section tone="light" pad="none" className={`pt-12 md:py-section ${hasPhoto ? '' : 'pb-12'}`}>
      <Container className={hasPhoto ? 'flex flex-col gap-7 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] md:items-center md:gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16' : ''}>
        <div>
          {eyebrow ? (
            <Eyebrow muted tick={eyebrowTick === true}>
              {eyebrow}
            </Eyebrow>
          ) : null}
          <AccentHeadline
            text={heading}
            accent={accentPhrase}
            level="section"
            className="mt-3.5 md:mt-4"
          />
          {body ? <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.6] md:mt-5 md:text-body">{body}</p> : null}
          <IntroLink link={link} className="mt-1.5 md:mt-2" />
        </div>
        {hasPhoto ? (
          <div className="relative -mx-5 aspect-4/5 bg-gray-light md:mx-0">
            <Media resource={photo as MediaDoc} fill sizes="(min-width: 1024px) 380px, (min-width: 768px) 300px, 100vw" className="object-cover" />
          </div>
        ) : null}
      </Container>
    </Section>
  )
}
