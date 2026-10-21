/**
 * MIRA STUDIO — Customer Reviews & Ratings Data
 * Seed reviews for products with localStorage persistence.
 */

const STORAGE_KEY = 'mira_customer_reviews';

export const INITIAL_REVIEWS = [
  // Aria Cashmere Turtleneck (mira-w-01)
  {
    id: 'rev-01',
    productId: 'mira-w-01',
    author: 'Camille Laurent',
    date: 'October 12, 2026',
    rating: 5,
    title: 'The softest cashmere I own',
    content: 'The hand-feel is extraordinary. It has a beautiful, relaxed drape that looks polished under an overcoat or standalone with high-waisted denim. Zero pilling after three weeks of regular wear.',
    fit: 'True to Size',
    purchasedVariant: 'Size S &bull; Oatmeal',
    verified: true,
    helpfulCount: 28
  },
  {
    id: 'rev-02',
    productId: 'mira-w-01',
    author: 'Sora Tanaka',
    date: 'September 28, 2026',
    rating: 5,
    title: 'Architectural neckline perfection',
    content: 'Most turtlenecks feel constrictive, but this ribbed collar holds its shape effortlessly without choking. Truly worth the investment.',
    fit: 'True to Size',
    purchasedVariant: 'Size M &bull; Charcoal',
    verified: true,
    helpfulCount: 19
  },
  {
    id: 'rev-03',
    productId: 'mira-w-01',
    author: 'Marcus Vance',
    date: 'September 15, 2026',
    rating: 4,
    title: 'Exceptional yarn quality',
    content: 'Bought this as a gift for my partner. The packaging was immaculate and the knit has an understated, luxurious weight. Slightly generous in the sleeve length.',
    fit: 'Runs Slightly Loose',
    purchasedVariant: 'Size M &bull; Espresso',
    verified: true,
    helpfulCount: 7
  },

  // Lyra Silk Slip Dress (mira-w-02)
  {
    id: 'rev-04',
    productId: 'mira-w-02',
    author: 'Beatrice Rossi',
    date: 'October 04, 2026',
    rating: 5,
    title: 'Cut on the true bias — drapes like water',
    content: 'You can immediately feel that this is genuine 22mm silk charmeuse. The bias cut hugs the natural curves without pulling or clinging. Wore it to a gallery opening in Rome and received endless compliments.',
    fit: 'True to Size',
    purchasedVariant: 'Size S &bull; Sage Noir',
    verified: true,
    helpfulCount: 34
  },
  {
    id: 'rev-05',
    productId: 'mira-w-02',
    author: 'Aria Chen',
    date: 'September 19, 2026',
    rating: 5,
    title: 'Timeless evening uniform',
    content: 'Adjustable rouleau straps make customizing the neckline effortless. A wardrobe centerpiece.',
    fit: 'True to Size',
    purchasedVariant: 'Size XS &bull; Champagne',
    verified: true,
    helpfulCount: 14
  },

  // Solstice Wool Coat (mira-w-03)
  {
    id: 'rev-06',
    productId: 'mira-w-03',
    author: 'Ingrid Holm',
    date: 'October 14, 2026',
    rating: 5,
    title: 'A masterclass in modern outerwear',
    content: 'Substantial virgin wool that shields against cold wind without feeling like armor. The raglan sleeve construction leaves plenty of room for chunky knits underneath.',
    fit: 'True to Size',
    purchasedVariant: 'Size M &bull; Camel',
    verified: true,
    helpfulCount: 42
  },

  // Kanso Merino Crewneck (mira-m-01)
  {
    id: 'rev-07',
    productId: 'mira-m-01',
    author: 'Julian Mercer',
    date: 'September 22, 2026',
    rating: 5,
    title: 'The gold standard for daily merino',
    content: 'Non-itchy even against bare skin. Temperature regulation is remarkable during morning commutes. Fits cleanly across the chest with no billowing.',
    fit: 'True to Size',
    purchasedVariant: 'Size L &bull; Deep Navy',
    verified: true,
    helpfulCount: 23
  },
  {
    id: 'rev-08',
    productId: 'mira-m-01',
    author: 'David K.',
    date: 'August 30, 2026',
    rating: 4,
    title: 'Understated and versatile',
    content: 'Clean collar stitch and great collar tension. Wash cold by hand and dry flat &mdash; it holds its shape perfectly.',
    fit: 'True to Size',
    purchasedVariant: 'Size M &bull; Heather Moss',
    verified: true,
    helpfulCount: 11
  },

  // Sora Soft Nappa Leather Tote (mira-a-01)
  {
    id: 'rev-09',
    productId: 'mira-a-01',
    author: 'Sophia Althaus',
    date: 'October 08, 2026',
    rating: 5,
    title: 'Supple leather with deceptive capacity',
    content: 'Accommodates my 15-inch laptop, notebook, water flask, and charger with ease. The leather has developed a subtle luster over the past month. Highly recommended.',
    fit: 'True to Size',
    purchasedVariant: 'One Size &bull; Saddle Tan',
    verified: true,
    helpfulCount: 39
  }
];

// Read all reviews combining seeds and localStorage
export function getAllReviews() {
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    const customReviews = custom ? JSON.parse(custom) : [];
    return [...customReviews, ...INITIAL_REVIEWS];
  } catch {
    return INITIAL_REVIEWS;
  }
}

// Retrieve reviews for a specific product
export function getReviewsForProduct(productId) {
  const all = getAllReviews();
  return all.filter(r => r.productId === productId);
}

// Calculate rating metrics and distribution
export function getRatingSummary(productId) {
  const reviews = getReviewsForProduct(productId);
  const count = reviews.length;

  if (count === 0) {
    return {
      average: 4.8,
      count: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      trueToSizePercent: 95
    };
  }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = Number((sum / count).toFixed(1));

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let trueToSizeCount = 0;

  reviews.forEach(r => {
    if (distribution[r.rating] !== undefined) {
      distribution[r.rating] += 1;
    }
    if (r.fit === 'True to Size') {
      trueToSizeCount += 1;
    }
  });

  const trueToSizePercent = Math.round((trueToSizeCount / count) * 100) || 92;

  return {
    average,
    count,
    distribution,
    trueToSizePercent
  };
}

// Add a newly submitted review and persist in localStorage
export function addProductReview(productId, review) {
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    const customReviews = custom ? JSON.parse(custom) : [];

    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      author: review.author || 'Anonymous Client',
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      rating: Number(review.rating) || 5,
      title: review.title || 'Exceptional piece',
      content: review.content,
      fit: review.fit || 'True to Size',
      purchasedVariant: review.purchasedVariant || 'Verified Purchase',
      verified: true,
      helpfulCount: 0
    };

    customReviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customReviews));
    window.dispatchEvent(new Event('mira_reviews_updated'));

    return newReview;
  } catch (e) {
    console.warn('Could not save review:', e);
    return null;
  }
}
