import { gsap } from 'gsap'
import { animate as motionAnimate } from 'motion'
import { finePointer, reducedMotion } from './env'

/* ------------------------------------------------------------------ */
/* Magnetic buttons + 3D tilt (re-bindable for re-rendered menu cards)  */
/* ------------------------------------------------------------------ */

const bindMagnetic = (el: HTMLElement): void => {
  const strength = parseFloat(el.dataset.strength ?? '0.15')
  el.addEventListener('pointermove', (event) => {
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left - rect.width / 2) * strength * 2
    const y = (event.clientY - rect.top - rect.height / 2) * strength * 2
    motionAnimate(el, { x, y }, { type: 'spring', stiffness: 320, damping: 22, mass: 0.6 })
  })
  el.addEventListener('pointerleave', () => {
    motionAnimate(el, { x: 0, y: 0 }, { type: 'spring', stiffness: 200, damping: 16 })
  })
}

const bindTilt = (el: HTMLElement): void => {
  gsap.set(el, { transformPerspective: 950, transformOrigin: 'center' })
  const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.55, ease: 'power3.out' })
  const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.55, ease: 'power3.out' })

  el.addEventListener('pointermove', (event) => {
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotY((px - 0.5) * 9)
    rotX((0.5 - py) * 7)
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
  })

  el.addEventListener('pointerleave', () => {
    rotX(0)
    rotY(0)
  })
}

/** Binds magnetic + tilt behaviour to any not-yet-bound elements in scope. */
export const bindInteractive = (scope: ParentNode = document): void => {
  if (!finePointer() || reducedMotion()) return

  scope.querySelectorAll<HTMLElement>('.magnetic-btn:not([data-bound])').forEach((el) => {
    el.dataset.bound = 'true'
    bindMagnetic(el)
  })

  scope.querySelectorAll<HTMLElement>('[data-tilt]:not([data-tilt-bound])').forEach((el) => {
    el.dataset.tiltBound = 'true'
    bindTilt(el)
  })
}

/* ------------------------------------------------------------------ */
/* Topbar + active nav link                                            */
/* ------------------------------------------------------------------ */

const initNav = (): void => {
  const topbar = document.querySelector<HTMLElement>('.topbar')
  if (topbar) {
    const onScroll = (): void => {
      topbar.classList.toggle('is-scrolled', window.scrollY > 28)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav__link'))
  navLinks.forEach((link) => {
    const id = link.getAttribute('href')?.slice(1)
    const section = id ? document.getElementById(id) : null
    if (!section) return

    new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          navLinks.forEach((other) => other.classList.toggle('is-active', other === link))
        }
      },
      { rootMargin: '-42% 0px -52% 0px' },
    ).observe(section)
  })
}

/* ------------------------------------------------------------------ */
/* Mobile menu                                                         */
/* ------------------------------------------------------------------ */

const initMobileMenu = (): void => {
  const toggle = document.querySelector<HTMLButtonElement>('.nav__toggle')
  if (!toggle) return

  const menu = document.createElement('div')
  menu.className = 'mobile-menu'
  menu.id = 'mobile-menu'
  menu.hidden = true

  const links = Array.from(document.querySelectorAll('.nav__link'))
    .map((link) => {
      const href = link.getAttribute('href') ?? '#'
      return `<a class="mobile-menu__link" href="${href}">${link.textContent}</a>`
    })
    .join('')

  menu.innerHTML = `
    <div class="mobile-menu__panel glass-panel">
      <div class="mobile-menu__links">${links}</div>
      <a class="button button--primary mobile-menu__cta" href="#contact">Reserve a table</a>
    </div>
  `
  document.body.appendChild(menu)

  let open = false
  const setOpen = (next: boolean): void => {
    open = next
    menu.hidden = !open
    document.body.classList.toggle('menu-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')

    const panel = menu.querySelector('.mobile-menu__panel')
    const items = menu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta')

    if (open && panel && !reducedMotion()) {
      gsap.fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
      gsap.fromTo(
        panel,
        { y: 26, scale: 0.97 },
        { y: 0, scale: 1, duration: 0.42, ease: 'power3.out' },
      )
      gsap.fromTo(
        items,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.055, delay: 0.08, ease: 'power2.out' },
      )
    } else if (open && panel) {
      gsap.set(menu, { autoAlpha: 1 })
      gsap.set(items, { opacity: 1, y: 0 })
    }
  }

  toggle.addEventListener('click', () => setOpen(!open))

  menu.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (target.closest('a')) setOpen(false)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) setOpen(false)
  })
}

/* ------------------------------------------------------------------ */
/* Reservation form                                                    */
/* ------------------------------------------------------------------ */

const initReservationForm = (): void => {
  const form = document.querySelector<HTMLFormElement>('.reservation')
  if (!form) return

  const success = form.querySelector<HTMLElement>('.form-success')
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const name = (form.elements.namedItem('name') as HTMLInputElement | null)?.value.trim() ?? 'friend'
    const date = (form.elements.namedItem('date') as HTMLInputElement | null)?.value

    if (success) {
      const prettyDate = date
        ? new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })
        : 'your chosen day'
      success.textContent = `Thank you, ${name} — we've noted ${prettyDate} and will confirm by email shortly.`
    }

    if (button) {
      button.disabled = true
      const label = button.textContent
      button.textContent = 'Request sent ✓'
      window.setTimeout(() => {
        button.disabled = false
        button.textContent = label
      }, 4600)
    }

    if (success && !reducedMotion()) {
      gsap.fromTo(
        success,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      )
    }
  })
}

/* ------------------------------------------------------------------ */
/* Gallery lightbox                                                    */
/* ------------------------------------------------------------------ */

const initGalleryViewer = (): void => {
  const items = Array.from(document.querySelectorAll<HTMLElement>('.gallery__item'))
  if (!items.length) return

  const box = document.createElement('div')
  box.className = 'lightbox'
  box.hidden = true
  box.innerHTML = `
    <div class="lightbox__backdrop" data-close></div>
    <figure class="lightbox__figure glass-panel">
      <img alt="" decoding="async" />
      <figcaption></figcaption>
    </figure>
    <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous photo">‹</button>
    <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next photo">›</button>
    <button class="lightbox__close" type="button" aria-label="Close gallery">×</button>
  `
  document.body.appendChild(box)

  const img = box.querySelector('img') as HTMLImageElement
  const caption = box.querySelector('figcaption') as HTMLElement
  const figure = box.querySelector('.lightbox__figure') as HTMLElement

  let index = 0
  let lastFocused: HTMLElement | null = null

  const render = (): void => {
    const source = items[index]?.querySelector('img')
    if (!source) return
    img.src = source.currentSrc || source.src
    img.alt = source.alt
    caption.textContent = source.alt

    if (!reducedMotion()) {
      gsap.fromTo(
        figure,
        { opacity: 0, scale: 0.965, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.42, ease: 'power3.out' },
      )
    }
  }

  const open = (item: HTMLElement): void => {
    index = Math.max(0, items.indexOf(item))
    lastFocused = document.activeElement as HTMLElement | null
    box.hidden = false
    document.body.classList.add('lightbox-open')
    render()
    if (!reducedMotion()) {
      gsap.fromTo(box, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28, ease: 'power2.out' })
    }
    ;(box.querySelector('.lightbox__close') as HTMLElement).focus()
  }

  const close = (): void => {
    if (reducedMotion()) {
      box.hidden = true
      document.body.classList.remove('lightbox-open')
      lastFocused?.focus?.()
      return
    }
    gsap.to(box, {
      autoAlpha: 0,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        box.hidden = true
        document.body.classList.remove('lightbox-open')
        lastFocused?.focus?.()
      },
    })
  }

  const step = (delta: number): void => {
    index = (index + delta + items.length) % items.length
    render()
  }

  items.forEach((item) => {
    item.setAttribute('tabindex', '0')
    item.setAttribute('role', 'button')
    item.setAttribute('aria-label', `Open photo: ${item.querySelector('img')?.alt ?? ''}`)
    item.addEventListener('click', () => open(item))
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        open(item)
      }
    })
  })

  box.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('[data-close]')) close()
  })

  box.querySelector('.lightbox__close')?.addEventListener('click', close)
  box.querySelector('.lightbox__nav--prev')?.addEventListener('click', () => step(-1))
  box.querySelector('.lightbox__nav--next')?.addEventListener('click', () => step(1))

  document.addEventListener('keydown', (event) => {
    if (box.hidden) return
    if (event.key === 'Escape') close()
    if (event.key === 'ArrowLeft') step(-1)
    if (event.key === 'ArrowRight') step(1)
  })
}

/* ------------------------------------------------------------------ */
/* Entry                                                               */
/* ------------------------------------------------------------------ */

export const initUi = (): void => {
  const year = document.getElementById('year')
  if (year) year.textContent = String(new Date().getFullYear())

  bindInteractive()
  initNav()
  initMobileMenu()
  initReservationForm()
  initGalleryViewer()

  // Menu cards are re-rendered on category switches — re-bind their effects.
  document.addEventListener('menu:rendered', () => {
    const grid = document.querySelector('.menu__grid')
    if (grid) bindInteractive(grid)
  })
}
