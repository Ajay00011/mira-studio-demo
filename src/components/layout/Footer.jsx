import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const SHOP_LINKS = [
  { to: '/shop?category=women', label: 'Women' },
  { to: '/shop?category=men',   label: 'Men' },
  { to: '/shop?category=accessories', label: 'Accessories' },
  { to: '/wishlist',            label: 'Saved Wishlist' },
  { to: '/shop',                label: 'All Products' },
];

const COMPANY_LINKS = [
  { to: '/about',   label: 'Our Story' },
  { to: '/orders',  label: 'Track Your Order' },
  { to: '/contact', label: 'Contact & FAQ' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      /* Demo only — no real submission */
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Brand */}
          <div>
            <p className="footer__brand-name">
              Mira<span className="footer__brand-dot">.</span>Studio
            </p>
            <p className="footer__brand-desc">
              Thoughtfully designed clothing for the modern individual.
              Crafted with care, worn with intention.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="footer__heading">Shop</h3>
            <ul className="footer__list">
              {SHOP_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="footer__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="footer__heading">Company</h3>
            <ul className="footer__list">
              {COMPANY_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="footer__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="footer__heading">Stay in touch</h3>
            <p className="footer__newsletter-text">
              Subscribe for early access, behind-the-scenes stories, and curated style updates.
            </p>
            {subscribed ? (
              <p className="footer__newsletter-text" style={{ color: 'var(--color-accent)' }}>
                ✓ Thank you for subscribing!
              </p>
            ) : (
              <form className="footer__newsletter-form" onSubmit={handleSubscribe}>
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  className="footer__newsletter-input"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address for newsletter"
                />
                <button type="submit" className="footer__newsletter-btn">
                  Join
                </button>
              </form>
            )}
            <p className="footer__newsletter-note">
              Demo only — no emails are sent or stored.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copy">
            © {currentYear} Mira Studio. All rights reserved. This is a fictional demo brand.
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Instagram (demo)">
              <svg className="footer__social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="Pinterest (demo)">
              <svg className="footer__social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 21c1-3 1.5-5 2-7.5.5-2.5-.5-4 1.5-4s2.5 2 1.5 4.5c-.5 1.5-1.5 3-2.5 5" />
              </svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="Twitter / X (demo)">
              <svg className="footer__social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 4l16 16M20 4L4 20" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
