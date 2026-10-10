import './style.css'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { animate as motionAnimate, inView, stagger } from 'motion'
import { animate as animeAnimate } from 'animejs'
import { getProject, types } from '@theatre/core'
import studio from '@theatre/studio'

gsap.registerPlugin(ScrollTrigger)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
      price: '$5',
      image:
        'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80',
      badge: 'House favorite',
    },
    {
      name: 'Cinnamon Cloud',
      description: 'Single-origin espresso with cinnamon foam and caramel notes.',
      price: '$5',
      image:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
      badge: 'Warm spice',
    },
    {
      name: 'Honey Oat',
      description: 'Oat milk, floral honey, and a smooth espresso base.',
      price: '$5.5',
      image:
        'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80',
      badge: 'Soft texture',
    },
  ],
  tea: [
    {
      name: 'Jasmine Silk',
      description: 'A delicate floral tea with a clean, lingering finish.',
      price: '$4',
      image:
        'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80',
      badge: 'Botanical',
    },
    {
      name: 'Citrus Matcha',
      description: 'Ceremonial matcha brightened with orange peel and citrus zest.',
      price: '$5',
      image:
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
      badge: 'Bright lift',
    },
    {
      name: 'Vanilla Rooibos',
      description: 'Naturally sweet red tea with light vanilla bean and cream.',
      price: '$4',
      image:
        'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80',
      badge: 'Smooth & gentle',
    },
  ],
  pastries: [
    {
      name: 'Almond Croissant',
      description: 'Layered pastry, toasted almonds, and a honey finish.',
      price: '$4.5',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
      badge: 'Baked fresh',
    },
    {
      name: 'Maple Morning Bun',
      description: 'Sticky and soft with a buttery maple glaze.',
      price: '$4',
      image:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80',
      badge: 'Sweet & rich',
    },
    {
      name: 'Berry Scone',
      description: 'Tender crumb with roasted berries and a citrus glaze.',
      price: '$3.5',
      image:
        'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=900&q=80',
      badge: 'Fragrant fruit',
    },
  ],
  desserts: [
    {
      name: 'Cocoa Mousse',
      description: 'Silky dark chocolate mousse with a hint of espresso.',
      price: '$6',
      image:
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80',
      badge: 'Decadent',
    },
    {
      name: 'Pear Tart',
      description: 'Roasted pear with flaky pastry and warm vanilla cream.',
      price: '$6.5',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=900&q=80',
      badge: 'Seasonal',
    },
    {
      name: 'Coconut Mille-Feuille',
      description: 'Laminated pastry with coconut cream and toasted flakes.',
      price: '$5',
      image:
        'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
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
    <div class="ambient-dust" aria-hidden="true"></div>
    <div class="vignette" aria-hidden="true"></div>

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

        <a href="#contact" class="button button--primary nav__cta magnetic-btn" data-strength="0.18">Reserve</a>
      </nav>
    </header>

    <main>
      <section class="hero reveal" id="home">
        <div class="hero__layer hero__layer--far" aria-hidden="true"></div>
        <div class="hero__layer hero__layer--mid" aria-hidden="true"></div>
        <div class="hero__layer hero__layer--near" aria-hidden="true"></div>
        <div class="hero__overlay" aria-hidden="true"></div>
        <div class="hero__grain" aria-hidden="true"></div>

        <div class="hero__content">
          <div class="hero__copy glass-panel">
            <p class="eyebrow"><span class="eyebrow__dot"></span>Slow mornings. Rich rituals.</p>
            <h1 class="hero__title">
              <span class="hero__title-line hero__title-line--1">Crafted</span>
              <span class="hero__title-line hero__title-line--2">comfort in every cup.</span>
            </h1>
            <p class="lead">
              Café Atelier blends modern coffee culture with warm hospitality, creating a refined space for lingering conversation and beautifully prepared drinks.
            </p>
            <div class="hero__actions">
              <a class="button button--primary magnetic-btn" href="#menu" data-strength="0.2">Explore Our Menu</a>
              <a class="button button--secondary magnetic-btn" href="#story" data-strength="0.16">Discover Our Café</a>
            </div>
          </div>

          <div class="hero__meta glass-panel">
            <div class="hero__meta-item">
              <span class="meta-label">Open</span>
              <strong>Daily 7:30 AM – 8:00 PM</strong>
            </div>
            <div class="hero__meta-divider" aria-hidden="true"></div>
            <div class="hero__meta-item">
              <span class="meta-label">Find us</span>
              <strong>14 Mercer Lane, New York</strong>
            </div>
          </div>
        </div>

        <div class="hero__visual" aria-label="Cinematic 3D café environment">
          <div class="hero-scene-shell glass-panel">
            <canvas class="hero-canvas"></canvas>
            <div class="hero-scene-halo"></div>
            <div class="hero-scene-glow" aria-hidden="true"></div>
          </div>
          <div class="floating-card floating-card--a glass-panel" aria-hidden="true">
            <div class="floating-card__swatch floating-card__swatch--1"></div>
            <span>Roast No. 07</span>
            <strong>Ethiopia Yirgacheffe</strong>
          </div>
          <div class="floating-card floating-card--b glass-panel" aria-hidden="true">
            <div class="floating-card__swatch floating-card__swatch--2"></div>
            <span>Seasonal</span>
            <strong>Almond & Honey</strong>
          </div>
        </div>

        <div class="scroll-indicator" aria-label="Scroll down">
          <span>Scroll</span>
          <div class="scroll-indicator__line"></div>
        </div>
      </section>

      <section class="story section reveal" id="story">
        <div class="story__decor story__decor--1" aria-hidden="true"></div>
        <div class="story__decor story__decor--2" aria-hidden="true"></div>

        <div class="section-heading story__heading">
          <p class="eyebrow eyebrow--muted"><span class="eyebrow__dot eyebrow__dot--muted"></span>Our story</p>
          <h2>A slower rhythm for everyday rituals.</h2>
        </div>

        <div class="story__layout">
          <div class="story__media-stack">
            <div class="story__media story__media--main glass-panel" data-tilt>
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
                alt="Café Atelier interior with warm lighting"
              />
              <div class="story__badge glass-panel">
                <span>Since 2018</span>
                <strong>Thoughtful coffee, warm rooms</strong>
              </div>
              <div class="story__photo-corner story__photo-corner--tl" aria-hidden="true"></div>
              <div class="story__photo-corner story__photo-corner--br" aria-hidden="true"></div>
            </div>
            <div class="story__media story__media--secondary glass-panel tilt-3d" data-tilt>
              <img
                src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&q=80"
                alt="Latte art detail"
              />
            </div>
          </div>

          <div class="story__copy">
            <div class="story__copy-accent" aria-hidden="true"></div>
            <p class="story__lede">
              At Café Atelier, every detail is designed to feel considered — from the espresso pull to the way sunlight settles across the counter.
            </p>
            <p>
              Our menu centers on balanced flavor, straightforward hospitality, and a comfortable sense of pause in a busy city.
            </p>
            <ul class="story__list">
              <li><span class="story__list-icon"></span>Comfortable, welcoming interiors</li>
              <li><span class="story__list-icon"></span>Thoughtfully prepared seasonal drinks</li>
              <li><span class="story__list-icon"></span>Simple, warm neighborhood service</li>
            </ul>
            <div class="story__stats">
              <div class="story__stat glass-panel">
                <strong class="stat-number">6+</strong>
                <span>Years of service</span>
              </div>
              <div class="story__stat glass-panel">
                <strong class="stat-number">24</strong>
                <span>Single-origin beans</span>
              </div>
              <div class="story__stat glass-panel">
                <strong class="stat-number">100%</strong>
                <span>Handcrafted daily</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="menu section reveal" id="menu">
        <div class="section-heading section-heading--split menu__heading">
          <div>
            <p class="eyebrow eyebrow--muted"><span class="eyebrow__dot eyebrow__dot--muted"></span>Menu</p>
            <h2>Little moments, beautifully brewed.</h2>
          </div>
          <div class="menu__filters" aria-label="Menu categories">
            <button class="filter-button is-active magnetic-btn" type="button" data-category="coffee" data-strength="0.14">Coffee</button>
            <button class="filter-button magnetic-btn" type="button" data-category="tea" data-strength="0.14">Tea</button>
            <button class="filter-button magnetic-btn" type="button" data-category="pastries" data-strength="0.14">Pastries</button>
            <button class="filter-button magnetic-btn" type="button" data-category="desserts" data-strength="0.14">Desserts</button>
          </div>
        </div>

        <div class="menu__grid" aria-live="polite"></div>
      </section>

      <section class="signature section reveal">
        <div class="section-heading signature__heading">
          <p class="eyebrow eyebrow--muted"><span class="eyebrow__dot eyebrow__dot--muted"></span>Signature offerings</p>
          <h2>Favorites with a sense of occasion.</h2>
        </div>

        <div class="signature__showcase">
          <article class="feature feature--active glass-panel tilt-3d" data-tilt>
            <div class="feature__image">
              <img
                src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80"
                alt="Signature iced coffee with cream"
              />
              <div class="feature__image-shine" aria-hidden="true"></div>
            </div>
            <div class="feature__content">
              <span class="feature__label">Seasonal special</span>
              <h3>Maple Morning Espresso</h3>
              <p>Espresso layered with maple cream and a toasted oat finish for a naturally sweet start.</p>
              <div class="feature__meta">
                <strong>$6</strong>
                <span>Freshly pulled</span>
              </div>
            </div>
          </article>

          <div class="feature-list">
            <article class="mini-feature glass-panel tilt-3d" data-tilt>
              <span class="mini-feature__badge">01</span>
              <div>
                <h4>Slow Brew</h4>
                <p>Balanced and silky with a bright finish.</p>
              </div>
              <div class="mini-feature__accent" aria-hidden="true"></div>
            </article>
            <article class="mini-feature glass-panel tilt-3d" data-tilt>
              <span class="mini-feature__badge">02</span>
              <div>
                <h4>Pastry Pairings</h4>
                <p>Seasonal bakes designed to complement each drink.</p>
              </div>
              <div class="mini-feature__accent" aria-hidden="true"></div>
            </article>
            <article class="mini-feature glass-panel tilt-3d" data-tilt>
              <span class="mini-feature__badge">03</span>
              <div>
                <h4>Private Tastings</h4>
                <p>Curated flights for small groups by reservation.</p>
              </div>
              <div class="mini-feature__accent" aria-hidden="true"></div>
            </article>
          </div>
        </div>
      </section>

      <section class="gallery section reveal" id="gallery">
        <div class="section-heading gallery__heading">
          <p class="eyebrow eyebrow--muted"><span class="eyebrow__dot eyebrow__dot--muted"></span>Gallery</p>
          <h2>Atmosphere in motion.</h2>
        </div>

        <div class="gallery__grid" aria-label="Gallery of café moments">
          <figure class="gallery__item gallery__item--tall tilt-3d" data-tilt>
            <img src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80" alt="Tea service at the cafe" />
            <div class="gallery__frame" aria-hidden="true"></div>
          </figure>
          <figure class="gallery__item gallery__item--wide tilt-3d" data-tilt>
            <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80" alt="Latte art coffee drink" />
            <div class="gallery__frame" aria-hidden="true"></div>
          </figure>
          <figure class="gallery__item tilt-3d" data-tilt>
            <img src="https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80" alt="Coffee pouring into a ceramic cup" />
            <div class="gallery__frame" aria-hidden="true"></div>
          </figure>
          <figure class="gallery__item gallery__item--large tilt-3d" data-tilt>
            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80" alt="Café interior with sunlight" />
            <div class="gallery__frame" aria-hidden="true"></div>
          </figure>
          <figure class="gallery__item tilt-3d" data-tilt>
            <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80" alt="Coffee and pastry on a table" />
            <div class="gallery__frame" aria-hidden="true"></div>
          </figure>
        </div>
      </section>

      <section class="contact section reveal" id="contact">
        <div class="contact__decor-1" aria-hidden="true"></div>
        <div class="contact__decor-2" aria-hidden="true"></div>

        <div class="contact__visual glass-panel">
          <div class="contact__image" aria-hidden="true"></div>
          <div class="contact__image-overlay" aria-hidden="true"></div>
          <div class="contact__info">
            <p class="eyebrow"><span class="eyebrow__dot"></span>Visit us</p>
            <h2>Make your next slow morning official.</h2>
            <ul class="contact__details">
              <li>
                <span class="contact__detail-icon contact__detail-icon--pin"></span>
                <span>14 Mercer Lane, New York</span>
              </li>
              <li>
                <span class="contact__detail-icon contact__detail-icon--phone"></span>
                <span>(212) 555-0148</span>
              </li>
              <li>
                <span class="contact__detail-icon contact__detail-icon--time"></span>
                <span>Daily • 7:30 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <form class="reservation glass-panel" aria-label="Reservation form">
          <div class="reservation__header">
            <p class="eyebrow eyebrow--muted"><span class="eyebrow__dot eyebrow__dot--muted"></span>Reserve a table</p>
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

          <button class="button button--primary magnetic-btn" type="submit" data-strength="0.2">Request reservation</button>
          <p class="form-success" aria-live="polite"></p>
        </form>
      </section>
    </main>

    <footer class="site-footer">
      <div class="site-footer__brand">
        <span class="brand__mark">CA</span>
        <p>© <span id="year"></span> Café Atelier</p>
      </div>
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

function renderMenu(category: string, animate = true) {
  if (!menuGrid) {
    return
  }

  menuGrid.innerHTML = menuData[category]
    .map(
      (item) => `
        <article class="menu-item glass-panel tilt-3d" data-tilt>
          <div class="menu-item__image-wrap">
            <img src="${item.image}" alt="${item.name}" />
            <div class="menu-item__image-shine" aria-hidden="true"></div>
            <span class="menu-item__badge">${item.badge}</span>
          </div>
          <div class="menu-item__content">
            <div class="menu-item__meta">
              <h3>${item.name}</h3>
              <strong class="menu-item__price">${item.price}</strong>
            </div>
            <p>${item.description}</p>
            <div class="menu-item__underline" aria-hidden="true"></div>
          </div>
        </article>
      `,
    )
    .join('')

  if (animate && !reducedMotion) {
    animeAnimate('.menu-item', {
      opacity: [0, 1],
      translateY: [30, 0],
      translateX: [index => index % 2 === 0 ? -18 : 18, 0],
      rotateX: [12, 0],
      scale: [0.94, 1],
      filter: ['blur(10px)', 'blur(0px)'],
      delay: animeAnimate.stagger(90),
      duration: 780,
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    })
  }

  initTiltEffects('.menu-item')
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const currentSelection = button.getAttribute('data-category') ?? 'coffee'
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button))

    if (!reducedMotion && menuGrid) {
      animeAnimate('.menu-item', {
        opacity: [1, 0],
        translateY: [0, -20],
        rotateX: [0, -8],
        scale: [1, 0.96],
        filter: ['blur(0px)', 'blur(8px)'],
        delay: animeAnimate.stagger(50, { from: 'last' }),
        duration: 420,
        easing: 'easeInQuad',
        complete: () => {
          renderMenu(currentSelection)
        },
      })
    } else {
      renderMenu(currentSelection, false)
    }
  })
})

renderMenu('coffee', false)

const navLinks = document.querySelectorAll('.nav__link')
const sections = document.querySelectorAll('main section[id]')

const highlightNav = () => {
  const scrollPosition = window.scrollY + 160
  sections.forEach((section) => {
    const sectionElement = section as HTMLElement
    const id = sectionElement.getAttribute('id')
    const link = document.querySelector(`.nav__link[href="#${id}"]`)
    if (!link || !id) return
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
  smoothWheel: !reducedMotion,
  wheelMultiplier: 0.92,
  touchMultiplier: 1.15,
})

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

// ==================== HERO 3D SCENE ====================
type FloatingObject = {
  mesh: THREE.Mesh
  basePosition: THREE.Vector3
  offset: number
  speed: number
  orbitRadius: THREE.Vector3
  autoRotate: THREE.Vector3
  depthInfluence: number
}

const initializeHeroScene = () => {
  const heroCanvas = document.querySelector<HTMLCanvasElement>('.hero-canvas')
  if (!heroCanvas) return

  const renderer = new THREE.WebGLRenderer({
    canvas: heroCanvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, reducedMotion ? 1.5 : 2))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.12

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
  camera.position.set(0, 0, 9.5)

  const heroGroup = new THREE.Group()
  scene.add(heroGroup)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xfff0d4, 1.6)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xffe3b8, 2.6)
  keyLight.position.set(4.5, 5.5, 7.5)
  keyLight.castShadow = false
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

  // Materials palette — warm café tones
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
    opts: Partial<{ speed: number; orbitRadius: THREE.Vector3; autoRotate: THREE.Vector3; depthInfluence: number; offset: number; scale: number }> = {},
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
      offset: opts.offset ?? Math.random() * Math.PI * 2,
      speed: opts.speed ?? 0.5 + Math.random() * 0.7,
      orbitRadius: opts.orbitRadius ?? new THREE.Vector3(1.0 + Math.random() * 1.6, 0.7 + Math.random() * 1.0, 0.8 + Math.random() * 1.2),
      autoRotate: opts.autoRotate ?? new THREE.Vector3(0.004 + Math.random() * 0.008, 0.006 + Math.random() * 0.01, 0.002 + Math.random() * 0.006),
      depthInfluence: opts.depthInfluence ?? 0.5 + Math.random() * 0.5,
    })
    return mesh
  }

  // Coffee bean geometry — ellipsoid with central groove
  const makeCoffeeBean = (size = 0.42) => {
    const geo = new THREE.SphereGeometry(size, 48, 32)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      const groove = Math.exp(-((y * y) / (size * size * 0.12))) * 0.12 * size * Math.sign(x || 0.001)
      pos.setX(i, x * 1.55 - groove)
      pos.setY(i, y * 0.78)
      pos.setZ(i, z * 1.02)
    }
    geo.computeVertexNormals()
    return geo
  }

  // Individual coffee beans (no pot/cup) — Scene A core
  const beanPositions = [
    { pos: new THREE.Vector3(-2.6, 1.3, 1.6), mat: materials.beanDark, scale: 1.0, speed: 0.62 },
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
      orbitRadius: new THREE.Vector3(0.9 + Math.random() * 0.7, 0.6 + Math.random() * 0.5, 0.5 + Math.random() * 0.6),
      offset: Math.random() * Math.PI * 2,
      depthInfluence: 0.7 + Math.random() * 0.3,
    })
  })

  // Pastry-inspired sculptural forms
  addObject(
    new THREE.TorusGeometry(0.95, 0.26, 40, 96),
    materials.pastryGlaze,
    new THREE.Vector3(0, 0.2, 0),
    { speed: 0.38, orbitRadius: new THREE.Vector3(0.4, 0.5, 0.3), scale: 1, autoRotate: new THREE.Vector3(0.006, 0.0025, 0.0045), depthInfluence: 0.35 },
  )

  addObject(
    new THREE.SphereGeometry(0.6, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2.1),
    materials.pastry,
    new THREE.Vector3(-1.8, 0.8, -0.6),
    { speed: 0.44, orbitRadius: new THREE.Vector3(0.8, 0.5, 0.6), scale: 1, autoRotate: new THREE.Vector3(0.0035, 0.0055, 0.0025), depthInfluence: 0.6 },
  )

  addObject(
    new THREE.IcosahedronGeometry(0.68, 1),
    materials.sculptGold,
    new THREE.Vector3(1.7, -0.8, -1.1),
    { speed: 0.5, orbitRadius: new THREE.Vector3(1.0, 0.8, 0.7), scale: 1, autoRotate: new THREE.Vector3(0.007, 0.0055, 0.004), depthInfluence: 0.65 },
  )

  addObject(
    new THREE.OctahedronGeometry(0.82, 0),
    materials.sculptIvory,
    new THREE.Vector3(-0.7, 1.7, 0.4),
    { speed: 0.34, orbitRadius: new THREE.Vector3(0.6, 0.5, 0.5), scale: 1, autoRotate: new THREE.Vector3(0.005, 0.004, 0.007), depthInfluence: 0.55 },
  )

  // Berry-like accents
  addObject(
    new THREE.SphereGeometry(0.22, 32, 32),
    materials.berry,
    new THREE.Vector3(-1.2, -1.3, 1.4),
    { speed: 0.9, scale: 1, orbitRadius: new THREE.Vector3(0.6, 0.5, 0.8), depthInfluence: 0.7 },
  )
  addObject(
    new THREE.SphereGeometry(0.19, 32, 32),
    materials.berry,
    new THREE.Vector3(2.5, 1.6, 1.1),
    { speed: 0.96, scale: 1, orbitRadius: new THREE.Vector3(0.5, 0.5, 0.6), depthInfluence: 0.75 },
  )

  // Translucent geometric forms
  addObject(
    new THREE.BoxGeometry(0.9, 0.9, 0.9),
    materials.glass,
    new THREE.Vector3(0.8, -1.9, 0.2),
    { speed: 0.42, orbitRadius: new THREE.Vector3(0.7, 0.6, 0.5), scale: 1, autoRotate: new THREE.Vector3(0.006, 0.008, 0.005), depthInfluence: 0.5 },
  )

  addObject(
    new THREE.TetrahedronGeometry(0.72, 0),
    materials.glass,
    new THREE.Vector3(-3.1, 0.4, -0.3),
    { speed: 0.48, orbitRadius: new THREE.Vector3(0.6, 0.7, 0.5), scale: 1, autoRotate: new THREE.Vector3(0.008, 0.005, 0.009), depthInfluence: 0.55 },
  )

  // Leaf shape
  const leafCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.15, 0.35, 0),
    new THREE.Vector3(0.08, 0.75, 0),
    new THREE.Vector3(0, 1.0, 0),
  ])
  addObject(
    new THREE.TubeGeometry(leafCurve, 24, 0.08, 12, false),
    materials.leaf,
    new THREE.Vector3(2.1, 2.0, 0.5),
    { speed: 0.58, scale: 1, orbitRadius: new THREE.Vector3(0.7, 0.6, 0.6), depthInfluence: 0.7 },
  )

  // Central sculptural knot
  addObject(
    new THREE.TorusKnotGeometry(0.62, 0.16, 160, 28, 2, 5),
    materials.sculptGold,
    new THREE.Vector3(0, 0.4, -0.4),
    { speed: 0.3, orbitRadius: new THREE.Vector3(0.3, 0.35, 0.25), scale: 1, autoRotate: new THREE.Vector3(0.004, 0.006, 0.003), depthInfluence: 0.2 },
  )

  // Particle field — suspended dust/motes
  const particleCount = reducedMotion ? 160 : 340
  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  const particleSizes = new Float32Array(particleCount)
  for (let i = 0; i < particleCount; i++) {
    const radius = 2 + Math.random() * 6
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7
    particlePositions[i * 3 + 2] = radius * Math.cos(phi)
    particleSizes[i] = 0.025 + Math.random() * 0.055
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xf5d7a8,
    size: 0.05,
    transparent: true,
    opacity: reducedMotion ? 0.5 : 0.82,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)

  // Larger glowing particles (specs of light)
  const glowCount = reducedMotion ? 22 : 44
  const glowGeometry = new THREE.BufferGeometry()
  const glowPositions = new Float32Array(glowCount * 3)
  for (let i = 0; i < glowCount; i++) {
    glowPositions[i * 3] = (Math.random() - 0.5) * 10
    glowPositions[i * 3 + 1] = (Math.random() - 0.5) * 7
    glowPositions[i * 3 + 2] = (Math.random() - 0.5) * 6
  }
  glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3))
  const glowMaterial = new THREE.PointsMaterial({
    color: 0xffd89c,
    size: 0.13,
    transparent: true,
    opacity: reducedMotion ? 0.4 : 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const glowParticles = new THREE.Points(glowGeometry, glowMaterial)
  scene.add(glowParticles)

  // Pointer parallax
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
  let hovered = false
  const heroVisual = document.querySelector('.hero__visual')
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

  const resizeScene = () => {
    const { clientWidth, clientHeight } = heroCanvas
    const needResize = heroCanvas.width !== clientWidth || heroCanvas.height !== clientHeight
    if (!needResize) return
    renderer.setSize(clientWidth, clientHeight, false)
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
  }

  // Time-based motion orchestration
  const startTime = performance.now()
  let scrollProgress = 0

  const render = () => {
    const elapsed = (performance.now() - startTime) * 0.001

    pointer.x += (pointer.targetX - pointer.x) * (hovered ? 0.065 : 0.035)
    pointer.y += (pointer.targetY - pointer.y) * (hovered ? 0.065 : 0.035)

    // Hero group gentle rotation + parallax
    heroGroup.rotation.y += reducedMotion ? 0.0008 : 0.0022
    heroGroup.rotation.x = THREE.MathUtils.lerp(heroGroup.rotation.x, pointer.y * 0.3 - scrollProgress * 0.45, 0.05)
    heroGroup.rotation.z = THREE.MathUtils.lerp(heroGroup.rotation.z, pointer.x * 0.22, 0.045)
    heroGroup.position.x = THREE.MathUtils.lerp(heroGroup.position.x, pointer.x * 0.7 + scrollProgress * 1.4, 0.04)
    heroGroup.position.y = THREE.MathUtils.lerp(heroGroup.position.y, pointer.y * 0.55 - scrollProgress * 0.9, 0.04)
    heroGroup.position.z = THREE.MathUtils.lerp(heroGroup.position.z, -scrollProgress * 1.6, 0.045)

    // Per-object orbital motion
    floatingObjects.forEach((obj, index) => {
      const t = elapsed * obj.speed + obj.offset
      const bp = obj.basePosition
      const r = obj.orbitRadius
      obj.mesh.position.x = bp.x + Math.sin(t + index * 0.7) * r.x
      obj.mesh.position.y = bp.y + Math.cos(t * 1.15 + index * 0.5) * r.y
      obj.mesh.position.z = bp.z + Math.sin(t * 1.4 + index * 0.9) * r.z + scrollProgress * 1.5 * obj.depthInfluence

      obj.mesh.rotation.x += obj.autoRotate.x
      obj.mesh.rotation.y += obj.autoRotate.y
      obj.mesh.rotation.z += obj.autoRotate.z

      // Breathing scale
      const breathe = 1 + Math.sin(t * 1.2) * 0.015
      obj.mesh.scale.multiplyScalar(breathe / obj.mesh.scale.x || 1)
    })

    // Particle motion
    particles.rotation.y += reducedMotion ? 0.0005 : 0.0014
    particles.rotation.x = THREE.MathUtils.lerp(particles.rotation.x, pointer.y * 0.15, 0.04)
    particles.rotation.z = THREE.MathUtils.lerp(particles.rotation.z, pointer.x * 0.1, 0.04)

    glowParticles.rotation.y -= reducedMotion ? 0.0003 : 0.0009
    glowParticles.rotation.x = THREE.MathUtils.lerp(glowParticles.rotation.x, -pointer.y * 0.12, 0.035)

    // Subtle light pulsing
    if (!reducedMotion) {
      rimLight.intensity = 14 + Math.sin(elapsed * 0.9) * 2.2
      fillLight.intensity = 6 + Math.cos(elapsed * 1.1) * 1.6
      topLight.intensity = 5 + Math.sin(elapsed * 0.7) * 1.2
    }

    // Camera + pointer
    const baseCamX = pointer.x * 1.1
    const baseCamY = -pointer.y * 0.7
    camera.position.x += (baseCamX - camera.position.x + scrollProgress * 1.8) * 0.045
    camera.position.y += (baseCamY - camera.position.y - scrollProgress * 0.7) * 0.045
    camera.position.z = 9.5 - scrollProgress * 2.2
    camera.lookAt(
      pointer.x * 0.3 + scrollProgress * 0.5,
      -pointer.y * 0.2,
      0 - scrollProgress * 0.6,
    )

    resizeScene()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  render()

  // GSAP scroll-linked camera + scene progress
  gsap.to(camera.position, {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: (self) => {
        scrollProgress = (self as any).progress as number
      },
    },
    ease: 'none',
  })

  // Theatre.js — art-directed hero sequence
  try {
    if (window.location.hostname === 'localhost') {
      studio.initialize()
    }
    const project = getProject('Cafe-Atelier-Experience')
    const heroSheet = project.sheet('HeroCinematic', { version: 1 })

    const camObj = heroSheet.object('SceneCamera', {
      position: types.compound({
        x: types.number(0, { range: [-4, 4] }),
        y: types.number(0, { range: [-3, 3] }),
        z: types.number(9.5, { range: [4, 14] }),
      }),
    })

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

    heroSheet.sequence.play({ iterationCount: Infinity, range: [0, 18], rate: 1 })

    gsap.ticker.add(() => {
      const cp = camObj.value.position
      const sp = sceneObj.value
      const lp = lightsObj.value

      heroGroup.scale.setScalar(THREE.MathUtils.lerp(heroGroup.scale.x, sp.scale, 0.06))
      rimLight.intensity += (lp.rimIntensity - rimLight.intensity) * 0.05
      keyLight.intensity += (lp.keyIntensity - keyLight.intensity) * 0.05
    })
  } catch (err) {
    // Theatre optional
  }
}

initializeHeroScene()

// ==================== DECORATIVE ANIME.JS SEQUENCES ====================
const initDecorativeAnimations = () => {
  if (reducedMotion) return

  // Animated eyebrow dots
  animeAnimate('.eyebrow__dot', {
    scale: [1, 1.6, 1],
    opacity: [0.85, 1, 0.85],
    duration: 2200,
    loop: true,
    delay: animeAnimate.stagger(400),
    easing: 'easeInOutSine',
  })

  // Floating cards in hero
  animeAnimate('.floating-card--a', {
    translateY: [0, -10, 0],
    rotate: [-2, 1, -2],
    duration: 6200,
    loop: true,
    easing: 'easeInOutSine',
  })
  animeAnimate('.floating-card--b', {
    translateY: [0, 12, 0],
    rotate: [1.5, -1, 1.5],
    duration: 7400,
    loop: true,
    easing: 'easeInOutSine',
    delay: 1200,
  })

  // Scroll indicator motion (refined)
  animeAnimate('.scroll-indicator__line', {
    scaleY: [0.3, 1, 0.3],
    opacity: [0.2, 0.95, 0.2],
    duration: 2400,
    loop: true,
    easing: 'easeInOutQuad',
  })
}
initDecorativeAnimations()

// ==================== MOTION MAGNETIC BUTTONS ====================
const initMagneticButtons = () => {
  const magnets = document.querySelectorAll<HTMLElement>('.magnetic-btn')
  magnets.forEach((el) => {
    const strength = parseFloat(el.dataset.strength || '0.18')
    const bounds = () => el.getBoundingClientRect()
    const reset = () => {
      if (!reducedMotion) {
        motionAnimate(
          el,
          { x: 0, y: 0, scale: 1 },
          { duration: 0.5, ease: 'easeOut' },
        )
      }
    }

    el.addEventListener('pointermove', (ev) => {
      if (reducedMotion) return
      const e = ev as PointerEvent
      const b = bounds()
      const cx = b.left + b.width / 2
      const cy = b.top + b.height / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength
      motionAnimate(
        el,
        { x: dx, y: dy, scale: 1.03 },
        { duration: 0.28, ease: 'easeOut' },
      )
    })
    el.addEventListener('pointerleave', reset)
    el.addEventListener('pointerdown', () => {
      if (reducedMotion) return
      motionAnimate(el, { scale: 0.97 }, { duration: 0.16, ease: 'easeIn' })
    })
    el.addEventListener('pointerup', reset)
  })
}
initMagneticButtons()

// ==================== 3D TILT EFFECTS (images/cards) ====================
function initTiltEffects(selector: string) {
  if (reducedMotion) return
  const els = document.querySelectorAll<HTMLElement>(selector)
  els.forEach((el) => {
    const max = 9
    const shine = el.querySelector<HTMLElement>(
      '.menu-item__image-shine, .feature__image-shine, .gallery__frame',
    )

    let currentRx = 0
    let currentRy = 0

    const update = () => {
      motionAnimate(
        el,
        {
          rotateX: currentRx,
          rotateY: currentRy,
          transformPerspective: 900,
        },
        { duration: 0.42, ease: 'easeOut' },
      )
    }

    el.addEventListener('pointermove', (ev) => {
      const e = ev as PointerEvent
      const b = el.getBoundingClientRect()
      const px = (e.clientX - b.left) / b.width - 0.5
      const py = (e.clientY - b.top) / b.height - 0.5
      currentRy = px * max
      currentRx = -py * max
      update()

      if (shine) {
        shine.style.setProperty('--mx', `${(e.clientX - b.left) / b.width * 100}%`)
        shine.style.setProperty('--my', `${(e.clientY - b.top) / b.height * 100}%`)
      }
    })

    el.addEventListener('pointerleave', () => {
      currentRx = 0
      currentRy = 0
      update()
    })
  })
}
initTiltEffects('.tilt-3d, .story__media, .feature, .gallery__item')

// ==================== GSAP SCROLL CINEMATIC SCENES ====================
const initScrollStorytelling = () => {
  if (reducedMotion) {
    document.querySelectorAll('.reveal').forEach((r) => r.classList.add('is-visible'))
    return
  }

  // Scroll-linked hero parallax layers
  gsap.to('.hero__layer--far', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    yPercent: 18,
    scale: 1.08,
    ease: 'none',
  })
  gsap.to('.hero__layer--mid', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    yPercent: 11,
    scale: 1.05,
    ease: 'none',
  })
  gsap.to('.hero__layer--near', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    yPercent: 6,
    scale: 1.03,
    ease: 'none',
  })

  gsap.to('.hero__copy', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.4 },
    y: 60,
    opacity: 0.2,
    filter: 'blur(6px)',
    ease: 'none',
  })

  gsap.to('.floating-card--a', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    x: -120,
    y: -200,
    rotate: -12,
    opacity: 0,
    scale: 0.7,
    ease: 'none',
  })
  gsap.to('.floating-card--b', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    x: 140,
    y: -180,
    rotate: 10,
    opacity: 0,
    scale: 0.7,
    ease: 'none',
  })

  // Scene B — Story photographic parallax & reveal
  const storyTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.story',
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1,
    },
  })
  storyTl
    .from('.story__media--main', {
      y: 120,
      rotateX: 14,
      rotateY: -8,
      opacity: 0,
      scale: 0.9,
      filter: 'blur(14px)',
    }, 0)
    .from('.story__media--secondary', {
      y: 80,
      x: 60,
      rotate: 6,
      opacity: 0,
      scale: 0.88,
      filter: 'blur(12px)',
    }, 0.08)
    .from('.story__copy > *', {
      y: 50,
      opacity: 0,
      filter: 'blur(8px)',
      stagger: 0.06,
    }, 0.04)
    .from('.story__stat', {
      y: 40,
      opacity: 0,
      scale: 0.9,
      stagger: 0.08,
    }, 0.2)
    .to('.story__decor--1', {
      rotate: 180,
      x: 60,
      scale: 1.2,
    }, 0)
    .to('.story__decor--2', {
      rotate: -160,
      x: -40,
      scale: 1.15,
    }, 0)

  // Story badge assembly
  gsap.from('.story__badge', {
    scrollTrigger: { trigger: '.story__media--main', start: 'top 70%' },
    y: 40,
    opacity: 0,
    scale: 0.78,
    rotate: -5,
    duration: 0.9,
    ease: 'back.out(1.4)',
  })

  // Scene C — Menu transformation with depth assembly
  gsap.from('.menu__heading', {
    scrollTrigger: { trigger: '.menu', start: 'top 80%' },
    y: 60,
    opacity: 0,
    filter: 'blur(10px)',
    duration: 0.9,
    ease: 'power3.out',
  })

  gsap.from('.menu__filters .filter-button', {
    scrollTrigger: { trigger: '.menu', start: 'top 70%' },
    y: 30,
    opacity: 0,
    stagger: 0.08,
    duration: 0.6,
    ease: 'power3.out',
  })

  // Menu items staggered entrance with 3D assembly
  inView('.menu', () => {
    animeAnimate('.menu-item', {
      opacity: [0, 1],
      translateY: [60, 0],
      translateX: [(_, i) => ((i % 3) - 1) * 40, 0],
      rotateX: [16, 0],
      rotateY: [(_, i) => ((i % 3) - 1) * 8, 0],
      scale: [0.9, 1],
      filter: ['blur(14px)', 'blur(0px)'],
      delay: animeAnimate.stagger(110),
      duration: 900,
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    })
  })

  // Scene D — Signature showcase
  const sigTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.signature',
      start: 'top 82%',
      end: 'bottom 18%',
      scrub: 0.8,
    },
  })
  sigTl
    .from('.signature__heading h2', {
      x: -60,
      opacity: 0,
      filter: 'blur(8px)',
    }, 0)
    .from('.feature', {
      y: 140,
      rotateX: 18,
      scale: 0.92,
      opacity: 0,
      filter: 'blur(16px)',
    }, 0.06)
    .from('.mini-feature', {
      y: 80,
      x: 60,
      rotate: 6,
      opacity: 0,
      filter: 'blur(12px)',
      stagger: 0.1,
    }, 0.12)

  // Scene E — Gallery editorial assembly
  const galleryTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.gallery',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 0.8,
    },
  })
  galleryTl
    .from('.gallery__heading', {
      y: 50,
      opacity: 0,
      filter: 'blur(10px)',
    }, 0)
    .from('.gallery__item--tall', {
      y: 120,
      x: -80,
      rotate: -6,
      opacity: 0,
      scale: 0.88,
      filter: 'blur(16px)',
    }, 0.04)
    .from('.gallery__item--wide', {
      y: 90,
      x: 80,
      rotate: 4,
      opacity: 0,
      scale: 0.9,
      filter: 'blur(14px)',
    }, 0.08)
    .from('.gallery__item:not(.gallery__item--tall):not(.gallery__item--wide):not(.gallery__item--large)', {
      y: 70,
      opacity: 0,
      scale: 0.92,
      filter: 'blur(12px)',
      stagger: 0.08,
    }, 0.14)
    .from('.gallery__item--large', {
      y: 110,
      scale: 0.88,
      opacity: 0,
      filter: 'blur(16px)',
    }, 0.22)

  // Scene E2 — Contact final composition
  const contactTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.contact',
      start: 'top 78%',
      end: 'bottom 22%',
      scrub: 0.8,
    },
  })
  contactTl
    .from('.contact__visual', {
      y: 130,
      x: -60,
      rotate: -3,
      opacity: 0,
      scale: 0.9,
      filter: 'blur(16px)',
    }, 0)
    .from('.contact__info h2, .contact__info p, .contact__details li', {
      y: 50,
      opacity: 0,
      filter: 'blur(10px)',
      stagger: 0.08,
    }, 0.1)
    .from('.reservation', {
      y: 150,
      x: 60,
      rotate: 3,
      opacity: 0,
      scale: 0.9,
      filter: 'blur(18px)',
    }, 0.08)
    .from('.reservation__header, .reservation label, .reservation button', {
      y: 30,
      opacity: 0,
      stagger: 0.06,
    }, 0.24)
    .to('.contact__decor-1', {
      rotate: 220,
      scale: 1.1,
      y: -30,
    }, 0)
    .to('.contact__decor-2', {
      rotate: -200,
      scale: 1.15,
      y: 40,
    }, 0)

  // Story list icons — decorative pulse
  inView('.story__copy', () => {
    animeAnimate('.story__list-icon', {
      scale: [0, 1],
      opacity: [0, 1],
      rotate: [-180, 0],
      delay: animeAnimate.stagger(120),
      duration: 800,
      easing: 'easeOutElastic(1, .7)',
    })
  })

  // Stat numbers counter-like reveal
  inView('.story__stats', () => {
    document.querySelectorAll<HTMLElement>('.stat-number').forEach((stat) => {
      const text = stat.textContent || ''
      const isPct = text.includes('%')
      const numeric = parseInt(text.replace(/\D/g, ''), 10) || 0
      const suffix = isPct ? '%' : text.includes('+') ? '+' : ''
      if (!numeric) return
      const obj = { v: 0 }
      gsap.to(obj, {
        v: numeric,
        duration: 1.5,
        ease: 'power3.out',
        onUpdate: () => {
          stat.textContent = `${Math.round(obj.v)}${suffix}`
        },
      })
    })
  })

  // Continuous button glow pulse
  motionAnimate(
    '.button--primary',
    {
      boxShadow: [
        '0 16px 30px rgba(132, 75, 38, 0.28), 0 0 0 rgba(212, 164, 110, 0)',
        '0 22px 46px rgba(132, 75, 38, 0.5), 0 0 26px rgba(212, 164, 110, 0.22)',
        '0 16px 30px rgba(132, 75, 38, 0.28), 0 0 0 rgba(212, 164, 110, 0)',
      ],
    },
    { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
  )

  // Underline sweep on menu-item hover
  document.querySelectorAll<HTMLElement>('.menu-item').forEach((item) => {
    const line = item.querySelector<HTMLElement>('.menu-item__underline')
    if (!line) return
    item.addEventListener('pointerenter', () => {
      motionAnimate(line, { scaleX: [0, 1], transformOrigin: 'left' }, { duration: 0.5, ease: 'easeOut' })
    })
    item.addEventListener('pointerleave', () => {
      motionAnimate(line, { scaleX: [1, 0], transformOrigin: 'right' }, { duration: 0.35, ease: 'easeIn' })
    })
  })
}
initScrollStorytelling()

// ==================== RESERVATION FORM ====================
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
        if (!reducedMotion) {
          animeAnimate('.reservation', {
            translateX: [0, -8, 8, -5, 5, 0],
            duration: 420,
            easing: 'easeInOutSine',
          })
        }
      }
      return
    }

    if (successMessage) {
      successMessage.textContent = `Thanks, ${name}. Your reservation request for ${guestCount} on ${date} has been noted.`
      successMessage.classList.remove('is-error')
      if (!reducedMotion) {
        motionAnimate(successMessage, { opacity: [0, 1], y: [10, 0] }, { duration: 0.5, ease: 'easeOut' })
      }
    }

    reservationForm.reset()
  })
}

// ==================== GALLERY IMAGE VIEWER (lightweight keyboard-accessible) ====================
const initGalleryViewer = () => {
  const items = document.querySelectorAll<HTMLElement>('.gallery__item img')
  if (!items.length) return
  const viewer = document.createElement('div')
  viewer.className = 'gallery-viewer'
  viewer.setAttribute('role', 'dialog')
  viewer.setAttribute('aria-modal', 'true')
  viewer.setAttribute('tabindex', '-1')
  viewer.hidden = true
  viewer.innerHTML = `
    <div class="gallery-viewer__backdrop" data-close></div>
    <figure class="gallery-viewer__figure glass-panel">
      <button class="gallery-viewer__btn gallery-viewer__btn--prev" aria-label="Previous image">‹</button>
      <img class="gallery-viewer__img" src="" alt="" />
      <button class="gallery-viewer__btn gallery-viewer__btn--next" aria-label="Next image">›</button>
      <button class="gallery-viewer__btn gallery-viewer__btn--close" data-close aria-label="Close viewer">×</button>
      <figcaption class="gallery-viewer__caption"></figcaption>
    </figure>
  `
  document.body.appendChild(viewer)

  const img = viewer.querySelector<HTMLImageElement>('.gallery-viewer__img')!
  const caption = viewer.querySelector<HTMLElement>('.gallery-viewer__caption')!
  const imgs = Array.from(items)
  let index = 0
  const originalOverflow = document.body.style.overflow

  const show = (i: number) => {
    index = (i + imgs.length) % imgs.length
    const current = imgs[index]
    img.src = current.src
    img.alt = current.alt
    caption.textContent = current.alt
    viewer.hidden = false
    document.body.style.overflow = 'hidden'
    if (!reducedMotion) {
      gsap.fromTo(
        viewer,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' },
      )
      gsap.fromTo(
        img,
        { scale: 0.9, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' },
      )
    }
    viewer.focus()
  }

  const hide = () => {
    const hideNow = () => {
      viewer.hidden = true
      document.body.style.overflow = originalOverflow
      imgs[index].closest('.gallery__item')?.scrollIntoView({ block: 'nearest' })
    }
    if (!reducedMotion) {
      gsap.to(viewer, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: hideNow,
      })
    } else {
      hideNow()
    }
  }

  items.forEach((el, i) => {
    el.style.cursor = 'zoom-in'
    el.addEventListener('click', () => show(i))
  })
  viewer.addEventListener('click', (e) => {
    const t = e.target as HTMLElement
    if (t.hasAttribute('data-close')) hide()
    if (t.classList.contains('gallery-viewer__btn--prev')) show(index - 1)
    if (t.classList.contains('gallery-viewer__btn--next')) show(index + 1)
    if (t.classList.contains('gallery-viewer__btn--close')) hide()
  })
  document.addEventListener('keydown', (e) => {
    if (viewer.hidden) return
    if (e.key === 'Escape') hide()
    if (e.key === 'ArrowLeft') show(index - 1)
    if (e.key === 'ArrowRight') show(index + 1)
  })
}
initGalleryViewer()

// ==================== GLOBAL SPRING NAV ====================
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href')
    if (!id || id === '#') return
    const target = document.querySelector<HTMLElement>(id)
    if (!target) return
    e.preventDefault()
    lenis.scrollTo(target, { offset: -60, duration: 1.3 })
  })
})

// Cleanup Three/WebGL on pagehide (memory)
window.addEventListener('pagehide', () => {
  try {
    const canvases = document.querySelectorAll('canvas')
    canvases.forEach((c) => {
      const ctx = c.getContext('webgl2') || c.getContext('webgl')
      ctx?.getExtension('WEBGL_lose_context')?.loseContext()
    })
  } catch {
    // ignore
  }
})
