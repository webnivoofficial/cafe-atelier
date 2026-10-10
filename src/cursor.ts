import { gsap } from 'gsap'
import { finePointer, isMobileViewport, reducedMotion } from './env'

/**
 * Custom cursor — a crisp dot with a trailing glass ring that expands over
 * anything interactive. Desktop pointers only.
 */
export const initCustomCursor = (): void => {
  if (!finePointer() || reducedMotion() || isMobileViewport()) return

  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  const ring = document.createElement('div')
  ring.className = 'cursor-ring'
  dot.setAttribute('aria-hidden', 'true')
  ring.setAttribute('aria-hidden', 'true')

  document.body.append(dot, ring)
  document.body.classList.add('has-cursor')

  gsap.set([dot, ring], { autoAlpha: 0 })

  const ringX = gsap.quickTo(ring, 'x', { duration: 0.32, ease: 'power3.out' })
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.32, ease: 'power3.out' })

  let shown = false
  const reveal = (): void => {
    if (shown) return
    shown = true
    gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
  }

  window.addEventListener(
    'pointermove',
    (event) => {
      reveal()
      gsap.set(dot, { x: event.clientX, y: event.clientY })
      ringX(event.clientX)
      ringY(event.clientY)
    },
    { passive: true },
  )

  document.addEventListener('mouseleave', () => {
    gsap.to([dot, ring], { autoAlpha: 0, duration: 0.25 })
    shown = false
  })

  const interactiveSelector = 'a, button, [data-tilt], input, select, textarea, .menu-item__media'

  document.addEventListener('pointerover', (event) => {
    const target = event.target as HTMLElement | null
    if (target?.closest(interactiveSelector)) {
      document.body.classList.add('cursor-hover')
    }
  })

  document.addEventListener('pointerout', (event) => {
    const target = event.target as HTMLElement | null
    if (target?.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-hover')
    }
  })

  window.addEventListener('pointerdown', () => {
    gsap.to(ring, { scale: 0.78, duration: 0.16, ease: 'power2.out' })
  })

  window.addEventListener('pointerup', () => {
    gsap.to(ring, { scale: 1, duration: 0.3, ease: 'back.out(2.2)' })
  })
}
