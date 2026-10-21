import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import usePageTransition from '../hooks/usePageTransition';
import useScrollReveal from '../hooks/useScrollReveal';
import './Auth.css';

export default function Auth({ initialMode = 'login' }) {
  const transitionClass = usePageTransition();
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || '/account';
  const isFromCheckout = redirectUrl.includes('checkout');

  // Mode: 'login' or 'register'
  const [mode, setMode] = useState(() => {
    if (location.pathname.includes('register')) return 'register';
    return initialMode;
  });

  useEffect(() => {
    if (location.pathname.includes('register')) {
      setMode('register');
    } else if (location.pathname.includes('login')) {
      setMode('login');
    }
  }, [location.pathname]);

  const { currentUser, isAuthenticated, login, loginDemo, register } = useAuth();

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registration form state
  const [regData, setRegData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });
  const [regErrors, setRegErrors] = useState({});
  const [isRegistering, setIsRegistering] = useState(false);

  useScrollReveal(pageRef);

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both your email address and password.');
      return;
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      try {
        login(loginEmail, loginPassword);
        navigate(redirectUrl, { replace: true });
      } catch (err) {
        setLoginError(err.message || 'Login failed. Please check your credentials.');
        setIsLoggingIn(false);
      }
    }, 400);
  };

  // One-click demo login
  const handleDemoLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      loginDemo();
      navigate(redirectUrl, { replace: true });
    }, 300);
  };

  // Handle Registration change
  const handleRegChange = (field, value) => {
    setRegData(prev => ({ ...prev, [field]: value }));
    if (regErrors[field]) {
      setRegErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Validate Registration Form
  const validateReg = () => {
    const errs = {};
    if (!regData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!regData.lastName.trim()) errs.lastName = 'Last name is required.';

    if (!regData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regData.email.trim())) {
      errs.email = 'Please provide a valid email format.';
    }

    if (!regData.phone.trim()) {
      errs.phone = 'Phone number is required for courier delivery updates.';
    }

    if (!regData.password) {
      errs.password = 'Password is required.';
    } else if (regData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (regData.password !== regData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    // Address validation (MANDATORY for ordering requirement)
    if (!regData.street.trim()) errs.street = 'Street address is required.';
    if (!regData.city.trim()) errs.city = 'City is required.';
    if (!regData.postalCode.trim()) errs.postalCode = 'Postal / ZIP code is required.';

    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Registration submission
  const handleRegSubmit = (e) => {
    e.preventDefault();
    if (!validateReg()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsRegistering(true);
    setTimeout(() => {
      try {
        register(regData);
        navigate(redirectUrl, { replace: true });
      } catch (err) {
        setRegErrors({ general: err.message });
        setIsRegistering(false);
      }
    }, 500);
  };

  return (
    <main className={`main-content auth-page ${transitionClass}`} ref={pageRef}>
      <div className="container auth-container">
        {/* Checkout requirement banner if redirected from checkout */}
        {isFromCheckout && (
          <div className="auth-checkout-notice" role="alert">
            <span className="auth-checkout-notice__icon">🔒</span>
            <div className="auth-checkout-notice__text">
              <strong>Studio Registration Required Before Purchase</strong>
              <p>
                In accordance with Mira Studio atelier guidelines, you must register or sign in before placing an order.
                Your delivery address will be saved securely and verified automatically at checkout.
              </p>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="auth-card">
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={`auth-tab${mode === 'login' ? ' active' : ''}`}
              onClick={() => { setMode('login'); setLoginError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={`auth-tab${mode === 'register' ? ' active' : ''}`}
              onClick={() => { setMode('register'); setRegErrors({}); }}
            >
              Create Account
            </button>
          </div>

          {/* ── Mode 1: Login ───────────────────────────────────────── */}
          {mode === 'login' ? (
            <div className="auth-body">
              <div className="auth-header">
                <span className="auth-header__eyebrow">Studio Client Access</span>
                <h1 className="auth-header__title">Welcome Back</h1>
                <p className="auth-header__desc">
                  Sign in to access your saved delivery address, order tracking, and curated favorites.
                </p>
              </div>

              {loginError && (
                <div className="auth-error-alert" role="alert">
                  <span>⚠</span> {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
                <Input
                  id="login-email"
                  label="Email Address"
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="sophia@example.com"
                  autoComplete="email"
                  required
                />

                <Input
                  id="login-password"
                  label="Password"
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="submit"
                  className="btn btn--primary btn--lg auth-submit-btn"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? 'Authenticating...' : 'Sign In &rarr;'}
                </button>
              </form>

              {/* Demo 1-Click Login Box */}
              <div className="auth-demo-box">
                <div className="auth-demo-box__header">
                  <span>✦ Immediate Testing Shortcut</span>
                </div>
                <p className="auth-demo-box__text">
                  Skip manual typing and sign in as our pre-registered test client with a confirmed New York address:
                </p>
                <button
                  type="button"
                  className="btn btn--secondary auth-demo-btn"
                  onClick={handleDemoLogin}
                  disabled={isLoggingIn}
                >
                  One-Click Demo Sign In (Sophia Laurent)
                </button>
              </div>

              <div className="auth-footer-prompt">
                <span>New to Mira Studio?</span>{' '}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => setMode('register')}
                >
                  Create an account &rarr;
                </button>
              </div>
            </div>
          ) : (
            /* ── Mode 2: Registration ────────────────────────────────── */
            <div className="auth-body">
              <div className="auth-header">
                <span className="auth-header__eyebrow">Studio Membership</span>
                <h1 className="auth-header__title">Create Account</h1>
                <p className="auth-header__desc">
                  Register your profile and primary delivery address. All subsequent purchases will automatically load and verify this address at checkout.
                </p>
              </div>

              {regErrors.general && (
                <div className="auth-error-alert" role="alert">
                  <span>⚠</span> {regErrors.general}
                </div>
              )}

              <form onSubmit={handleRegSubmit} className="auth-form" noValidate>
                {/* ── Section A: Personal Information ───────────────── */}
                <div className="auth-section">
                  <h3 className="auth-section__title">1. Personal Information</h3>

                  <div className="auth-grid-2">
                    <Input
                      id="reg-first-name"
                      label="First Name"
                      value={regData.firstName}
                      onChange={e => handleRegChange('firstName', e.target.value)}
                      error={regErrors.firstName}
                      placeholder="Sophia"
                      required
                    />

                    <Input
                      id="reg-last-name"
                      label="Last Name"
                      value={regData.lastName}
                      onChange={e => handleRegChange('lastName', e.target.value)}
                      error={regErrors.lastName}
                      placeholder="Laurent"
                      required
                    />
                  </div>

                  <div className="auth-grid-2">
                    <Input
                      id="reg-email"
                      label="Email Address"
                      type="email"
                      value={regData.email}
                      onChange={e => handleRegChange('email', e.target.value)}
                      error={regErrors.email}
                      placeholder="sophia@example.com"
                      autoComplete="email"
                      required
                    />

                    <Input
                      id="reg-phone"
                      label="Phone Number"
                      type="tel"
                      value={regData.phone}
                      onChange={e => handleRegChange('phone', e.target.value)}
                      error={regErrors.phone}
                      placeholder="+1 (555) 000-0000"
                      helperText="Used for courier delivery dispatch notifications"
                      required
                    />
                  </div>

                  <div className="auth-grid-2">
                    <Input
                      id="reg-password"
                      label="Password"
                      type="password"
                      value={regData.password}
                      onChange={e => handleRegChange('password', e.target.value)}
                      error={regErrors.password}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      required
                    />

                    <Input
                      id="reg-confirm-password"
                      label="Confirm Password"
                      type="password"
                      value={regData.confirmPassword}
                      onChange={e => handleRegChange('confirmPassword', e.target.value)}
                      error={regErrors.confirmPassword}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                {/* ── Section B: Primary Delivery Address ───────────── */}
                <div className="auth-section">
                  <div className="auth-section__header-row">
                    <h3 className="auth-section__title">2. Primary Delivery Address</h3>
                    <span className="auth-section__badge">Saved for Order Confirmation</span>
                  </div>
                  <p className="auth-section__hint">
                    This address will be safely linked to your profile and presented for verification whenever you order.
                  </p>

                  <Input
                    id="reg-street"
                    label="Street Address"
                    value={regData.street}
                    onChange={e => handleRegChange('street', e.target.value)}
                    error={regErrors.street}
                    placeholder="142 Mercer Street"
                    required
                  />

                  <Input
                    id="reg-apartment"
                    label="Apartment, Suite, Unit (Optional)"
                    value={regData.apartment}
                    onChange={e => handleRegChange('apartment', e.target.value)}
                    placeholder="Apt 4B"
                  />

                  <div className="auth-grid-3">
                    <Input
                      id="reg-city"
                      label="City"
                      value={regData.city}
                      onChange={e => handleRegChange('city', e.target.value)}
                      error={regErrors.city}
                      placeholder="New York"
                      required
                    />

                    <Input
                      id="reg-state"
                      label="State / Province"
                      value={regData.state}
                      onChange={e => handleRegChange('state', e.target.value)}
                      placeholder="NY"
                    />

                    <Input
                      id="reg-postal"
                      label="Postal / ZIP Code"
                      value={regData.postalCode}
                      onChange={e => handleRegChange('postalCode', e.target.value)}
                      error={regErrors.postalCode}
                      placeholder="10012"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="reg-country" className="input-label">
                      Country
                    </label>
                    <select
                      id="reg-country"
                      className="input-field"
                      value={regData.country}
                      onChange={e => handleRegChange('country', e.target.value)}
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Italy">Italy</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Japan">Japan</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn--primary btn--lg auth-submit-btn"
                  disabled={isRegistering}
                >
                  {isRegistering ? 'Registering Account...' : 'Complete Registration & Save Address &rarr;'}
                </button>
              </form>

              <div className="auth-footer-prompt">
                <span>Already registered?</span>{' '}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => setMode('login')}
                >
                  Sign in to your account &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
