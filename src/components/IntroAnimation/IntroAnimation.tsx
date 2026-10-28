'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import './intro.css'

/**
 * Homepage logo intro (design: Intro Animation.dc.html; human-ordered
 * 2026-10-28, resolves design Conflict 11). Plays on every full document load
 * of `/` (refresh included, no storage flag) and never on in-app navigation.
 *
 * Client component because it must (a) tell a hydrated server render from an
 * in-app navigation and (b) unmount itself / handle skip. It is still
 * server-rendered, so the overlay is in the HTML before any page content
 * paints; the animation itself is pure CSS and clears itself without JS.
 *
 * Detection: on a full load the overlay element already exists in the DOM when
 * hydration renders this component; on a client-side navigation it does not.
 * `played` additionally stops a replay within one document lifetime.
 */
const ID = 'intro-overlay'
const TOTAL_MS = 2720 // panel pull-up ends (2.16s + 560ms)
let played = false

function shouldPlay(): boolean {
  if (played) return false
  if (typeof document === 'undefined') return true // SSR
  return document.getElementById(ID) !== null // hydrating server HTML
}

export function IntroAnimation() {
  const [active, setActive] = useState(shouldPlay)

  useEffect(() => {
    if (!active) return
    played = true
    const el = document.getElementById(ID)
    const skip = () => {
      el?.setAttribute('data-skip', '')
      window.setTimeout(() => setActive(false), 260)
    }
    const done = window.setTimeout(() => setActive(false), TOTAL_MS + 200)
    window.addEventListener('pointerdown', skip, { once: true })
    window.addEventListener('keydown', skip, { once: true })
    return () => {
      window.clearTimeout(done)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [active])

  if (!active) return null

  const bands = [1, 2, 3, 4] as const
  return (
    <div id={ID} className="intro" aria-hidden="true">
      <div className="intro__stage">
        <div className="intro__lockup">
          <div className="intro__sunwrap">
            <div className="intro__sun">
              {bands.map((n) => (
                <div key={n} className={`intro__band intro__band--${n}`}>
                  <Image src="/logo-duha.png" alt="" fill sizes="440px" unoptimized priority={n === 1} />
                </div>
              ))}
            </div>
          </div>
          <div className="intro__word">
            <div className="intro__mask">
              <span className="intro__rise">Duha</span>
            </div>
            <div className="intro__mask">
              <span className="intro__rise">Media</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
