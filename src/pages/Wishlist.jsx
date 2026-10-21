import { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ui/ProductCard';
import Toast from '../components/ui/Toast';
import usePageTransition from '../hooks/usePageTransition';
import useScrollReveal from '../hooks/useScrollReveal';
import './Wishlist.css';

export default function Wishlist() {
  const transitionClass = usePageTransition();
  const pageRef = useRef(null);

  const {
    wishlistProducts,
    totalWishlistItems,
    removeFromWishlist,
    clearWishlist
  } = useWishlist();

  const { addToCart } = useCart();

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [toastTitle, setToastTitle] = useState('Added to Bag');
  const [toastOpen, setToastOpen] = useState(false);

  // Clear confirmation modal/dialog state
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Recommended products if wishlist is empty or to inspire at the bottom
  const recommendations = useMemo(() => {
    return PRODUCTS.filter(p => p.isFeatured).slice(0, 3);
  }, []);

  useScrollReveal(pageRef, [wishlistProducts.length]);

  // Add individual item to bag from wishlist
  const handleMoveToBag = (product) => {
    const defaultColor = product.colors?.[0] || { name: 'Default', hex: '#1a1a1a' };
    const defaultSize = product.sizes?.[0] || 'M';

    addToCart(product, defaultColor, defaultSize, 1);
    setToastTitle('Added to Bag');
    setToastMessage(`${product.name} has been added to your shopping bag.`);
    setToastOpen(true);
  };

  // Move all in-stock items from wishlist to cart
  const handleMoveAllToBag = () => {
    const inStockItems = wishlistProducts.filter(p => p.inStock);
    if (inStockItems.length === 0) return;

    inStockItems.forEach(product => {
      const defaultColor = product.colors?.[0] || { name: 'Default', hex: '#1a1a1a' };
      const defaultSize = product.sizes?.[0] || 'M';
      addToCart(product, defaultColor, defaultSize, 1);
    });

    setToastTitle('All Favorites Added');
    setToastMessage(`${inStockItems.length} items moved to your shopping bag.`);
    setToastOpen(true);
  };

  const handleClear = () => {
    clearWishlist();
    setShowClearConfirm(false);
  };

  return (
    <main className={`main-content wishlist-page ${transitionClass}`} ref={pageRef}>
      <div className="container">
        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb__link">Home</Link>
          <span className="breadcrumb__separator" aria-hidden="true">/</span>
          <span className="breadcrumb__current" aria-current="page">Wishlist</span>
        </nav>

        {/* ── Editorial Header ────────────────────────────────────── */}
        <div className="wishlist-header">
          <div className="wishlist-header__content">
            <span className="wishlist-header__eyebrow">Personal Wardrobe</span>
            <h1 className="wishlist-header__title">Saved Favorites</h1>
            <p className="wishlist-header__lead">
              A bespoke edit of pieces you are considering. Review availability, curate styling ideas, or transfer them directly to your shopping bag.
            </p>
          </div>

          {totalWishlistItems > 0 && (
            <div className="wishlist-header__actions">
              <span className="wishlist-header__count-badge">
                <span className="wishlist-header__count-number">{totalWishlistItems}</span>
                <span>{totalWishlistItems === 1 ? 'item saved' : 'items saved'}</span>
              </span>

              <button
                type="button"
                className="btn btn--primary wishlist-header__btn"
                onClick={handleMoveAllToBag}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Move All to Bag
              </button>

              <button
                type="button"
                className="btn btn--ghost wishlist-header__btn wishlist-header__btn--clear"
                onClick={() => setShowClearConfirm(true)}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* ── Wishlist Content ────────────────────────────────────── */}
        {totalWishlistItems === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty__icon-wrap" aria-hidden="true">
              <svg
                className="wishlist-empty__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <h2 className="wishlist-empty__title">Your Wishlist is Empty</h2>
            <p className="wishlist-empty__desc">
              You haven't saved any garments or accessories yet. Explore our latest season release and tap the heart icon on any piece to save it for later.
            </p>
            <div className="wishlist-empty__actions">
              <Link to="/shop" className="btn btn--primary btn--lg">
                Explore The Collection &rarr;
              </Link>
            </div>

            {/* Recommendations to get started */}
            <div className="wishlist-recommendations">
              <div className="wishlist-recommendations__header">
                <span className="wishlist-recommendations__eyebrow">Studio Selection</span>
                <h3 className="wishlist-recommendations__title">Pieces You May Admire</h3>
              </div>
              <div className="product-grid">
                {recommendations.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="wishlist-grid-wrapper">
            <div className="wishlist-grid">
              {wishlistProducts.map(product => (
                <div key={product.id} className="wishlist-card">
                  {/* Media */}
                  <div className="wishlist-card__media">
                    <Link to={`/product/${product.slug}`} className="wishlist-card__image-link">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="wishlist-card__image"
                        loading="lazy"
                      />
                    </Link>

                    {/* Remove Wishlist Button */}
                    <button
                      type="button"
                      className="wishlist-card__remove-btn"
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      title="Remove from favorites"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="var(--color-accent)" strokeWidth="2" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </button>

                    {product.isNew && (
                      <span className="product-card__badge product-card__badge--new wishlist-card__badge">
                        New
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="wishlist-card__body">
                    <div className="wishlist-card__meta">
                      <span className="wishlist-card__category">{product.category}</span>
                      {product.rating && (
                        <span className="wishlist-card__rating">
                          ★ {product.rating}
                        </span>
                      )}
                    </div>

                    <h3 className="wishlist-card__title">
                      <Link to={`/product/${product.slug}`} className="wishlist-card__title-link">
                        {product.name}
                      </Link>
                    </h3>

                    <div className="wishlist-card__price-row">
                      <span className="wishlist-card__price">${product.price}</span>
                      <span className={`wishlist-card__stock${product.inStock ? ' in-stock' : ' out-stock'}`}>
                        {product.inStock ? 'In Stock' : 'Sold Out'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="wishlist-card__actions">
                      <button
                        type="button"
                        className="btn btn--primary wishlist-card__add-btn"
                        onClick={() => handleMoveToBag(product)}
                        disabled={!product.inStock}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        Add to Bag
                      </button>

                      <Link
                        to={`/product/${product.slug}`}
                        className="btn btn--secondary wishlist-card__view-btn"
                        aria-label={`View details for ${product.name}`}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Editorial Reassurance Banner */}
            <div className="wishlist-perks">
              <div className="wishlist-perk">
                <span className="wishlist-perk__icon">✦</span>
                <span className="wishlist-perk__title">Complimentary Shipping</span>
                <span className="wishlist-perk__desc">Free carbon-neutral delivery on all orders over $150.</span>
              </div>
              <div className="wishlist-perk">
                <span className="wishlist-perk__icon">↺</span>
                <span className="wishlist-perk__title">30-Day Thoughtful Returns</span>
                <span className="wishlist-perk__desc">Complimentary home collection and gentle exchanges.</span>
              </div>
              <div className="wishlist-perk">
                <span className="wishlist-perk__icon">🌿</span>
                <span className="wishlist-perk__title">Ethical Natural Fibers</span>
                <span className="wishlist-perk__desc">Every piece crafted in certified low-impact European mills.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-backdrop" onClick={() => setShowClearConfirm(false)} role="dialog" aria-modal="true" aria-labelledby="clear-title">
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3 id="clear-title" className="modal__title">Clear Saved Favorites?</h3>
              <button
                type="button"
                className="modal__close"
                onClick={() => setShowClearConfirm(false)}
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>
            <div className="modal__body">
              <p>Are you sure you want to remove all {totalWishlistItems} saved pieces from your wishlist? This cannot be undone.</p>
            </div>
            <div className="modal__footer">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setShowClearConfirm(false)}
              >
                Keep Saved Items
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleClear}
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Toast Notification */}
      <Toast
        isOpen={toastOpen}
        title={toastTitle}
        message={toastMessage}
        actionTo="/cart"
        actionLabel="View Bag"
        onClose={() => setToastOpen(false)}
      />
    </main>
  );
}
