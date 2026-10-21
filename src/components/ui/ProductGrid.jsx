import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ products = [], className = '' }) {
  if (!products.length) return null;

  return (
    <div className={`product-grid ${className}`} role="list" aria-label="Products">
      {products.map((product) => (
        <div key={product.id} className="product-grid__item" role="listitem">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
