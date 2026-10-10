import { gsap } from 'gsap'
import { reducedMotion } from './env'

/* ------------------------------------------------------------------ */
/* Scene markup                                                        */
/* ------------------------------------------------------------------ */

const lampSvg = (x: number): string => `
  <g class="fs-lamp" transform="translate(${x},0)">
    <line x1="0" y1="0" x2="0" y2="56" stroke="#3a2a1e" stroke-width="2.5" />
    <path d="M-22 78 L22 78 L10 58 L-10 58 Z" fill="#c98d5e" />
    <ellipse class="fs-lamp__glow" cx="0" cy="86" rx="46" ry="30" fill="url(#fs-lamp-glow)" />
  </g>
`

const cupSvg = (): string => `
  <g class="fs-steam" aria-hidden="true">
    <path class="fs-steam__wisp" d="M-4 -16 c-2.4 -3 2.4 -4.6 0 -8" />
    <path class="fs-steam__wisp" d="M4 -17 c-2.4 -3 2.4 -4.6 0 -8" />
  </g>
  <path d="M-8 -11 L-6.5 0 L6.5 0 L8 -11 Z" fill="#f2e6d3" />
  <path d="M7.5 -9 q7 1 5.5 6 q-1.5 4.5 -7 3.5" fill="none" stroke="#f2e6d3" stroke-width="2.2" stroke-linecap="round" />
  <ellipse cx="0" cy="-11" rx="8" ry="2" fill="#5a3521" opacity="0.5" />
`

const sceneSvg = (): string => `
  <svg class="footer-scene__svg" viewBox="0 0 920 340" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="fs-lamp-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(224,164,88,0.5)" />
        <stop offset="100%" stop-color="rgba(224,164,88,0)" />
      </radialGradient>
      <linearGradient id="fs-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#241812" />
        <stop offset="100%" stop-color="#180f0a" />
      </linearGradient>
    </defs>

    <rect x="0" y="262" width="920" height="78" fill="url(#fs-floor)" />
    <line x1="0" y1="262" x2="920" y2="262" stroke="rgba(224,164,88,0.22)" stroke-width="2" />

    ${lampSvg(300)}
    ${lampSvg(640)}

    <!-- Counter, espresso machine, jars -->
    <g class="fs-counter">
      <rect x="48" y="184" width="190" height="78" rx="10" fill="#5a3a22" />
      <rect x="48" y="216" width="190" height="8" fill="rgba(0,0,0,0.16)" />
      <rect x="36" y="172" width="214" height="14" rx="7" fill="#7d4e2e" />
      <rect x="80" y="128" width="64" height="44" rx="8" fill="#33241a" />
      <rect x="88" y="136" width="48" height="15" rx="4" fill="#241812" />
      <circle class="fs-machine__light" cx="89" cy="159" r="3.5" fill="#e0a458" />
      <rect x="106" y="153" width="16" height="6" rx="2" fill="#c98d5e" />
      <rect x="196" y="146" width="18" height="26" rx="4" fill="#a9713f" opacity="0.85" />
      <rect x="221" y="152" width="14" height="20" rx="3" fill="#8a5a3a" opacity="0.85" />
      <g class="fs-machine-steam" transform="translate(112,118)">
        <path class="fs-steam__wisp" d="M-4 0 c-2.4 -3 2.4 -4.6 0 -8" />
        <path class="fs-steam__wisp" d="M5 -1 c-2.4 -3 2.4 -4.6 0 -8" />
      </g>
    </g>

    <!-- Table + seated guest -->
    <g class="fs-table">
      <rect x="726" y="212" width="14" height="50" fill="#4a2e1b" />
      <rect x="656" y="196" width="160" height="14" rx="7" fill="#6b4226" />
      <g class="fs-guest">
        <circle cx="800" cy="150" r="10" fill="#d9a97f" />
        <path d="M790 150 a10 10 0 0 1 20 0 z" fill="#2c1a0e" />
        <path d="M790 160 q10 -4 20 0 l7 34 q-17 6 -34 0 z" fill="#a9713f" />
        <g class="fs-guest-arm">
          <path d="M0 0 q-14 6 -21 17" stroke="#a9713f" stroke-width="7" fill="none" stroke-linecap="round" />
        </g>
      </g>
      <g class="fs-cup fs-cup--table" transform="translate(736,194)" opacity="0">
        ${cupSvg()}
      </g>
    </g>

    <!-- Barista -->
    <g class="fs-barista" transform="translate(250,262)">
      <g class="fs-bob">
        <line class="fs-leg fs-leg--l" x1="-9" y1="-50" x2="-9" y2="-3" stroke="#3f2a1d" stroke-width="6" stroke-linecap="round" />
        <line class="fs-leg fs-leg--r" x1="9" y1="-50" x2="9" y2="-3" stroke="#3f2a1d" stroke-width="6" stroke-linecap="round" />
        <path d="M-14 -96 L14 -96 L17 -48 L-17 -48 Z" fill="#e8d5b5" />
        <path d="M-9 -88 L9 -88 L13 -50 L-13 -50 Z" fill="#5a3521" />
        <path d="M-9 -88 L9 -88 L7 -83 L-7 -83 Z" fill="#4a2c19" />
        <path class="fs-arm fs-arm--l" d="M-14 -90 q-6 10 -2 20" stroke="#e8d5b5" stroke-width="6.5" fill="none" stroke-linecap="round" />
        <path class="fs-arm fs-arm--r" d="M14 -90 q6 10 2 20" stroke="#e8d5b5" stroke-width="6.5" fill="none" stroke-linecap="round" />
        <g class="fs-head">
          <circle cx="0" cy="-108" r="10.5" fill="#e0b08a" />
          <path d="M-10.5 -108 a10.5 10.5 0 0 1 21 0 z" fill="#3a2313" />
          <circle cx="-3.5" cy="-105" r="1.3" fill="#2c1a0e" />
          <circle cx="3.5" cy="-105" r="1.3" fill="#2c1a0e" />
        </g>
        <g class="fs-tray">
          <ellipse cx="0" cy="-70" rx="22" ry="5" fill="#c98d5e" />
          <ellipse cx="0" cy="-71.5" rx="22" ry="5" fill="rgba(255,235,205,0.28)" />
        </g>
        <g class="fs-cup fs-cup--tray" transform="translate(0,-70)" opacity="0">
          ${cupSvg()}
        </g>
      </g>
    </g>
  </svg>
`

/* ------------------------------------------------------------------ */
/* Animation                                                           */
/* ------------------------------------------------------------------ */

const animateSteam = (scope: Element, ambient: gsap.core.Timeline[]): void => {
  scope.querySelectorAll<SVGPathElement>('.fs-steam__wisp').forEach((wisp, index) => {
    ambient.push(
      gsap.timeline({ repeat: -1, delay: index * 0.55 }).fromTo(
        wisp,
        { opacity: 0, y: 3 },
        { opacity: 0.75, y: -5, duration: 1.3, ease: 'sine.out' },
      ).to(wisp, { opacity: 0, y: -9, duration: 0.8, ease: 'sine.in' }),
    )
  })
}

/**
 * The signature footer scene — a barista lifts a cup at the counter, walks
 * it to a waiting guest, serves with a nod, is acknowledged, walks back,
 * and the guest enjoys the drink. The loop never teleports anyone.
 */
export const initFooterScene = (): void => {
  const mount = document.querySelector<HTMLElement>('.footer-scene__mount')
  if (!mount) return

  mount.innerHTML = sceneSvg()

  const barista = mount.querySelector<SVGGElement>('.fs-barista')
  const bob = mount.querySelector<SVGGElement>('.fs-bob')
  const legL = mount.querySelector<SVGLineElement>('.fs-leg--l')
  const legR = mount.querySelector<SVGLineElement>('.fs-leg--r')
  const armL = mount.querySelector<SVGPathElement>('.fs-arm--l')
  const armR = mount.querySelector<SVGPathElement>('.fs-arm--r')
  const head = mount.querySelector<SVGGElement>('.fs-head')
  const tray = mount.querySelector<SVGGElement>('.fs-tray')
  const cupTray = mount.querySelector<SVGGElement>('.fs-cup--tray')
  const cupTable = mount.querySelector<SVGGElement>('.fs-cup--table')
  const guestArm = mount.querySelector<SVGGElement>('.fs-guest-arm')

  if (!barista || !bob || !legL || !legR || !armL || !armR || !head || !tray || !cupTray || !cupTable || !guestArm) {
    return
  }

  gsap.set([legL, legR], { transformOrigin: '50% 0%' })
  gsap.set(head, { transformOrigin: '50% 100%' })
  gsap.set(guestArm, { transformOrigin: '100% 0%' })

  /* Reduced motion — a still, fully-served tableau. */
  if (reducedMotion()) {
    gsap.set(barista, { x: 590 })
    gsap.set(cupTable, { opacity: 1 })
    gsap.set(guestArm, { rotation: -12 })
    return
  }

  const ambient: gsap.core.Timeline[] = []

  mount.querySelectorAll<SVGGElement>('.fs-lamp').forEach((lamp, index) => {
    gsap.set(lamp, { transformOrigin: '50% 0%' })
    ambient.push(
      gsap.timeline({ delay: index * 0.7 }).to(lamp, {
        rotation: 3.2,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      }),
    )
    const glow = lamp.querySelector('.fs-lamp__glow')
    if (glow) {
      ambient.push(
        gsap.to(glow, {
          opacity: 0.65,
          duration: 2.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: index * 0.5,
        }),
      )
    }
  })

  const machineLight = mount.querySelector('.fs-machine__light')
  if (machineLight) {
    ambient.push(
      gsap.to(machineLight, {
        opacity: 0.25,
        duration: 1.1,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      }),
    )
  }

  animateSteam(mount.querySelector('.fs-machine-steam') ?? mount, ambient)
  animateSteam(cupTable, ambient)

  const WALK = 2.6
  const STEP = WALK / 8

  const walkCycle = (tl: gsap.core.Timeline, at: number): void => {
    tl.fromTo(
      legL,
      { rotation: -22 },
      { rotation: 22, duration: STEP, yoyo: true, repeat: 7, ease: 'sine.inOut' },
      at,
    )
    tl.fromTo(
      legR,
      { rotation: 22 },
      { rotation: -22, duration: STEP, yoyo: true, repeat: 7, ease: 'sine.inOut' },
      at,
    )
    tl.fromTo(
      bob,
      { y: -2 },
      { y: 0, duration: STEP, yoyo: true, repeat: 7, ease: 'sine.inOut' },
      at,
    )
    tl.fromTo(
      armL,
      { rotation: -4 },
      { rotation: 4, duration: STEP * 2, yoyo: true, repeat: 3, ease: 'sine.inOut' },
      at,
    )
    tl.fromTo(
      armR,
      { rotation: 4 },
      { rotation: -4, duration: STEP * 2, yoyo: true, repeat: 3, ease: 'sine.inOut' },
      at,
    )
  }

  const settleLegs = (tl: gsap.core.Timeline, at: number): void => {
    tl.to([legL, legR], { rotation: 0, duration: 0.28, ease: 'power1.out' }, at)
    tl.to(bob, { y: 0, duration: 0.28, ease: 'power1.out' }, at)
    tl.to([armL, armR], { rotation: 0, duration: 0.28, ease: 'power1.out' }, at)
  }

  const master = gsap.timeline({ repeat: -1, repeatDelay: 0.1 })

  // 0.0 — 0.6 · at the counter: a fresh cup is picked up.
  master.to(cupTray, { opacity: 1, duration: 0.35, ease: 'power1.out' }, 0.18)

  // 0.7 — 3.3 · walk to the table.
  master.to(barista, { x: 590, duration: WALK, ease: 'none' }, 0.7)
  walkCycle(master, 0.7)
  settleLegs(master, 0.7 + WALK)

  // 3.6 — 4.9 · the serve.
  master.to(tray, { rotation: 4, duration: 0.3, ease: 'power1.inOut' }, 3.6)
  master.to(
    cupTray,
    {
      keyframes: [
        { x: 62, y: -94, duration: 0.3, ease: 'power1.out' },
        { x: 146, y: -68, duration: 0.35, ease: 'power1.in' },
      ],
    },
    3.85,
  )
  master.to(cupTray, { opacity: 0, duration: 0.1 }, 4.48)
  master.to(cupTable, { opacity: 1, duration: 0.16, ease: 'power1.out' }, 4.5)
  master.to(tray, { rotation: 0, duration: 0.3, ease: 'power1.inOut' }, 4.7)

  // 4.7 — 5.3 · a nod of thanks, a wave back.
  master.to(head, { rotation: 8, duration: 0.26, ease: 'power1.inOut' }, 4.75)
  master.to(head, { rotation: 0, duration: 0.3, ease: 'power1.inOut' }, 5.02)
  master.to(guestArm, { rotation: -22, duration: 0.35, ease: 'power2.out' }, 4.8)
  master.to(guestArm, { rotation: -10, duration: 0.4, ease: 'sine.inOut' }, 5.2)

  // 5.6 — 8.2 · walk back to the counter.
  master.to(barista, { x: 250, duration: WALK, ease: 'none' }, 5.6)
  walkCycle(master, 5.6)
  settleLegs(master, 5.6 + WALK)

  // 8.4 — 9.6 · the guest enjoys the drink while the barista settles in.
  master.to(guestArm, { rotation: -46, duration: 0.45, ease: 'power2.in' }, 8.4)
  master.to(cupTable, { x: 782, y: 158, opacity: 0, duration: 0.5, ease: 'power1.in' }, 8.45)
  master.to(guestArm, { rotation: 0, duration: 0.4, ease: 'sine.inOut' }, 8.95)

  // Pause everything when the scene scrolls out of view.
  let sceneActive = true
  new IntersectionObserver(
    (entries) => {
      const visible = entries[0]?.isIntersecting ?? true
      if (visible === sceneActive) return
      sceneActive = visible
      if (visible) {
        master.play()
        ambient.forEach((tl) => tl.play())
      } else {
        master.pause()
        ambient.forEach((tl) => tl.pause())
      }
    },
    { threshold: 0.08 },
  ).observe(mount)
}
