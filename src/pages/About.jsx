import { useRef } from 'react';
import { Link } from 'react-router-dom';
import usePageTransition from '../hooks/usePageTransition';
import useScrollReveal from '../hooks/useScrollReveal';
import './About.css';

export default function About() {
  const transitionClass = usePageTransition();
  const pageRef = useRef(null);

  useScrollReveal(pageRef);

  return (
    <main className={`main-content about-page ${transitionClass}`} ref={pageRef}>
      {/* ── Hero Banner ───────────────────────────────────────────── */}
      <section className="about-hero" aria-labelledby="about-heading">
        <div className="container">
          <p className="about-hero__eyebrow">Our Philosophy</p>
          <h1 className="about-hero__title" id="about-heading">
            Crafted with Care, Worn with <em>Intention</em>
          </h1>
          <p className="about-hero__subtitle">
            Founded in 2022, Mira Studio was born from a desire for quiet elegance:
            garments shaped by architectural proportion, honest materiality, and enduring craft.
          </p>
        </div>
      </section>

      <div className="container">
        {/* ── Brand Narrative ─────────────────────────────────────── */}
        <section className="about-story" aria-labelledby="story-heading">
          <div className="about-story__grid">
            <div className="about-story__visual reveal" aria-hidden="true">
              <svg viewBox="0 0 400 500" width="100%" height="100%">
                <defs>
                  <linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2c2825" />
                    <stop offset="100%" stopColor="#1a1816" />
                  </linearGradient>
                </defs>
                <rect width="400" height="500" fill="url(#aboutGrad)" />
                {/* Minimalist drape sketch */}
                <path d="M100 120 C180 80, 220 80, 300 120 L270 420 C220 440, 180 440, 130 420 Z" fill="#c4a882" opacity="0.3" />
                <path d="M130 140 C190 110, 210 110, 270 140 L250 400 C210 420, 190 420, 150 400 Z" fill="#edeae3" opacity="0.85" />
                <line x1="200" y1="130" x2="200" y2="410" stroke="#c4a882" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="200" cy="80" r="14" fill="#c4a882" opacity="0.6" />
                <text x="200" y="470" fontFamily="'Playfair Display', serif" fontSize="13" letterSpacing="4" fill="#baa28c" textAnchor="middle">
                  ATELIER MIRA &bull; MILAN
                </text>
              </svg>
            </div>

            <div className="about-story__content reveal">
              <p className="about-story__eyebrow">The Origin</p>
              <h2 className="about-story__heading" id="story-heading">
                Rejecting the Churn of Fast Fashion
              </h2>
              <p className="about-story__text">
                Mira Studio began as an intimate dialogue between textile purists and architectural pattern-makers in Milan. We noticed wardrobes overflowing with disposable novelty, while the pieces we truly reached for were those offering unwavering tactile comfort and quiet composure.
              </p>
              <p className="about-story__text">
                Every silhouette in our collection undergoes months of fit calibration. We design in singular drops rather than ephemeral seasons, allowing our garments to form the enduring backbone of your daily uniform.
              </p>
            </div>
          </div>
        </section>

        {/* ── Core Pillars ─────────────────────────────────────────── */}
        <section className="about-pillars section" aria-labelledby="pillars-heading">
          <div className="about-pillars__header reveal">
            <p className="about-pillars__eyebrow">Our Guiding Values</p>
            <h2 className="about-pillars__title" id="pillars-heading">The Three Pillars of Mira Studio</h2>
          </div>

          <div className="about-pillars__grid">
            <div className="pillar-card reveal">
              <div className="pillar-card__icon" aria-hidden="true">🏛️</div>
              <h3 className="pillar-card__title">Architectural Restraint</h3>
              <p className="pillar-card__text">
                We believe beauty resides in disciplined reduction. Clean drape, subtle welt pockets, and refined lapels that speak without shouting.
              </p>
            </div>

            <div className="pillar-card reveal">
              <div className="pillar-card__icon" aria-hidden="true">🌿</div>
              <h3 className="pillar-card__title">Traceable Natural Fibers</h3>
              <p className="pillar-card__text">
                Zero synthetic acrylics or virgin polyester. We select exclusively certified natural raw fibers: Mongolian cashmere, French flax, and organic cotton.
              </p>
            </div>

            <div className="pillar-card reveal">
              <div className="pillar-card__icon" aria-hidden="true">🤝</div>
              <h3 className="pillar-card__title">Ethical Ateliers</h3>
              <p className="pillar-card__text">
                Crafted in limited production batches by family-owned heritage workshops across Italy, Portugal, and Peru that ensure dignified living wages.
              </p>
            </div>
          </div>
        </section>

        {/* ── Materials & Sustainability ───────────────────────────── */}
        <section className="about-materials section" aria-labelledby="materials-heading">
          <div className="about-materials__header reveal">
            <p className="about-hero__eyebrow">Material Integrity</p>
            <h2 className="about-pillars__title" id="materials-heading">Sustainably Sourced Raw Materials</h2>
          </div>

          <div className="about-materials__grid">
            <div className="material-card reveal">
              <span className="material-card__origin">Inner Mongolia</span>
              <h3 className="material-card__name">Grade-A Cashmere</h3>
              <p className="material-card__desc">
                Combed humanely during spring molting. Ultra-fine 15.2-micron fibers that create lightweight thermal balance without pilling.
              </p>
            </div>

            <div className="material-card reveal">
              <span className="material-card__origin">Normandy, France</span>
              <h3 className="material-card__name">European Flax Linen</h3>
              <p className="material-card__desc">
                Cultivated using zero irrigation and minimal fertilizers. Naturally breathable, hypoallergenic, and softened with non-toxic stone enzymes.
              </p>
            </div>

            <div className="material-card reveal">
              <span className="material-card__origin">Victoria, Australia</span>
              <h3 className="material-card__name">Merino Extra-Fine</h3>
              <p className="material-card__desc">
                19.5-micron non-mulesed wool. Active thermoregulation and natural moisture-wicking properties for seamless seasonal transitions.
              </p>
            </div>

            <div className="material-card reveal">
              <span className="material-card__origin">Tuscany, Italy</span>
              <h3 className="material-card__name">Vegetable-Tanned Leather</h3>
              <p className="material-card__desc">
                Full-grain calfskin tanned with bark and chestnut extracts. Developed without heavy metals to age with a rich, unique patina.
              </p>
            </div>
          </div>
        </section>

        {/* ── Founder Quote ────────────────────────────────────────── */}
        <section className="about-quote section reveal" aria-label="Founder quote">
          <blockquote className="about-quote__text">
            &ldquo;Clothing should feel like an extension of your calmest self &mdash; effortless in motion, tactile against the skin, and completely unbothered by temporary trends.&rdquo;
          </blockquote>
          <p className="about-quote__author">
            &mdash; Elena Vance, Creative Director
          </p>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────── */}
        <section className="about-cta reveal" aria-labelledby="cta-heading">
          <h2 className="about-cta__title" id="cta-heading">Experience the Collection</h2>
          <p className="about-cta__text">
            Discover tailored silhouettes, fluid silks, and tactile knits designed to accompany you through every chapter.
          </p>
          <div className="about-cta__actions">
            <Link to="/shop" className="btn btn--accent btn--lg">
              Explore All Pieces
            </Link>
            <Link to="/contact" className="btn btn--secondary btn--lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Contact Our Studio
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
