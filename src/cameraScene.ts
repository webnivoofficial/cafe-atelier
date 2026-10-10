import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { reducedMotion, isMobileViewport } from './env'

type ThreeNS = typeof import('three')
type CameraGroup = import('three').Group
type CameraRenderer = import('three').WebGLRenderer

gsap.registerPlugin(ScrollTrigger)

/* The settled gallery-wall arrangement the photographs scatter into,
   expressed as fractions of the stage so it stays responsive. Two loose
   rows with a slightly deeper centre tile reads as the existing gallery
   unfolding organically — varied and outward, yet intentional and upright
   (small rotY only), never a random pile of cards. */
const PHOTO_LAYOUT = [
  { x: -0.34, y: -0.3, rotY: 8, scale: 0.86, z: 16 },
  { x: 0.02, y: -0.37, rotY: -4, scale: 0.7, z: 36 },
  { x: 0.35, y: -0.27, rotY: -10, scale: 0.84, z: 18 },
  { x: -0.2, y: 0.22, rotY: 6, scale: 0.8, z: 22 },
  { x: 0.24, y: 0.24, rotY: -7, scale: 0.78, z: 20 },
] as const

/* ------------------------------------------------------------------ */
/* A real 3D camera assembled from primitives: an ivory warm-white     */
/* body, charcoal lens housing and grip, brushed-silver rings and      */
/* dials, a physical glass lens and a restrained Café-amber nameplate. */
/* Smaller and more detailed than the previous version — no flat icon. */
/* ------------------------------------------------------------------ */
const buildCameraModel = (THREE: ThreeNS): CameraGroup => {
  const group = new THREE.Group()

  // --- Materials ---------------------------------------------------
  const ivory = new THREE.MeshStandardMaterial({ color: 0xe9dfcc, metalness: 0.08, roughness: 0.56 })
  const ivorySoft = new THREE.MeshStandardMaterial({ color: 0xdccfb8, metalness: 0.1, roughness: 0.62 })
  const charcoal = new THREE.MeshStandardMaterial({ color: 0x26272c, metalness: 0.38, roughness: 0.5 })
  const gripMat = new THREE.MeshStandardMaterial({ color: 0x1d1e22, metalness: 0.2, roughness: 0.82 })
  const silver = new THREE.MeshStandardMaterial({ color: 0xcdd0d4, metalness: 0.95, roughness: 0.24 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x111216, metalness: 0.5, roughness: 0.42 })
  const amber = new THREE.MeshStandardMaterial({
    color: 0xe0a458,
    metalness: 0.55,
    roughness: 0.34,
    emissive: 0x3a2208,
    emissiveIntensity: 0.45,
  })

  // --- Body --------------------------------------------------------
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.34, 1.42, 0.86), ivory)
  group.add(body)

  // Lower two-tone wrap so the ivory never reads as a flat panel.
  const wrap = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.6, 0.88), ivorySoft)
  wrap.position.set(0, -0.46, 0)
  group.add(wrap)

  // Brushed top deck.
  const deck = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.12, 0.86), silver)
  deck.position.set(0, 0.75, 0)
  group.add(deck)

  // Pentaprism / viewfinder hump with a small dark window.
  const prism = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.42, 0.66), charcoal)
  prism.position.set(0, 1.0, 0.02)
  group.add(prism)
  const vfWindow = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.02), dark)
  vfWindow.position.set(0, 1.02, 0.35)
  group.add(vfWindow)

  // Textured hand grip on the right.
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1.5, 0.9), gripMat)
  grip.position.set(1.32, 0, 0.02)
  group.add(grip)
  for (let i = -1; i <= 1; i++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.2, 0.92), charcoal)
    rib.position.set(1.5, i * 0.34, 0.02)
    group.add(rib)
  }

  // Mode dial + shutter button on the deck.
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.14, 22), silver)
  dial.position.set(0.72, 0.9, -0.02)
  group.add(dial)
  const dialTop = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.16, 18), dark)
  dialTop.position.set(0.72, 0.94, -0.02)
  group.add(dialTop)
  const shutter = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 16), charcoal)
  shutter.position.set(1.02, 0.86, 0.26)
  group.add(shutter)

  // Restrained Café-amber nameplate + lower seam for a premium accent.
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.13, 0.02), amber)
  plate.position.set(-0.5, 0.42, 0.44)
  group.add(plate)
  const seam = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.03, 0.02), dark)
  seam.position.set(0, -0.16, 0.44)
  group.add(seam)

  // --- Lens assembly (points toward +Z / the visitor) --------------
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.62, 0.72, 40), charcoal)
  barrel.rotation.x = Math.PI / 2
  barrel.position.set(-0.06, -0.02, 0.72)
  group.add(barrel)

  const focusRing = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.08, 14, 40), dark)
  focusRing.position.set(-0.06, -0.02, 0.86)
  group.add(focusRing)

  const ringMid = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.045, 12, 40), silver)
  ringMid.position.set(-0.06, -0.02, 1.02)
  group.add(ringMid)

  const ringFront = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.05, 12, 40), silver)
  ringFront.position.set(-0.06, -0.02, 1.08)
  group.add(ringFront)

  // Physical glass — high clearcoat + iridescence for believable reflections.
  const glass = new THREE.Mesh(
    new THREE.CircleGeometry(0.4, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x0b1620,
      metalness: 0.1,
      roughness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      reflectivity: 1,
      iridescence: 0.55,
      iridescenceIOR: 1.3,
      transparent: true,
      opacity: 0.92,
    }),
  )
  glass.position.set(-0.06, -0.02, 1.1)
  group.add(glass)

  // Cool inner reflection + a tiny warm catch-light so the lens reads.
  const inner = new THREE.Mesh(
    new THREE.CircleGeometry(0.2, 28),
    new THREE.MeshBasicMaterial({ color: 0x2b4a63, transparent: true, opacity: 0.55 }),
  )
  inner.position.set(-0.06, -0.02, 1.11)
  group.add(inner)
  const catchLight = new THREE.Mesh(
    new THREE.CircleGeometry(0.05, 12),
    new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.7 }),
  )
  catchLight.position.set(-0.14, 0.06, 1.12)
  group.add(catchLight)

  return group
}

/** Responsive pixel offsets for a photo's resting slot. */
const slotFor = (stage: HTMLElement, index: number) => {
  const spec = PHOTO_LAYOUT[index % PHOTO_LAYOUT.length]
  const w = stage.clientWidth
  const h = stage.clientHeight
  return {
    fx: spec.x * Math.min(w * 0.44, 360),
    fy: spec.y * Math.min(h * 0.4, 230),
    rotY: spec.rotY,
    scale: spec.scale,
    z: spec.z,
  }
}

/** Static, unpinned arrangement used for reduced-motion and no-WebGL. */
const layoutStatically = (stage: HTMLElement, photos: HTMLElement[]): void => {
  photos.forEach((p, i) => {
    const s = slotFor(stage, i)
    gsap.set(p, {
      xPercent: -50,
      yPercent: -50,
      x: s.fx,
      y: s.fy,
      z: 0,
      rotationY: s.rotY * 0.4,
      scale: s.scale,
      autoAlpha: 1,
    })
  })
}

/* Guards against a second initialization (lazy fallback + observer,
   or a repeated boot after refresh are all covered by this flag). */
let cameraBooted = false

export const initCameraScene = async (): Promise<void> => {
  if (cameraBooted) return
  cameraBooted = true

  const section = document.querySelector<HTMLElement>('.camera-transition')
  const stage = section?.querySelector<HTMLElement>('.camera-stage')
  const canvas = section?.querySelector<HTMLCanvasElement>('.camera-canvas')
  const caption = section?.querySelector<HTMLElement>('.camera-caption')
  const photos = Array.from(section?.querySelectorAll<HTMLElement>('.camera-photo') ?? [])

  if (!section || !stage || !canvas || !caption || !photos.length) {
    cameraBooted = false
    return
  }

  // Keep every plane centered on its own origin before GSAP takes over.
  gsap.set(photos, { xPercent: -50, yPercent: -50 })

  /* ---- Reduced motion: simple reveal, no pin, no scrub, no WebGL. ---- */
  if (reducedMotion()) {
    canvas.style.display = 'none'
    layoutStatically(stage, photos)
    return
  }

  // Three.js is only fetched when the animation will actually run.
  const THREE = await import('three')

  let renderer: CameraRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch {
    canvas.style.display = 'none'
    layoutStatically(stage, photos)
    return
  }

  const mobile = isMobileViewport()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2))
  renderer.setSize(stage.clientWidth, stage.clientHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.04

  const scene = new THREE.Scene()

  // Pull the camera rig back so the object reads as small and premium.
  const cam3d = new THREE.PerspectiveCamera(34, stage.clientWidth / stage.clientHeight, 0.1, 100)
  cam3d.position.set(0, 0.3, 8.6)
  cam3d.lookAt(0, -0.15, 0)

  // Warm, cinematic three-point lighting.
  scene.add(new THREE.HemisphereLight(0xffe6c4, 0x2a1c12, 0.78))
  scene.add(new THREE.AmbientLight(0x3a2c1d, 0.55))
  const key = new THREE.DirectionalLight(0xfff1dc, 2.5)
  key.position.set(4, 5, 6)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xc98d5e, 1.1)
  fill.position.set(-5, -1, 4)
  scene.add(fill)
  const rim = new THREE.DirectionalLight(0xffd9a0, 1.6)
  rim.position.set(-2, 3, -5)
  scene.add(rim)

  /* orbit (scroll path travel) > bob (idle float) > model.
     `orbit` moves along a curved 3D route while its orientation is derived
     from the direction of travel — the lens faces forward, then left, then
     down, then right. It NEVER spins independently on its own axis. */
  const orbit = new THREE.Group()
  const bob = new THREE.Group()
  bob.add(buildCameraModel(THREE))
  orbit.add(bob)
  scene.add(orbit)

  // Path constants, softened for phones so the journey stays on-screen.
  const PATH = mobile
    ? { rx: 1.4, ry: 1.0, recede: 3.0, zdepth: 0.7, descent: 1.1, s0: 0.62, s1: 0.4 }
    : { rx: 2.4, ry: 1.5, recede: 3.6, zdepth: 0.9, descent: 1.4, s0: 0.76, s1: 0.42 }

  const m = { u: 0 }

  // Orientation checkpoints: the lens is the model's local +Z, so we aim
  // +Z at the direction the camera is travelling. Smoothly slerped between
  // keys — gradual, no snapping, no roll, no extra full revolution.
  const eulerQ = (x: number, y: number, z: number): import('three').Quaternion =>
    new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z))
  const ORIENT = [
    { u: 0.0, q: eulerQ(0, 0, 0) }, // front — lens faces the visitor
    { u: 0.18, q: eulerQ(0, -Math.PI / 2, 0) }, // left — lens faces left
    { u: 0.55, q: eulerQ(Math.PI / 2, 0, 0) }, // down — lens faces downward
    { u: 0.82, q: eulerQ(0.28, Math.PI / 2, 0) }, // right — lens faces right
    { u: 1.0, q: eulerQ(0.34, Math.PI / 2, 0) }, // onward — right + a little down
  ]
  const faceAlongPath = (u: number): void => {
    if (u <= ORIENT[0].u) return void orbit.quaternion.copy(ORIENT[0].q)
    const last = ORIENT[ORIENT.length - 1]
    if (u >= last.u) return void orbit.quaternion.copy(last.q)
    for (let i = 0; i < ORIENT.length - 1; i++) {
      const a = ORIENT[i]
      const b = ORIENT[i + 1]
      if (u >= a.u && u <= b.u) {
        orbit.quaternion.copy(a.q).slerp(b.q, (u - a.u) / (b.u - a.u))
        return
      }
    }
  }

  const applyPath = (): void => {
    // A 270° spatial arc (not a full loop): centre → left → bottom → right.
    const phi = m.u * Math.PI * 1.5
    orbit.position.set(
      -PATH.rx * Math.sin(phi), // travel left, sweep through, end on the right
      PATH.ry * (Math.cos(phi) - 1) - PATH.descent * m.u, // descend along the curve
      -PATH.recede * m.u + PATH.zdepth * Math.sin(phi), // travel away with a breathing depth
    )
    faceAlongPath(m.u) // orientation strictly follows the direction of travel
    const s = PATH.s0 + (PATH.s1 - PATH.s0) * m.u
    orbit.scale.setScalar(s) // continuous shrink
  }
  applyPath()

  gsap.set(caption, { autoAlpha: 1 })
  gsap.set(canvas, { autoAlpha: 1 })

  let active = false

  const REV_START = 0.08
  const REV_DUR = 0.8

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=540%',
      scrub: 0.7,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        active = self.isActive
      },
    },
  })

  // Stage A: caption drifts away while the camera holds front-facing.
  tl.to(caption, { autoAlpha: 0, y: -18, duration: 0.08 }, 0)

  // Stages B–F: one continuous revolution along the curved 3D path.
  tl.to(m, { u: 1, duration: REV_DUR, ease: 'none', onUpdate: applyPath }, REV_START)

  // Photographs scatter outward from the camera into the gallery-wall
  // arrangement as it travels left, down and right — revealing progressively.
  photos.forEach((p, i) => {
    tl.fromTo(
      p,
      { autoAlpha: 0, scale: 0.4, x: 0, y: 0, z: -560, rotationY: 0 },
      {
        autoAlpha: 1,
        scale: () => slotFor(stage, i).scale,
        x: () => slotFor(stage, i).fx,
        y: () => slotFor(stage, i).fy,
        z: () => slotFor(stage, i).z,
        rotationY: () => slotFor(stage, i).rotY,
        duration: 0.4,
        ease: 'power3.out',
      },
      0.18 + i * 0.09,
    )
  })

  // The camera shrinks and fades away as the photographs take priority…
  tl.to(canvas, { autoAlpha: 0, duration: 0.12 }, 0.84)
  // …but the photographs REMAIN settled in their composition (no hand-off fade).

  /* --------------------- Render only when visible --------------------- */
  const render = (): void => {
    if (!active) return
    const clock = performance.now()
    bob.position.y = Math.sin(clock * 0.0012) * 0.04
    renderer.render(scene, cam3d)
  }
  gsap.ticker.add(render)
  // Draw a first frame so the pinned scene is never blank on entry.
  renderer.render(scene, cam3d)

  const resize = (): void => {
    const w = stage.clientWidth
    const h = stage.clientHeight
    if (!w || !h) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileViewport() ? 1.5 : 2))
    renderer.setSize(w, h)
    cam3d.aspect = w / h
    cam3d.updateProjectionMatrix()
    applyPath()
  }
  window.addEventListener('resize', resize)
  ScrollTrigger.refresh()
}
