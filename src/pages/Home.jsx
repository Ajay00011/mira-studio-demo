import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ui/ProductCard';
import usePageTransition from '../hooks/usePageTransition';
import useScrollReveal from '../hooks/useScrollReveal';
import './Home.css';

const CATEGORIES = [
  {
    slug: 'women',
    name: 'Women',
    modifier: 'women',
    image: '/category_images/bag.jpg',
    tagline: 'Effortless tailoring & fluid silhouettes'
  },
  {
    slug: 'men',
    name: 'Men',
    modifier: 'men',
    image: '/category_images/men.jpg',
    tagline: 'Refined essentials & structured coats'
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    modifier: 'accessories',
    image: '/category_images/accessories.jpg',
    tagline: 'Sculptural brass & Italian leather'
  },
];

export default function Home() {
  const transitionClass = usePageTransition();
  const pageRef = useRef(null);
  const [nlEmail, setNlEmail] = useState('');
  const [nlSubscribed, setNlSubscribed] = useState(false);

  useScrollReveal(pageRef);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (nlEmail.trim()) {
      setNlSubscribed(true);
      setNlEmail('');
    }
  };

  return (
    <main className={`main-content ${transitionClass}`} ref={pageRef}>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="hero" aria-label="Hero">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__overlay" aria-hidden="true" />

        <div className="hero__content">
          <p className="hero__eyebrow">New Season — Autumn / Winter 2026</p>
          <h1 className="hero__title">
            Designed for <em>Everyday</em> Elegance
          </h1>
          <p className="hero__subtitle">
            Thoughtfully crafted essentials that merge timeless silhouettes with
            modern comfort. Sustainably made, effortlessly styled.
          </p>
          <div className="hero__actions">
            <Link to="/shop" className="btn btn--lg hero__btn--primary">
              Shop Collection
            </Link>
            <Link to="/about" className="btn btn--lg hero__btn--secondary">
              Our Story
            </Link>
          </div>
        </div>

        <div className="hero__scroll-indicator" aria-hidden="true">
          <span>Scroll</span>
          <span className="hero__scroll-line" />
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────── */}
      <section className="categories section" aria-labelledby="categories-heading">
        <div className="categories__header reveal">
          <p className="categories__eyebrow">Collections</p>
          <h2 className="categories__title" id="categories-heading">Shop by Category</h2>
        </div>
        <div className="categories__grid">
          {CATEGORIES.map(({ slug, name, modifier, image, tagline }) => (
            <Link
              key={slug}
              to={`/shop?category=${slug}`}
              className={`category-card category-card--${modifier} reveal`}
            >
              <div className="category-card__bg" aria-hidden="true" />
              {image && (
                <img
                  src={image}
                  alt={`${name} collection`}
                  className="category-card__image"
                  loading="lazy"
                />
              )}
              <div className="category-card__overlay" aria-hidden="true" />
              <div className="category-card__content">
                <h3 className="category-card__name">{name}</h3>
                {tagline && <p className="category-card__tagline">{tagline}</p>}
                <span className="category-card__cta">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured (placeholder — products added in Milestone 2) ─ */}
      <section className="featured section" aria-labelledby="featured-heading">
        <div className="featured__header reveal">
          <p className="featured__eyebrow">Curated Picks</p>
          <h2 className="featured__title" id="featured-heading">Featured Products</h2>
          <p className="featured__subtitle">
            Our editors' top selections for the season, designed to elevate your everyday wardrobe.
          </p>
        </div>
        <div className="featured__grid">
          {PRODUCTS.filter(p => p.isFeatured).slice(0, 4).map(product => (
            <div key={product.id} className="reveal">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="featured__cta reveal">
          <Link to="/shop" className="btn btn--primary btn--lg">
            View All Products
          </Link>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────── */}
      <section className="newsletter section" aria-labelledby="newsletter-heading">
        <div className="newsletter__inner reveal">
          <p className="newsletter__eyebrow">Newsletter</p>
          <h2 className="newsletter__title" id="newsletter-heading">
            Join the Mira Studio Community
          </h2>
          <p className="newsletter__text">
            Get early access to new arrivals, exclusive offers, and behind-the-scenes
            stories from our studio.
          </p>

          {nlSubscribed ? (
            <p style={{ color: 'var(--color-success)', fontWeight: 'var(--fw-medium)' }}>
              ✓ Thank you for subscribing! (Demo only — no emails sent.)
            </p>
          ) : (
            <form className="newsletter__form" onSubmit={handleNewsletter}>
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                className="newsletter__input"
                placeholder="Enter your email address"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                required
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="btn btn--primary btn--lg">
                Subscribe
              </button>
            </form>
          )}
          <p className="newsletter__note">
            Demo only — no real emails are sent or stored.
          </p>
        </div>
      </section>
    </main>
  );
}
