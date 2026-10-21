import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const NAV_LINKS = [
  { to: '/',        label: 'Home' },
  { to: '/shop',    label: 'Shop' },
  { to: '/orders',  label: 'Orders' },
  { to: '/about',   label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { currentUser, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartBadgeAnimate, setCartBadgeAnimate] = useState(false);
  const [wishlistBadgeAnimate, setWishlistBadgeAnimate] = useState(false);
  const location = useLocation();

  const displayCount = totalItems;

  /* Animate cart badge when count changes */
  useEffect(() => {
    if (displayCount > 0) {
      setCartBadgeAnimate(true);
      const timer = setTimeout(() => setCartBadgeAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [displayCount]);

  /* Animate wishlist badge when count changes */
  useEffect(() => {
    if (totalWishlistItems > 0) {
      setWishlistBadgeAnimate(true);
      const timer = setTimeout(() => setWishlistBadgeAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalWishlistItems]);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && mobileOpen) {
      setMobileOpen(false);
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [mobileOpen, handleKeyDown]);

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`} role="banner">
      <div className="header__inner">
        {/* Logo */}
        <Link to="/" className="header__logo" aria-label="Mira Studio — Home">
          <span className="header__logo-text">
            Mira<span className="header__logo-dot">.</span>Studio
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="header__nav" aria-label="Main navigation">
          <ul className="header__nav-list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `header__nav-link${isActive ? ' active' : ''}`
                  }
                  end={to === '/'}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {/* User Account / Sign In */}
          {isAuthenticated ? (
            <Link
              to="/account"
              className="header__action-btn header__account-btn"
              aria-label={`Studio Account, ${currentUser.firstName}`}
              title={`Account: ${currentUser.firstName}`}
            >
              <span className="header__avatar-initial" aria-hidden="true">
                {currentUser.firstName?.[0] || 'U'}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="header__action-btn header__login-btn"
              aria-label="Sign In or Register"
              title="Sign In / Register"
            >
              <svg
                className="header__action-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          )}

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="header__action-btn header__wishlist-btn"
            aria-label={`Wishlist, ${totalWishlistItems} items`}
            title="Saved Favorites"
          >
            <svg
              className="header__action-icon"
              viewBox="0 0 24 24"
              fill={totalWishlistItems > 0 ? "rgba(197, 85, 60, 0.15)" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {totalWishlistItems > 0 && (
              <span className={`badge header__badge header__wishlist-badge${wishlistBadgeAnimate ? ' badge--animate' : ''}`}>
                {totalWishlistItems}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link to="/cart" className="header__action-btn header__cart-btn" aria-label={`Cart, ${displayCount} items`} title="Shopping Bag">
            <svg
              className="header__action-icon header__cart-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M16 10a4 4 0 01-8 0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {displayCount > 0 && (
              <span className={`badge header__badge header__cart-badge${cartBadgeAnimate ? ' badge--animate' : ''}`}>
                {displayCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="header__menu-toggle"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="header__hamburger" aria-hidden="true">
              <span className="header__hamburger-line" />
              <span className="header__hamburger-line" />
              <span className="header__hamburger-line" />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <nav
        id="mobile-nav"
        className={`header__mobile-nav${mobileOpen ? ' header__mobile-nav--open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `header__mobile-nav-link${isActive ? ' active' : ''}`
            }
            end={to === '/'}
            tabIndex={mobileOpen ? 0 : -1}
          >
            {label}
          </NavLink>
        ))}
        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `header__mobile-nav-link${isActive ? ' active' : ''}`
          }
          tabIndex={mobileOpen ? 0 : -1}
        >
          Favorites {totalWishlistItems > 0 && `(${totalWishlistItems})`}
        </NavLink>
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `header__mobile-nav-link${isActive ? ' active' : ''}`
          }
          tabIndex={mobileOpen ? 0 : -1}
        >
          Cart {displayCount > 0 && `(${displayCount})`}
        </NavLink>
        {isAuthenticated ? (
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `header__mobile-nav-link${isActive ? ' active' : ''}`
            }
            tabIndex={mobileOpen ? 0 : -1}
          >
            Studio Account ({currentUser.firstName})
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `header__mobile-nav-link${isActive ? ' active' : ''}`
            }
            tabIndex={mobileOpen ? 0 : -1}
          >
            Sign In / Register
          </NavLink>
        )}
      </nav>
    </header>
  );
}
