from pathlib import Path

main = '''import './style.css'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { animate as motionAnimate } from 'motion'
import { animate as animeAnimate } from 'animejs'
import { Studio } from '@theatre/studio'

gsap.registerPlugin(ScrollTrigger)

const isTheatreEnabled = typeof window !== 'undefined' && window.location.hostname === 'localhost'

type MenuItem = {
  name: string
  description: string
  price: string
  image: string
  badge: string
}

const menuData: Record<string, MenuItem[]> = {
  coffee: [
    {
      name: 'Velvet Roast',
      description: 'Shot of espresso, brown sugar, and a velvety milk finish.',
      price: '$6',
      image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80',
      badge: 'House favorite',
    },
    {
      name: 'Cinnamon Cloud',
      description: 'Single-origin espresso with cinnamon foam and caramel notes.',
      price: '$7',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
      badge: 'Warm spice',
    },
    {
      name: 'Honey Oat',
      description: 'Oat milk, floral honey, and a smooth espresso base.',
      price: '$6.5',
      image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80',
      badge: 'Soft texture',
    },
  ],
  tea: [
    {
      name: 'Jasmine Silk',
      description: 'A delicate floral tea with a clean, lingering finish.',
      price: '$5',
      image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80',
      badge: 'Botanical',
    },
    {
      name: 'Citrus Matcha',
      description: 'Ceremonial matcha brightened with orange peel and citrus zest.',
      price: '$7',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
      badge: 'Bright lift',
    },
    {
      name: 'Vanilla Rooibos',
      description: 'Naturally sweet red tea with light vanilla bean and cream.',
      price: '$6',
      image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80',
      badge: 'Smooth & gentle',
    },
  ],
  pastries: [
    {
      name: 'Almond Croissant',
      description: 'Layered pastry, toasted almonds, and a honey finish.',
      price: '$5.5',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
      badge: 'Baked fresh',
    },
    {
      name: 'Maple Morning Bun',
      description: 'Sticky and soft with a buttery maple glaze.',
      price: '$6',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80',
      badge: 'Sweet & rich',
    },
    {
      name: 'Berry Scone',
      description: 'Tender crumb with roasted berries and a citrus glaze.',
      price: '$4.5',
      image: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=900&q=80',
      badge: 'Fragrant fruit',
    },
  ],
  desserts: [
    {
      name: 'Cocoa Mousse',
      description: 'Silky dark chocolate mousse with a hint of espresso.',
      price: '$8',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80',
      badge: 'Decadent',
    },
    {
      name: 'Pear Tart',
      description: 'Roasted pear with flaky pastry and warm vanilla cream.',
      price: '$8.5',
      image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=900&q=80',
      badge: 'Seasonal',
    },
    {
      name: 'Coconut Mille-Feuille',
      description: 'Laminated pastry with coconut cream and toasted flakes.',
      price: '$9',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
      badge: 'Light & airy',
    },
  ],
}

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found')
}

app.innerHTML = `
  <div class="page-shell">
    <header class="topbar">
      <nav class="nav glass-panel" aria-label="Main navigation">
        <a class="brand" href="#home" aria-label="Café Atelier home">
          <span class="brand__mark">CA</span>
          <span class="brand__text">Café Atelier</span>
        </a>

        <div class="nav__links" aria-label="Navigation links">
          <a href="#home" class="nav__link is-active">Home</a>
          <a href="#story" class="nav__link">Our Story</a>
          <a href="#menu" class="nav__link">Menu</a>
          <a href="#gallery" class="nav__link">Gallery</a>
          <a href="#contact" class="nav__link">Contact</a>
        </div>

        <a href="#contact" class="button button--primary nav__cta">Reserve</a>
      </nav>
    </header>

    <main>
      <section class="hero reveal" id="home">
        <div class="hero__background" aria-hidden="true"></div>
        <div class="hero__overlay" aria-hidden="true"></div>

        <div class="hero__content">
          <div class="hero__copy glass-panel">
            <p class="eyebrow">Slow mornings. Rich rituals.</p>
            <h1>
              <span>Crafted</span>
              comfort in every cup.
            </h1>
            <p class="lead">
              Café Atelier blends modern coffee culture with warm hospitality, creating a refined space for lingering conversation and beautifully prepared drinks.
            </p>
            <div class="hero__actions">
              <a class="button button--primary" href="#menu">Explore Our Menu</a>
              <a class="button button--secondary" href="#story">Discover Our Café</a>
            </div>
          </div>

          <div class="hero__meta glass-panel">
            <div>
              <span class="meta-label">Open</span>
              <strong>Daily 7:30 AM – 8:00 PM</strong>
            </div>
            <div>
              <span class="meta-label">Find us</span>
              <strong>14 Mercer Lane, New York</strong>
            </div>
          </div>
        </div>

        <div class="hero__visual" aria-label="Cinematic 3D café environment">
          <div class="hero-scene-shell glass-panel">
            <canvas class="hero-canvas"></canvas>
            <div class="hero-scene-halo"></div>
            <div class="scene-ring scene-ring--one"></div>
            <div class="scene-ring scene-ring--two"></div>
          </div>
        </div>

        <div class="scroll-indicator" aria-label="Scroll down">
          <span>Scroll</span>
          <div class="scroll-indicator__line"></div>
        </div>
      </section>

      <section class="story section reveal" id="story">
        <div class="section-heading">
          <p class="eyebrow eyebrow--muted">Our story</p>
          <h2>A slower rhythm for everyday rituals.</h2>
        </div>

        <div class="story__layout">
          <div class="story__media glass-panel">
            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80" alt="Café Atelier interior with warm lighting" />
            <div class="story__badge glass-panel">
              <span>Since 2018</span>
              <strong>Thoughtful coffee, warm rooms</strong>
            </div>
          </div>

          <div class="story__copy">
            <p>At Café Atelier, every detail is designed to feel considered — from the espresso pull to the way sunlight settles across the counter.</p>
            <p>Our menu centers on balanced flavor, straightforward hospitality, and a comfortable sense of pause in a busy city.</p>
            <ul class="story__list">
              <li>Comfortable, welcoming interiors</li>
              <li>Thoughtfully prepared seasonal drinks</li>
              <li>Simple, warm neighborhood service</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="menu section reveal" id="menu">
        <div class="section-heading section-heading--split">
          <div>
            <p class="eyebrow eyebrow--muted">Menu</p>
            <h2>Little moments, beautifully brewed.</h2>
          </div>
          <div class="menu__filters" aria-label="Menu categories">
            <button class="filter-button is-active" type="button" data-category="coffee">Coffee</button>
            <button class="filter-button" type="button" data-category="tea">Tea</button>
            <button class="filter-button" type="button" data-category="pastries">Pastries</button>
            <button class="filter-button" type="button" data-category="desserts">Desserts</button>
          </div>
        </div>
        <div class="menu__grid" aria-live="polite"></div>
      </section>

      <section class="signature section reveal">
        <div class="section-heading">
          <p class="eyebrow eyebrow--muted">Signature offerings</p>
          <h2>Favorites with a sense of occasion.</h2>
        </div>

        <div class="signature__showcase">
          <article class="feature feature--active glass-panel">
            <div class="feature__image">
              <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80" alt="Signature iced coffee with cream" />
            </div>
            <div class="feature__content">
              <span class="feature__label">Seasonal special</span>
              <h3>Maple Morning Espresso</h3>
              <p>Espresso layered with maple cream and a toasted oat finish for a naturally sweet start.</p>
              <div class="feature__meta">
                <strong>$8</strong>
                <span>Freshly pulled</span>
              </div>
            </div>
          </article>

          <div class="feature-list">
            <article class="mini-feature glass-panel">
              <span>01</span>
              <div>
                <h4>Slow Brew</h4>
                <p>Balanced and silky with a bright finish.</p>
              </div>
            </article>
            <article class="mini-feature glass-panel">
              <span>02</span>
              <div>
                <h4>Pastry Pairings</h4>
                <p>Seasonal bakes designed to complement each drink.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="gallery section reveal" id="gallery">
        <div class="section-heading">
          <p class="eyebrow eyebrow--muted">Gallery</p>
          <h2>Atmosphere in motion.</h2>
        </div>

        <div class="gallery__grid" aria-label="Gallery of café moments">
          <figure class="gallery__item gallery__item--tall"><img src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80" alt="Tea service at the cafe" /></figure>
          <figure class="gallery__item gallery__item--wide"><img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80" alt="Latte art coffee drink" /></figure>
          <figure class="gallery__item"><img src="https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80" alt="Coffee pouring into a ceramic cup" /></figure>
          <figure class="gallery__item gallery__item--large"><img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80" alt="Café interior with sunlight" /></figure>
          <figure class="gallery__item"><img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80" alt="Coffee and pastry on a table" /></figure>
        </div>
      </section>

      <section class="contact section reveal" id="contact">
        <div class="contact__visual glass-panel">
          <div class="contact__image" aria-hidden="true"></div>
          <div class="contact__info">
            <p class="eyebrow">Visit us</p>
            <h2>Make your next slow morning official.</h2>
            <ul>
              <li>14 Mercer Lane, New York</li>
              <li>(212) 555-0148</li>
              <li>Daily • 7:30 AM – 8:00 PM</li>
            </ul>
          </div>
        </div>

        <form class="reservation glass-panel" aria-label="Reservation form">
          <div class="reservation__header">
            <p class="eyebrow eyebrow--muted">Reserve a table</p>
            <h3>Plan your café moment.</h3>
          </div>

          <div class="field-row">
            <label>
              Name
              <input type="text" name="name" placeholder="Your name" required />
            </label>
            <label>
              Guests
              <select name="guests" required>
                <option value="">Select</option>
                <option>2 guests</option>
                <option>4 guests</option>
                <option>6 guests</option>
                <option>8 guests</option>
              </select>
            </label>
          </div>

          <div class="field-row">
            <label>
              Date
              <input type="date" name="date" required />
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
          </div>

          <label>
            Notes
            <textarea name="notes" rows="4" placeholder="Tell us about your plans for the visit."></textarea>
          </label>

          <button class="button button--primary" type="submit">Request reservation</button>
          <p class="form-success" aria-live="polite"></p>
        </form>
      </section>
    </main>

    <footer class="site-footer">
      <p>© <span id="year"></span> Café Atelier</p>
      <div>
        <a href="#home">Home</a>
        <a href="#menu">Menu</a>
        <a href="#contact">Contact</a>
      </div>
    </footer>
  </div>
`

const menuGrid = document.querySelector('.menu__grid')
const filterButtons = document.querySelectorAll('.filter-button')
const yearNode = document.querySelector('#year')

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear())
}

function renderMenu(category: string) {
  if (!menuGrid) {
    return
  }

  menuGrid.innerHTML = menuData[category]
    .map(
      (item) => `
        <article class="menu-item glass-panel">
          <div class="menu-item__image-wrap">
            <img src="${item.image}" alt="${item.name}" />
            <span class="menu-item__badge">${item.badge}</span>
          </div>
          <div class="menu-item__content">
            <div class="menu-item__meta">
              <h3>${item.name}</h3>
              <strong>${item.price}</strong>
            </div>
            <p>${item.description}</p>
          </div>
        </article>
      `,
    )
    .join('')

  motionAnimate(
    '.menu-item',
    { opacity: [0, 1], y: [18, 0], filter: ['blur(8px)', 'blur(0px)'] },
    { duration: 0.65, ease: 'easeOut', delay: (index) => index * 0.08 },
  )
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const currentSelection = button.getAttribute('data-category') ?? 'coffee'

    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button))
    renderMenu(currentSelection)
  })
})

renderMenu('coffee')

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  },
  { threshold: 0.18 },
)

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item))

const navLinks = document.querySelectorAll('.nav__link')
const sections = document.querySelectorAll('main section[id]')

const highlightNav = () => {
  const scrollPosition = window.scrollY + 120

  sections.forEach((section) => {
    const sectionElement = section as HTMLElement
    const id = sectionElement.getAttribute('id')
    const link = document.querySelector(`.nav__link[href="#${id}"]`)

    if (!link || !id) {
      return
    }

    const top = sectionElement.offsetTop
    const bottom = top + sectionElement.offsetHeight

    if (scrollPosition >= top && scrollPosition < bottom) {
      navLinks.forEach((navLink) => navLink.classList.toggle('is-active', navLink === link))
    }
  })
}

const header = document.querySelector('.topbar')
let lastScrollY = window.scrollY

const handleHeaderState = () => {
  const currentScroll = window.scrollY

  if (header) {
    header.classList.toggle('is-scrolled', currentScroll > 18)
    header.classList.toggle('is-hidden', currentScroll > lastScrollY && currentScroll > 110)
  }

  lastScrollY = currentScroll
  highlightNav()
}

window.addEventListener('scroll', handleHeaderState, { passive: true })
handleHeaderState()

const lenis = new Lenis({
  duration: 1.15,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.2,
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

const initializeHeroScene = () => {
  const heroCanvas = document.querySelector<HTMLCanvasElement>('.hero-canvas')

  if (!heroCanvas) {
    return
  }

  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
  camera.position.set(0, 0, 8)

  const heroGroup = new THREE.Group()
  scene.add(heroGroup)

  const ambientLight = new THREE.AmbientLight(0xfff0d4, 1.8)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xffd7a0, 2.2)
  keyLight.position.set(3.5, 4.5, 7)
  scene.add(keyLight)

  const rimLight = new THREE.PointLight(0xe39b69, 12, 18)
  rimLight.position.set(-4, 2, 4)
  scene.add(rimLight)

  const objectMaterials = [
    new THREE.MeshPhysicalMaterial({
      color: 0xd7a56d,
      metalness: 0.16,
      roughness: 0.34,
      emissive: 0x3d2113,
      emissiveIntensity: 0.25,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xefe5d8,
      metalness: 0.12,
      roughness: 0.42,
      emissive: 0x705c48,
      emissiveIntensity: 0.12,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0x8a5b3f,
      metalness: 0.2,
      roughness: 0.48,
      emissive: 0x2b180f,
      emissiveIntensity: 0.18,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xf4d9b7,
      metalness: 0.08,
      roughness: 0.5,
      transparent: true,
      opacity: 0.9,
    }),
  ]

  const floatingObjects: Array<{ mesh: THREE.Mesh; offset: number; speed: number; radius: number }> = []

  const createObject = (geometry: THREE.BufferGeometry, materialIndex: number, position: THREE.Vector3) => {
    const mesh = new THREE.Mesh(geometry, objectMaterials[materialIndex])
    mesh.position.copy(position)
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    heroGroup.add(mesh)

    floatingObjects.push({
      mesh,
      offset: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.7,
      radius: 1.1 + Math.random() * 1.8,
    })
  }

  createObject(new THREE.TorusKnotGeometry(0.92, 0.24, 180, 32), 0, new THREE.Vector3(0, 0.3, 0))
  createObject(new THREE.OctahedronGeometry(1.15), 1, new THREE.Vector3(-2.1, -0.3, -0.8))
  createObject(new THREE.CylinderGeometry(0.72, 0.95, 1.7, 32), 2, new THREE.Vector3(2.1, -0.2, -1.2))
  createObject(new THREE.IcosahedronGeometry(0.7), 3, new THREE.Vector3(0.5, 1.8, 0.6))
  createObject(new THREE.SphereGeometry(0.6, 32, 32), 0, new THREE.Vector3(-1.5, 1.7, 0.9))

  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(240 * 3)

  for (let i = 0; i < 240; i += 1) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 8
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 7
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xf5d7a8,
    size: 0.06,
    transparent: true,
    opacity: 0.8,
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)

  const pointer = { x: 0, y: 0 }
  window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
  })

  const resize = () => {
    const { clientWidth, clientHeight } = heroCanvas
    const needsResize = heroCanvas.width !== clientWidth || heroCanvas.height !== clientHeight

    if (!needsResize) {
      return
    }

    renderer.setSize(clientWidth, clientHeight, false)
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
  }

  const animateObjectMotion = () => {
    heroGroup.rotation.y += 0.0025
    heroGroup.rotation.x = THREE.MathUtils.lerp(heroGroup.rotation.x, pointer.y * 0.22, 0.045)
    heroGroup.rotation.z = THREE.MathUtils.lerp(heroGroup.rotation.z, pointer.x * 0.18, 0.04)
    heroGroup.position.x = THREE.MathUtils.lerp(heroGroup.position.x, pointer.x * 0.55, 0.035)
    heroGroup.position.y = THREE.MathUtils.lerp(heroGroup.position.y, pointer.y * 0.5, 0.035)

    floatingObjects.forEach(({ mesh, offset, speed, radius }, index) => {
      const time = performance.now() * 0.0007 * speed + offset
      mesh.position.x = Math.sin(time + index) * radius
      mesh.position.y = Math.cos(time * 1.1 + index) * radius * 0.8
      mesh.position.z = Math.sin(time * 1.4 + index) * 1.2
      mesh.rotation.x += 0.008 + index * 0.0008
      mesh.rotation.y += 0.012 + index * 0.001
    })

    particles.rotation.y += 0.0015
    particles.rotation.x = THREE.MathUtils.lerp(particles.rotation.x, pointer.y * 0.2, 0.04)

    const targetX = pointer.x * 0.9
    const targetY = -pointer.y * 0.55
    camera.position.x += (targetX - camera.position.x) * 0.04
    camera.position.y += (targetY - camera.position.y) * 0.04
    camera.position.z = 8

    renderer.render(scene, camera)
  }

  const loop = () => {
    resize()
    animateObjectMotion()
    requestAnimationFrame(loop)
  }

  loop()

  gsap.to(camera.position, {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    z: 6.5,
    x: 1.5,
    y: -0.6,
    ease: 'none',
  })

  gsap.to(heroGroup.rotation, {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    y: 1.4,
    x: -0.8,
    ease: 'none',
  })

  gsap.to('.scene-ring', {
    scrollTrigger: {
      trigger: '.story',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    },
    y: 48,
    opacity: 0.9,
    ease: 'none',
  })

  if (isTheatreEnabled) {
    try {
      Studio.initialize({})
    } catch (error) {
      console.warn('Theatre init skipped', error)
    }
  }
}

initializeHeroScene()

motionAnimate(
  '.button--primary',
  {
    boxShadow: [
      '0 16px 30px rgba(132, 75, 38, 0.28)',
      '0 20px 42px rgba(132, 75, 38, 0.42)',
      '0 16px 30px rgba(132, 75, 38, 0.28)',
    ],
  },
  { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
)

animeAnimate('.scene-ring', {
  rotate: 360,
  loop: true,
  duration: 14000,
  easing: 'linear',
})

const reservationForm = document.querySelector('.reservation') as HTMLFormElement | null

if (reservationForm) {
  reservationForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(reservationForm)
    const name = String(formData.get('name') ?? '').trim()
    const date = String(formData.get('date') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const guestCount = String(formData.get('guests') ?? '').trim()

    const successMessage = reservationForm.querySelector('.form-success')

    if (!name || !date || !email || !guestCount) {
      if (successMessage) {
        successMessage.textContent = 'Please complete all required fields before submitting.'
        successMessage.classList.add('is-error')
      }
      return
    }

    if (successMessage) {
      successMessage.textContent = `Thanks, ${name}. Your reservation request for ${guestCount.toLowerCase()} on ${date} has been noted.`
      successMessage.classList.remove('is-error')
    }

    reservationForm.reset()
  })
}
'''

css = '''@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #120d0b;
  --bg-soft: #1b1413;
  --panel: rgba(255, 248, 240, 0.08);
  --panel-strong: rgba(255, 248, 240, 0.13);
  --card: rgba(26, 19, 16, 0.52);
  --line: rgba(255, 255, 255, 0.12);
  --text: #f7efe8;
  --muted: rgba(247, 239, 232, 0.72);
  --muted-strong: rgba(247, 239, 232, 0.88);
  --gold: #d3a66f;
  --gold-soft: #f2dbb3;
  --coffee: #4d2f22;
  --coffee-dark: #201612;
  --shadow: rgba(9, 8, 8, 0.38);
  --radius-lg: 28px;
  --radius-md: 22px;
  --container: 1280px;
  --serif: 'Cormorant Garamond', serif;
  --sans: 'Manrope', sans-serif;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(190, 117, 64, 0.24), transparent 24%),
    linear-gradient(180deg, #120d0b 0%, #1a1412 100%);
  color: var(--text);
  font-family: var(--sans);
  line-height: 1.6;
}
img { display: block; max-width: 100%; width: 100%; }
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
button { cursor: pointer; }
#app { min-height: 100vh; }
.page-shell {
  width: min(var(--container), calc(100% - 30px));
  margin: 0 auto;
  padding-bottom: 40px;
}
.glass-panel {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 50px rgba(14, 12, 10, 0.22);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}
.topbar {
  position: sticky;
  top: 18px;
  z-index: 40;
  padding-top: 18px;
  transition: transform 0.35s ease, opacity 0.35s ease;
}
.topbar.is-hidden { transform: translateY(-120%); opacity: 0; }
.topbar.is-scrolled .nav { background: rgba(21, 16, 14, 0.72); }
.nav {
  width: min(var(--container), calc(100% - 20px));
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 22px;
  border-radius: 999px;
  background: rgba(25, 19, 16, 0.28);
  transition: background 0.3s ease, border-color 0.3s ease;
}
.brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; }
.brand__mark {
  width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 231, 182, 0.66), rgba(181, 117, 66, 0.28));
  border: 1px solid rgba(255,255,255,0.18); box-shadow: inset 0 1px 0 rgba(255,255,255,0.35);
}
.nav__links {
  display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px;
}
.nav__link {
  position: relative; padding: 12px 16px; border-radius: 999px; color: var(--muted); font-size: 0.83rem; letter-spacing: 0.04em; transition: color 0.25s ease, background 0.25s ease;
}
.nav__link:hover, .nav__link.is-active { color: var(--text); background: rgba(255, 255, 255, 0.06); }
.button {
  display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: 999px; padding: 0.9rem 1.5rem; min-height: 50px; color: var(--text); font-weight: 700; letter-spacing: 0.04em; transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}
.button:hover { transform: translateY(-2px); }
.button--primary {
  background: linear-gradient(135deg, rgba(214, 159, 92, 0.95), rgba(155, 98, 55, 0.95));
  box-shadow: 0 18px 30px rgba(132, 75, 38, 0.45);
}
.button--secondary {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
}
.hero {
  position: relative; min-height: calc(100vh - 86px); padding-top: 110px; padding-bottom: 40px; overflow: hidden; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 42px; align-items: center;
}
.hero__background, .hero__overlay { position: absolute; inset: 0; }
.hero__background {
  background-image: url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1800&q=80');
  background-size: cover; background-position: center; transform: scale(1.14); filter: saturate(0.85) contrast(1.08);
}
.hero__overlay {
  background: linear-gradient(90deg, rgba(13, 10, 9, 0.77), rgba(13, 10, 9, 0.32) 45%, rgba(13, 10, 9, 0.62));
}
.hero__content, .hero__visual, .scroll-indicator { position: relative; z-index: 1; }
.hero__content { display: flex; flex-direction: column; gap: 22px; align-items: flex-start; }
.hero__copy {
  max-width: 640px; padding: 34px 34px 30px; border-radius: var(--radius-lg);
}
.eyebrow {
  margin: 0 0 12px; color: var(--gold-soft); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
}
.eyebrow--muted { color: var(--muted); }
.hero h1, .section-heading h2, .contact__info h2, .reservation h3 {
  margin: 0; font-family: var(--serif); font-weight: 600; line-height: 0.94; letter-spacing: -0.04em;
}
.hero h1 { font-size: clamp(4rem, 8vw, 7.2rem); max-width: 620px; text-wrap: balance; }
.hero h1 span { display: block; }
.lead { max-width: 550px; margin: 18px 0 0; color: var(--muted-strong); font-size: 1.03rem; }
.hero__actions { margin-top: 18px; display:flex; gap:16px; flex-wrap:wrap; }
.hero__meta {
  display:flex; flex-wrap:wrap; gap:20px; padding: 18px 22px; border-radius: 18px; max-width: 520px;
}
.hero__meta > div { display:flex; flex-direction:column; gap:4px; }
.meta-label { color: var(--muted); font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; }
.hero__visual { display:flex; justify-content:center; align-items:center; min-height:580px; perspective:1200px; }
.hero-scene-shell {
  position: relative; width: min(34vw, 430px); height: 440px; border-radius: 32px; overflow: hidden; background: rgba(255,255,255,0.04);
}
.hero-canvas { width: 100%; height: 100%; display:block; }
.hero-scene-halo {
  position: absolute; inset: 14% 18%; border-radius: 50%; background: radial-gradient(circle, rgba(255,209,147,0.38), rgba(255,209,147,0.1) 45%, transparent 72%); filter: blur(28px); pointer-events:none;
}
.scene-ring {
  position: absolute; inset: auto; width: 110%; height: 110%; left: -5%; top: -5%; border: 1px solid rgba(255,255,255,0.14); border-radius: 50%; opacity: 0.32; pointer-events:none;
}
.scene-ring--two { transform: scale(0.78) rotate(18deg); }
.scroll-indicator {
  position: absolute; left:50%; bottom:18px; display:flex; flex-direction:column; align-items:center; gap:12px; transform: translateX(-50%); color: var(--muted); font-size: 0.68rem; letter-spacing:0.18em; text-transform: uppercase;
}
.scroll-indicator__line { width: 1px; height: 60px; background: linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0)); animation: scrollPulse 2.2s ease-in-out infinite; }
@keyframes scrollPulse { 0%, 100% { opacity: 0.2; transform: scaleY(0.7); } 50% { opacity:1; transform: scaleY(1); } }
.section { padding-top:120px; }
.section-heading { margin-bottom: 32px; }
.section-heading h2 { font-size: clamp(2.6rem, 5vw, 4.2rem); max-width: 680px; }
.section-heading--split { display:flex; justify-content:space-between; align-items:end; gap:20px; }
.story__layout { display:grid; grid-template-columns:1.1fr 0.9fr; gap:28px; align-items:center; }
.story__media { position:relative; overflow:hidden; border-radius:var(--radius-lg); min-height:560px; }
.story__media img { height:100%; object-fit:cover; }
.story__badge {
  position:absolute; left:24px; bottom:24px; display:flex; flex-direction:column; gap:5px; padding:18px 18px 16px; border-radius:16px;
}
.story__badge span { color: var(--muted); font-size: 0.7rem; text-transform: uppercase; letter-spacing:0.14em; }
.story__badge strong { font-family: var(--serif); font-size: 2rem; line-height:1; }
.story__copy { display:flex; flex-direction:column; gap:24px; color: var(--muted-strong); font-size:1.08rem; }
.story__list { list-style:none; padding:0; margin:10px 0 0; display:grid; gap:12px; }
.story__list li { position:relative; padding-left:28px; color: var(--text); }
.story__list li::before { content:'•'; position:absolute; left:0; top:-1px; color: var(--gold); font-size:1.8rem; line-height:1; }
.menu__filters { display:flex; flex-wrap:wrap; gap:10px; }
.filter-button {
  border: 1px solid rgba(255,255,255,0.12); background: transparent; color: var(--muted); padding: 12px 18px; border-radius: 999px; transition: all 0.2s ease;
}
.filter-button.is-active { background: rgba(255,255,255,0.08); color: var(--text); border-color: rgba(255,255,255,0.22); }
.menu__grid {
  display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; margin-top: 28px;
}
.menu-item {
  overflow:hidden; border-radius: 24px; background: rgba(27,19,16,0.42); border:1px solid rgba(255,255,255,0.12);
}
.menu-item__image-wrap { position:relative; }
.menu-item__image-wrap img { height: 280px; object-fit: cover; }
.menu-item__badge {
  position:absolute; left:16px; bottom:16px; padding:8px 10px; border-radius:999px; background: rgba(16,12,10,0.5); border:1px solid rgba(255,255,255,0.12); font-size:0.64rem; letter-spacing:0.12em; text-transform:uppercase; color: var(--gold-soft);
}
.menu-item__content { padding: 20px 18px 22px; }
.menu-item__meta { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom: 12px; }
.menu-item__meta h3 { margin:0; font-size:1.5rem; font-family: var(--serif); line-height:1; }
.menu-item__meta strong { color: var(--gold-soft); font-size:1.08rem; }
.menu-item__content p { margin: 0; color: var(--muted-strong); }
.signature__showcase { display:grid; grid-template-columns:1.2fr 0.8fr; gap:20px; }
.feature, .mini-feature { border-radius: 26px; }
.feature { overflow:hidden; display:grid; grid-template-columns: 1.1fr 0.9fr; }
.feature__image img { height:100%; min-height: 360px; object-fit:cover; }
.feature__content { padding: 28px; display:flex; flex-direction:column; justify-content:center; }
.feature__label { color: var(--gold-soft); font-size:0.7rem; letter-spacing:0.18em; text-transform:uppercase; }
.feature__content h3 { margin: 12px 0; font-family: var(--serif); font-size: clamp(2.2rem, 3vw, 3.2rem); line-height: 0.95; }
.feature__content p { margin:0; color: var(--muted-strong); }
.feature__meta { margin-top: 18px; display:flex; align-items:center; justify-content:space-between; gap:10px; }
.feature__meta strong { font-size: 1.5rem; color: var(--gold-soft); }
.feature__meta span { color: var(--muted); }
.feature-list { display:grid; gap:16px; }
.mini-feature { display:flex; gap:16px; padding: 22px 18px; align-items:flex-start; }
.mini-feature span { color: var(--gold-soft); font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; }
.mini-feature h4 { margin:0 0 6px; font-size:1.25rem; }
.mini-feature p { margin:0; color: var(--muted-strong); }
.gallery__grid {
  display:grid; grid-template-columns: repeat(12, 1fr); gap: 18px; margin-top:20px;
}
.gallery__item {
  grid-column: span 4; overflow:hidden; border-radius: 24px; min-height: 260px; background: rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
}
.gallery__item--wide { grid-column: span 5; }
.gallery__item--tall { grid-column: span 3; min-height: 340px; }
.gallery__item--large { grid-column: span 5; min-height: 300px; }
.gallery__item img { height:100%; object-fit:cover; }
.contact {
  display:grid; grid-template-columns: 1fr 1fr; gap: 22px; align-items:stretch; margin-top:120px;
}
.contact__visual {
  display:flex; flex-direction:column; justify-content:space-between; gap:18px; border-radius:30px; padding: 20px; overflow:hidden;
}
.contact__image {
  min-height: 320px; border-radius: 22px; background-image: url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=80'); background-size:cover; background-position:center;
}
.contact__info { padding: 0 8px 8px; }
.contact__info h2 { font-size: clamp(2.6rem, 4vw, 3.8rem); }
.contact__info ul { list-style:none; margin:20px 0 0; padding:0; display:grid; gap:10px; color: var(--muted-strong); }
.reservation {
  border-radius: 30px; padding: 26px 24px 22px; display:flex; flex-direction:column; gap:18px;
}
.reservation__header h3 { font-size: clamp(2.1rem, 3vw, 2.8rem); }
.field-row { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
label { display:flex; flex-direction:column; gap:8px; color: var(--muted); font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; }
input, select, textarea {
  border: 1px solid rgba(255,255,255,0.1); background: rgba(8,7,7,0.2); color: var(--text); border-radius: 16px; padding: 14px 16px; outline:none;
}
input::placeholder, textarea::placeholder { color: rgba(247,239,232,0.45); }
textarea { resize: vertical; min-height: 110px; }
.form-success { min-height: 24px; margin: 0; color: var(--gold-soft); }
.form-success.is-error { color: #ffb0a1; }
.site-footer {
  display:flex; align-items:center; justify-content:space-between; gap:18px; padding: 32px 8px 10px; color: var(--muted); border-top: 1px solid rgba(255,255,255,0.08); margin-top:42px; font-size:0.96rem;
}
.site-footer div { display:flex; gap:20px; }
.reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.9s ease, transform 0.9s ease; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
@media (max-width: 1000px) {
  .hero { grid-template-columns:1fr; padding-top: 92px; }
  .hero__content { order: 1; }
  .hero__visual { order: 0; min-height: 420px; }
  .story__layout, .signature__showcase, .contact { grid-template-columns:1fr; }
  .menu__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gallery__item--wide, .gallery__item--large, .gallery__item--tall, .gallery__item { grid-column: span 6; }
}
@media (max-width: 760px) {
  .nav { padding: 12px 18px; }
  .nav__links { display:none; }
  .hero { min-height: auto; }
  .hero__copy { padding: 24px 22px; }
  .hero__meta { flex-direction: column; }
  .menu__grid, .field-row, .feature { grid-template-columns: 1fr; }
  .gallery__grid { grid-template-columns:1fr; }
  .gallery__item, .gallery__item--wide, .gallery__item--large, .gallery__item--tall { grid-column: auto; min-height: 220px; }
  .site-footer { flex-direction:column; align-items:flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  .reveal { opacity:1; transform:none; }
}
'''

Path(r'C:\Users\hp\OneDrive\Desktop\Web Nivo\Website\Cafe\src\main.ts').write_text(main, encoding='utf-8')
Path(r'C:\Users\hp\OneDrive\Desktop\Web Nivo\Website\Cafe\src\style.css').write_text(css, encoding='utf-8')
print('rewritten')
