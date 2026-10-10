import './style.css'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import { appTemplate } from './template'
import { reducedMotion } from './env'
import { initCinemaBackground } from './cinema'
import { initBeanField } from './beans'
import { initHeroScene } from './heroScene'
import { initFloatingSteamIcon } from './steam'
import { initMenuOrder } from './menuOrder'
import { initTextShuffle } from './textShuffle'
import { initSocialGlitch } from './socialGlitch'
import { initFooterScene } from './footerScene'
import { initCustomCursor } from './cursor'
import { initWaypoints } from './waypoints'
import { initUi } from './ui'
import { initScrollStory } from './scrollStory'

gsap.registerPlugin(ScrollTrigger)

const MIN_PRELOADER_MS = 1150

/* ------------------------------------------------------------
   Mounting + smooth scroll
   ------------------------------------------------------------ */

const mountApp = (): void => {
  const app = document.querySelector<HTMLElement>('#app')
  if (!app) return
  app.innerHTML = appTemplate
}

const initSmoothScroll = (): Lenis | null => {
  if (reducedMotion()) return null

  const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  return lenis
}

const scrollToTarget = (hash: string, lenis: Lenis | null): void => {
  const target = document.querySelector<HTMLElement>(hash)
  if (!target) return

  if (lenis) {
    lenis.scrollTo(target, { offset: -70, duration: 1.25 })
    return
  }
  target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
}

const initAnchorNavigation = (lenis: Lenis | null): void => {
  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
    if (!link) return
    const hash = link.getAttribute('href')
    if (!hash || hash === '#') return
    if (!document.querySelector(hash)) return
    event.preventDefault()
    scrollToTarget(hash, lenis)
  })

  document.addEventListener('waypoint:navigate', (event) => {
    const id = (event as CustomEvent<string>).detail
    if (id) scrollToTarget(`#${id}`, lenis)
  })
}

/* ------------------------------------------------------------
   Preloader + intro
   ------------------------------------------------------------ */

const runPreloader = (onDone: () => void): void => {
  const preloader = document.querySelector<HTMLElement>('.preloader')
  if (!preloader) {
    onDone()
    return
  }

  const started = performance.now()
  let finished = false

  const finish = (): void => {
    if (finished) return
    finished = true

    const wait = Math.max(0, MIN_PRELOADER_MS - (performance.now() - started))
    window.setTimeout(() => {
      if (!preloader.isConnected) {
        onDone()
        return
      }
      if (reducedMotion()) {
        preloader.remove()
        onDone()
        return
      }
      gsap.to(preloader, {
        autoAlpha: 0,
        duration: 0.72,
        ease: 'power2.inOut',
        onComplete: () => preloader.remove(),
      })
      onDone()
    }, wait)
  }

  if (document.readyState === 'complete') {
    finish()
    return
  }

  window.addEventListener('load', finish, { once: true })
  // Safety valve — never trap anyone behind the veil.
  window.setTimeout(finish, 4200)
}

const playIntro = (): void => {
  if (reducedMotion()) return

  const lines = gsap.utils.toArray<HTMLElement>('.hero__title-inner')

  gsap
    .timeline({ delay: 0.15 })
    .fromTo(
      '.hero__copy .eyebrow',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
    )
    .fromTo(
      lines,
      { yPercent: 118 },
      { yPercent: 0, duration: 1.05, stagger: 0.12, ease: 'power4.out' },
      0.12,
    )
    .fromTo(
      '.hero__copy .lead',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0.6,
    )
    .fromTo(
      '.hero__actions',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0.72,
    )
    .fromTo(
      '.hero__meta',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0.84,
    )
    .fromTo(
      '.hero__visual',
      { opacity: 0, y: 34, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 1.15, ease: 'power3.out' },
      0.35,
    )
    .fromTo(
      '.floating-card',
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.75, stagger: 0.16, ease: 'power3.out' },
      1.05,
    )
}

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */

const main = (): void => {
  mountApp()

  const lenis = initSmoothScroll()

  initCinemaBackground()
  initBeanField()
  initHeroScene()
  initFloatingSteamIcon()
  initMenuOrder()
  initTextShuffle()
  initSocialGlitch()
  initFooterScene()
  initCustomCursor()
  initWaypoints()
  initUi()
  initScrollStory()

  initAnchorNavigation(lenis)

  // Menu re-renders change the page height — keep triggers honest.
  document.addEventListener('menu:rendered', () => {
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  runPreloader(() => {
    playIntro()
    ScrollTrigger.refresh()
  })
}

main()
