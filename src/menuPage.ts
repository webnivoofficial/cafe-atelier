import './style.css'
import './menuPage.css'

import { MENU_CATEGORIES, menuData } from './data'
import type { MenuCategory } from './data'

/* The dedicated menu page (/menu). Rendered from the same verified data
   the homepage counter uses — no invented items or prices. Category chips
   are plain anchor links, so the page stays fully usable without JS
   filtering or animation. */

const CATEGORY_LABELS: Record<MenuCategory, { label: string; note: string }> = {
  coffee: { label: 'Coffee & Espresso', note: 'Pulled, poured, and finished with care.' },
  tea: { label: 'Tea & Infusions', note: 'Quietly fragrant leaves, steeped to the minute.' },
  pastries: { label: 'Bakery', note: 'Laminated, proofed, and baked in small batches.' },
  desserts: { label: 'Desserts', note: 'Small, seasonal, and made to linger over.' },
}

const itemRow = (name: string, description: string, badge: string, price: string, image: string): string => `
  <li class="menu-page__item">
    <img class="menu-page__item-thumb" src="${image}" alt="" loading="lazy" decoding="async" />
    <div class="menu-page__item-body">
      <div class="menu-page__item-line">
        <h3 class="menu-page__item-name">
          ${name}
          ${badge ? `<span class="menu-page__item-badge">${badge}</span>` : ''}
        </h3>
        <span class="menu-page__item-dots" aria-hidden="true"></span>
        <span class="menu-page__item-price">${price}</span>
      </div>
      <p class="menu-page__item-desc">${description}</p>
    </div>
  </li>
`

const categorySection = (category: MenuCategory): string => {
  const meta = CATEGORY_LABELS[category]
  return `
    <section class="menu-page__category" id="${category}" aria-labelledby="${category}-title">
      <header class="menu-page__category-head">
        <h2 class="menu-page__category-title" id="${category}-title">${meta.label}</h2>
        <p class="menu-page__category-note">${meta.note}</p>
      </header>
      <ul class="menu-page__items">
        ${menuData[category].map((m) => itemRow(m.name, m.description, m.badge, m.price, m.image)).join('')}
      </ul>
    </section>
  `
}

const chips = MENU_CATEGORIES.map(
  (c) => `<a class="menu-page__chip" href="#${c}">${CATEGORY_LABELS[c].label}</a>`,
).join('')

const app = document.querySelector<HTMLElement>('#menu-app')
if (app) {
  app.innerHTML = `
    <div class="menu-page">
      <div class="menu-page__bg" aria-hidden="true"></div>

      <header class="menu-page__bar glass-panel">
        <a class="brand" href="/" aria-label="Back to the Café Atelier home page">
          <span class="brand__mark">CA</span>
          <span class="brand__text">Café Atelier</span>
        </a>
        <a class="menu-page__back" href="/">← Back to the café</a>
      </header>

      <main class="menu-page__main">
        <p class="eyebrow"><span class="eyebrow__dot"></span>The menu</p>
        <h1 class="menu-page__title">Everything, made to order.</h1>
        <p class="menu-page__lead">
          A small, seasonal counter of coffee, tea, bakes, and desserts — the same list we serve
          at 14 Mercer Lane. Scan the QR code at a table to come back here any time.
        </p>

        <nav class="menu-page__chips" aria-label="Menu categories">${chips}</nav>

        ${MENU_CATEGORIES.map(categorySection).join('')}
      </main>

      <footer class="menu-page__footer">
        <p>© <span id="year"></span> Café Atelier • 14 Mercer Lane, New York</p>
        <p>Daily • 7:30 AM – 8:00 PM • (212) 555-0148</p>
      </footer>
    </div>
  `
  const year = app.querySelector<HTMLElement>('#year')
  if (year) year.textContent = String(new Date().getFullYear())
}
