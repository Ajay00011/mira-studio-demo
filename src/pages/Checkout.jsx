import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import usePageTransition from '../hooks/usePageTransition';
import useScrollReveal from '../hooks/useScrollReveal';
import './Checkout.css';

export default function Checkout() {
  const transitionClass = usePageTransition();
  const pageRef = useRef(null);

  const {
    cart,
    totalItems,
    subtotal,
    shippingCost,
    total,
    clearCart
  } = useCart();

  const { addOrder } = useOrders();
  const { currentUser, isAuthenticated, updateAddress } = useAuth();

  // Address confirmation state
  const [addressConfirmed, setAddressConfirmed] = useState(true);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressData, setEditAddressData] = useState({
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: ''
  });

  // Populate address data from registered user
  useEffect(() => {
    if (currentUser) {
      setEditAddressData({
        street: currentUser.address?.street || '',
        apartment: currentUser.address?.apartment || '',
        city: currentUser.address?.city || '',
        state: currentUser.address?.state || '',
        postalCode: currentUser.address?.postalCode || '',
        country: currentUser.address?.country || 'United States',
        phone: currentUser.phone || ''
      });
    }
  }, [currentUser]);

  // Payment form fields
  const [paymentData, setPaymentData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  useEffect(() => {
    if (currentUser) {
      setPaymentData(prev => ({
        ...prev,
        cardholderName: prev.cardholderName || `${currentUser.firstName} ${currentUser.lastName}`
      }));
    }
  }, [currentUser]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'

  // Completed order state
  const [completedOrder, setCompletedOrder] = useState(null);

  useScrollReveal(pageRef);

  // Field change handler with auto-formatting for payment
  const handlePaymentChange = (field, value) => {
    let formattedValue = value;

    // Auto-format card number into 4-digit chunks
    if (field === 'cardNumber') {
      const raw = value.replace(/\D/g, '').slice(0, 16);
      formattedValue = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    // Auto-format expiry into MM/YY
    if (field === 'expiry') {
      const raw = value.replace(/\D/g, '').slice(0, 4);
      if (raw.length >= 3) {
        formattedValue = `${raw.slice(0, 2)}/${raw.slice(2)}`;
      } else {
        formattedValue = raw;
      }
    }

    // Limit CVC to digits
    if (field === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setPaymentData(prev => ({ ...prev, [field]: formattedValue }));

    // Clear field error on edit
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Save address edit inline
  const handleSaveAddressEdit = (e) => {
    e.preventDefault();
    if (!editAddressData.street.trim() || !editAddressData.city.trim() || !editAddressData.postalCode.trim()) {
      alert('Please fill in street address, city, and postal code.');
      return;
    }
    updateAddress(editAddressData);
    setIsEditingAddress(false);
    setAddressConfirmed(true);
  };

  // Form validation
  const validateForm = () => {
    const errs = {};

    if (!addressConfirmed) {
      errs.address = 'Please check the box to confirm your delivery address before proceeding.';
    }

    // Payment validation (only required if Online Payment is selected)
    if (paymentMethod === 'online') {
      if (!paymentData.cardholderName.trim()) {
        errs.cardholderName = 'Cardholder name is required.';
      }

      const rawCard = paymentData.cardNumber.replace(/\s/g, '');
      if (!rawCard) {
        errs.cardNumber = 'Card number is required.';
      } else if (rawCard.length < 16) {
        errs.cardNumber = 'Card number must be 16 digits (dummy numbers allowed).';
      }

      if (!paymentData.expiry.trim()) {
        errs.expiry = 'MM/YY required.';
      } else {
        const [m, y] = paymentData.expiry.split('/');
        const monthNum = parseInt(m, 10);
        if (!m || !y || monthNum < 1 || monthNum > 12) {
          errs.expiry = 'Valid MM/YY required.';
        }
      }

      if (!paymentData.cvc.trim()) {
        errs.cvc = 'CVC required.';
      } else if (paymentData.cvc.length < 3) {
        errs.cvc = '3 digits min.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Simulate payment processing
    setTimeout(() => {
      const fakeOrderNumber = `MIRA-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderSnapshot = {
        orderNumber: fakeOrderNumber,
        items: [...cart],
        subtotal,
        shippingCost,
        total,
        shippingAddress: {
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          address: currentUser.address?.street || editAddressData.street,
          apartment: currentUser.address?.apartment || editAddressData.apartment,
          city: currentUser.address?.city || editAddressData.city,
          state: currentUser.address?.state || editAddressData.state,
          postalCode: currentUser.address?.postalCode || editAddressData.postalCode,
          country: currentUser.address?.country || editAddressData.country,
          email: currentUser.email,
          phone: currentUser.phone || editAddressData.phone
        },
        paymentMethod: paymentMethod, // 'online' or 'cod'
        paymentLabel: paymentMethod === 'online' ? 'Online Payment (Simulated)' : 'Cash on Delivery (COD)',
        paymentMasked: paymentMethod === 'online'
          ? `Simulated Card ending in •••• ${paymentData.cardNumber.slice(-4) || '4242'}`
          : 'Cash / Contactless on Doorstep Arrival',
        placedAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      };

      const savedOrder = addOrder(orderSnapshot);
      setCompletedOrder(savedOrder);
      clearCart(); // Clear bag after successful demo checkout
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  // ── Render 1: Order Confirmation Screen ─────────────────────────
  if (completedOrder) {
    return (
      <main className={`main-content checkout-page ${transitionClass}`} ref={pageRef}>
        <div className="container">
          <div className="order-confirmation">
            <div className="order-confirmation__icon-circle" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <p className="order-confirmation__eyebrow">Simulated Order Placed</p>
            <h1 className="order-confirmation__title">Thank You for Your Order</h1>

            <div className="order-confirmation__order-number">
              Order #{completedOrder.orderNumber}
            </div>

            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)', maxWidth: '520px', lineHeight: 'var(--lh-relaxed)' }}>
              A simulated order confirmation has been created for <strong>{completedOrder.shippingAddress.name}</strong>. Because this is a fictional demo store,
              no physical package will be shipped.
            </p>

            {/* Order Card Recap */}
            <div className="order-confirmation__card">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-medium)' }}>
                Order Summary &bull; ${completedOrder.total}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
                    <span>{item.quantity} &times; {item.name} ({item.selectedColor}, {item.selectedSize})</span>
                    <span style={{ fontWeight: 'var(--fw-semibold)' }}>${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-confirmation__details-grid">
                <div>
                  <div className="order-confirmation__field-label">Confirmed Delivery Address</div>
                  <div className="order-confirmation__field-val">
                    {completedOrder.shippingAddress.name}<br />
                    {completedOrder.shippingAddress.address}
                    {completedOrder.shippingAddress.apartment ? `, ${completedOrder.shippingAddress.apartment}` : ''}<br />
                    {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.postalCode}<br />
                    {completedOrder.shippingAddress.country}
                  </div>
                </div>

                <div>
                  <div className="order-confirmation__field-label">Payment Method</div>
                  <div className="order-confirmation__field-val">
                    <strong>{completedOrder.paymentLabel}</strong><br />
                    <span>{completedOrder.paymentMasked}</span><br />
                    <span>Total Amount: ${completedOrder.total}</span><br />
                    {completedOrder.paymentMethod === 'cod' ? (
                      <span style={{ color: 'var(--color-success)', fontWeight: 'var(--fw-medium)', display: 'inline-block', marginTop: '4px' }}>
                        💵 Cash/Card will be collected upon doorstep delivery
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-secondary)', display: 'inline-block', marginTop: '4px' }}>
                        Estimated Courier: 3-5 Business Days
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="order-confirmation__actions">
              <Link to={`/orders?id=${completedOrder.orderNumber}`} className="btn btn--primary btn--lg">
                📦 Track Package &amp; Digital Receipt &rarr;
              </Link>
              <Link to="/shop" className="btn btn--secondary btn--lg">
                Explore More Pieces
              </Link>
              <Link to="/" className="btn btn--ghost btn--lg">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Render 2: Unauthenticated User Guard (MANDATORY REGISTRATION REQUIREMENT) ──
  if (!isAuthenticated) {
    return (
      <main className={`main-content checkout-page ${transitionClass}`} ref={pageRef}>
        <div className="container">
          <div className="checkout-auth-gate">
            <div className="checkout-auth-gate__icon-box" aria-hidden="true">
              🔒
            </div>
            <span className="checkout-header__eyebrow">Studio Policy Notice</span>
            <h1 className="checkout-auth-gate__title">
              Registration Required to Purchase
            </h1>
            <p className="checkout-auth-gate__desc">
              Before purchasing any garments from Mira Studio, client registration is mandatory.
              Your primary delivery address will be saved securely during registration, and automatically
              loaded for quick verification whenever you confirm an order.
            </p>

            <div className="checkout-auth-gate__actions">
              <Link
                to="/register?redirect=/checkout"
                className="btn btn--primary btn--lg checkout-auth-gate__btn"
              >
                Create Account &amp; Save Address &rarr;
              </Link>

              <Link
                to="/login?redirect=/checkout"
                className="btn btn--secondary btn--lg checkout-auth-gate__btn"
              >
                Already Registered? Sign In
              </Link>
            </div>

            <div className="checkout-auth-gate__footer">
              <p>
                Need immediate testing? You can also use the <strong>One-Click Demo Sign In</strong> on the login page.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Render 3: Empty Cart Guard ──────────────────────────────────
  if (cart.length === 0) {
    return (
      <main className={`main-content checkout-page ${transitionClass}`} ref={pageRef}>
        <div className="container" style={{ textAlign: 'center', paddingBlock: 'var(--space-4xl)' }}>
          <p className="checkout-header__eyebrow">Demo Checkout</p>
          <h1 className="checkout-header__title" style={{ marginBottom: 'var(--space-md)' }}>
            Your Shopping Bag is Empty
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: '480px', marginInline: 'auto' }}>
            Please select items from the catalog before proceeding to checkout.
          </p>
          <Link to="/shop" className="btn btn--primary btn--lg">
            Return to Shop
          </Link>
        </div>
      </main>
    );
  }

  // ── Render 4: Active Checkout Form for Authenticated Clients ────
  return (
    <main className={`main-content checkout-page ${transitionClass}`} ref={pageRef}>
      <div className="container">
        {/* Prominent Demo Disclaimer Banner */}
        <div className="demo-banner" role="alert" aria-label="Demo checkout warning">
          <span className="demo-banner__icon" aria-hidden="true">&#9888;</span>
          <div className="demo-banner__content">
            <span className="demo-banner__title">
              Demo Checkout Simulation — No Real Payment is Processed
            </span>
            <span className="demo-banner__text">
              Signed in as <strong>{currentUser.firstName} {currentUser.lastName}</strong> ({currentUser.email}).
              No real credit cards are charged.
            </span>
          </div>
        </div>

        <header className="checkout-header">
          <p className="checkout-header__eyebrow">Studio Client Order Confirmation</p>
          <h1 className="checkout-header__title">Express Checkout</h1>
        </header>

        <div className="checkout-layout">
          {/* ── Form Column (Left) ────────────────────────────────── */}
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>

            {/* ── Step 1: Confirm Saved Delivery Address ───────────── */}
            <section className="checkout-section" aria-labelledby="step-address-heading">
              <div className="checkout-section__header-row">
                <h2 className="checkout-section__title" id="step-address-heading">
                  <span className="checkout-section__step-num">1</span>
                  Confirm Delivery Address
                </h2>
                <span className="checkout-saved-badge">
                  ✓ Saved from Registration
                </span>
              </div>

              <p className="checkout-section__lead">
                Confirm your primary shipping address saved during registration:
              </p>

              {/* Display Address Card */}
              {!isEditingAddress ? (
                <div className="checkout-address-confirm-card">
                  <div className="checkout-address-confirm-card__top">
                    <div>
                      <span className="checkout-address-name">
                        {currentUser.firstName} {currentUser.lastName}
                      </span>
                      <span className="checkout-address-contact">
                        {currentUser.email} &bull; {currentUser.phone || 'Phone on file'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn btn--secondary btn--sm"
                      onClick={() => setIsEditingAddress(true)}
                    >
                      Edit Address
                    </button>
                  </div>

                  <p className="checkout-address-lines">
                    {currentUser.address?.street}
                    {currentUser.address?.apartment ? `, ${currentUser.address.apartment}` : ''}<br />
                    {currentUser.address?.city}{currentUser.address?.state ? `, ${currentUser.address.state}` : ''} {currentUser.address?.postalCode}<br />
                    {currentUser.address?.country}
                  </p>

                  <label className="checkout-address-confirm-checkbox">
                    <input
                      type="checkbox"
                      checked={addressConfirmed}
                      onChange={e => {
                        setAddressConfirmed(e.target.checked);
                        if (errors.address) {
                          setErrors(prev => {
                            const next = { ...prev };
                            delete next.address;
                            return next;
                          });
                        }
                      }}
                    />
                    <span>I confirm this is my delivery address for this order</span>
                  </label>

                  {errors.address && (
                    <p className="form-field__error" style={{ marginTop: 'var(--space-2xs)' }}>
                      {errors.address}
                    </p>
                  )}
                </div>
              ) : (
                /* Inline Address Editor */
                <div className="checkout-address-edit-box">
                  <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--space-sm)' }}>
                    Update Saved Delivery Address
                  </h3>
                  <div className="checkout-address-form-fields">
                    <Input
                      id="edit-street"
                      label="Street Address"
                      value={editAddressData.street}
                      onChange={e => setEditAddressData(d => ({ ...d, street: e.target.value }))}
                      required
                    />
                    <Input
                      id="edit-apt"
                      label="Apartment, Suite (Optional)"
                      value={editAddressData.apartment}
                      onChange={e => setEditAddressData(d => ({ ...d, apartment: e.target.value }))}
                    />
                    <div className="checkout-form__row-3">
                      <Input
                        id="edit-city"
                        label="City"
                        value={editAddressData.city}
                        onChange={e => setEditAddressData(d => ({ ...d, city: e.target.value }))}
                        required
                      />
                      <Input
                        id="edit-state"
                        label="State"
                        value={editAddressData.state}
                        onChange={e => setEditAddressData(d => ({ ...d, state: e.target.value }))}
                      />
                      <Input
                        id="edit-postal"
                        label="Postal / ZIP"
                        value={editAddressData.postalCode}
                        onChange={e => setEditAddressData(d => ({ ...d, postalCode: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-md)' }}>
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={handleSaveAddressEdit}
                    >
                      Save &amp; Confirm Address
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => setIsEditingAddress(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* ── Step 2: Delivery Method ──────────────────────────── */}
            <section className="checkout-section" aria-labelledby="step-delivery-heading">
              <h2 className="checkout-section__title" id="step-delivery-heading">
                <span className="checkout-section__step-num">2</span>
                Delivery Method
              </h2>

              <div className="shipping-methods">
                <label className="shipping-method-option active">
                  <div className="shipping-method-option__left">
                    <input
                      type="radio"
                      name="shipping-method"
                      checked={true}
                      readOnly
                      aria-label="Standard Carbon-Neutral Delivery"
                    />
                    <div>
                      <div className="shipping-method-option__name">
                        DHL Express Carbon-Neutral Shipping
                      </div>
                      <div className="shipping-method-option__desc">
                        3–5 business days &bull; Tracked &amp; signed delivery
                      </div>
                    </div>
                  </div>
                  <div className="shipping-method-option__price">
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
                  </div>
                </label>
              </div>
            </section>

            {/* ── Step 3: Payment Method (Online vs COD) ───────────── */}
            <section className="checkout-section" aria-labelledby="step-payment-heading">
              <h2 className="checkout-section__title" id="step-payment-heading">
                <span className="checkout-section__step-num">3</span>
                Payment Option
              </h2>

              {/* Payment Method Selector Tabs */}
              <div className="payment-options-grid" role="radiogroup" aria-label="Select payment method">
                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === 'online'}
                  className={`payment-option-card ${paymentMethod === 'online' ? 'payment-option-card--active' : ''}`}
                  onClick={() => { setPaymentMethod('online'); setErrors({}); }}
                >
                  <div className="payment-option-card__header">
                    <span className="payment-option-card__radio" aria-hidden="true" />
                    <span className="payment-option-card__title">Online Payment</span>
                  </div>
                  <p className="payment-option-card__desc">
                    Instant simulated checkout via Credit Card or Debit Card.
                  </p>
                  <div className="payment-option-card__badges" aria-hidden="true">
                    <span>💳 Visa</span>
                    <span>Mastercard</span>
                    <span>Amex</span>
                  </div>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === 'cod'}
                  className={`payment-option-card ${paymentMethod === 'cod' ? 'payment-option-card--active' : ''}`}
                  onClick={() => { setPaymentMethod('cod'); setErrors({}); }}
                >
                  <div className="payment-option-card__header">
                    <span className="payment-option-card__radio" aria-hidden="true" />
                    <span className="payment-option-card__title">Cash on Delivery</span>
                  </div>
                  <p className="payment-option-card__desc">
                    Pay in cash or card on doorstep handover upon package arrival.
                  </p>
                  <div className="payment-option-card__badges payment-option-card__badges--cod" aria-hidden="true">
                    <span>💵 Doorstep Cash</span>
                    <span>POS Terminal</span>
                  </div>
                </button>
              </div>

              {/* Conditional Payment UI */}
              {paymentMethod === 'online' ? (
                <div className="payment-fields-box">
                  <div className="payment-badge">
                    <span aria-hidden="true">🔒</span> 256-bit Simulated Encryption &bull; Demo Mode
                  </div>

                  <Input
                    id="checkout-cardholderName"
                    label="Cardholder Name"
                    value={paymentData.cardholderName}
                    onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                    placeholder="Sophia Laurent"
                    required
                    error={errors.cardholderName}
                    autoComplete="cc-name"
                  />

                  <Input
                    id="checkout-cardNumber"
                    label="Card Number"
                    value={paymentData.cardNumber}
                    onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    required
                    error={errors.cardNumber}
                    autoComplete="cc-number"
                    maxLength={19}
                  />

                  <div className="checkout-form__row-2">
                    <Input
                      id="checkout-expiry"
                      label="Expiry Date"
                      value={paymentData.expiry}
                      onChange={(e) => handlePaymentChange('expiry', e.target.value)}
                      placeholder="MM/YY"
                      required
                      error={errors.expiry}
                      autoComplete="cc-exp"
                      maxLength={5}
                    />

                    <Input
                      id="checkout-cvc"
                      label="Security Code (CVC)"
                      value={paymentData.cvc}
                      onChange={(e) => handlePaymentChange('cvc', e.target.value)}
                      placeholder="123"
                      required
                      error={errors.cvc}
                      autoComplete="cc-csc"
                      maxLength={4}
                    />
                  </div>
                </div>
              ) : (
                /* Cash on Delivery Explainer Box */
                <div className="cod-details-box" role="region" aria-label="Cash on Delivery terms">
                  <div className="cod-details-box__icon" aria-hidden="true">
                    📦
                  </div>
                  <div className="cod-details-box__content">
                    <h4 className="cod-details-box__title">Doorstep Cash on Delivery (COD)</h4>
                    <p className="cod-details-box__text">
                      No online payment is needed today. Please have the exact total of <strong>${total}</strong> ready in cash or card when our courier arrives at your confirmed delivery address.
                    </p>
                    <ul className="cod-details-box__list">
                      <li>✓ Exact cash or portable contactless card machine available upon handover.</li>
                      <li>✓ Inspect garment packaging condition prior to settling payment.</li>
                      <li>✓ Fully tracked with SMS dispatch notifications to your phone number.</li>
                    </ul>
                  </div>
                </div>
              )}
            </section>

            {/* Place Order CTA */}
            <div className="checkout-submit-group">
              <button
                type="submit"
                className="btn btn--primary btn--lg checkout-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Confirming Order...'
                ) : paymentMethod === 'online' ? (
                  `Confirm Order & Pay • $${total}`
                ) : (
                  `Confirm COD Order • $${total}`
                )}
              </button>

              <p className="checkout-submit-disclaimer">
                By placing this simulated order, you confirm acceptance of our ethical atelier guidelines.
              </p>
            </div>
          </form>

          {/* ── Summary Column (Right) ────────────────────────────── */}
          <aside className="checkout-summary" aria-label="Order items and totals">
            <div className="checkout-summary__card">
              <h2 className="checkout-summary__title">
                Order Review ({totalItems} {totalItems === 1 ? 'piece' : 'pieces'})
              </h2>

              {/* Items List */}
              <div className="checkout-summary__items">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="checkout-item">
                    <div className="checkout-item__media">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="checkout-item__image"
                      />
                      <span className="checkout-item__qty-badge">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="checkout-item__body">
                      <h3 className="checkout-item__name">{item.name}</h3>
                      <p className="checkout-item__variants">
                        {item.selectedColor} &bull; {item.selectedSize}
                      </p>
                    </div>

                    <div className="checkout-item__price">
                      ${item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Rows */}
              <div className="checkout-summary__costs">
                <div className="checkout-summary__row">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="checkout-summary__row">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
                </div>
                <div className="checkout-summary__row checkout-summary__row--total">
                  <span>Total Amount</span>
                  <span>${total}</span>
                </div>
              </div>

              {/* Delivery Assurance */}
              <div className="checkout-summary__perks">
                <div className="checkout-summary__perk">
                  <span>✦</span>
                  <span>Carbon-neutral European transit</span>
                </div>
                <div className="checkout-summary__perk">
                  <span>↺</span>
                  <span>30-day complimentary returns</span>
                </div>
                <div className="checkout-summary__perk">
                  <span>🌿</span>
                  <span>Certified organic &amp; renewable fibers</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
