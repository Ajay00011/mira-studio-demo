import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import FilterBar from '../components/ui/FilterBar';
import ProductGrid from '../components/ui/ProductGrid';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import usePageTransition from '../hooks/usePageTransition';
import useScrollReveal from '../hooks/useScrollReveal';
import './Shop.css';

const CATEGORY_META = {
  all: {
    eyebrow: 'Mira Studio Curations',
    title: 'The Collection',
    description: 'Tailored silhouettes, tactile knitwear, and sculptural accessories. Thoughtfully designed in limited editions with uncompromised craft.'
  },
  women: {
    eyebrow: 'Curated Wardrobe',
    title: "Women's Collection",
    description: 'Effortless cashmere knits, fluid mulberry silk slip dresses, and virgin wool tailoring crafted for timeless wear.',
    image: '/category_images/bag.jpg'
  },
  men: {
    eyebrow: 'Modern Essentials',
    title: "Men's Collection",
    description: 'Understated merino knits, utilitarian trench coats, and structured trousers designed with quiet refinement.',
    image: '/category_images/men.jpg'
  },
  accessories: {
    eyebrow: 'Finishing Touches',
    title: 'Accessories',
    description: 'Handcrafted Italian nappa leather goods, sculptural brass jewelry, and Peruvian alpaca scarves.',
    image: '/category_images/accessories.jpg'
  }
};

export default function Shop() {
  const transitionClass = usePageTransition();
  const pageRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronisation
  const categoryParam = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortOption, setSortOption] = useState(sortParam);
  const [isLoading, setIsLoading] = useState(false);

  useScrollReveal(pageRef);

  // Sync state when URL params change (e.g., clicking category links in Header/Footer/Home)
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchQuery(searchParams.get('q') || '');
    setSortOption(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // Update URL search parameters when filters change
  const updateParams = (newCat, newQ, newSort) => {
    const params = new URLSearchParams();
    if (newCat && newCat !== 'all') params.set('category', newCat);
    if (newQ && newQ.trim()) params.set('q', newQ.trim());
    if (newSort && newSort !== 'newest') params.set('sort', newSort);
    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    updateParams(cat, searchQuery, sortOption);
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
    updateParams(selectedCategory, q, sortOption);
  };

  const handleSortChange = (sort) => {
    setSortOption(sort);
    updateParams(selectedCategory, searchQuery, sort);
  };

  const handleReset = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortOption('newest');
    setSearchParams({}, { replace: true });
  };

  // Calculate product counts per category
  const categoryCounts = useMemo(() => {
    return {
      all: PRODUCTS.length,
      women: PRODUCTS.filter(p => p.category === 'women').length,
      men: PRODUCTS.filter(p => p.category === 'men').length,
      accessories: PRODUCTS.filter(p => p.category === 'accessories').length
    };
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search filter (name and description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return list;
  }, [selectedCategory, searchQuery, sortOption]);

  const activeMeta = CATEGORY_META[selectedCategory] || CATEGORY_META.all;

  return (
    <main className={`main-content shop-page ${transitionClass}`} ref={pageRef}>
      {/* ── Shop Header ───────────────────────────────────────────── */}
      <section className={`shop-hero ${activeMeta.image ? 'shop-hero--with-image' : ''}`} aria-labelledby="shop-heading">
        {activeMeta.image && (
          <>
            <img src={activeMeta.image} alt="" className="shop-hero__bg-img" aria-hidden="true" />
            <div className="shop-hero__overlay" aria-hidden="true" />
          </>
        )}
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="shop-hero__eyebrow">{activeMeta.eyebrow}</p>
          <h1 className="shop-hero__title" id="shop-heading">{activeMeta.title}</h1>
          <p className="shop-hero__description">
            {activeMeta.description}
          </p>
        </div>
      </section>

      {/* ── Main Catalog Section ──────────────────────────────────── */}
      <div className="container">
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          totalResults={filteredProducts.length}
          categoryCounts={categoryCounts}
          onReset={handleReset}
        />

        {isLoading ? (
          <LoadingSpinner label="Refreshing Collection..." />
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <EmptyState
            title="No matching pieces found"
            description={`We couldn't find anything matching "${searchQuery || selectedCategory}". Try checking your spelling or clearing filters.`}
            actionLabel="Reset All Filters"
            onAction={handleReset}
          />
        )}
      </div>
    </main>
  );
}
