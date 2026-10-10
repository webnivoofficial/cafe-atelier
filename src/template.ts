import { CINEMA_PHOTOS } from './data'

const cinemaLayers = CINEMA_PHOTOS.map(
  (url, index) =>
    `<div class="cinema-bg__layer${index === 0 ? ' is-active' : ''}" data-layer="${index}"><div class="cinema-bg__img" style="background-image:url('${url}')"></div></div>`,
).join('')

export const appTemplate = `
  <div class="preloader" aria-hidden="true">
    <div class="preloader__inner">
      <div class="preloader__icon"></div>
      <span class="preloader__word">Café&nbsp;Atelier</span>
      <span class="preloader__note">Warming the lamps…</span>
    </div>
    <div class="preloader__veil"></div>
  </div>

  <div class="cinema-bg" aria-hidden="true">
    ${cinemaLayers}
    <div class="cinema-bg__tint"></div>
    <div class="cinema-bg__grain"></div>
  </div>

  <div class="bean-field" aria-hidden="true"></div>
  <div class="ambient-dust" aria-hidden="true"></div>
  <div class="vignette" aria-hidden="true"></div>

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

        <a href="#contact" class="button button--primary nav__cta magnetic-btn" data-strength="0.18">Reserve</a>
        <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
          <span class="nav__toggle-bar"></span>
          <span class="nav__toggle-bar"></span>
          <span class="nav__toggle-bar"></span>
        </button>
      </nav>
    </header>

    <main>
      <section class="hero reveal" id="home">
        <div class="hero__light hero__light--a" aria-hidden="true"></div>
        <div class="hero__light hero__light--b" aria-hidden="true"></div>
        <div class="hero__overlay" aria-hidden="true"></div>
        <div class="hero__grain" aria-hidden="true"></div>

        <div class="hero__content">
          <div class="hero__copy glass-panel glass-sheen">
            <p class="eyebrow"><span class="eyebrow__dot"></span><span data-shuffle="eyebrow">Slow mornings. Rich rituals.</span></p>
            <h1 class="hero__title">
              <span class="hero__title-line hero__title-line--1"><span class="hero__title-inner">Crafted</span></span>
              <span class="hero__title-line hero__title-line--2"><span class="hero__title-inner">comfort in every cup.</span></span>
            </h1>
            <p class="lead" data-shuffle="lead">
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
          <div class="hero-scene-shell glass-panel glass-sheen">
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
            <strong>Almond &amp; Honey</strong>
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
                decoding="async"
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
                loading="lazy"
                decoding="async"
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
            <p class="menu__intro" data-shuffle="menuIntro">
              Every cup is built to order — browse the counter, build your tray, and we will take care of the rest.
            </p>
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
                loading="lazy"
                decoding="async"
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
            <img src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80" alt="Tea service at the cafe" loading="lazy" decoding="async" />
            <div class="gallery__frame" aria-hidden="true"></div>
          </figure>
          <figure class="gallery__item gallery__item--wide tilt-3d" data-tilt>
            <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80" alt="Latte art coffee drink" loading="lazy" decoding="async" />
            <div class="gallery__frame" aria-hidden="true"></div>
          </figure>
          <figure class="gallery__item tilt-3d" data-tilt>
            <img src="https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80" alt="Coffee pouring into a ceramic cup" loading="lazy" decoding="async" />
            <div class="gallery__frame" aria-hidden="true"></div>
          </figure>
          <figure class="gallery__item gallery__item--large tilt-3d" data-tilt>
            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80" alt="Café interior with sunlight" loading="lazy" decoding="async" />
            <div class="gallery__frame" aria-hidden="true"></div>
          </figure>
          <figure class="gallery__item tilt-3d" data-tilt>
            <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80" alt="Coffee and pastry on a table" loading="lazy" decoding="async" />
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

    <footer class="site-footer reveal" id="footer">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="brand__mark">CA</span>
          <div class="footer-brand__copy">
            <span class="footer-brand__name">Café Atelier</span>
            <p class="footer-message" data-shuffle="footerMessage">Crafted with warmth, served with care.</p>
          </div>
        </div>
        <div class="footer-social" aria-label="Social links"></div>
      </div>

      <div class="footer-scene glass-panel glass-sheen">
        <div class="footer-scene__mount" id="footer-scene" role="img" aria-label="Illustrated scene of a Café Atelier barista carrying a tray with a drink, serving a guest at a table, and returning to the counter in a continuous loop"></div>
        <p class="footer-scene__caption">The Atelier floor — where every serving begins.</p>
      </div>

      <div class="footer-bottom">
        <p>© <span id="year"></span> Café Atelier • 14 Mercer Lane, New York</p>
        <nav class="footer-nav" aria-label="Footer navigation">
          <a href="#home">Home</a>
          <a href="#story">Story</a>
          <a href="#menu">Menu</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </footer>
  </div>
`
