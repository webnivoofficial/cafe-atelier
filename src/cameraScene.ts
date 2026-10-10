import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { reducedMotion, isMobileViewport } from './env'

type ThreeNS = typeof import('three')
type CameraGroup = import('three').Group
type CameraRenderer = import('three').WebGLRenderer

gsap.registerPlugin(ScrollTrigger)

/* Final resting arrangement for the revealed photographs, expressed as
   fractions of the stage so they stay responsive on every viewport. The
   centre is intentionally left clear — that is where the camera lives. */
const PHOTO_LAYOUT = [
  { x: -0.42, y: -0.22, rotY: 18, scale: 0.8, z: 30 },
  { x: 0.42, y: -0.26, rotY: -18, scale: 0.72, z: 4 },
  { x: 0.47, y: 0.18, rotY: -14, scale: 0.7, z: 20 },
  { x: -0.45, y: 0.24, rotY: 16, scale: 0.75, z: 10 },
  { x: 0.03, y: -0.44, rotY: -2, scale: 0.64, z: 44 },
] as const

/* ------------------------------------------------------------------ */
/* The camera is a real 3D object assembled from primitives — body,    */
/* grip, pentaprism hump, lens barrel, metallic rings and a physical   */
/* glass element that catches the warm key light. No flat icon.        */
/* ------------------------------------------------------------------ */
const buildCameraModel = (THREE: ThreeNS): CameraGroup => {
  const group = new THREE.Group()

  const shell = new THREE.MeshStandardMaterial({ color: 0x241a12, metalness: 0.5, roughness: 0.44 })
  const metal = new THREE.MeshStandardMaterial({ color: 0x6b4a2a, metalness: 0.9, roughness: 0.28 })
  const amber = new THREE.MeshStandardMaterial({
    color: 0xe0a458,
    metalness: 0.6,
    roughness: 0.35,
    emissive: 0x3a2208,
    emissiveIntensity: 0.5,
  })

  // Main body.
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.7, 1.0), shell)
  group.add(body)

  // Pentaprism / viewfinder hump on top.
  const prism = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.42, 0.74), shell)
  prism.position.set(0, 1.02, 0.04)
  group.add(prism)

  // Hand grip on the right.
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.72, 1.06), metal)
  grip.position.set(1.56, 0, 0)
  group.add(grip)

  // Mode dial + shutter button accents.
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.16, 24), metal)
  dial.position.set(0.92, 0.96, 0.1)
  group.add(dial)

  const flash = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.12), amber)
  flash.position.set(-1.02, 0.96, 0.5)
  group.add(flash)

  // Lens barrel, axis pointing toward the viewer (+Z).
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.68, 0.95, 44), shell)
  barrel.rotation.x = Math.PI / 2
  barrel.position.set(-0.1, 0.02, 0.92)
  group.add(barrel)

  // Focus + accent rings on the barrel.
  const ringBack = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.05, 16, 44), metal)
  ringBack.position.set(-0.1, 0.02, 1.04)
  group.add(ringBack)

  const ringFront = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.07, 18, 44), amber)
  ringFront.position.set(-0.1, 0.02, 1.32)
  group.add(ringFront)

  // Physical glass lens — high clearcoat + iridescence for reflections.
  const glass = new THREE.Mesh(
    new THREE.CircleGeometry(0.46, 56),
    new THREE.MeshPhysicalMaterial({
      color: 0x0a1016,
      metalness: 0.1,
      roughness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      reflectivity: 1,
      iridescence: 0.5,
      iridescenceIOR: 1.3,
      transparent: true,
      opacity: 0.92,
    }),
  )
  glass.position.set(-0.1, 0.02, 1.34)
  group.add(glass)

  // Faint inner glow so the lens reads even against dark areas.
  const inner = new THREE.Mesh(
    new THREE.CircleGeometry(0.24, 32),
    new THREE.MeshBasicMaterial({ color: 0x2a4a63, transparent: true, opacity: 0.5 }),
  )
  inner.position.set(-0.1, 0.02, 1.35)
  group.add(inner)

  return group
}

/** Responsive pixel offsets for a photo's resting slot. */
const slotFor = (stage: HTMLElement, index: number) => {
  const spec = PHOTO_LAYOUT[index % PHOTO_LAYOUT.length]
  const w = stage.clientWidth
  const h = stage.clientHeight
  return {
    fx: spec.x * Math.min(w * 0.46, 380),
    fy: spec.y * Math.min(h * 0.44, 250),
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

export const initCameraScene = async (): Promise<void> => {
  const section = document.querySelector<HTMLElement>('.camera-transition')
  const stage = section?.querySelector<HTMLElement>('.camera-stage')
  const canvas = section?.querySelector<HTMLCanvasElement>('.camera-canvas')
  const caption = section?.querySelector<HTMLElement>('.camera-caption')
  const photos = Array.from(section?.querySelectorAll<HTMLElement>('.camera-photo') ?? [])

  if (!section || !stage || !canvas || !caption || !photos.length) return

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
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()

  const cam3d = new THREE.PerspectiveCamera(34, stage.clientWidth / stage.clientHeight, 0.1, 100)
  cam3d.position.set(0, 0.1, 7.5)
  cam3d.lookAt(0, 0, 0)

  // Warm, cinematic three-point lighting.
  scene.add(new THREE.HemisphereLight(0xffe0b0, 0x2a1810, 0.7))
  scene.add(new THREE.AmbientLight(0x40301f, 0.5))
  const key = new THREE.DirectionalLight(0xfff0d8, 2.6)
  key.position.set(4, 5, 6)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xc98d5e, 1.2)
  fill.position.set(-5, -1, 3)
  scene.add(fill)
  const rim = new THREE.DirectionalLight(0xffd9a0, 1.7)
  rim.position.set(-2, 3, -5)
  scene.add(rim)

  // Spinner (scroll rotation) > bobber (idle float) > model.
  const spinner = new THREE.Group()
  const bobber = new THREE.Group()
  bobber.add(buildCameraModel(THREE))
  spinner.add(bobber)
  spinner.scale.setScalar(mobile ? 0.82 : 1)
  scene.add(spinner)

  gsap.set(caption, { autoAlpha: 1 })
  gsap.set(canvas, { autoAlpha: 1 })

  /* ------------------------- Scroll timeline ------------------------- */
  const spin = { a: 0 }
  let active = false

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=340%',
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        active = self.isActive
      },
    },
  })

  // Minimal caption drifts away almost immediately so the camera leads.
  tl.to(caption, { autoAlpha: 0, y: -22, duration: 0.12 }, 0)

  // Stage 2–5: one continuous 360° revolution, lens returns to front.
  tl.to(
    spin,
    {
      a: -Math.PI * 2,
      duration: 0.76,
      onUpdate: () => {
        spinner.rotation.y = spin.a
      },
    },
    0.06,
  )

  // Stage 4: photographs emerge from behind the camera into layered planes.
  photos.forEach((p, i) => {
    tl.fromTo(
      p,
      { opacity: 0, x: 0, y: 0, z: -480, rotationY: 30, scale: 0.48 },
      {
        opacity: 1,
        x: () => slotFor(stage, i).fx,
        y: () => slotFor(stage, i).fy,
        z: () => slotFor(stage, i).z,
        rotationY: () => slotFor(stage, i).rotY,
        scale: () => slotFor(stage, i).scale,
        duration: 0.42,
        ease: 'power2.out',
      },
      0.12 + i * 0.09,
    )
  })

  // Stage 6: the camera fades while the photographs settle…
  tl.to(canvas, { autoAlpha: 0, duration: 0.1 }, 0.8)
  // …then they clear too, handing off to the real gallery below.
  tl.to(photos, { autoAlpha: 0, duration: 0.1, stagger: 0.01 }, 0.9)

  /* --------------------- Render only when visible --------------------- */
  const render = (): void => {
    if (!active) return
    const clock = performance.now()
    bobber.position.y = Math.sin(clock * 0.0012) * 0.06
    bobber.rotation.z = Math.sin(clock * 0.0009) * 0.025
    bobber.rotation.x = Math.sin(clock * 0.0011) * 0.02
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
  }
  window.addEventListener('resize', resize)
  ScrollTrigger.refresh()
}
