import { gsap } from 'gsap'
import { reducedMotion } from './env'

/** Minimal café-cup icon with animated steam wisps (SVG markup). */
export const steamIconSvg = (className = ''): string => `
  <svg class="steam-icon ${className}" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
    <g class="steam-icon__steam">
      <path class="steam-icon__wisp" d="M25 23c-2.4-2.8 2.4-4.9 0-8" />
      <path class="steam-icon__wisp" d="M32 21c-2.7-3.1 2.7-5.4 0-9" />
      <path class="steam-icon__wisp" d="M39 23c-2.4-2.8 2.4-4.9 0-8" />
    </g>
    <path class="steam-icon__body" d="M15 30.5h28.5l-2.9 15.6a6.3 6.3 0 0 1-6.2 5.2h-10a6.3 6.3 0 0 1-6.2-5.2L15 30.5Z" />
    <path class="steam-icon__handle" d="M43.5 33.5h3a5.6 5.6 0 0 1 0 11.2h-4.6" />
    <ellipse class="steam-icon__rim" cx="29.2" cy="30.5" rx="14.6" ry="3.1" />
    <ellipse class="steam-icon__surface" cx="29.2" cy="30.6" rx="10.4" ry="1.9" />
    <ellipse class="steam-icon__saucer" cx="29.5" cy="55.4" rx="19.5" ry="2.9" />
  </svg>
`

/** Start a soft looping steam animation inside a rendered steam icon. */
export const attachSteam = (svg: SVGSVGElement): void => {
  const wisps = svg.querySelectorAll<SVGPathElement>('.steam-icon__wisp')
  if (!wisps.length) return

  if (reducedMotion()) {
    gsap.set(wisps, { opacity: 0.45 })
    return
  }

  wisps.forEach((wisp, index) => {
    const sway = index % 2 === 0 ? 2.4 : -2.4
    gsap.set(wisp, { transformOrigin: '50% 100%' })

    const rise = gsap.timeline({ repeat: -1, delay: index * 0.75, repeatDelay: 0.4 })
    rise
      .fromTo(
        wisp,
        { y: 9, opacity: 0, scaleY: 0.55 },
        { y: -6, opacity: 0.9, scaleY: 1, duration: 1.35, ease: 'sine.out' },
      )
      .to(wisp, { y: -16, opacity: 0, duration: 0.85, ease: 'sine.in' })

    gsap.to(wisp, {
      x: sway,
      duration: 1.5 + index * 0.35,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
  })
}

/** Small floating decorative cup near the bottom of the viewport. */
export const initFloatingSteamIcon = (): void => {
  const holder = document.createElement('div')
  holder.className = 'steam-float glass-panel'
  holder.setAttribute('aria-hidden', 'true')
  holder.innerHTML = steamIconSvg('steam-float__icon')
  document.body.appendChild(holder)

  const svg = holder.querySelector('svg')
  if (svg) {
    attachSteam(svg as SVGSVGElement)
  }

  if (!reducedMotion()) {
    gsap.to(holder, {
      y: -9,
      duration: 4.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
  }
}
