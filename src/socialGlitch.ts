import { gsap } from 'gsap'
import { animate as motionAnimate } from 'motion'
import { SOCIAL_PROFILES } from './data'
import type { SocialKey } from './data'
import { finePointer, randomBetween, randomIntBetween, reducedMotion } from './env'

const iconSvg = (key: SocialKey): string => {
  const profile = SOCIAL_PROFILES[key]
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${profile.path}"/></svg>`
}

/* ------------------------------------------------------------------ */
/* Glitch                                                              */
/* ------------------------------------------------------------------ */

const glitchIcon = (el: HTMLElement): void => {
  const svg = el.querySelector('svg')
  if (!svg || el.classList.contains('is-glitching')) return
  el.classList.add('is-glitching')

  const makeGhost = (color: string): SVGSVGElement => {
    const ghost = svg.cloneNode(true) as SVGSVGElement
    ghost.classList.add('social-link__ghost')
    ghost.style.color = color
    el.appendChild(ghost)
    return ghost
  }

  const ghostA = makeGhost('rgba(255, 96, 96, 0.8)')
  const ghostB = makeGhost('rgba(96, 226, 210, 0.8)')

  const tl = gsap.timeline({
    onComplete: () => {
      ghostA.remove()
      ghostB.remove()
      gsap.set(svg, { clearProps: 'all' })
      el.classList.remove('is-glitching')
    },
  })

  const steps = randomIntBetween(4, 6)
  for (let i = 0; i < steps; i++) {
    const at = i * 0.09
    tl.set([ghostA, ghostB], { opacity: 1 }, at)
    tl.set(ghostA, { x: randomBetween(-8, -3), y: randomBetween(-3, 3), skewX: randomBetween(-14, 14) }, at)
    tl.set(ghostB, { x: randomBetween(3, 8), y: randomBetween(-3, 3), skewX: randomBetween(-14, 14) }, at)
    tl.set(svg, { x: randomBetween(-3, 3), skewX: randomBetween(-8, 8) }, at)
  }

  tl.set([ghostA, ghostB, svg], { opacity: 0, x: 0, y: 0, skewX: 0 }, steps * 0.09)
  tl.set(svg, { opacity: 1 }, steps * 0.09 + 0.05)

  // Occasionally slice the icon with a clipped band for extra texture.
  if (Math.random() > 0.45) {
    tl.fromTo(
      svg,
      { clipPath: 'inset(14% 0 44% 0)' },
      { clipPath: 'inset(0% 0 0% 0)', duration: 0.2, ease: 'steps(3)' },
      0.12,
    )
  }
}

/* ------------------------------------------------------------------ */
/* Mount                                                               */
/* ------------------------------------------------------------------ */

/**
 * Footer social icons with accurate brand marks. Every 5–10 seconds one
 * random icon (while on screen) plays a brief randomized glitch.
 */
export const initSocialGlitch = (): void => {
  const mount = document.querySelector<HTMLElement>('.footer-social')
  if (!mount) return

  const nodes: HTMLElement[] = []

  ;(Object.keys(SOCIAL_PROFILES) as SocialKey[]).forEach((key) => {
    const profile = SOCIAL_PROFILES[key]
    const el = profile.url ? document.createElement('a') : document.createElement('span')
    el.className = `social-link social-link--${key}`
    el.innerHTML = iconSvg(key)

    if (profile.url) {
      el.setAttribute('href', profile.url)
      el.setAttribute('target', '_blank')
      el.setAttribute('rel', 'noopener noreferrer')
      el.setAttribute('aria-label', `Café Atelier on ${profile.label}`)
    } else {
      // URL not invented — render as a quiet placeholder until provided.
      el.classList.add('social-link--pending')
      el.setAttribute('role', 'img')
      el.setAttribute('aria-label', `${profile.label} — link coming soon`)
    }

    mount.appendChild(el)
    nodes.push(el)
  })

  if (!nodes.length) return

  // Entrance: rise into place when the footer social row scrolls into view.
  if (!reducedMotion()) {
    gsap.set(nodes, { autoAlpha: 0, y: 20 })
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()
        gsap.to(nodes, {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: 'power3.out',
          onComplete: () => gsap.set(nodes, { clearProps: 'transform' }),
        })
      },
      { threshold: 0.4 },
    )
    observer.observe(mount)
  }

  // Hover springs (Motion.dev).
  if (finePointer() && !reducedMotion()) {
    nodes.forEach((el) => {
      el.addEventListener('pointerenter', () => {
        motionAnimate(el, { scale: 1.14, y: -3 }, { type: 'spring', stiffness: 340, damping: 18 })
      })
      el.addEventListener('pointerleave', () => {
        motionAnimate(el, { scale: 1, y: 0 }, { type: 'spring', stiffness: 260, damping: 20 })
      })
    })
  }

  // Randomized glitch loop.
  if (reducedMotion()) return

  const scheduleGlitch = (): void => {
    window.setTimeout(() => {
      const visible = nodes.filter((el) => {
        const rect = el.getBoundingClientRect()
        return rect.bottom > 0 && rect.top < window.innerHeight
      })
      if (visible.length) {
        glitchIcon(visible[randomIntBetween(0, visible.length - 1)])
      }
      scheduleGlitch()
    }, randomBetween(5000, 10000))
  }
  scheduleGlitch()
}
