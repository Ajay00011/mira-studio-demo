/**
 * MIRA STUDIO — Product Catalog
 * Exactly 12 thoughtfully curated products across 3 categories:
 * - Women (4 items)
 * - Men (4 items)
 * - Accessories (4 items)
 */

export const CATEGORIES = [
  { id: 'all', name: 'All Collection' },
  { id: 'women', name: 'Women' },
  { id: 'men', name: 'Men' },
  { id: 'accessories', name: 'Accessories' }
];

// Helper to generate bespoke editorial vector artwork for product cards
function createProductSvg(title, category, primaryColor, accentColor, iconType) {
  const icons = {
    turtleneck: `
      <path d="M140 110 C140 90, 160 80, 200 80 C240 80, 260 90, 260 110 L250 145 C235 150, 165 150, 150 145 Z" fill="${accentColor}" opacity="0.9" />
      <path d="M150 145 L90 200 L115 235 L145 200 L145 340 L255 340 L255 200 L285 235 L310 200 L250 145 Z" fill="${primaryColor}" />
      <path d="M145 200 C170 215, 230 215, 255 200" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.6"/>
      <line x1="200" y1="145" x2="200" y2="340" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.4"/>
    `,
    coat: `
      <path d="M155 90 L200 130 L245 90 L290 140 L315 350 L275 350 L260 170 L260 370 L140 370 L140 170 L125 350 L85 350 L110 140 Z" fill="${primaryColor}" />
      <path d="M175 90 L200 190 L155 190 Z" fill="${accentColor}" opacity="0.8" />
      <path d="M225 90 L200 190 L245 190 Z" fill="${accentColor}" opacity="0.8" />
      <circle cx="215" cy="225" r="4" fill="${accentColor}"/>
      <circle cx="215" cy="270" r="4" fill="${accentColor}"/>
      <circle cx="215" cy="315" r="4" fill="${accentColor}"/>
      <line x1="200" y1="190" x2="200" y2="370" stroke="${accentColor}" stroke-width="2" opacity="0.5"/>
    `,
    dress: `
      <path d="M170 95 L200 130 L230 95 L245 150 C235 200, 225 240, 265 370 L135 370 C175 240, 165 200, 155 150 Z" fill="${primaryColor}" />
      <path d="M180 90 Q200 115 220 90" stroke="${accentColor}" stroke-width="2" fill="none"/>
      <path d="M160 210 Q200 230 240 210" stroke="${accentColor}" stroke-width="1.5" fill="none" opacity="0.6"/>
      <path d="M148 310 Q200 335 252 310" stroke="${accentColor}" stroke-width="1.5" fill="none" opacity="0.4"/>
    `,
    trousers: `
      <path d="M145 110 L255 110 L265 370 L210 370 L202 210 L198 210 L190 370 L135 370 Z" fill="${primaryColor}" />
      <line x1="170" y1="130" x2="160" y2="365" stroke="${accentColor}" stroke-width="1.5" opacity="0.5"/>
      <line x1="230" y1="130" x2="240" y2="365" stroke="${accentColor}" stroke-width="1.5" opacity="0.5"/>
      <rect x="145" y="110" width="110" height="18" fill="${accentColor}" opacity="0.3"/>
    `,
    shirt: `
      <path d="M150 110 L200 135 L250 110 L305 165 L275 210 L250 180 L250 350 L150 350 L150 180 L125 210 L95 165 Z" fill="${primaryColor}" />
      <path d="M175 105 L200 135 L225 105 Z" fill="${accentColor}" opacity="0.7"/>
      <line x1="200" y1="135" x2="200" y2="350" stroke="${accentColor}" stroke-width="2" opacity="0.6"/>
      <circle cx="200" cy="170" r="3" fill="${accentColor}"/>
      <circle cx="200" cy="210" r="3" fill="${accentColor}"/>
      <circle cx="200" cy="250" r="3" fill="${accentColor}"/>
      <circle cx="200" cy="290" r="3" fill="${accentColor}"/>
      <rect x="160" y="165" width="28" height="32" rx="3" fill="none" stroke="${accentColor}" stroke-width="1.5" opacity="0.5"/>
    `,
    tote: `
      <path d="M165 140 C165 95, 235 95, 235 140" stroke="${accentColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M120 140 L280 140 L265 350 L135 350 Z" fill="${primaryColor}" rx="12"/>
      <path d="M130 190 L270 190" stroke="${accentColor}" stroke-width="1.5" opacity="0.4"/>
      <rect x="180" y="235" width="40" height="24" rx="3" fill="${accentColor}" opacity="0.4"/>
      <circle cx="200" cy="247" r="3" fill="#ffffff" opacity="0.9"/>
    `,
    cuff: `
      <ellipse cx="200" cy="220" rx="90" ry="70" fill="none" stroke="${primaryColor}" stroke-width="28" stroke-dasharray="450" stroke-dashoffset="60" stroke-linecap="round"/>
      <ellipse cx="200" cy="220" rx="90" ry="70" fill="none" stroke="${accentColor}" stroke-width="4" stroke-dasharray="450" stroke-dashoffset="60" stroke-linecap="round" opacity="0.8"/>
      <circle cx="130" cy="245" r="8" fill="${accentColor}"/>
      <circle cx="270" cy="245" r="8" fill="${accentColor}"/>
    `,
    scarf: `
      <path d="M150 100 C180 80, 220 80, 250 100 C270 120, 270 150, 250 170 C220 190, 180 190, 150 170 C130 150, 130 120, 150 100 Z" fill="${accentColor}" opacity="0.85"/>
      <path d="M170 170 L170 350 L205 350 L205 180 Z" fill="${primaryColor}"/>
      <path d="M205 180 L235 330 L200 330 Z" fill="${primaryColor}" opacity="0.9"/>
      <line x1="170" y1="350" x2="170" y2="368" stroke="${accentColor}" stroke-width="2"/>
      <line x1="180" y1="350" x2="180" y2="368" stroke="${accentColor}" stroke-width="2"/>
      <line x1="190" y1="350" x2="190" y2="368" stroke="${accentColor}" stroke-width="2"/>
      <line x1="200" y1="350" x2="200" y2="368" stroke="${accentColor}" stroke-width="2"/>
    `,
    cardholder: `
      <rect x="130" y="150" width="140" height="175" rx="8" fill="${primaryColor}"/>
      <path d="M130 195 C170 215, 230 215, 270 195" stroke="${accentColor}" stroke-width="2" fill="none"/>
      <path d="M130 235 C170 255, 230 255, 270 235" stroke="${accentColor}" stroke-width="2" fill="none"/>
      <path d="M130 275 C170 295, 230 295, 270 275" stroke="${accentColor}" stroke-width="2" fill="none"/>
      <circle cx="200" cy="305" r="4" fill="${accentColor}"/>
    `
  };

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad_${iconType}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f5f3ef"/>
          <stop offset="50%" stop-color="#edeae3"/>
          <stop offset="100%" stop-color="#e2ded4"/>
        </linearGradient>
        <radialGradient id="lightGrad_${iconType}" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="480" fill="url(#bgGrad_${iconType})"/>
      <rect width="400" height="480" fill="url(#lightGrad_${iconType})"/>
      <g transform="translate(0, 15)">
        ${icons[iconType] || icons.turtleneck}
      </g>
      <g opacity="0.35">
        <text x="200" y="445" font-family="'Playfair Display', Georgia, serif" font-size="13" letter-spacing="4" fill="#5c564c" text-anchor="middle" text-transform="uppercase">MIRA STUDIO</text>
        <line x1="80" y1="455" x2="320" y2="455" stroke="#999182" stroke-width="0.5"/>
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const PRODUCTS = [
  // ── Women (4 Products) ──────────────────────────────────────────────
  {
    id: 'mira-w-01',
    name: 'Aria Cashmere Turtleneck',
    slug: 'aria-cashmere-turtleneck',
    category: 'women',
    price: 245,
    description: 'Spun from grade-A Mongolian cashmere with a relaxed ribbed collar, seamless shoulders, and delicate micro-stitched cuffs. An effortless balance of softness and quiet structure.',
    image: createProductSvg('Aria Cashmere Turtleneck', 'Women', '#423d38', '#c4a882', 'turtleneck'),
    colors: [
      { name: 'Oatmeal', hex: '#d9d2c9' },
      { name: 'Espresso', hex: '#342922' },
      { name: 'Charcoal', hex: '#2c2c2c' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isNew: true,
    createdAt: '2026-09-15'
  },
  {
    id: 'mira-w-02',
    name: 'Lyra Silk Bias Slip Dress',
    slug: 'lyra-silk-bias-slip-dress',
    category: 'women',
    price: 290,
    description: 'Cut on the true bias from heavyweight 22mm mulberry silk charmeuse. Features adjustable delicate rouleau straps, subtle waist contouring, and an ankle-grazing fluid drape.',
    image: createProductSvg('Lyra Silk Slip Dress', 'Women', '#2f3b39', '#829a95', 'dress'),
    colors: [
      { name: 'Sage Noir', hex: '#3c4845' },
      { name: 'Champagne', hex: '#e6ded3' },
      { name: 'Midnight', hex: '#1a1f28' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    rating: 4.8,
    reviewCount: 24,
    isFeatured: true,
    isNew: false,
    createdAt: '2026-08-20'
  },
  {
    id: 'mira-w-03',
    name: 'Solstice Double-Breasted Wool Coat',
    slug: 'solstice-double-breasted-wool-coat',
    category: 'women',
    price: 520,
    description: 'Masterfully crafted in double-faced virgin wool. Designed with oversized horn buttons, notched lapels, raglan sleeves, and deep welt pockets lined in cupro.',
    image: createProductSvg('Solstice Wool Coat', 'Women', '#382c23', '#c4a882', 'coat'),
    colors: [
      { name: 'Camel', hex: '#b58f62' },
      { name: 'Onyx', hex: '#1f1e1d' },
      { name: 'Tuscan Olive', hex: '#4e503f' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    rating: 5.0,
    reviewCount: 42,
    isFeatured: true,
    isNew: true,
    createdAt: '2026-10-02'
  },
  {
    id: 'mira-w-04',
    name: 'Paloma High-Rise Linen Trouser',
    slug: 'paloma-high-rise-linen-trouser',
    category: 'women',
    price: 185,
    description: 'Woven from European flax with front pleats and a relaxed wide-leg silhouette. Tailored with clean internal binding, side slip pockets, and a clean hook-and-bar closure.',
    image: createProductSvg('Paloma Linen Trouser', 'Women', '#4a4742', '#ab9883', 'trousers'),
    colors: [
      { name: 'Raw Ecru', hex: '#e4dec8' },
      { name: 'Slate Sand', hex: '#78756e' },
      { name: 'Ink Navy', hex: '#222938' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    rating: 4.7,
    reviewCount: 19,
    isFeatured: false,
    isNew: false,
    createdAt: '2026-07-12'
  },

  // ── Men (4 Products) ────────────────────────────────────────────────
  {
    id: 'mira-m-01',
    name: 'Kanso Merino Crewneck',
    slug: 'kanso-merino-crewneck',
    category: 'men',
    price: 175,
    description: 'An understated everyday staple knit from ultra-fine 19.5-micron Australian merino wool. Naturally thermoregulating, odour-resistant, and finished with ribbed trims.',
    image: createProductSvg('Kanso Merino Crewneck', 'Men', '#24282e', '#8898aa', 'turtleneck'),
    colors: [
      { name: 'Deep Navy', hex: '#1c2434' },
      { name: 'Heather Moss', hex: '#525a4d' },
      { name: 'Bone', hex: '#e3dfd7' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    rating: 4.8,
    reviewCount: 51,
    isFeatured: true,
    isNew: false,
    createdAt: '2026-08-10'
  },
  {
    id: 'mira-m-02',
    name: 'Vanguard Relaxed Trench Coat',
    slug: 'vanguard-relaxed-trench-coat',
    category: 'men',
    price: 495,
    description: 'A modernised utilitarian silhouette tailored in water-repellent Japanese cotton gabardine. Features storm flap detailing, horn buckle belt, and back vent for graceful motion.',
    image: createProductSvg('Vanguard Trench Coat', 'Men', '#3b3834', '#bfa98e', 'coat'),
    colors: [
      { name: 'British Khaki', hex: '#948062' },
      { name: 'Washed Black', hex: '#2a2a2a' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    rating: 4.9,
    reviewCount: 31,
    isFeatured: false,
    isNew: true,
    createdAt: '2026-09-28'
  },
  {
    id: 'mira-m-03',
    name: 'Arc Heavyweight Cotton Overshirt',
    slug: 'arc-heavyweight-cotton-overshirt',
    category: 'men',
    price: 160,
    description: 'Woven from sturdy 380gsm organic cotton twill, enzyme-washed for immediate broken-in comfort. Equipped with dual chest patch pockets and tonal corozo nut buttons.',
    image: createProductSvg('Arc Cotton Overshirt', 'Men', '#383e35', '#9ab097', 'shirt'),
    colors: [
      { name: 'Olive Drab', hex: '#4b5545' },
      { name: 'Unglazed Clay', hex: '#a66b53' },
      { name: 'Chalk White', hex: '#edebe6' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    rating: 4.6,
    reviewCount: 29,
    isFeatured: false,
    isNew: false,
    createdAt: '2026-07-30'
  },
  {
    id: 'mira-m-04',
    name: 'Sartor Pleated Wide-Leg Trousers',
    slug: 'sartor-pleated-wide-leg-trousers',
    category: 'men',
    price: 210,
    description: 'Tailored in tropical wool blend for year-round breathability. Double forward pleats create an elegant drape, finished with side adjusters and a gentle taper at the hem.',
    image: createProductSvg('Sartor Pleated Trousers', 'Men', '#2a2829', '#8a8484', 'trousers'),
    colors: [
      { name: 'Charcoal Mélange', hex: '#37373b' },
      { name: 'Espresso', hex: '#3d2e26' },
      { name: 'Warm Taupe', hex: '#877b73' }
    ],
    sizes: ['30', '32', '34', '36'],
    inStock: true,
    rating: 4.8,
    reviewCount: 16,
    isFeatured: false,
    isNew: true,
    createdAt: '2026-09-05'
  },

  // ── Accessories (4 Products) ────────────────────────────────────────
  {
    id: 'mira-a-01',
    name: 'Sora Soft Nappa Leather Tote',
    slug: 'sora-soft-nappa-leather-tote',
    category: 'accessories',
    price: 340,
    description: 'Handcrafted in full-grain Italian nappa leather that softens with each wear. Generous interior fits a 15-inch laptop, lined in durable cotton canvas with magnetic closure.',
    image: createProductSvg('Sora Leather Tote', 'Accessories', '#362a22', '#c79c6d', 'tote'),
    colors: [
      { name: 'Saddle Tan', hex: '#9e673a' },
      { name: 'Noir', hex: '#171717' },
      { name: 'Warm Cream', hex: '#ebe4d8' }
    ],
    sizes: ['One Size'],
    inStock: true,
    rating: 4.9,
    reviewCount: 47,
    isFeatured: false,
    isNew: true,
    createdAt: '2026-09-18'
  },
  {
    id: 'mira-a-02',
    name: 'Eos Sculptural Brass Cuff',
    slug: 'eos-sculptural-brass-cuff',
    category: 'accessories',
    price: 95,
    description: 'Solid recycled jeweller’s brass, hand-finished with a brushed satin patina and sealed with a hypoallergenic protective coat. An organic curved form that hugs the wrist comfortably.',
    image: createProductSvg('Eos Brass Cuff', 'Accessories', '#59441e', '#d4af37', 'cuff'),
    colors: [
      { name: 'Satin Brass', hex: '#c5a059' },
      { name: 'Silver Rhodium', hex: '#cfd2d6' }
    ],
    sizes: ['S/M', 'M/L'],
    inStock: true,
    rating: 4.7,
    reviewCount: 33,
    isFeatured: false,
    isNew: false,
    createdAt: '2026-06-14'
  },
  {
    id: 'mira-a-03',
    name: 'Nomad Alpaca Fringed Scarf',
    slug: 'nomad-alpaca-fringed-scarf',
    category: 'accessories',
    price: 135,
    description: 'Woven in Peru from 70% baby alpaca and 30% fine highland wool. Measuring an expansive 200cm × 70cm, finished with 10cm hand-twisted fringing along the borders.',
    image: createProductSvg('Nomad Alpaca Scarf', 'Accessories', '#3d342f', '#baa28c', 'scarf'),
    colors: [
      { name: 'Oatmeal Check', hex: '#cfc4b4' },
      { name: 'Burnt Ochre', hex: '#ab653e' },
      { name: 'Forest Shadow', hex: '#2d3b32' }
    ],
    sizes: ['One Size'],
    inStock: true,
    rating: 4.9,
    reviewCount: 22,
    isFeatured: false,
    isNew: true,
    createdAt: '2026-10-01'
  },
  {
    id: 'mira-a-04',
    name: 'Aura Minimalist Leather Cardholder',
    slug: 'aura-minimalist-leather-cardholder',
    category: 'accessories',
    price: 70,
    description: 'Vegetable-tanned French calfskin with four exterior card slots and a central folded-currency pocket. Hand-burnished edges and heat-stamped foil branding.',
    image: createProductSvg('Aura Cardholder', 'Accessories', '#3b2f28', '#b89474', 'cardholder'),
    colors: [
      { name: 'Caramel', hex: '#a66d3f' },
      { name: 'Black Caviar', hex: '#1c1b1a' },
      { name: 'Forest Green', hex: '#263b2f' }
    ],
    sizes: ['One Size'],
    inStock: true,
    rating: 4.8,
    reviewCount: 56,
    isFeatured: false,
    isNew: false,
    createdAt: '2026-05-20'
  }
];

// Helper functions for easy querying
export function getProductBySlug(slug) {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

export function getRelatedProducts(currentProduct, limit = 3) {
  return PRODUCTS
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, limit);
}
