import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CINEMA_PHOTOS } from './data'
import { isMobileViewport } from './env'

gsap.registerPlugin(ScrollTrigger)

type FadeConfig = {
  layer: HTMLElement | undefined
  trigger: string
  start: string
  end: string
}

const crossfadeIn = ({ layer, trigger, start, end }: FadeConfig): void => {
  if (!layer || layer.classList.contains('is-disabled')) return
  gsap.fromTo(
    layer,
    { autoAlpha: 0, scale: 1.05, yPercent: -2 },
    {
      autoAlpha: 1,
      scale: 1.12,
      yPercent: 0,
      ease: 'none',
      scrollTrigger: { trigger, start, end, scrub: 0.6 },
    },
  )
}

const crossfadeOut = ({ layer, trigger, start, end }: FadeConfig): void => {
  if (!layer || layer.classList.contains('is-disabled')) return
  gsap.to(layer, {
    autoAlpha: 0,
    scale: 1.18,
    yPercent: 3,
    ease: 'none',
    scrollTrigger: { trigger, start, end, scrub: 0.6 },
  })
}

/** Keeps the CSS Ken Burns motion running only while a layer is on screen. */
const trackActiveWindow = (
  layer: HTMLElement | undefined,
  startTrigger: string,
  endTrigger: string,
): void => {
  if (!layer || layer.classList.contains('is-disabled')) return
  ScrollTrigger.create({
    trigger: startTrigger,
    start: 'top bottom',
    endTrigger,
    end: 'top 20%',
    onToggle: (self) => layer.classList.toggle('is-active', self.isActive),
  })
}

/**
 * Cinematic café backdrop — a sequence of art-directed photographs that
 * crossfade, drift and re-frame as the visitor scrolls through the site.
 */
export const initCinemaBackground = (): void => {
  const root = document.querySelector<HTMLElement>('.cinema-bg')
  if (!root) return

  // Warm the image cache so crossfades never pop in half-loaded.
  CINEMA_PHOTOS.forEach((url) => {
    const preloader = new Image()
    preloader.src = url
  })

  const layers = Array.from(root.querySelectorAll<HTMLElement>('.cinema-bg__layer'))
  const mobile = isMobileViewport()
  const [heroShot, sunlitRoom, baristaCounter, lattePour] = layers

  if (mobile) {
    sunlitRoom?.classList.add('is-disabled')
    lattePour?.classList.add('is-disabled')
  }

  // Hero photograph dissolves into the sunlit room as the story begins.
  crossfadeOut({ layer: heroShot, trigger: '.story', start: 'top 88%', end: 'top 22%' })

  if (!mobile) {
    crossfadeIn({ layer: sunlitRoom, trigger: '.story', start: 'top 92%', end: 'top 32%' })
    crossfadeOut({ layer: sunlitRoom, trigger: '.signature', start: 'top 88%', end: 'top 24%' })
    crossfadeIn({ layer: baristaCounter, trigger: '.signature', start: 'top 92%', end: 'top 32%' })
  } else {
    crossfadeIn({ layer: baristaCounter, trigger: '.menu', start: 'top 92%', end: 'top 32%' })
  }
  if (!mobile) {
    crossfadeOut({ layer: baristaCounter, trigger: '.contact', start: 'top 88%', end: 'top 24%' })
    crossfadeIn({ layer: lattePour, trigger: '.contact', start: 'top 92%', end: 'top 32%' })
  }

  trackActiveWindow(heroShot, '.hero', '.story')
  if (!mobile) {
    trackActiveWindow(sunlitRoom, '.story', '.signature')
    trackActiveWindow(baristaCounter, '.signature', '.contact')
    trackActiveWindow(lattePour, '.contact', '.site-footer')
  } else {
    trackActiveWindow(baristaCounter, '.menu', '.site-footer')
  }
}
