import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
      image:
        'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80',
      badge: 'House favorite',
    },
    {
      name: 'Cinnamon Cloud',
      description: 'Single-origin espresso with cinnamon foam and caramel notes.',
      price: '$7',
      image:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
      badge: 'Warm spice',
    },
    {
      name: 'Honey Oat',
      description: 'Oat milk, floral honey, and a smooth espresso base.',
      price: '$6.5',
      image:
        'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80',
      badge: 'Soft texture',
    },
  ],
  tea: [
    {
      name: 'Jasmine Silk',
      description: 'A delicate floral tea with a clean, lingering finish.',
      price: '$5',
      image:
        'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80',
      badge: 'Botanical',
    },
    {
      name: 'Citrus Matcha',
      description: 'Ceremonial matcha brightened with orange peel and citrus zest.',
      price: '$7',
      image:
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
      badge: 'Bright lift',
    },
    {
      name: 'Vanilla Rooibos',
      description: 'Naturally sweet red tea with light vanilla bean and cream.',
      price: '$6',
      image:
        'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80',
      badge: 'Smooth & gentle',
    },
  ],
  pastries: [
    {
      name: 'Almond Croissant',
      description: 'Layered pastry, toasted almonds, and a honey finish.',
      price: '$5.5',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
      badge: 'Baked fresh',
    },
    {
      name: 'Maple Morning Bun',
      description: 'Sticky and soft with a buttery maple glaze.',
      price: '$6',
      image:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80',
      badge: 'Sweet & rich',
    },
    {
      name: 'Berry Scone',
      description: 'Tender crumb with roasted berries and a citrus glaze.',
      price: '$4.5',
      image:
        'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=900&q=80',
      badge: 'Fragrant fruit',
    },
  ],
  desserts: [
    {
      name: 'Cocoa Mousse',
      description: 'Silky dark chocolate mousse with a hint of espresso.',
      price: '$8',
      image:
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80',
      badge: 'Decadent',
    },
    {
      name: 'Pear Tart',
      description: 'Roasted pear with flaky pastry and warm vanilla cream.',
      price: '$8.5',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=900&q=80',
      badge: 'Seasonal',
    },
    {
      name: 'Coconut Mille-Feuille',
      description: 'Laminated pastry with coconut cream and toasted flakes.',
      price: '$9',
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

        <div class="hero__visual" aria-label="3D coffee pouring scene">
          <div class="brew-scene">
            <span class="floating-bean bean-one"></span>
            <span class="floating-bean bean-two"></span>
            <span class="floating-bean bean-three"></span>
            <span class="floating-bean bean-four"></span>

            <div class="steam steam-one"></div>
            <div class="steam steam-two"></div>
            <div class="steam steam-three"></div>

            <div class="coffee-pot">
              <div class="pot-body"></div>
              <div class="pot-lip"></div>
              <div class="pot-handle"></div>
              <div class="pot-spout"></div>
            </div>

            <div class="coffee-stream"></div>

            <div class="coffee-cup">
              <div class="cup-rim"></div>
              <div class="cup-body"></div>
              <div class="cup-handle"></div>
              <div class="cup-liquid"></div>
            </div>
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
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
              alt="Café Atelier interior with warm lighting"
            />
            <div class="story__badge glass-panel">
              <span>Since 2018</span>
              <strong>Thoughtful coffee, warm rooms</strong>
            </div>
          </div>

          <div class="story__copy">
            <p>
              At Café Atelier, every detail is designed to feel considered — from the espresso pull to the way sunlight settles across the counter.
            </p>
            <p>
              Our menu centers on balanced flavor, straightforward hospitality, and a comfortable sense of pause in a busy city.
            </p>
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
              <img
                src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80"
                alt="Signature iced coffee with cream"
              />
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
          <figure class="gallery__item gallery__item--tall">
            <img src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80" alt="Tea service at the cafe" />
          </figure>
          <figure class="gallery__item gallery__item--wide">
            <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80" alt="Latte art coffee drink" />
          </figure>
          <figure class="gallery__item">
            <img src="https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80" alt="Coffee pouring into a ceramic cup" />
          </figure>
          <figure class="gallery__item gallery__item--large">
            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80" alt="Café interior with sunlight" />
          </figure>
          <figure class="gallery__item">
            <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80" alt="Coffee and pastry on a table" />
          </figure>
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
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const currentSelection = button.getAttribute('data-category') ?? 'coffee'

    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button))
    renderMenu(currentSelection)
  })
})

renderMenu('coffee')

const revealItems = document.querySelectorAll('.reveal')
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

revealItems.forEach((item) => revealObserver.observe(item))

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

const brewScene = document.querySelector('.brew-scene') as HTMLElement | null
const coffeePot = document.querySelector('.coffee-pot') as HTMLElement | null
const coffeeCup = document.querySelector('.coffee-cup') as HTMLElement | null
const coffeeStream = document.querySelector('.coffee-stream') as HTMLElement | null
const cupLiquid = document.querySelector('.cup-liquid') as HTMLElement | null

if (brewScene && coffeePot && coffeeCup && coffeeStream && cupLiquid) {
  gsap.set('.coffee-stream', { transformOrigin: 'center top', scaleY: 0.2, opacity: 0.2 })
  gsap.set('.cup-liquid', { transformOrigin: 'center bottom', scaleY: 0.1, opacity: 0.7 })

  gsap.to('.coffee-stream', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    scaleY: 1.4,
    opacity: 1,
    ease: 'none',
  })

  gsap.to('.cup-liquid', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    scaleY: 1,
    opacity: 1,
    ease: 'none',
  })

  gsap.to('.coffee-pot', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    rotation: -22,
    x: -80,
    y: 30,
    ease: 'none',
  })

  gsap.to('.coffee-cup', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    rotation: 10,
    x: 70,
    y: -20,
    ease: 'none',
  })

  gsap.to('.brew-scene', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    y: -50,
    scale: 1.12,
    rotateX: 10,
    rotateY: -18,
    ease: 'none',
  })

  gsap.to('.floating-bean', {
    y: -24,
    rotation: 360,
    duration: 8,
    ease: 'none',
    repeat: -1,
    stagger: {
      amount: 3,
      from: 'random',
    },
  })

  gsap.to('.steam', {
    y: -25,
    opacity: 0.08,
    scale: 1.15,
    duration: 2.6,
    repeat: -1,
    yoyo: true,
    stagger: 0.5,
    ease: 'sine.inOut',
  })

  const pointerMove = (event: PointerEvent) => {
    const x = event.clientX / window.innerWidth - 0.5
    const y = event.clientY / window.innerHeight - 0.5

    gsap.to('.brew-scene', {
      x: x * 22,
      y: y * 18,
      rotateY: -12 + x * 18,
      rotateX: 10 - y * 18,
      duration: 0.6,
      ease: 'power2.out',
    })
  }

  window.addEventListener('pointermove', pointerMove)
}

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
