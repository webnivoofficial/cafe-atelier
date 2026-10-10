import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { animate as animeAnimate, stagger as animeStagger, cubicBezier as animeBezier } from 'animejs'
import { menuData, formatPrice } from './data'
import type { MenuItem, MenuCategory } from './data'
import { reducedMotion } from './env'
import { steamIconSvg } from './steam'

gsap.registerPlugin(MotionPathPlugin)

type CartLine = { item: MenuItem; qty: number }

const cart = new Map<string, CartLine>()
const itemIndex = new Map<string, MenuItem>()
Object.values(menuData).forEach((items) => items.forEach((entry) => itemIndex.set(entry.name, entry)))

let currentCategory: MenuCategory = 'coffee'
let transitionLock = false
const flyingItems = new Set<string>()

let grid: HTMLElement | null = null
let dockToggle: HTMLButtonElement | null = null
let dockCount: HTMLElement | null = null
let dockTotal: HTMLElement | null = null
let dockIcon: HTMLElement | null = null
let panel: HTMLElement | null = null
let panelList: HTMLElement | null = null
let panelEmpty: HTMLElement | null = null
let panelTotal: HTMLElement | null = null
let panelOrderBtn: HTMLButtonElement | null = null
let panelOpen = false

let sheet: HTMLElement | null = null
let sheetImg: HTMLImageElement | null = null
let sheetTitle: HTMLElement | null = null
let sheetDesc: HTMLElement | null = null
let sheetPrice: HTMLElement | null = null
let sheetBadge: HTMLElement | null = null
let sheetQty: HTMLElement | null = null
let sheetAddBtn: HTMLButtonElement | null = null
let sheetItem: MenuItem | null = null
let sheetQtyValue = 1
let lastFocused: HTMLElement | null = null

/* ------------------------------------------------------------------ */
/* Cart rendering                                                      */
/* ------------------------------------------------------------------ */

const totalCents = (): number =>
  Array.from(cart.values()).reduce((sum, line) => sum + line.item.cents * line.qty, 0)

const totalCount = (): number =>
  Array.from(cart.values()).reduce((sum, line) => sum + line.qty, 0)

const popNumber = (el: HTMLElement | null): void => {
  if (!el || reducedMotion()) return
  gsap.fromTo(el, { y: 9, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26, ease: 'power2.out' })
}

const updateDock = (animateBadge = false): void => {
  if (dockCount) {
    dockCount.textContent = String(totalCount())
    popNumber(dockCount)
  }
  if (dockTotal) dockTotal.textContent = formatPrice(totalCents())
  if (panelTotal) panelTotal.textContent = formatPrice(totalCents())
  if (panelEmpty) panelEmpty.hidden = cart.size > 0
  if (panelOrderBtn) panelOrderBtn.disabled = cart.size === 0

  if (animateBadge && dockToggle && !reducedMotion()) {
    gsap.fromTo(
      dockToggle,
      { scale: 1 },
      { scale: 1.08, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.inOut' },
    )
  }
}

const renderCartList = (): void => {
  if (!panelList) return
  panelList.innerHTML = ''

  cart.forEach((line) => {
    const row = document.createElement('li')
    row.className = 'cart-item'
    row.dataset.name = line.item.name
    row.innerHTML = `
      <img class="cart-item__thumb" src="${line.item.image}" alt="" loading="lazy" decoding="async" />
      <div class="cart-item__info">
        <strong>${line.item.name}</strong>
        <span>${formatPrice(line.item.cents)} each</span>
      </div>
      <div class="stepper">
        <button type="button" data-cart-step="-1" data-name="${line.item.name}" aria-label="Decrease ${line.item.name} quantity">−</button>
        <span class="stepper__value">${line.qty}</span>
        <button type="button" data-cart-step="1" data-name="${line.item.name}" aria-label="Increase ${line.item.name} quantity">+</button>
      </div>
      <strong class="cart-item__line">${formatPrice(line.item.cents * line.qty)}</strong>
      <button class="cart-item__remove" type="button" data-cart-remove="${line.item.name}" aria-label="Remove ${line.item.name}">×</button>
    `
    panelList!.appendChild(row)
  })

  updateDock()
}

/* ------------------------------------------------------------------ */
/* Fly-to-tray animation                                               */
/* ------------------------------------------------------------------ */

const flyToDock = (sourceImg: HTMLElement, onLand: () => void): void => {
  if (!dockIcon || reducedMotion()) {
    onLand()
    return
  }

  const from = sourceImg.getBoundingClientRect()
  const to = dockIcon.getBoundingClientRect()

  const ghost = document.createElement('div')
  ghost.className = 'fly-ghost'
  const imgClone = sourceImg.cloneNode(true) as HTMLElement
  imgClone.removeAttribute('loading')
  ghost.appendChild(imgClone)
  document.body.appendChild(ghost)

  gsap.set(ghost, {
    position: 'fixed',
    left: from.left,
    top: from.top,
    width: from.width,
    height: from.height,
    borderRadius: 18,
    overflow: 'hidden',
    zIndex: 130,
    pointerEvents: 'none',
  })

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)

  gsap.to(ghost, {
    duration: 0.78,
    ease: 'power2.in',
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: dx * 0.45, y: dy * 0.25 - 110 },
        { x: dx, y: dy },
      ],
      curviness: 1.4,
    },
    scale: 0.12,
    opacity: 0.4,
    onComplete: () => {
      ghost.remove()
      onLand()
    },
  })
}

const confirmAdded = (button: HTMLButtonElement | null): void => {
  if (!button) return
  const label = button.querySelector('span')
  if (!label) return
  const original = label.textContent
  label.textContent = 'Added ✓'
  button.classList.add('is-added')
  window.setTimeout(() => {
    label.textContent = original
    button.classList.remove('is-added')
  }, 950)
}

/* ------------------------------------------------------------------ */
/* Cart operations                                                     */
/* ------------------------------------------------------------------ */

const addItem = (item: MenuItem, qty: number, sourceImg: HTMLElement | null, sourceBtn: HTMLButtonElement | null): void => {
  if (flyingItems.has(item.name)) return
  flyingItems.add(item.name)

  const existing = cart.get(item.name)
  if (existing) {
    existing.qty += qty
  } else {
    cart.set(item.name, { item, qty })
  }
  renderCartList()

  const finish = (): void => {
    flyingItems.delete(item.name)
    updateDock(true)
    confirmAdded(sourceBtn)
  }

  if (sourceImg) {
    flyToDock(sourceImg, finish)
  } else {
    finish()
  }
}

const changeQty = (name: string, delta: number): void => {
  const line = cart.get(name)
  if (!line) return

  line.qty += delta
  if (line.qty <= 0) {
    cart.delete(name)
    renderCartList()
    return
  }

  if (panelList && !reducedMotion()) {
    const valueEl = panelList.querySelector<HTMLElement>(
      `.cart-item[data-name="${name}"] .stepper__value`,
    )
    if (valueEl) valueEl.textContent = String(line.qty)
    const lineEl = panelList.querySelector<HTMLElement>(`.cart-item[data-name="${name}"] .cart-item__line`)
    if (lineEl) lineEl.textContent = formatPrice(line.item.cents * line.qty)
    popNumber(valueEl)
  } else {
    renderCartList()
  }
  updateDock()
}

/* ------------------------------------------------------------------ */
/* Cart panel + dock                                                   */
/* ------------------------------------------------------------------ */

const buildCartDock = (): void => {
  const dock = document.createElement('div')
  dock.className = 'cart-dock'
  dock.innerHTML = `
    <button class="cart-dock__toggle glass-panel magnetic-btn" type="button" aria-expanded="false" aria-controls="cart-panel" data-strength="0.16" aria-label="Open your tray">
      <span class="cart-dock__icon">${steamIconSvg('cart-dock__cup')}</span>
      <span class="cart-dock__count" aria-live="polite">0</span>
      <span class="cart-dock__total">$0</span>
    </button>
  `
  document.body.appendChild(dock)

  const tray = document.createElement('aside')
  tray.className = 'cart-panel glass-panel'
  tray.id = 'cart-panel'
  tray.setAttribute('aria-label', 'Your tray')
  tray.hidden = true
  tray.innerHTML = `
    <header class="cart-panel__header">
      <h3>Your tray</h3>
      <span class="cart-panel__note">Pay at the counter — we'll call your name.</span>
    </header>
    <ul class="cart-panel__list"></ul>
    <p class="cart-panel__empty">Your tray is empty — add something delightful from the menu.</p>
    <footer class="cart-panel__footer">
      <div class="cart-panel__total"><span>Total</span><strong>$0</strong></div>
      <button class="button button--primary cart-panel__order" type="button">Place order</button>
    </footer>
  `
  document.body.appendChild(tray)

  dockToggle = dock.querySelector('button')
  dockCount = dock.querySelector('.cart-dock__count')
  dockTotal = dock.querySelector('.cart-dock__total')
  dockIcon = dock.querySelector('.cart-dock__icon')
  panel = tray
  panelList = tray.querySelector('.cart-panel__list')
  panelEmpty = tray.querySelector('.cart-panel__empty')
  panelTotal = tray.querySelector('.cart-panel__total strong')
  panelOrderBtn = tray.querySelector('.cart-panel__order')

  tray.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const stepBtn = target.closest<HTMLButtonElement>('[data-cart-step]')
    if (stepBtn) {
      changeQty(stepBtn.dataset.name ?? '', Number(stepBtn.dataset.cartStep))
      return
    }
    const removeBtn = target.closest<HTMLButtonElement>('[data-cart-remove]')
    if (removeBtn) {
      changeQty(removeBtn.dataset.cartRemove ?? '', -Infinity)
    }
  })

  dockToggle?.addEventListener('click', () => {
    panelOpen ? closePanel() : openPanel()
  })

  panelOrderBtn?.addEventListener('click', placeOrder)
}

const openPanel = (): void => {
  if (!panel || !dockToggle) return
  panelOpen = true
  panel.hidden = false
  dockToggle.setAttribute('aria-expanded', 'true')
  dockToggle.setAttribute('aria-label', 'Close your tray')
  if (!reducedMotion()) {
    gsap.fromTo(
      panel,
      { autoAlpha: 0, y: 24, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: 'power3.out' },
    )
  }
}

const closePanel = (): void => {
  if (!panel || !dockToggle) return
  panelOpen = false
  dockToggle.setAttribute('aria-expanded', 'false')
  dockToggle.setAttribute('aria-label', 'Open your tray')
  if (reducedMotion()) {
    panel.hidden = true
    return
  }
  gsap.to(panel, {
    autoAlpha: 0,
    y: 18,
    scale: 0.98,
    duration: 0.28,
    ease: 'power2.in',
    onComplete: () => {
      if (panel) panel.hidden = true
    },
  })
}

const placeOrder = (): void => {
  if (!panel || cart.size === 0) return
  const count = totalCount()
  const total = formatPrice(totalCents())
  cart.clear()
  renderCartList()

  const success = document.createElement('div')
  success.className = 'cart-success'
  success.innerHTML = `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle class="cart-success__ring" cx="32" cy="32" r="26" />
      <path class="cart-success__check" d="M20 33.5l8.5 8.5L45 25" />
    </svg>
    <h4>Order noted!</h4>
    <p>${count} item${count === 1 ? '' : 's'} • ${total}. See you at the counter shortly.</p>
  `

  const list = panel.querySelector<HTMLElement>('.cart-panel__list')
  const empty = panel.querySelector<HTMLElement>('.cart-panel__empty')
  const footer = panel.querySelector<HTMLElement>('.cart-panel__footer')
  if (list) list.style.display = 'none'
  if (empty) empty.style.display = 'none'
  if (footer) footer.style.display = 'none'
  panel.insertBefore(success, panel.querySelector('.cart-panel__footer'))

  if (!reducedMotion()) {
    gsap.fromTo(success, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' })
    gsap.fromTo(
      '.cart-success__ring',
      { strokeDasharray: 170, strokeDashoffset: 170 },
      { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' },
    )
    gsap.fromTo(
      '.cart-success__check',
      { strokeDasharray: 40, strokeDashoffset: 40 },
      { strokeDashoffset: 0, duration: 0.45, delay: 0.4, ease: 'power2.out' },
    )
  }

  window.setTimeout(() => {
    success.remove()
    if (list) list.style.display = ''
    if (empty) empty.style.display = ''
    if (footer) footer.style.display = ''
    renderCartList()
    closePanel()
  }, 3400)
}

/* ------------------------------------------------------------------ */
/* Product detail sheet                                                */
/* ------------------------------------------------------------------ */

const buildProductSheet = (): void => {
  sheet = document.createElement('div')
  sheet.className = 'product-sheet'
  sheet.hidden = true
  sheet.innerHTML = `
    <div class="product-sheet__backdrop" data-close></div>
    <article class="product-sheet__panel glass-panel glass-sheen" role="dialog" aria-modal="true" aria-labelledby="product-sheet-title">
      <button class="product-sheet__close" type="button" data-close aria-label="Close details">×</button>
      <div class="product-sheet__media">
        <img alt="" decoding="async" />
        <span class="product-sheet__badge"></span>
      </div>
      <div class="product-sheet__info">
        <h3 id="product-sheet-title"></h3>
        <p class="product-sheet__desc"></p>
        <div class="product-sheet__meta">
          <strong class="product-sheet__price"></strong>
          <span class="product-sheet__unit">each</span>
        </div>
        <div class="stepper product-sheet__stepper">
          <button type="button" data-sheet-step="-1" aria-label="Decrease quantity">−</button>
          <span class="stepper__value">1</span>
          <button type="button" data-sheet-step="1" aria-label="Increase quantity">+</button>
        </div>
        <button class="button button--primary product-sheet__add magnetic-btn" type="button" data-strength="0.16">Add to tray</button>
        <p class="product-sheet__hint">Details stay on your tray — adjust quantities any time.</p>
      </div>
    </article>
  `
  document.body.appendChild(sheet)

  sheetImg = sheet.querySelector('img')
  sheetTitle = sheet.querySelector('#product-sheet-title')
  sheetDesc = sheet.querySelector('.product-sheet__desc')
  sheetPrice = sheet.querySelector('.product-sheet__price')
  sheetBadge = sheet.querySelector('.product-sheet__badge')
  sheetQty = sheet.querySelector('.stepper__value')
  sheetAddBtn = sheet.querySelector('.product-sheet__add')

  sheet.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (target.closest('[data-close]')) {
      closeProductSheet()
      return
    }
    const stepBtn = target.closest<HTMLButtonElement>('[data-sheet-step]')
    if (stepBtn && sheetQty) {
      sheetQtyValue = Math.min(9, Math.max(1, sheetQtyValue + Number(stepBtn.dataset.sheetStep)))
      sheetQty.textContent = String(sheetQtyValue)
      popNumber(sheetQty)
      syncSheetAddLabel()
    }
  })

  sheetAddBtn?.addEventListener('click', () => {
    if (!sheetItem) return
    const media = sheet?.querySelector('.product-sheet__media img') as HTMLElement | null
    addItem(sheetItem, sheetQtyValue, media, sheetAddBtn)
    closeProductSheet()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sheet && !sheet.hidden) {
      closeProductSheet()
    }
  })
}

const syncSheetAddLabel = (): void => {
  if (!sheetAddBtn || !sheetItem) return
  sheetAddBtn.querySelector('span')?.remove()
  const label = document.createElement('span')
  label.textContent = `Add to tray — ${formatPrice(sheetItem.cents * sheetQtyValue)}`
  sheetAddBtn.textContent = ''
  sheetAddBtn.appendChild(label)
}

const openProductSheet = (item: MenuItem): void => {
  if (!sheet) return
  sheetItem = item
  sheetQtyValue = 1
  lastFocused = document.activeElement as HTMLElement | null

  if (sheetImg) {
    sheetImg.src = item.image
    sheetImg.alt = item.name
  }
  if (sheetTitle) sheetTitle.textContent = item.name
  if (sheetDesc) sheetDesc.textContent = item.description
  if (sheetPrice) sheetPrice.textContent = formatPrice(item.cents)
  if (sheetBadge) sheetBadge.textContent = item.badge
  if (sheetQty) sheetQty.textContent = '1'
  syncSheetAddLabel()

  sheet.hidden = false
  document.body.classList.add('sheet-open')
  ;(sheet.querySelector('.product-sheet__close') as HTMLElement | null)?.focus()

  if (!reducedMotion()) {
    gsap.fromTo(
      sheet,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3, ease: 'power2.out' },
    )
    gsap.fromTo(
      sheet.querySelector('.product-sheet__panel'),
      { y: 46, scale: 0.95, filter: 'blur(10px)' },
      { y: 0, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' },
    )
  }
}

const closeProductSheet = (): void => {
  if (!sheet) return
  const done = (): void => {
    if (sheet) sheet.hidden = true
    document.body.classList.remove('sheet-open')
    lastFocused?.focus?.()
  }
  if (reducedMotion()) {
    done()
    return
  }
  gsap.to(sheet, {
    autoAlpha: 0,
    duration: 0.24,
    ease: 'power2.in',
    onComplete: done,
  })
}

/* ------------------------------------------------------------------ */
/* Menu grid                                                           */
/* ------------------------------------------------------------------ */

const cardMarkup = (item: MenuItem): string => `
  <article class="menu-item glass-panel tilt-3d" data-tilt>
    <button class="menu-item__media" type="button" aria-label="View details for ${item.name}">
      <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" />
      <span class="menu-item__badge">${item.badge}</span>
      <span class="menu-item__image-shine" aria-hidden="true"></span>
    </button>
    <div class="menu-item__content">
      <div class="menu-item__meta">
        <h3>${item.name}</h3>
        <strong class="menu-item__price">${item.price}</strong>
      </div>
      <p>${item.description}</p>
      <div class="menu-item__actions">
        <span class="menu-item__underline" aria-hidden="true"></span>
        <button class="add-button magnetic-btn" type="button" data-add="${item.name}" data-strength="0.12">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
          <span>Add</span>
        </button>
      </div>
    </div>
  </article>
`

const entrance = (): void => {
  if (reducedMotion()) return
  animeAnimate('.menu-item', {
    opacity: [0, 1],
    translateY: [34, 0],
    translateX: [(index: number) => ((index % 3) - 1) * 34, 0],
    rotateX: [14, 0],
    scale: [0.93, 1],
    filter: ['blur(12px)', 'blur(0px)'],
    delay: animeStagger(85),
    duration: 760,
    easing: animeBezier(0.22, 1, 0.36, 1),
  })
}

const renderMenu = (category: MenuCategory, animateIn = true): void => {
  if (!grid) return
  currentCategory = category
  grid.innerHTML = menuData[category].map(cardMarkup).join('')
  if (animateIn) entrance()
  document.dispatchEvent(new CustomEvent('menu:rendered'))
}

const switchCategory = (category: MenuCategory): void => {
  if (category === currentCategory || transitionLock) return
  transitionLock = true

  const buttons = document.querySelectorAll<HTMLButtonElement>('.filter-button')
  buttons.forEach((btn) => btn.classList.toggle('is-active', btn.dataset.category === category))

  if (reducedMotion() || !grid) {
    renderMenu(category, false)
    transitionLock = false
    return
  }

  animeAnimate('.menu-item', {
    opacity: [1, 0],
    translateY: [0, -18],
    rotateX: [0, -8],
    scale: [1, 0.96],
    filter: ['blur(0px)', 'blur(8px)'],
    delay: animeStagger(45, { from: 'last' }),
    duration: 360,
    easing: 'inQuad',
    onComplete: () => {
      renderMenu(category)
      transitionLock = false
    },
  })
}

/* ------------------------------------------------------------------ */
/* Initialisation                                                      */
/* ------------------------------------------------------------------ */

export const initMenuOrder = (): void => {
  grid = document.querySelector('.menu__grid')
  if (!grid) return

  buildCartDock()
  buildProductSheet()
  renderMenu('coffee', false)

  document.querySelectorAll<HTMLButtonElement>('.filter-button').forEach((button) => {
    button.addEventListener('click', () => {
      switchCategory((button.dataset.category ?? 'coffee') as MenuCategory)
    })
  })

  grid.addEventListener('click', (event) => {
    const target = event.target as HTMLElement

    const addBtn = target.closest<HTMLButtonElement>('[data-add]')
    if (addBtn) {
      const item = itemIndex.get(addBtn.dataset.add ?? '')
      if (!item) return
      const img = addBtn.closest('.menu-item')?.querySelector('.menu-item__media img') as HTMLElement | null
      addItem(item, 1, img, addBtn)
      return
    }

    const mediaBtn = target.closest<HTMLButtonElement>('.menu-item__media')
    if (mediaBtn) {
      const name = mediaBtn.getAttribute('aria-label')?.replace('View details for ', '')
      const item = name ? itemIndex.get(name) : undefined
      if (item) openProductSheet(item)
    }
  })

  renderCartList()
}
