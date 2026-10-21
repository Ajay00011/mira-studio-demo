import './QuantitySelector.css';

export default function QuantitySelector({
  quantity = 1,
  onIncrease,
  onDecrease,
  min = 1,
  max = 10,
  disabled = false,
  label = 'Quantity'
}) {
  return (
    <div
      className="quantity-selector"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className="quantity-selector__btn"
        onClick={onDecrease}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>

      <span
        className="quantity-selector__value"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>

      <button
        type="button"
        className="quantity-selector__btn"
        onClick={onIncrease}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
      >
        &#43;
      </button>
    </div>
  );
}
