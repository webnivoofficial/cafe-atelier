import { gsap } from 'gsap'

import { isMobileViewport, randomBetween, randomIntBetween, reducedMotion } from './env'

const BEAN_COLORS = [
  { body: '#5a3521', crease: '#2e1a0f' },
  { body: '#7c4c2e', crease: '#3f2413' },
  { body: '#9a6640', crease: '#52311b' },
  { body: '#43291a', crease: '#241209' },
]

const beanSvg = (colors: { body: string; crease: string }): string => `
  <svg viewBox="0 0 40 56" aria-hidden="true" focusable="false">
    <ellipse cx="20" cy="28" rx="12.5" ry="19.5" fill="${colors.body}" transform="rotate(16 20 28)" />
    <path d="M18.5 10.5c-3.4 9.2-3.4 25.8 0 35" stroke="${colors.crease}" stroke-width="3.6" stroke-linecap="round" fill="none" opacity="0.9" />
    <ellipse cx="15.5" cy="19" rx="3" ry="6.5" fill="rgba(255, 226, 188, 0.22)" transform="rotate(16 15.5 19)" />
  </svg>
`

type Bean = {
  parallaxEl: HTMLElement
  driftEl: HTMLElement
  depth: number
}

/**
 * Slow-drifting coffee beans at assorted depths, with scroll parallax so
 * the page always carries a whisper of motion.
 */
export const initBeanField = (): void => {
  const field = document.querySelector<HTMLElement>('.bean-field')
  if (!field) return

  const count = isMobileViewport() ? 6 : 12
  const beans: Bean[] = []

  for (let i = 0; i < count; i++) {
    const colors = BEAN_COLORS[i % BEAN_COLORS.length]
    const depth = randomBetween(0.25, 1)
    const size = Math.round(randomBetween(16, 40) * (0.6 + depth * 0.4))

    const bean = document.createElement('div')
    bean.className = 'bean'
    bean.style.left = `${randomBetween(2, 96)}%`
    bean.style.top = `${randomBetween(-8, 100)}%`
    bean.style.width = `${size}px`
    bean.style.height = `${Math.round(size * 1.4)}px`
    bean.style.opacity = `${(0.1 + depth * 0.2).toFixed(2)}`
    if (depth < 0.5) bean.style.filter = 'blur(1.1px)'

    const drift = document.createElement('div')
    drift.className = 'bean__drift'
    drift.innerHTML = beanSvg(colors)
    bean.appendChild(drift)
    field.appendChild(bean)

    beans.push({ parallaxEl: bean, driftEl: drift, depth })
  }

  if (reducedMotion()) return

  beans.forEach(({ driftEl, depth }) => {
    gsap.fromTo(
      driftEl,
      { y: '-10vh' },
      {
        y: '10vh',
        duration: randomBetween(16, 26),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      },
    )

    gsap.to(driftEl, {
      x: `${randomBetween(-40, 40)}px`,
      duration: randomBetween(9, 18),
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })

    gsap.to(driftEl.firstElementChild, {
      rotation: randomIntBetween(-180, 180),
      duration: randomBetween(30, 70),
      repeat: -1,
      ease: 'none',
    })
  })

  // Depth parallax — nearer beans respond to scroll more than distant ones.
  let lastScroll = window.scrollY
  const applyParallax = (): void => {
    const current = window.scrollY
    if (current === lastScroll) return
    lastScroll = current
    beans.forEach(({ parallaxEl, depth }) => {
      const offset = -current * 0.045 * depth
      parallaxEl.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`
    })
  }

  gsap.ticker.add(applyParallax)
}
