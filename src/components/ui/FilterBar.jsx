import { CATEGORIES } from '../../data/products';
import './FilterBar.css';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest Arrivals' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A to Z' }
];

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  totalResults,
  categoryCounts = {},
  onReset
}) {
  const isFiltered = selectedCategory !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="filter-bar" role="region" aria-label="Product filters and search">
      {/* ── Category Pills ────────────────────────────────────────── */}
      <div className="filter-bar__categories" role="tablist" aria-label="Filter by category">
        {CATEGORIES.map(cat => {
          const count = categoryCounts[cat.id] ?? 0;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`filter-bar__category-btn${isActive ? ' active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span>{cat.name}</span>
              <span className="filter-bar__category-count">({count})</span>
            </button>
          );
        })}
      </div>

      {/* ── Search & Sort Row ─────────────────────────────────────── */}
      <div className="filter-bar__controls">
        <div className="filter-bar__search">
          <svg className="filter-bar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="filter-bar__search-input"
            placeholder="Search by name, silhouette, or fabric..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              type="button"
              className="filter-bar__search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
            >
              &times;
            </button>
          )}
        </div>

        <div className="filter-bar__sort-group">
          <label htmlFor="shop-sort" className="filter-bar__sort-label">
            Sort by:
          </label>
          <select
            id="shop-sort"
            className="filter-bar__sort-select"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Filter status & reset ─────────────────────────────────── */}
      <div className="filter-bar__status" aria-live="polite">
        <span>
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'product' : 'products'}
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        </span>

        {isFiltered && (
          <button
            type="button"
            className="filter-bar__reset-btn"
            onClick={onReset}
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
