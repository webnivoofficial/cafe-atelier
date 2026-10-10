import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from './env'

gsap.registerPlugin(ScrollTrigger)

/**
 * Section reveals — an IntersectionObserver finally grants `.reveal`
 * elements their `is-visible` class (the old build never did).
 */
const initReveals = (): void => {
  const revealables = document.querySelectorAll<HTMLElement>('.reveal')
  if (!revealables.length) return

  if (reducedMotion()) {
    revealables.forEach((el) => el.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  )

  revealables.forEach((el) => observer.observe(el))
}

/** Counts a numeric `.stat-number` up from zero the first time it appears. */
const initStatCounters = (): void => {
  document.querySelectorAll<HTMLElement>('.stat-number').forEach((el) => {
    const match = el.textContent?.match(/^(\d+)(.*)$/)
    if (!match) return
    const end = parseFloat(match[1])
    const suffix = match[2] ?? ''

    if (reducedMotion()) {
      el.textContent = `${end}${suffix}`
      return
    }

    el.textContent = `0${suffix}`
    const counter = { value: 0 }

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: end,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.round(counter.value)}${suffix}`
          },
        })
      },
    })
  })
}

/**
 * The scroll journey — scrubbed, reversible GSAP timelines that carry each
 * section through a small cinematic beat as it crosses the viewport.
 */
const initJourneys = (): void => {
  if (reducedMotion()) return

  /* Hero — copy drifts up and dissolves as the section scrolls away. */
  gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  })
    .to('.hero__copy', { y: -70, opacity: 0.18, ease: 'none' }, 0)
    .to('.hero__meta', { y: -34, opacity: 0, ease: 'none' }, 0)
    .to('.scroll-indicator', { opacity: 0, ease: 'none' }, 0)

  /* Story — the photo stack breathes at slightly different rates. */
  gsap.timeline({
    scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: 0.7 },
  })
    .fromTo('.story__media--main', { y: 56 }, { y: -46, ease: 'none' }, 0)
    .fromTo('.story__media--secondary', { y: -34 }, { y: 42, ease: 'none' }, 0)
    .fromTo('.story__decor--1', { rotation: -8 }, { rotation: 14, ease: 'none' }, 0)
    .fromTo('.story__decor--2', { rotation: 10 }, { rotation: -12, ease: 'none' }, 0)

  /* Menu — heading and filters part like a curtain opening. */
  gsap.timeline({
    scrollTrigger: { trigger: '.menu', start: 'top 85%', end: 'top 30%', scrub: 0.6 },
  })
    .fromTo('.menu__heading > div', { y: 34, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0)
    .fromTo('.menu__filters', { y: 22, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.15)

  /* Signature — hero feature zooms out to reveal itself. */
  gsap.timeline({
    scrollTrigger: { trigger: '.signature', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
  })
    .fromTo('.feature--active .feature__image img', { scale: 1.22 }, { scale: 1.02, ease: 'none' }, 0)
    .fromTo('.feature--active', { y: 40 }, { y: -30, ease: 'none' }, 0)

  /* Signature list — staggered entrances as each row lands. */
  gsap.utils.toArray<HTMLElement>('.mini-feature').forEach((card, index) => {
    gsap.fromTo(
      card,
      { x: index % 2 === 0 ? 46 : -46, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 55%', scrub: 0.6 },
      },
    )
  })

  /* Gallery — columns drift at alternating speeds for depth. */
  const galleryItems = gsap.utils.toArray<HTMLElement>('.gallery__item')
  galleryItems.forEach((item, index) => {
    const speed = index % 3 === 0 ? 34 : index % 3 === 1 ? -26 : 18
    gsap.fromTo(
      item,
      { y: speed * -0.6 },
      {
        y: speed,
        ease: 'none',
        scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: 0.9 },
      },
    )
  })

  /* Contact — the photo panel floats while the form rises to meet it. */
  gsap.timeline({
    scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: 0.7 },
  })
    .fromTo('.contact__image', { yPercent: -8 }, { yPercent: 8, ease: 'none' }, 0)
    .fromTo('.contact__decor-1', { rotation: -10 }, { rotation: 8, ease: 'none' }, 0)
    .fromTo('.contact__decor-2', { rotation: 12 }, { rotation: -9, ease: 'none' }, 0)

  /* Footer — the scene stage rises like a curtain call. */
  gsap.fromTo(
    '.footer-scene',
    { y: 42, opacity: 0.4 },
    {
      y: 0,
      opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.footer-scene', start: 'top 95%', end: 'top 55%', scrub: 0.7 },
    },
  )
}

export const initScrollStory = (): void => {
  initReveals()
  initStatCounters()
  initJourneys()
}
