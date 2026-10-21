import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import Toast from '../components/ui/Toast';
import usePageTransition from '../hooks/usePageTransition';
import useScrollReveal from '../hooks/useScrollReveal';
import './Orders.css';

export default function Orders() {
  const transitionClass = usePageTransition();
  const pageRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { orders, getOrderById, advanceOrderStatus, totalOrders } = useOrders();
  const { addToCart } = useCart();

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  // Toast notification state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Currently active selected order (default to query param ?id=, or latest order)
  const initialOrderId = searchParams.get('id');
  const [selectedOrderId, setSelectedOrderId] = useState(() => {
    if (initialOrderId) return initialOrderId;
    return orders[0]?.orderNumber || null;
  });

  // Keep selected order updated when query param changes
  useEffect(() => {
    const paramId = searchParams.get('id');
    if (paramId) {
      setSelectedOrderId(paramId);
    }
  }, [searchParams]);

  const activeOrder = useMemo(() => {
    if (!selectedOrderId) return orders[0] || null;
    return getOrderById(selectedOrderId) || orders[0] || null;
  }, [selectedOrderId, orders, getOrderById]);

  useScrollReveal(pageRef, [activeOrder?.orderNumber, orders.length]);

  // Handle order search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError('');
    const clean = searchQuery.trim();
    if (!clean) {
      setSearchError('Please enter an order number (e.g. MIRA-849201) or email.');
      return;
    }

    const found = getOrderById(clean);
    if (found) {
      setSelectedOrderId(found.orderNumber);
      setSearchParams({ id: found.orderNumber });
      setSearchQuery('');
    } else {
      // Check by email
      const byEmail = orders.filter(o =>
        o.shippingAddress?.email?.toLowerCase() === clean.toLowerCase()
      );
      if (byEmail.length > 0) {
        setSelectedOrderId(byEmail[0].orderNumber);
        setSearchParams({ id: byEmail[0].orderNumber });
        setSearchQuery('');
      } else {
        setSearchError(`No order found matching "${clean}". Try demo order MIRA-849201.`);
      }
    }
  };

  // Re-Order all items into cart
  const handleReorder = () => {
    if (!activeOrder?.items?.length) return;

    activeOrder.items.forEach(item => {
      const productObj = {
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        image: item.image,
        inStock: true
      };
      addToCart(
        productObj,
        { name: item.selectedColor, hex: '#1a1a1a' },
        item.selectedSize,
        item.quantity
      );
    });

    setToastTitle('Order Added to Bag');
    setToastMessage(`Added ${activeOrder.items.length} items from #${activeOrder.orderNumber} to your shopping bag.`);
    setToastOpen(true);
  };

  // Simulate courier delivery progress
  const handleAdvanceStep = () => {
    if (!activeOrder) return;
    advanceOrderStatus(activeOrder.orderNumber);
    setToastTitle('Delivery Status Updated');
    setToastMessage(`Simulated shipment progression for #${activeOrder.orderNumber}.`);
    setToastOpen(true);
  };

  // Print receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  // Helper for status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'order-status-badge--delivered';
      case 'out_for_delivery':
        return 'order-status-badge--out';
      case 'in_transit':
        return 'order-status-badge--transit';
      case 'in_atelier':
        return 'order-status-badge--atelier';
      default:
        return 'order-status-badge--confirmed';
    }
  };

  return (
    <main className={`main-content orders-page ${transitionClass}`} ref={pageRef}>
      <div className="container">
        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb__link">Home</Link>
          <span className="breadcrumb__separator" aria-hidden="true">/</span>
          <span className="breadcrumb__current" aria-current="page">Order History &amp; Tracking</span>
        </nav>

        {/* ── Page Header ────────────────────────────────────────── */}
        <div className="orders-header">
          <div>
            <span className="orders-header__eyebrow">Studio Client Services</span>
            <h1 className="orders-header__title">Order History &amp; Live Tracking</h1>
            <p className="orders-header__lead">
              Track carbon-neutral atelier dispatch, monitor live courier milestones, and retrieve digital receipts.
            </p>
          </div>

          {/* Quick Lookup Form */}
          <form className="orders-search-form" onSubmit={handleSearch} role="search" aria-label="Order lookup">
            <div className="orders-search-input-wrap">
              <svg className="orders-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
              </svg>
              <input
                type="text"
                className="orders-search-input"
                placeholder="Lookup order # or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Order number or email address"
              />
              <button type="submit" className="btn btn--primary orders-search-btn">
                Track
              </button>
            </div>
            {searchError && <p className="orders-search-error">{searchError}</p>}
            <div className="orders-search-hints">
              <span>Quick demo shortcuts:</span>
              <button
                type="button"
                className="orders-search-hint-btn"
                onClick={() => { setSelectedOrderId('MIRA-849201'); setSearchParams({ id: 'MIRA-849201' }); }}
              >
                #MIRA-849201 (In Transit)
              </button>
              <button
                type="button"
                className="orders-search-hint-btn"
                onClick={() => { setSelectedOrderId('MIRA-617392'); setSearchParams({ id: 'MIRA-617392' }); }}
              >
                #MIRA-617392 (Delivered)
              </button>
            </div>
          </form>
        </div>

        {/* ── Main Two-Column Layout ─────────────────────────────── */}
        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty__icon" aria-hidden="true">📦</div>
            <h2>No Orders Placed Yet</h2>
            <p>You haven't placed any orders yet. Discover our latest collection to place a simulated order.</p>
            <Link to="/shop" className="btn btn--primary btn--lg">Explore Shop &rarr;</Link>
          </div>
        ) : (
          <div className="orders-layout">
            {/* Left Column: All Orders Sidebar */}
            <aside className="orders-sidebar" aria-label="Past orders">
              <div className="orders-sidebar__header">
                <h2 className="orders-sidebar__title">All Orders ({orders.length})</h2>
              </div>

              <div className="orders-sidebar__list">
                {orders.map(order => {
                  const isSelected = order.orderNumber === activeOrder?.orderNumber;
                  return (
                    <button
                      key={order.orderNumber}
                      type="button"
                      className={`orders-sidebar__item${isSelected ? ' active' : ''}`}
                      onClick={() => {
                        setSelectedOrderId(order.orderNumber);
                        setSearchParams({ id: order.orderNumber });
                      }}
                      aria-current={isSelected ? 'true' : 'false'}
                    >
                      <div className="orders-sidebar__item-top">
                        <span className="orders-sidebar__item-id">#{order.orderNumber}</span>
                        <span className={`order-status-badge ${getStatusBadgeClass(order.status)}`}>
                          {order.statusLabel}
                        </span>
                      </div>

                      <div className="orders-sidebar__item-mid">
                        <span className="orders-sidebar__item-date">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="orders-sidebar__item-total">${order.total}</span>
                      </div>

                      <div className="orders-sidebar__item-thumbs">
                        {order.items.slice(0, 3).map((it, idx) => (
                          <div key={idx} className="orders-sidebar__thumb-wrap" title={`${it.name} (${it.selectedSize})`}>
                            {it.image ? (
                              <img src={it.image} alt={it.name} className="orders-sidebar__thumb" />
                            ) : (
                              <span className="orders-sidebar__thumb-fallback">👕</span>
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <span className="orders-sidebar__thumbs-more">+{order.items.length - 3}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right Column: Detailed Tracking & Receipt View */}
            {activeOrder && (
              <section className="orders-detail" aria-labelledby="active-order-title">
                {/* Order Hero Card */}
                <div className="order-hero-card">
                  <div className="order-hero-card__header">
                    <div>
                      <span className="order-hero-card__eyebrow">Package Tracking</span>
                      <h2 id="active-order-title" className="order-hero-card__title">
                        Order #{activeOrder.orderNumber}
                      </h2>
                      <p className="order-hero-card__placed">
                        Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })} &bull; {activeOrder.items.length} {activeOrder.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    <div className="order-hero-card__badge-group">
                      <span className={`order-status-badge order-status-badge--lg ${getStatusBadgeClass(activeOrder.status)}`}>
                        <span className="order-status-badge__dot" aria-hidden="true" />
                        {activeOrder.statusLabel}
                      </span>
                    </div>
                  </div>

                  {/* Shipment Tracking Meta */}
                  <div className="order-tracking-meta-grid">
                    <div className="order-tracking-meta-cell">
                      <span className="order-tracking-meta-label">Carrier &amp; Method</span>
                      <span className="order-tracking-meta-val">{activeOrder.carrier}</span>
                    </div>
                    <div className="order-tracking-meta-cell">
                      <span className="order-tracking-meta-label">Tracking Number</span>
                      <span className="order-tracking-meta-val tracking-mono">{activeOrder.trackingNumber}</span>
                    </div>
                    <div className="order-tracking-meta-cell">
                      <span className="order-tracking-meta-label">Estimated Delivery</span>
                      <span className="order-tracking-meta-val order-tracking-meta-val--highlight">
                        {activeOrder.estimatedDelivery}
                      </span>
                    </div>
                  </div>

                  {/* ── Visual Package Tracker Timeline ────────────────── */}
                  <div className="order-timeline-box">
                    <div className="order-timeline-box__header">
                      <h3 className="order-timeline-box__title">Shipment Progress</h3>
                      {activeOrder.status !== 'delivered' && (
                        <button
                          type="button"
                          className="btn btn--secondary btn--sm order-timeline-simulate-btn"
                          onClick={handleAdvanceStep}
                          title="Click to simulate delivery advancing to the next courier stage"
                        >
                          ⚡ Advance Courier Step
                        </button>
                      )}
                    </div>

                    <div className="order-stepper">
                      {activeOrder.timeline.map((step, idx) => {
                        const isCurrent = step.completed && (
                          idx === activeOrder.timeline.length - 1 ||
                          !activeOrder.timeline[idx + 1]?.completed
                        );
                        return (
                          <div
                            key={step.stage}
                            className={`order-step${step.completed ? ' order-step--completed' : ''}${isCurrent ? ' order-step--current' : ''}`}
                          >
                            <div className="order-step__marker" aria-hidden="true">
                              {step.completed ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>
                            <div className="order-step__info">
                              <span className="order-step__title">{step.title}</span>
                              <span className="order-step__desc">{step.description}</span>
                              <span className="order-step__time">{step.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── Order Receipt & Line Items ─────────────────────── */}
                <div className="order-receipt-card" id="digital-receipt">
                  <div className="order-receipt-card__header">
                    <div>
                      <h3 className="order-receipt-card__title">Digital Receipt &amp; Summary</h3>
                      <p className="order-receipt-card__sub">Fictional Demo Purchase &bull; Guaranteed Sustainable</p>
                    </div>

                    <div className="order-receipt-card__actions">
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={handlePrintReceipt}
                      >
                        🖨️ Print Receipt
                      </button>
                      <button
                        type="button"
                        className="btn btn--primary btn--sm"
                        onClick={handleReorder}
                      >
                        Buy Again
                      </button>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="order-receipt-items">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="order-receipt-item">
                        <Link to={`/product/${item.slug}`} className="order-receipt-item__media">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="order-receipt-item__img" />
                          ) : (
                            <div className="order-receipt-item__img-fallback">👕</div>
                          )}
                        </Link>

                        <div className="order-receipt-item__details">
                          <Link to={`/product/${item.slug}`} className="order-receipt-item__name">
                            {item.name}
                          </Link>
                          <div className="order-receipt-item__meta">
                            <span>Colour: <strong>{item.selectedColor}</strong></span>
                            <span>&bull;</span>
                            <span>Size: <strong>{item.selectedSize}</strong></span>
                            <span>&bull;</span>
                            <span>Qty: <strong>{item.quantity}</strong></span>
                          </div>
                        </div>

                        <div className="order-receipt-item__price">
                          ${item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Addresses and Financial Totals */}
                  <div className="order-receipt-footer-grid">
                    <div className="order-receipt-footer-col">
                      <span className="order-receipt-label">Destination Address</span>
                      <p className="order-receipt-val">
                        <strong>{activeOrder.shippingAddress.name}</strong><br />
                        {activeOrder.shippingAddress.address}
                        {activeOrder.shippingAddress.apartment ? `, ${activeOrder.shippingAddress.apartment}` : ''}<br />
                        {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.postalCode}<br />
                        {activeOrder.shippingAddress.country}<br />
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                          Email: {activeOrder.shippingAddress.email}
                        </span>
                      </p>
                    </div>

                    <div className="order-receipt-footer-col">
                      <span className="order-receipt-label">Payment Information</span>
                      <p className="order-receipt-val">
                        <strong>{activeOrder.paymentLabel}</strong><br />
                        <span>{activeOrder.paymentMasked}</span><br />
                        {activeOrder.paymentMethod === 'cod' ? (
                          <span style={{ color: 'var(--color-success)', fontWeight: 'var(--fw-medium)', display: 'inline-block', marginTop: '4px' }}>
                            💵 Settled directly upon delivery
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-text-secondary)', fontSize: '11px', display: 'inline-block', marginTop: '4px' }}>
                            Payment authorized &bull; SSL Encrypted
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="order-receipt-footer-col order-receipt-totals">
                      <div className="order-receipt-total-row">
                        <span>Subtotal</span>
                        <span>${activeOrder.subtotal}</span>
                      </div>
                      <div className="order-receipt-total-row">
                        <span>Carbon-Neutral Shipping</span>
                        <span>{activeOrder.shippingCost === 0 ? 'FREE' : `$${activeOrder.shippingCost}`}</span>
                      </div>
                      <div className="order-receipt-total-row order-receipt-total-row--final">
                        <span>Grand Total</span>
                        <span>${activeOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Need Help Banner */}
                <div className="order-help-banner">
                  <span className="order-help-banner__icon">💬</span>
                  <div className="order-help-banner__text">
                    <strong>Need assistance with this order?</strong>
                    <p>Our Milan concierge team is available Monday through Saturday for complimentary fit advice and exchange guidance.</p>
                  </div>
                  <Link to="/contact" className="btn btn--secondary btn--sm">
                    Contact Studio
                  </Link>
                </div>
              </section>
            )}
          </div>
        )}
      </div>

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
