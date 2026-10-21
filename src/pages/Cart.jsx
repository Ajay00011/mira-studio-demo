import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/ui/CartItem';
import EmptyState from '../components/ui/EmptyState';
import usePageTransition from '../hooks/usePageTransition';
import useScrollReveal from '../hooks/useScrollReveal';
import './Cart.css';

export default function Cart() {
  const transitionClass = usePageTransition();
  const pageRef = useRef(null);

  const {
    cart,
    totalItems,
    subtotal,
    shippingCost,
    total,
    isEligibleForFreeShipping,
    amountToFreeShipping,
    freeShippingProgress,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const { isAuthenticated, currentUser } = useAuth();

  // Promo code simulator
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Clear confirmation toggle
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useScrollReveal(pageRef, [cart.length]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const trimmed = promoCode.trim().toUpperCase();
    if (!trimmed) return;

    if (trimmed === 'MIRA10') {
      setDiscountPercent(10);
      setPromoSuccess('10% demo discount applied!');
    } else if (trimmed === 'MIRA20') {
      setDiscountPercent(20);
      setPromoSuccess('20% demo discount applied!');
    } else {
      setPromoError('Invalid promo code. Try "MIRA10" for 10% off.');
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, total - discountAmount);

  // If cart is empty, show empty state
  if (cart.length === 0) {
    return (
      <main className={`main-content cart-page ${transitionClass}`} ref={pageRef}>
        <div className="container" style={{ paddingBlock: 'var(--space-4xl)' }}>
          <EmptyState
            title="Your Shopping Bag is Empty"
            description="Explore our latest collection of thoughtfully crafted essentials and sculptural pieces."
            actionLabel="Discover Collection"
            onAction={() => window.location.href = '/shop'}
          />

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
              Or explore by category
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/shop?category=women" className="btn btn--secondary btn--sm">
                Women
              </Link>
              <Link to="/shop?category=men" className="btn btn--secondary btn--sm">
                Men
              </Link>
              <Link to="/shop?category=accessories" className="btn btn--secondary btn--sm">
                Accessories
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`main-content cart-page ${transitionClass}`} ref={pageRef}>
      <div className="container">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <header className="cart-page__header">
          <p className="cart-page__eyebrow">Review Order</p>
          <h1 className="cart-page__title">Shopping Bag ({totalItems})</h1>
        </header>

        {/* ── Free Shipping Progress Bar ─────────────────────────── */}
        <div className="shipping-progress" role="region" aria-label="Free shipping status">
          <div className="shipping-progress__text">
            {isEligibleForFreeShipping ? (
              <span>
                🌿 <strong>Complimentary Shipping Unlocked!</strong> Your order qualifies for free carbon-neutral shipping.
              </span>
            ) : (
              <span>
                Add <strong>${amountToFreeShipping}</strong> more to unlock complimentary global shipping.
              </span>
            )}
            <span>{freeShippingProgress}%</span>
          </div>
          <div className="shipping-progress__bar-bg" aria-hidden="true">
            <div
              className="shipping-progress__bar-fill"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* ── Cart Layout Grid ─────────────────────────────────────── */}
        <div className="cart-layout">
          {/* Left Column: Items */}
          <section className="cart-items-section" aria-label="Items in bag">
            <div className="cart-items-section__header">
              <span className="cart-items-section__count">
                {totalItems} {totalItems === 1 ? 'Piece' : 'Pieces'}
              </span>

              {showClearConfirm ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-error)' }}>
                    Clear all items?
                  </span>
                  <button
                    type="button"
                    onClick={() => { clearCart(); setShowClearConfirm(false); }}
                    className="btn btn--primary btn--sm"
                    style={{ minHeight: '30px', padding: '4px 10px', fontSize: '11px' }}
                  >
                    Yes, Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="btn btn--secondary btn--sm"
                    style={{ minHeight: '30px', padding: '4px 10px', fontSize: '11px' }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="cart-items-section__clear-btn"
                  onClick={() => setShowClearConfirm(true)}
                >
                  Clear Bag
                </button>
              )}
            </div>

            <div className="cart-items-section__list">
              {cart.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </section>

          {/* Right Column: Summary Card */}
          <aside className="cart-summary-card" aria-label="Order summary">
            <h2 className="cart-summary-card__title">Order Summary</h2>

            <div className="cart-summary-card__rows">
              <div className="cart-summary-card__row">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>

              <div className="cart-summary-card__row">
                <span>Estimated Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <strong style={{ color: 'var(--color-success)' }}>Free</strong>
                  ) : (
                    `$${shippingCost}`
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="cart-summary-card__row" style={{ color: 'var(--color-accent)' }}>
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-${discountAmount}</span>
                </div>
              )}

              <div className="cart-summary-card__row cart-summary-card__row--total">
                <span>Estimated Total</span>
                <span>${finalTotal}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="cart-promo">
              <input
                type="text"
                className="cart-promo__input"
                placeholder="PROMO CODE (e.g. MIRA10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                aria-label="Promotion code"
              />
              <button type="submit" className="btn btn--secondary cart-promo__btn">
                Apply
              </button>
            </form>

            {promoSuccess && (
              <p style={{ fontSize: '11px', color: 'var(--color-success)' }}>
                ✓ {promoSuccess}
              </p>
            )}
            {promoError && (
              <p style={{ fontSize: '11px', color: 'var(--color-error)' }}>
                {promoError}
              </p>
            )}

            {/* Account Requirement Info & Checkout CTA */}
            {!isAuthenticated ? (
              <div className="cart-auth-box">
                <div className="cart-auth-box__notice">
                  <span className="cart-auth-box__icon">🔒</span>
                  <div>
                    <strong>Registration Required to Purchase</strong>
                    <p>Please register or sign in to confirm your delivery address before checkout.</p>
                  </div>
                </div>

                <Link
                  to="/register?redirect=/checkout"
                  className="btn btn--primary btn--lg cart-summary-card__checkout-btn"
                >
                  Register &amp; Checkout &rarr;
                </Link>

                <Link
                  to="/login?redirect=/checkout"
                  className="btn btn--secondary btn--sm cart-auth-signin-link"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            ) : (
              <div className="cart-auth-box">
                <div className="cart-auth-box__notice cart-auth-box__notice--verified">
                  <span className="cart-auth-box__icon">✓</span>
                  <div>
                    <strong>Signed in as {currentUser.firstName} {currentUser.lastName}</strong>
                    <p>Using saved delivery address from registration</p>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="btn btn--primary btn--lg cart-summary-card__checkout-btn"
                >
                  Proceed to Checkout &rarr;
                </Link>
              </div>
            )}

            <Link
              to="/shop"
              className="cart-summary-card__continue-link"
            >
              &larr; Continue Shopping
            </Link>

            {/* Trust Points */}
            <div className="cart-summary-card__badges">
              <div className="cart-summary-card__badge-item">
                <span>🔒</span>
                <span>Demo Checkout — No real charges will be made</span>
              </div>
              <div className="cart-summary-card__badge-item">
                <span>🌿</span>
                <span>100% plastic-free compostable mailers</span>
              </div>
              <div className="cart-summary-card__badge-item">
                <span>↺</span>
                <span>30-day complimentary return policy</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
