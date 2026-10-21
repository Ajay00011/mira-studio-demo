import { Link } from 'react-router-dom';
import QuantitySelector from './QuantitySelector';
import './CartItem.css';

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove
}) {
  if (!item) return null;

  const {
    cartItemId,
    name,
    slug,
    category,
    price,
    image,
    selectedColor,
    selectedColorHex,
    selectedSize,
    quantity
  } = item;

  const lineSubtotal = price * quantity;

  return (
    <article className="cart-item" aria-label={`${name}, ${selectedColor}, Size ${selectedSize}`}>
      {/* Thumbnail */}
      <Link to={`/product/${slug}`} className="cart-item__media-link" aria-label={`View ${name}`}>
        <img
          src={image}
          alt={name}
          className="cart-item__image"
          loading="lazy"
        />
      </Link>

      {/* Details */}
      <div className="cart-item__details">
        <span className="cart-item__category">{category}</span>
        <Link to={`/product/${slug}`} className="cart-item__name">
          {name}
        </Link>

        <div className="cart-item__options">
          <span className="cart-item__color-pill">
            <span
              className="cart-item__color-dot"
              style={{ backgroundColor: selectedColorHex || '#1a1a1a' }}
              aria-hidden="true"
            />
            <span>{selectedColor}</span>
          </span>

          <span aria-hidden="true">&bull;</span>

          <span>Size: <strong>{selectedSize}</strong></span>
        </div>

        <span className="cart-item__price-unit">
          ${price} each
        </span>
      </div>

      {/* Controls: Stepper, Subtotal, Remove */}
      <div className="cart-item__controls">
        <QuantitySelector
          quantity={quantity}
          onIncrease={() => onUpdateQuantity(cartItemId, quantity + 1)}
          onDecrease={() => onUpdateQuantity(cartItemId, quantity - 1)}
          label={`Quantity for ${name}`}
        />

        <div className="cart-item__subtotal" aria-label={`Subtotal $${lineSubtotal}`}>
          ${lineSubtotal}
        </div>

        <button
          type="button"
          className="cart-item__remove-btn"
          onClick={() => onRemove(cartItemId)}
          aria-label={`Remove ${name} from cart`}
          title="Remove item"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </article>
  );
}
