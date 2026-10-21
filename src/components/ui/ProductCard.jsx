import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({ product, className = '' }) {
  if (!product) return null;

  const { isInWishlist, toggleWishlist } = useWishlist();

  const {
    id,
    name,
    slug,
    category,
    price,
    image,
    colors = [],
    rating,
    reviewCount,
    isNew,
    isFeatured
  } = product;

  const isWishlisted = isInWishlist(id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  return (
    <Link
      to={`/product/${slug}`}
      className={`product-card ${className}`}
      aria-label={`View ${name}, $${price}`}
    >
      <div className="product-card__media">
        <img
          src={image}
          alt={name}
          className="product-card__image"
          loading="lazy"
        />

        {/* Badges */}
        <div className="product-card__badges">
          {isNew && (
            <span className="product-card__badge product-card__badge--new">
              New In
            </span>
          )}
          {isFeatured && (
            <span className="product-card__badge product-card__badge--featured">
              Curated
            </span>
          )}
        </div>

        {/* Wishlist toggle button */}
        <button
          type="button"
          className={`product-card__wishlist-btn${isWishlisted ? ' product-card__wishlist-btn--active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? `Remove ${name} from Wishlist` : `Save ${name} to Wishlist`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <svg
            className="product-card__wishlist-icon"
            viewBox="0 0 24 24"
            fill={isWishlisted ? 'var(--color-accent)' : 'none'}
            stroke={isWishlisted ? 'var(--color-accent)' : 'currentColor'}
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>

        <div className="product-card__quick-bar" aria-hidden="true">
          View Details &rarr;
        </div>
      </div>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="product-card__category">{category}</span>
          {rating && (
            <span className="product-card__rating" title={`${rating} out of 5 stars (${reviewCount} reviews)`}>
              <span className="product-card__star" aria-hidden="true">★</span>
              <span>{rating}</span>
            </span>
          )}
        </div>

        <h3 className="product-card__title">{name}</h3>

        <div className="product-card__footer">
          <span className="product-card__price">${price}</span>

          {colors.length > 0 && (
            <div className="product-card__swatches" aria-label={`Available in ${colors.length} shades`}>
              {colors.slice(0, 3).map((col, idx) => (
                <span
                  key={idx}
                  className="product-card__swatch"
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
              {colors.length > 3 && (
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                  +{colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
