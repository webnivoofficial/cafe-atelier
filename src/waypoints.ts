import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isMobileViewport, reducedMotion } from './env'

gsap.registerPlugin(ScrollTrigger)

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'story', label: 'Our story' },
  { id: 'menu', label: 'Menu' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Right-edge section indicators. Navigation is delegated through a
 * `waypoint:navigate` custom event so the smooth-scroll owner (main.ts)
 * can route it through Lenis.
 */
export const initWaypoints = (): void => {
  if (isMobileViewport()) return

  const nav = document.createElement('nav')
  nav.className = 'waypoints'
  nav.setAttribute('aria-label', 'Section navigation')
  nav.innerHTML = SECTIONS.map(
    (section) => `
      <button type="button" class="waypoint" data-target="${section.id}">
        <span class="waypoint__dot" aria-hidden="true"></span>
        <span class="waypoint__label">${section.label}</span>
      </button>
    `,
  ).join('')
  document.body.appendChild(nav)

  const buttons = Array.from(nav.querySelectorAll<HTMLButtonElement>('.waypoint'))

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('waypoint:navigate', { detail: button.dataset.target }))
    })
  })

  const setActive = (index: number): void => {
    buttons.forEach((button, i) => button.classList.toggle('is-active', i === index))
  }
  setActive(0)

  SECTIONS.forEach((section, index) => {
    const el = document.getElementById(section.id)
    if (!el) return
    ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) setActive(index)
      },
    })
  })

  // Appear once the hero is left behind, tuck away again at the very top.
  if (reducedMotion()) {
    ScrollTrigger.create({
      trigger: '.story',
      start: 'top 80%',
      onToggle: (self) => {
        nav.style.opacity = self.isActive ? '1' : '0'
        nav.style.visibility = self.isActive ? 'visible' : 'hidden'
      },
    })
    return
  }

  gsap.fromTo(
    nav,
    { autoAlpha: 0, x: 22 },
    {
      autoAlpha: 1,
      x: 0,
      duration: 0.55,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.story',
        start: 'top 75%',
        endTrigger: '.hero',
        end: 'bottom 60%',
        toggleActions: 'play none none reverse',
      },
    },
  )
}
