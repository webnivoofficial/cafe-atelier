import { gsap } from 'gsap'
import { TEXT_VARIATIONS } from './data'
import type { ShuffleKey } from './data'
import { reducedMotion } from './env'

type ShuffleTarget = {
  el: HTMLElement
  key: ShuffleKey
  index: number
}

const SWAP_COOLDOWN = 4200
const MIN_REVERSAL_DISTANCE = 180

const isElementVisible = (el: HTMLElement): boolean => {
  const rect = el.getBoundingClientRect()
  return rect.bottom > 0 && rect.top < window.innerHeight
}

/** Picks a variant index that always differs from the current one. */
const pickVariant = (key: ShuffleKey, currentIndex: number): number => {
  const pool = TEXT_VARIATIONS[key]
  if (pool.length <= 1) return currentIndex
  let next = currentIndex
  while (next === currentIndex) {
    next = Math.floor(Math.random() * pool.length)
  }
  return next
}

/**
 * Crossfades to new copy. The element height is locked during the swap and
 * then eased to the new natural height, so surrounding layout never jumps.
 */
const swapText = (target: ShuffleTarget, nextIndex: number): void => {
  const { el, key } = target
  const pool = TEXT_VARIATIONS[key]
  const nextText = pool[nextIndex] ?? pool[0] ?? ''
  if (el.textContent === nextText) return

  target.index = nextIndex

  if (reducedMotion()) {
    el.textContent = nextText
    return
  }

  const lockedHeight = el.offsetHeight
  el.style.minHeight = `${lockedHeight}px`

  gsap.to(el, {
    opacity: 0,
    y: -5,
    filter: 'blur(4px)',
    duration: 0.26,
    ease: 'power2.in',
    onComplete: () => {
      el.textContent = nextText
      gsap.fromTo(
        el,
        { opacity: 0, y: 7, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.44,
          ease: 'power2.out',
          onComplete: () => {
            // Settle the height lock smoothly into the new natural height.
            el.style.minHeight = ''
            const natural = el.offsetHeight
            if (natural < lockedHeight) {
              el.style.minHeight = `${lockedHeight}px`
              gsap.to(el, {
                minHeight: natural,
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => {
                  el.style.minHeight = ''
                },
              })
            }
          },
        },
      )
    },
  })
}

/**
 * Curated copy variations — a fresh pick on every page load, and a new pick
 * when the visitor scrolls down for a while and then reverses upward.
 */
export const initTextShuffle = (): void => {
  const targets: ShuffleTarget[] = []

  document.querySelectorAll<HTMLElement>('[data-shuffle]').forEach((el) => {
    const key = (el.dataset.shuffle ?? '') as ShuffleKey
    if (!key || !(key in TEXT_VARIATIONS)) return
    const current = el.textContent?.trim() ?? ''
    const initial = (TEXT_VARIATIONS[key] as readonly string[]).indexOf(current)
    targets.push({ el, key, index: initial >= 0 ? initial : 0 })
  })

  if (!targets.length) return

  // Fresh-load variation: swap to a random pick (guaranteed different).
  targets.forEach((target) => {
    const next = pickVariant(target.key, target.index)
    if (next !== target.index) swapText(target, next)
  })

  if (reducedMotion()) return

  // Scroll-reversal variation.
  let lastY = window.scrollY
  let direction: 'down' | 'up' | null = null
  let downDistance = 0
  let lastSwap = 0

  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY
      const delta = y - lastY
      lastY = y

      if (delta > 0) {
        direction = 'down'
        downDistance += delta
        return
      }
      if (delta < 0) {
        const wasDescending = direction === 'down' && downDistance > MIN_REVERSAL_DISTANCE
        direction = 'up'
        if (!wasDescending) return

        const now = performance.now()
        if (now - lastSwap < SWAP_COOLDOWN) return

        lastSwap = now
        downDistance = 0

        targets.forEach((target) => {
          if (isElementVisible(target.el)) {
            swapText(target, pickVariant(target.key, target.index))
          }
        })
      }
    },
    { passive: true },
  )
}
