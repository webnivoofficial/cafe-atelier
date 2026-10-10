
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getProject, types } from '@theatre/core'
import { reducedMotion } from './env'

gsap.registerPlugin(ScrollTrigger)

type FloatingObject = {
  mesh: THREE.Mesh
  basePosition: THREE.Vector3
  baseScale: number
  offset: number
  speed: number
  orbitRadius: THREE.Vector3
  autoRotate: THREE.Vector3
  depthInfluence: number
}

/**
 * Hero centrepiece — an abstract café constellation of sculpted beans,
 * glazes and translucent glass rendered in genuine 3D, art-directed with
 * Theatre.js and linked to scroll through GSAP ScrollTrigger.
 */
export const initHeroScene = (): void => {
  const heroCanvas = document.querySelector<HTMLCanvasElement>('.hero-canvas')
  if (!heroCanvas) return

  const renderer = new THREE.WebGLRenderer({
    canvas: heroCanvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, reducedMotion() ? 1.5 : 1.85))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.12

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
  camera.position.set(0, 0, 9.5)

  const heroGroup = new THREE.Group()
  scene.add(heroGroup)

  const ambientLight = new THREE.AmbientLight(0xfff0d4, 1.6)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xffe3b8, 2.6)
  keyLight.position.set(4.5, 5.5, 7.5)
  scene.add(keyLight)

  const rimLight = new THREE.PointLight(0xe39b69, 14, 22, 2)
  rimLight.position.set(-4.5, 2.5, 5)
  scene.add(rimLight)

  const fillLight = new THREE.PointLight(0xb78862, 6, 20, 2)
  fillLight.position.set(3, -2.5, 6)
  scene.add(fillLight)

  const topLight = new THREE.SpotLight(0xfff5e0, 5, 25, Math.PI / 5, 0.5, 1)
  topLight.position.set(0, 6, 3)
  topLight.target.position.set(0, 0, 0)
  scene.add(topLight)
  scene.add(topLight.target)

  const materials = {
    beanDark: new THREE.MeshPhysicalMaterial({
      color: 0x5c3622,
      metalness: 0.22,
      roughness: 0.52,
      clearcoat: 0.35,
      clearcoatRoughness: 0.45,
      emissive: 0x2a1408,
      emissiveIntensity: 0.22,
    }),
    beanMedium: new THREE.MeshPhysicalMaterial({
      color: 0x8a5a3a,
      metalness: 0.18,
      roughness: 0.48,
      clearcoat: 0.3,
      emissive: 0x361c0e,
      emissiveIntensity: 0.18,
    }),
    beanLight: new THREE.MeshPhysicalMaterial({
      color: 0xb68052,
      metalness: 0.16,
      roughness: 0.42,
      clearcoat: 0.28,
      emissive: 0x4a2a18,
      emissiveIntensity: 0.14,
    }),
    pastry: new THREE.MeshPhysicalMaterial({
      color: 0xe8cf9e,
      metalness: 0.08,
      roughness: 0.72,
      emissive: 0x52351a,
      emissiveIntensity: 0.1,
    }),
    pastryGlaze: new THREE.MeshPhysicalMaterial({
      color: 0xf6e1b8,
      metalness: 0.12,
      roughness: 0.28,
      clearcoat: 0.55,
      clearcoatRoughness: 0.25,
      emissive: 0x5a3e22,
      emissiveIntensity: 0.13,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xf0e4d0,
      metalness: 0.04,
      roughness: 0.08,
      transmission: 0.85,
      thickness: 0.4,
      transparent: true,
      opacity: 0.65,
      ior: 1.45,
      clearcoat: 0.8,
    }),
    sculptGold: new THREE.MeshPhysicalMaterial({
      color: 0xd4a46e,
      metalness: 0.78,
      roughness: 0.22,
      clearcoat: 0.4,
      emissive: 0x4a3010,
      emissiveIntensity: 0.18,
    }),
    sculptIvory: new THREE.MeshPhysicalMaterial({
      color: 0xf2e6d3,
      metalness: 0.1,
      roughness: 0.34,
      clearcoat: 0.2,
      emissive: 0x605040,
      emissiveIntensity: 0.1,
    }),
    berry: new THREE.MeshPhysicalMaterial({
      color: 0x6b2d3e,
      metalness: 0.14,
      roughness: 0.36,
      clearcoat: 0.5,
      emissive: 0x24080c,
      emissiveIntensity: 0.2,
    }),
    leaf: new THREE.MeshPhysicalMaterial({
      color: 0x5d7a42,
      metalness: 0.08,
      roughness: 0.58,
      emissive: 0x14200c,
      emissiveIntensity: 0.12,
      transparent: true,
      opacity: 0.92,
    }),
  }

  const floatingObjects: FloatingObject[] = []

  const addObject = (
    geometry: THREE.BufferGeometry,
    material: THREE.MeshPhysicalMaterial,
    position: THREE.Vector3,
    opts: Partial<{
      speed: number
      orbitRadius: THREE.Vector3
      autoRotate: THREE.Vector3
      depthInfluence: number
      offset: number
      scale: number
    }> = {},
  ) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(position)
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    const scale = opts.scale ?? 1
    mesh.scale.setScalar(scale)
    heroGroup.add(mesh)

    floatingObjects.push({
      mesh,
      basePosition: position.clone(),
      baseScale: scale,
      offset: opts.offset ?? Math.random() * Math.PI * 2,
      speed: opts.speed ?? 0.5 + Math.random() * 0.7,
      orbitRadius:
        opts.orbitRadius ??
        new THREE.Vector3(
          1 + Math.random() * 1.6,
          0.7 + Math.random(),
          0.8 + Math.random() * 1.2,
        ),
      autoRotate:
        opts.autoRotate ??
        new THREE.Vector3(
          0.004 + Math.random() * 0.008,
          0.006 + Math.random() * 0.01,
          0.002 + Math.random() * 0.006,
        ),
      depthInfluence: opts.depthInfluence ?? 0.5 + Math.random() * 0.5,
    })
    return mesh
  }

  // Coffee bean geometry — ellipsoid with the characteristic centre crease.
  const makeCoffeeBean = (size = 0.42): THREE.SphereGeometry => {
    const geo = new THREE.SphereGeometry(size, 48, 32)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      const groove =
        Math.exp(-((y * y) / (size * size * 0.12))) * 0.12 * size * Math.sign(x || 0.001)
      pos.setX(i, x * 1.55 - groove)
      pos.setY(i, y * 0.78)
      pos.setZ(i, z * 1.02)
    }
    geo.computeVertexNormals()
    return geo
  }

  const beanPositions = [
    { pos: new THREE.Vector3(-2.6, 1.3, 1.6), mat: materials.beanDark, scale: 1, speed: 0.62 },
    { pos: new THREE.Vector3(-1.6, -0.5, 2.2), mat: materials.beanMedium, scale: 0.85, speed: 0.74 },
    { pos: new THREE.Vector3(1.1, 1.8, 0.9), mat: materials.beanLight, scale: 0.9, speed: 0.56 },
    { pos: new THREE.Vector3(2.3, 0.4, 1.9), mat: materials.beanDark, scale: 1.1, speed: 0.68 },
    { pos: new THREE.Vector3(-0.4, -1.6, 2.4), mat: materials.beanMedium, scale: 0.78, speed: 0.82 },
    { pos: new THREE.Vector3(2.9, -1.2, 1.3), mat: materials.beanDark, scale: 0.95, speed: 0.7 },
    { pos: new THREE.Vector3(-2.9, -1.4, 0.8), mat: materials.beanLight, scale: 0.7, speed: 0.88 },
    { pos: new THREE.Vector3(0.2, 2.2, 2.1), mat: materials.beanDark, scale: 0.82, speed: 0.52 },
  ]
  beanPositions.forEach(({ pos, mat, scale, speed }) => {
    addObject(makeCoffeeBean(), mat, pos, {
      speed,
      scale,
      orbitRadius: new THREE.Vector3(
        0.9 + Math.random() * 0.7,
        0.6 + Math.random() * 0.5,
        0.5 + Math.random() * 0.6,
      ),
      offset: Math.random() * Math.PI * 2,
      depthInfluence: 0.7 + Math.random() * 0.3,
    })
  })

  addObject(new THREE.TorusGeometry(0.95, 0.26, 40, 96), materials.pastryGlaze, new THREE.Vector3(0, 0.2, 0), {
    speed: 0.38,
    orbitRadius: new THREE.Vector3(0.4, 0.5, 0.3),
    autoRotate: new THREE.Vector3(0.006, 0.0025, 0.0045),
    depthInfluence: 0.35,
  })
  addObject(
    new THREE.SphereGeometry(0.6, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2.1),
    materials.pastry,
    new THREE.Vector3(-1.8, 0.8, -0.6),
    { speed: 0.44, orbitRadius: new THREE.Vector3(0.8, 0.5, 0.6), autoRotate: new THREE.Vector3(0.0035, 0.0055, 0.0025), depthInfluence: 0.6 },
  )
  addObject(new THREE.IcosahedronGeometry(0.68, 1), materials.sculptGold, new THREE.Vector3(1.7, -0.8, -1.1), {
    speed: 0.5,
    orbitRadius: new THREE.Vector3(1, 0.8, 0.7),
    autoRotate: new THREE.Vector3(0.007, 0.0055, 0.004),
    depthInfluence: 0.65,
  })
  addObject(new THREE.OctahedronGeometry(0.82), materials.sculptIvory, new THREE.Vector3(-0.7, 1.7, 0.4), {
    speed: 0.34,
    orbitRadius: new THREE.Vector3(0.6, 0.5, 0.5),
    autoRotate: new THREE.Vector3(0.005, 0.004, 0.007),
    depthInfluence: 0.55,
  })
  addObject(new THREE.SphereGeometry(0.22, 32, 32), materials.berry, new THREE.Vector3(-1.2, -1.3, 1.4), {
    speed: 0.9,
    orbitRadius: new THREE.Vector3(0.6, 0.5, 0.8),
    depthInfluence: 0.7,
  })
  addObject(new THREE.SphereGeometry(0.19, 32, 32), materials.berry, new THREE.Vector3(2.5, 1.6, 1.1), {
    speed: 0.96,
    orbitRadius: new THREE.Vector3(0.5, 0.5, 0.6),
    depthInfluence: 0.75,
  })
  addObject(new THREE.BoxGeometry(0.9, 0.9, 0.9), materials.glass, new THREE.Vector3(0.8, -1.9, 0.2), {
    speed: 0.42,
    orbitRadius: new THREE.Vector3(0.7, 0.6, 0.5),
    autoRotate: new THREE.Vector3(0.006, 0.008, 0.005),
    depthInfluence: 0.5,
  })
  addObject(new THREE.TetrahedronGeometry(0.72), materials.glass, new THREE.Vector3(-3.1, 0.4, -0.3), {
    speed: 0.48,
    orbitRadius: new THREE.Vector3(0.6, 0.7, 0.5),
    autoRotate: new THREE.Vector3(0.008, 0.005, 0.009),
    depthInfluence: 0.55,
  })

  const leafCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.15, 0.35, 0),
    new THREE.Vector3(0.08, 0.75, 0),
    new THREE.Vector3(0, 1, 0),
  ])
  addObject(new THREE.TubeGeometry(leafCurve, 24, 0.08, 12, false), materials.leaf, new THREE.Vector3(2.1, 2, 0.5), {
    speed: 0.58,
    orbitRadius: new THREE.Vector3(0.7, 0.6, 0.6),
    depthInfluence: 0.7,
  })
  addObject(
    new THREE.TorusKnotGeometry(0.62, 0.16, 160, 28, 2, 5),
    materials.sculptGold,
    new THREE.Vector3(0, 0.4, -0.4),
    { speed: 0.3, orbitRadius: new THREE.Vector3(0.3, 0.35, 0.25), autoRotate: new THREE.Vector3(0.004, 0.006, 0.003), depthInfluence: 0.2 },
  )

  // Suspended dust motes.
  const particleCount = reducedMotion() ? 140 : 300
  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    const radius = 2 + Math.random() * 6
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7
    particlePositions[i * 3 + 2] = radius * Math.cos(phi)
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xf5d7a8,
      size: 0.05,
      transparent: true,
      opacity: reducedMotion() ? 0.5 : 0.82,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  scene.add(particles)

  // Warm light specks.
  const glowCount = reducedMotion() ? 20 : 40
  const glowGeometry = new THREE.BufferGeometry()
  const glowPositions = new Float32Array(glowCount * 3)
  for (let i = 0; i < glowCount; i++) {
    glowPositions[i * 3] = (Math.random() - 0.5) * 10
    glowPositions[i * 3 + 1] = (Math.random() - 0.5) * 7
    glowPositions[i * 3 + 2] = (Math.random() - 0.5) * 6
  }
  glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3))
  const glowParticles = new THREE.Points(
    glowGeometry,
    new THREE.PointsMaterial({
      color: 0xffd89c,
      size: 0.13,
      transparent: true,
      opacity: reducedMotion() ? 0.4 : 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  scene.add(glowParticles)

  // Pointer parallax.
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
  let hovered = false
  const heroVisual = document.querySelector<HTMLElement>('.hero__visual')
  if (heroVisual) {
    heroVisual.addEventListener('pointerenter', () => {
      hovered = true
    })
    heroVisual.addEventListener('pointerleave', () => {
      hovered = false
      pointer.targetX = 0
      pointer.targetY = 0
    })
    heroVisual.addEventListener('pointermove', (event) => {
      const rect = heroVisual.getBoundingClientRect()
      pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    })
  }

  const resizeScene = (): void => {
    const { clientWidth, clientHeight } = heroCanvas
    if (heroCanvas.width === clientWidth && heroCanvas.height === clientHeight) return
    renderer.setSize(clientWidth, clientHeight, false)
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
  }

  const startTime = performance.now()
  let scrollProgress = 0
  let sceneVisible = true

  const render = (): void => {
    if (sceneVisible && !document.hidden) {
      const elapsed = (performance.now() - startTime) * 0.001

      pointer.x += (pointer.targetX - pointer.x) * (hovered ? 0.065 : 0.035)
      pointer.y += (pointer.targetY - pointer.y) * (hovered ? 0.065 : 0.035)

      heroGroup.rotation.y += reducedMotion() ? 0.0008 : 0.0022
      heroGroup.rotation.x = THREE.MathUtils.lerp(
        heroGroup.rotation.x,
        pointer.y * 0.3 - scrollProgress * 0.45,
        0.05,
      )
      heroGroup.rotation.z = THREE.MathUtils.lerp(heroGroup.rotation.z, pointer.x * 0.22, 0.045)
      heroGroup.position.x = THREE.MathUtils.lerp(
        heroGroup.position.x,
        pointer.x * 0.7 + scrollProgress * 1.4,
        0.04,
      )
      heroGroup.position.y = THREE.MathUtils.lerp(
        heroGroup.position.y,
        pointer.y * 0.55 - scrollProgress * 0.9,
        0.04,
      )
      heroGroup.position.z = THREE.MathUtils.lerp(heroGroup.position.z, -scrollProgress * 1.6, 0.045)

      floatingObjects.forEach((obj, index) => {
        const t = elapsed * obj.speed + obj.offset
        const bp = obj.basePosition
        const r = obj.orbitRadius
        obj.mesh.position.x = bp.x + Math.sin(t + index * 0.7) * r.x
        obj.mesh.position.y = bp.y + Math.cos(t * 1.15 + index * 0.5) * r.y
        obj.mesh.position.z =
          bp.z + Math.sin(t * 1.4 + index * 0.9) * r.z + scrollProgress * 1.5 * obj.depthInfluence

        obj.mesh.rotation.x += obj.autoRotate.x
        obj.mesh.rotation.y += obj.autoRotate.y
        obj.mesh.rotation.z += obj.autoRotate.z

        const breathe = 1 + Math.sin(t * 1.2) * 0.018
        obj.mesh.scale.setScalar(obj.baseScale * breathe)
      })

      particles.rotation.y += reducedMotion() ? 0.0005 : 0.0014
      particles.rotation.x = THREE.MathUtils.lerp(particles.rotation.x, pointer.y * 0.15, 0.04)
      particles.rotation.z = THREE.MathUtils.lerp(particles.rotation.z, pointer.x * 0.1, 0.04)

      glowParticles.rotation.y -= reducedMotion() ? 0.0003 : 0.0009
      glowParticles.rotation.x = THREE.MathUtils.lerp(glowParticles.rotation.x, -pointer.y * 0.12, 0.035)

      if (!reducedMotion()) {
        rimLight.intensity = 14 + Math.sin(elapsed * 0.9) * 2.2
        fillLight.intensity = 6 + Math.cos(elapsed * 1.1) * 1.6
        topLight.intensity = 5 + Math.sin(elapsed * 0.7) * 1.2
      }

      const baseCamX = pointer.x * 1.1
      const baseCamY = -pointer.y * 0.7
      camera.position.x += (baseCamX - camera.position.x + scrollProgress * 1.8) * 0.045
      camera.position.y += (baseCamY - camera.position.y - scrollProgress * 0.7) * 0.045
      camera.position.z = 9.5 - scrollProgress * 2.2
      camera.lookAt(
        pointer.x * 0.3 + scrollProgress * 0.5,
        -pointer.y * 0.2,
        -scrollProgress * 0.6,
      )

      resizeScene()
      renderer.render(scene, camera)
    }
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)

  // Only animate the 3D scene while the hero is actually on screen.
  if (heroVisual) {
    new IntersectionObserver(
      (entries) => {
        sceneVisible = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.05 },
    ).observe(heroVisual)
  }

  let heroScrollProgress = 0
  gsap.to(
    {},
    {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          heroScrollProgress = self.progress
          scrollProgress = heroScrollProgress
        },
      },
    },
  )

  // Theatre.js — art-directed drift for camera framing and lighting.
  try {
    // Core-only mode: pass the same empty state Theatre builds internally —
    // without it, Theatre throws after 1s because @theatre/studio is never bundled.
    const project = getProject('Cafe-Atelier-Experience', {
      state: { sheetsById: {}, definitionVersion: '0.4.0', revisionHistory: [] },
    })
    const heroSheet = project.sheet('HeroCinematic')

    const sceneObj = heroSheet.object('HeroGroup', {
      rotation: types.compound({
        y: types.number(0, { range: [-Math.PI * 2, Math.PI * 2] }),
      }),
      scale: types.number(1, { range: [0.5, 1.8] }),
    })

    const lightsObj = heroSheet.object('Lighting', {
      rimIntensity: types.number(14, { range: [0, 30] }),
      keyIntensity: types.number(2.6, { range: [0, 6] }),
    })

    project.ready.then(() => {
      heroSheet.sequence.play({ iterationCount: Infinity, range: [0, 10], rate: 1 })
    })

    gsap.ticker.add(() => {
      const sp = sceneObj.value
      const lp = lightsObj.value
      heroGroup.scale.setScalar(THREE.MathUtils.lerp(heroGroup.scale.x, sp.scale, 0.06))
      rimLight.intensity += (lp.rimIntensity - rimLight.intensity) * 0.05
      keyLight.intensity += (lp.keyIntensity - keyLight.intensity) * 0.05
    })
  } catch {
    // Theatre is an optional flourish — the scene works without it.
  }
}
