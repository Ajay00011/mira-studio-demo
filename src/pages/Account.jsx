import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';
import usePageTransition from '../hooks/usePageTransition';
import useScrollReveal from '../hooks/useScrollReveal';
import './Account.css';

export default function Account() {
  const transitionClass = usePageTransition();
  const pageRef = useRef(null);
  const navigate = useNavigate();

  const { currentUser, isAuthenticated, logout, updateAddress } = useAuth();
  const { orders } = useOrders();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/account', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Edit address state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editData, setEditData] = useState({
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: ''
  });

  // Sync editData when currentUser is available
  useEffect(() => {
    if (currentUser) {
      setEditData({
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

  // Toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useScrollReveal(pageRef);

  if (!currentUser) return null;

  const handleSaveAddress = (e) => {
    e.preventDefault();
    updateAddress(editData);
    setIsEditingAddress(false);
    setToastMessage('Your default delivery address has been updated successfully.');
    setToastOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <main className={`main-content account-page ${transitionClass}`} ref={pageRef}>
      <div className="container account-container">
        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb__link">Home</Link>
          <span className="breadcrumb__separator" aria-hidden="true">/</span>
          <span className="breadcrumb__current" aria-current="page">Studio Account</span>
        </nav>

        {/* ── Account Header ─────────────────────────────────────── */}
        <div className="account-header">
          <div className="account-header__avatar">
            {currentUser.firstName?.[0] || 'M'}
          </div>
          <div className="account-header__details">
            <span className="account-header__eyebrow">Studio Client Profile</span>
            <h1 className="account-header__title">
              {currentUser.firstName} {currentUser.lastName}
            </h1>
            <p className="account-header__email">
              {currentUser.email} &bull; Member since{' '}
              {new Date(currentUser.registeredAt || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
          <div className="account-header__actions">
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* ── Two Column Grid ─────────────────────────────────────── */}
        <div className="account-grid">
          {/* Left Column: Saved Delivery Address (Crucial for checkout confirmation) */}
          <section className="account-card" aria-labelledby="saved-address-heading">
            <div className="account-card__header">
              <div>
                <span className="account-card__badge">Confirmed at Checkout</span>
                <h2 id="saved-address-heading" className="account-card__title">
                  Saved Delivery Address
                </h2>
              </div>
              {!isEditingAddress && (
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => setIsEditingAddress(true)}
                >
                  Edit Address
                </button>
              )}
            </div>

            <p className="account-card__desc">
              This address was verified during your registration and is automatically loaded whenever you place an order.
            </p>

            {isEditingAddress ? (
              <form onSubmit={handleSaveAddress} className="account-address-form">
                <Input
                  id="edit-street"
                  label="Street Address"
                  value={editData.street}
                  onChange={e => setEditData(d => ({ ...d, street: e.target.value }))}
                  required
                />
                <Input
                  id="edit-apt"
                  label="Apartment, Suite (Optional)"
                  value={editData.apartment}
                  onChange={e => setEditData(d => ({ ...d, apartment: e.target.value }))}
                />
                <div className="account-form-row">
                  <Input
                    id="edit-city"
                    label="City"
                    value={editData.city}
                    onChange={e => setEditData(d => ({ ...d, city: e.target.value }))}
                    required
                  />
                  <Input
                    id="edit-state"
                    label="State"
                    value={editData.state}
                    onChange={e => setEditData(d => ({ ...d, state: e.target.value }))}
                  />
                  <Input
                    id="edit-postal"
                    label="Postal / ZIP"
                    value={editData.postalCode}
                    onChange={e => setEditData(d => ({ ...d, postalCode: e.target.value }))}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="edit-country" className="input-label">Country</label>
                  <select
                    id="edit-country"
                    className="input-field"
                    value={editData.country}
                    onChange={e => setEditData(d => ({ ...d, country: e.target.value }))}
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Italy">Italy</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Australia">Australia</option>
                    <option value="India">India</option>
                  </select>
                </div>
                <Input
                  id="edit-phone"
                  label="Delivery Phone Number"
                  type="tel"
                  value={editData.phone}
                  onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))}
                  required
                />

                <div className="account-form-actions">
                  <button type="submit" className="btn btn--primary">
                    Save Address Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setIsEditingAddress(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="account-address-display">
                <div className="account-address-recipient">
                  <strong>{currentUser.firstName} {currentUser.lastName}</strong>
                  {currentUser.phone && <span className="account-address-phone"> &bull; {currentUser.phone}</span>}
                </div>
                <p className="account-address-lines">
                  {currentUser.address?.street}
                  {currentUser.address?.apartment ? `, ${currentUser.address.apartment}` : ''}<br />
                  {currentUser.address?.city}{currentUser.address?.state ? `, ${currentUser.address.state}` : ''} {currentUser.address?.postalCode}<br />
                  {currentUser.address?.country}
                </p>

                <div className="account-address-verified-badge">
                  <span aria-hidden="true">✓</span> Verified primary address for seamless checkout confirmation
                </div>
              </div>
            )}
          </section>

          {/* Right Column: Fast Shortcuts */}
          <div className="account-side-col">
            {/* Quick Orders Card */}
            <div className="account-card">
              <h2 className="account-card__title">Recent Orders</h2>
              <p className="account-card__desc">
                Review past deliveries, inspect carbon-neutral dispatch status, and download receipts.
              </p>
              <Link to="/orders" className="btn btn--secondary btn--lg account-shortcut-btn">
                📦 View Order History ({orders.length}) &rarr;
              </Link>
            </div>

            {/* Quick Wishlist Card */}
            <div className="account-card">
              <h2 className="account-card__title">Saved Favorites</h2>
              <p className="account-card__desc">
                Curated pieces you have marked to plan your next seasonal capsule.
              </p>
              <Link to="/wishlist" className="btn btn--secondary btn--lg account-shortcut-btn">
                ♡ View Saved Wishlist &rarr;
              </Link>
            </div>

            {/* Shopping CTA */}
            <div className="account-card account-card--cta">
              <span className="account-card__eyebrow">Autumn / Winter Edit</span>
              <h3 className="account-card__title">Discover New Arrivals</h3>
              <p className="account-card__desc">
                Sustainably spun garments tailored in certified European ateliers.
              </p>
              <Link to="/shop" className="btn btn--primary account-shortcut-btn">
                Explore Studio Catalog &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Toast
        isOpen={toastOpen}
        title="Address Updated"
        message={toastMessage}
        actionTo="/checkout"
        actionLabel="Go to Checkout"
        onClose={() => setToastOpen(false)}
      />
    </main>
  );
}
