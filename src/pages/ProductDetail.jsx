import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductBySlug, getProductById, getRelatedProducts } from '../data/products';
import QuantitySelector from '../components/ui/QuantitySelector';
import ProductGrid from '../components/ui/ProductGrid';
import Toast from '../components/ui/Toast';
import ReviewSummary from '../components/ui/ReviewSummary';
import ReviewList from '../components/ui/ReviewList';
import ReviewModal from '../components/ui/ReviewModal';
import { getReviewsForProduct, getRatingSummary } from '../data/reviews';
import usePageTransition from '../hooks/usePageTransition';
import useScrollReveal from '../hooks/useScrollReveal';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const transitionClass = usePageTransition();
  const pageRef = useRef(null);

  // Look up product by slug, or by ID as fallback
  const product = useMemo(() => {
    return getProductBySlug(slug) || getProductById(slug);
  }, [slug]);

  // Selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Button state & Toast
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  // Reviews & Ratings state
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState('fabric');

  useScrollReveal(pageRef, [slug]);

  // Load reviews & summary for current piece
  useEffect(() => {
    if (product) {
      setReviews(getReviewsForProduct(product.id));
      setRatingSummary(getRatingSummary(product.id));
    }
  }, [product]);

  // Listen for review updates
  useEffect(() => {
    const handleReviewsUpdated = () => {
      if (product) {
        setReviews(getReviewsForProduct(product.id));
        setRatingSummary(getRatingSummary(product.id));
      }
    };
    window.addEventListener('mira_reviews_updated', handleReviewsUpdated);
    return () => window.removeEventListener('mira_reviews_updated', handleReviewsUpdated);
  }, [product]);

  // Reset selections when slug changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(product.sizes?.[0] || null);
      setQuantity(1);
      setIsAdding(false);
      setIsAdded(false);
      setToastOpen(false);
    }
  }, [product]);

  // Related products from the same category
  const relatedProducts = useMemo(() => {
    return product ? getRelatedProducts(product, 4) : [];
  }, [product]);

  // Handle missing/invalid product
  if (!product) {
    return (
      <main className={`main-content product-detail-page ${transitionClass}`}>
        <section className="product-not-found">
          <div className="product-not-found__inner">
            <p className="product-not-found__code">404</p>
            <h1 className="product-not-found__title">Product Not Found</h1>
            <p className="product-not-found__text">
              The piece you are looking for ({`"${slug}"`}) does not exist in our catalog or may have been archived.
            </p>
            <div className="product-not-found__actions">
              <Link to="/shop" className="btn btn--primary">
                Browse Full Collection
              </Link>
              <Link to="/shop?category=women" className="btn btn--secondary">
                Women
              </Link>
              <Link to="/shop?category=men" className="btn btn--secondary">
                Men
              </Link>
              <Link to="/shop?category=accessories" className="btn btn--secondary">
                Accessories
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);

    addToCart(product, selectedColor, selectedSize, quantity);

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setToastOpen(true);

      setTimeout(() => {
        setIsAdded(false);
      }, 2500);
    }, 350);
  };

  const toggleAccordion = (key) => {
    setOpenAccordion(prev => prev === key ? null : key);
  };

  return (
    <main className={`main-content product-detail-page ${transitionClass}`} ref={pageRef}>
      <div className="container">
        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb__link">Home</Link>
          <span className="breadcrumb__separator" aria-hidden="true">/</span>
          <Link to="/shop" className="breadcrumb__link">Shop</Link>
          <span className="breadcrumb__separator" aria-hidden="true">/</span>
          <Link to={`/shop?category=${product.category}`} className="breadcrumb__link" style={{ textTransform: 'capitalize' }}>
            {product.category}
          </Link>
          <span className="breadcrumb__separator" aria-hidden="true">/</span>
          <span className="breadcrumb__current" aria-current="page">{product.name}</span>
        </nav>

        {/* ── Two-Column Product Layout ───────────────────────────── */}
        <div className="product-detail__layout">
          {/* Media Column (Left) */}
          <div className="product-detail__media-col">
            <div className="product-detail__gallery">
              <img
                src={product.image}
                alt={product.name}
                className="product-detail__image"
              />

              <div className="product-detail__badges">
                {product.isNew && (
                  <span className="product-card__badge product-card__badge--new">
                    New Arrival
                  </span>
                )}
                {product.isFeatured && (
                  <span className="product-card__badge product-card__badge--featured">
                    Studio Pick
                  </span>
                )}
              </div>

              {/* Floating Wishlist Heart */}
              <button
                type="button"
                className={`product-detail__gallery-wishlist${isWishlisted ? ' product-detail__gallery-wishlist--active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
                aria-label={isWishlisted ? `Remove ${product.name} from Wishlist` : `Save ${product.name} to Wishlist`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={isWishlisted ? 'var(--color-accent)' : 'none'}
                  stroke={isWishlisted ? 'var(--color-accent)' : 'currentColor'}
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
            </div>

            {/* Quality Perks below Image */}
            <div className="product-detail__perks">
              <div className="product-detail__perk">
                <div className="product-detail__perk-icon" aria-hidden="true">🌿</div>
                <div className="product-detail__perk-text">100% Sustainable Natural Fibres</div>
              </div>
              <div className="product-detail__perk">
                <div className="product-detail__perk-icon" aria-hidden="true">📦</div>
                <div className="product-detail__perk-text">Carbon-Neutral Free Shipping $150+</div>
              </div>
              <div className="product-detail__perk">
                <div className="product-detail__perk-icon" aria-hidden="true">↺</div>
                <div className="product-detail__perk-text">30-Day Complimentary Returns</div>
              </div>
            </div>
          </div>

          {/* Info & Buy Box (Right) */}
          <div className="product-detail__info-col">
            <div className="product-detail__header-meta">
              <span className="product-detail__category">{product.category}</span>
              <a
                href="#customer-reviews"
                className="product-detail__rating-link"
                aria-label={`Rated ${ratingSummary ? ratingSummary.average.toFixed(1) : product.rating} out of 5 stars based on ${reviews.length} reviews`}
              >
                <span className="product-detail__stars" aria-hidden="true">★★★★★</span>
                <span>{ratingSummary ? ratingSummary.average.toFixed(1) : product.rating} ({reviews.length} reviews)</span>
              </a>
            </div>

            <h1 className="product-detail__title">{product.name}</h1>

            <div className="product-detail__price-row">
              <span className="product-detail__price">${product.price}</span>
              <span className="product-detail__tax-note">Tax included • Free global shipping eligible</span>
            </div>

            <p className="product-detail__description">{product.description}</p>

            {/* ── Color Selection ───────────────────────────────── */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="product-detail__section-label">
                  <span>Colour: <strong>{selectedColor?.name}</strong></span>
                </div>
                <div className="product-detail__colors" role="radiogroup" aria-label="Choose a colour">
                  {product.colors.map(col => {
                    const isSelected = selectedColor?.name === col.name;
                    return (
                      <button
                        key={col.name}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`product-detail__color-btn${isSelected ? ' active' : ''}`}
                        onClick={() => setSelectedColor(col)}
                        title={col.name}
                      >
                        <span
                          className="product-detail__color-swatch"
                          style={{ backgroundColor: col.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Size Selection ────────────────────────────────── */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="product-detail__section-label">
                  <span>Size: <strong>{selectedSize}</strong></span>
                  <span style={{ fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}>
                    True to Size
                  </span>
                </div>
                <div className="product-detail__sizes" role="radiogroup" aria-label="Choose a size">
                  {product.sizes.map(sz => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`product-detail__size-btn${isSelected ? ' active' : ''}`}
                        onClick={() => setSelectedSize(sz)}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Quantity & Add to Cart ────────────────────────── */}
            <div>
              <div className="product-detail__section-label">
                <span>Quantity</span>
              </div>
              <div className="product-detail__actions">
                <QuantitySelector
                  quantity={quantity}
                  onIncrease={() => setQuantity(q => Math.min(10, q + 1))}
                  onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={!product.inStock}
                />

                <button
                  type="button"
                  className={`btn btn--primary btn--lg product-detail__add-btn${isAdded ? ' product-detail__add-btn--success' : ''}`}
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                >
                  {isAdding ? (
                    'Adding to Bag...'
                  ) : isAdded ? (
                    'Added to Bag ✓'
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      Add to Bag &bull; ${product.price * quantity}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className={`btn btn--secondary btn--lg product-detail__wishlist-btn${isWishlisted ? ' product-detail__wishlist-btn--active' : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={isWishlisted ? `Remove ${product.name} from Wishlist` : `Save ${product.name} to Wishlist`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill={isWishlisted ? 'var(--color-accent)' : 'none'}
                    stroke={isWishlisted ? 'var(--color-accent)' : 'currentColor'}
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                  <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* ── Accordions / Product Details ───────────────────── */}
            <div className="product-detail__accordions">
              {/* Accordion 1: Material & Craft */}
              <div className="product-accordion">
                <button
                  type="button"
                  className="product-accordion__toggle"
                  aria-expanded={openAccordion === 'fabric'}
                  onClick={() => toggleAccordion('fabric')}
                >
                  <span>Fabric, Material &amp; Craft</span>
                  <span className="product-accordion__icon" aria-hidden="true">+</span>
                </button>
                {openAccordion === 'fabric' && (
                  <div className="product-accordion__content">
                    Every piece is crafted in ethical partner ateliers from certified natural, renewable fibers. Designed for longevity and refined drape, utilizing minimal chemical finishing and recycled trims.
                  </div>
                )}
              </div>

              {/* Accordion 2: Sizing & Fit */}
              <div className="product-accordion">
                <button
                  type="button"
                  className="product-accordion__toggle"
                  aria-expanded={openAccordion === 'sizing'}
                  onClick={() => toggleAccordion('sizing')}
                >
                  <span>Sizing &amp; Fit Guide</span>
                  <span className="product-accordion__icon" aria-hidden="true">+</span>
                </button>
                {openAccordion === 'sizing' && (
                  <div className="product-accordion__content">
                    Cut with an effortless, modern silhouette that drapes cleanly over the body. Fits true to standard international sizing. If between sizes, we recommend sizing down for a closer fit or sizing up for a relaxed drape.
                  </div>
                )}
              </div>

              {/* Accordion 3: Care Instructions */}
              <div className="product-accordion">
                <button
                  type="button"
                  className="product-accordion__toggle"
                  aria-expanded={openAccordion === 'care'}
                  onClick={() => toggleAccordion('care')}
                >
                  <span>Care Instructions</span>
                  <span className="product-accordion__icon" aria-hidden="true">+</span>
                </button>
                {openAccordion === 'care' && (
                  <div className="product-accordion__content">
                    Dry clean gently or hand wash cold inside-out using mild wool/silk detergent. Do not wring or tumble dry. Dry flat on a clean towel away from direct sunlight. Warm iron on reverse if necessary.
                  </div>
                )}
              </div>

              {/* Accordion 4: Shipping & Returns */}
              <div className="product-accordion">
                <button
                  type="button"
                  className="product-accordion__toggle"
                  aria-expanded={openAccordion === 'shipping'}
                  onClick={() => toggleAccordion('shipping')}
                >
                  <span>Complimentary Shipping &amp; 30-Day Returns</span>
                  <span className="product-accordion__icon" aria-hidden="true">+</span>
                </button>
                {openAccordion === 'shipping' && (
                  <div className="product-accordion__content">
                    Orders ship within 1-2 business days in 100% plastic-free compostable mailers. Complimentary carbon-neutral standard delivery on orders above $150. Enjoy 30 days of hassle-free returns.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Customer Reviews & Ratings ─────────────────────────── */}
        <section id="customer-reviews" className="product-detail__reviews-section" aria-labelledby="reviews-heading">
          <div className="product-detail__reviews-header reveal">
            <p className="product-detail__related-eyebrow">Client Perspectives</p>
            <h2 className="product-detail__related-title" id="reviews-heading">
              Ratings &amp; Reviews ({reviews.length})
            </h2>
          </div>

          <ReviewSummary
            summary={ratingSummary}
            onWriteReview={() => setReviewModalOpen(true)}
          />

          <ReviewList reviews={reviews} />
        </section>

        {/* ── Related Products ───────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="product-detail__related" aria-labelledby="related-heading">
            <div className="product-detail__related-header reveal">
              <p className="product-detail__related-eyebrow">Complementary Pieces</p>
              <h2 className="product-detail__related-title" id="related-heading">
                You May Also Admire
              </h2>
            </div>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>

      {/* ── Add to Cart Toast Feedback ───────────────────────────── */}
      <Toast
        isOpen={toastOpen}
        title="Added to Bag"
        message={`${quantity} × ${product.name} (${selectedColor?.name}, ${selectedSize})`}
        actionTo="/cart"
        actionLabel="View Bag"
        onClose={() => setToastOpen(false)}
      />

      {/* ── Write Review Modal ───────────────────────────────────── */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productId={product.id}
        productName={product.name}
        onReviewSubmitted={(newRev) => {
          setReviews(prev => [newRev, ...prev]);
          setRatingSummary(getRatingSummary(product.id));
        }}
      />
    </main>
  );
}
