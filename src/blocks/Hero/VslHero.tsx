import React from 'react'

import type { BlockData } from '@/blocks/types'
import { AccentHeadline, ButtonLink, DotMatrix, Eyebrow, Media, Section } from '@/components/ui'
import { VideoFacade } from '@/components/VideoFacade'
import { youtubeVideoId } from '@/lib/youtube'

import { LOGO_MASK } from './logoMask'

/**
 * Hero, `vsl` variant (Campaign LP.dc.html "Hero variant A — VSL", desktop +
 * mobile builds): 820px column on the dot-matrix ground, wine logo shape in
 * the top-right corner, h1 at h2 scale with no accent, the 16:9 video tile
 * (2px ink frame, square ink play button) and ONE button (zero leakage: the
 * seed points it at Book a Call). The video is the shared click-to-load
 * `VideoFacade` (youtube-nocookie, nothing loads before the click).
 * Server component; the facade is the only client island.
 *
 * Empty state: no (valid) video link -> no tile, logged; a missing poster
 * keeps the tile on its ink ground, logged.
 */
export function VslHero({ eyebrow, eyebrowTick, heading, video, ctas, geometry }: BlockData<'hero'>) {
  const url = video?.url?.trim()
  const videoId = url ? youtubeVideoId(url) : null
  if (!videoId) console.error(`[Hero] vsl "${heading}": no valid YouTube link set; video tile left out`)
  const poster = typeof video?.poster === 'object' && video.poster !== null && video.poster.url ? video.poster : null
  if (videoId && !poster) console.error(`[Hero] vsl "${heading}": no poster image; video tile shows its ink ground`)
  const cta = ctas?.[0]?.link

  return (
    <Section tone="light" pad="none" className="relative overflow-hidden">
      <DotMatrix fade="corner" />
      {geometry !== false ? (
        <div
          aria-hidden="true"
          style={LOGO_MASK}
          className="pointer-events-none absolute -right-30 -top-37.5 z-0 size-60 bg-ground-accent md:-right-35 md:-top-15 md:size-75"
        />
      ) : null}
      <div className="relative z-10 mx-auto w-full max-w-205 px-container-mobile pt-11 pb-12 md:px-container md:py-16">
        {eyebrow ? <Eyebrow tick={eyebrowTick !== false}>{eyebrow}</Eyebrow> : null}
        <AccentHeadline
          text={heading}
          level={2}
          as="h1"
          className="mt-4 max-md:!text-[1.75rem] max-md:!leading-[1.08] md:mt-5 md:max-w-[20ch]"
        />
        {videoId ? (
          <VideoFacade
            videoId={videoId}
            label={`Play video: ${heading}`}
            title={`Video: ${heading}`}
            className="mt-6 aspect-video w-full overflow-hidden border-2 border-ink bg-ink md:mt-8"
          >
            {poster ? <Media resource={poster} fill alt="" preload sizes="(min-width: 820px) 740px, 100vw" /> : null}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center bg-ink text-cream transition-colors duration-180 group-hover:bg-ground-accent md:size-18"
            >
              <svg viewBox="0 0 256 256" fill="currentColor" className="size-5.5 md:size-7">
                <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" />
              </svg>
            </span>
          </VideoFacade>
        ) : null}
        {cta ? (
          <div className="mt-6 md:mt-8">
            <ButtonLink link={cta} variant="primary" size="md" className="w-full md:w-auto" />
          </div>
        ) : null}
      </div>
    </Section>
  )
}
