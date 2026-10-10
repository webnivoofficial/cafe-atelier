const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const pointerQuery = window.matchMedia('(pointer: fine)')

export const reducedMotion = (): boolean => motionQuery.matches
export const finePointer = (): boolean => pointerQuery.matches
export const isMobileViewport = (): boolean => window.innerWidth <= 780

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const randomBetween = (min: number, max: number): number =>
  min + Math.random() * (max - min)

export const randomIntBetween = (min: number, max: number): number =>
  Math.floor(randomBetween(min, max + 1))

export const pickRandom = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)]
