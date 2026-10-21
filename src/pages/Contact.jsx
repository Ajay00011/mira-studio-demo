import { useState, useRef } from 'react';
import Input from '../components/ui/Input';
import usePageTransition from '../hooks/usePageTransition';
import useScrollReveal from '../hooks/useScrollReveal';
import './Contact.css';

const SUBJECT_OPTIONS = [
  'Order & Sizing Inquiries',
  'Care & Fabric Recommendations',
  'Press & Editorial Collaboration',
  'Sustainability & Materials',
  'General Feedback'
];

export default function Contact() {
  const transitionClass = usePageTransition();
  const pageRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: SUBJECT_OPTIONS[0],
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  useScrollReveal(pageRef);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Please select a subject.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate network submission
    setTimeout(() => {
      setSubmittedData({ ...formData });
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: SUBJECT_OPTIONS[0],
        message: ''
      });
    }, 800);
  };

  const handleReset = () => {
    setSubmittedData(null);
  };

  return (
    <main className={`main-content contact-page ${transitionClass}`} ref={pageRef}>
      {/* ── Hero Banner ───────────────────────────────────────────── */}
      <section className="contact-hero" aria-labelledby="contact-heading">
        <div className="container">
          <p className="contact-hero__eyebrow">Client Care &amp; Studio</p>
          <h1 className="contact-hero__title" id="contact-heading">Get in Touch</h1>
          <p className="contact-hero__subtitle">
            Whether inquiring about fit consultations, sustainable sourcing, or custom studio appointments,
            our team is here to assist.
          </p>
        </div>
      </section>

      <div className="container">
        {/* Prominent Demo Notice */}
        <div className="demo-banner" role="alert" aria-label="Demo form notice" style={{ marginTop: 0 }}>
          <span className="demo-banner__icon" aria-hidden="true">&#9888;</span>
          <div className="demo-banner__content">
            <span className="demo-banner__title">
              Demo Contact Form &bull; Simulated Submissions
            </span>
            <span className="demo-banner__text">
              This is a fictional demo store. No emails are transmitted across the internet, and no personal data is stored on servers.
            </span>
          </div>
        </div>

        <div className="contact-layout">
          {/* ── Studio Information Column (Left) ──────────────────── */}
          <aside className="contact-info" aria-label="Studio contact information">
            <div className="contact-info__block">
              <span className="contact-info__label">Atelier &amp; Showroom</span>
              <h2 className="contact-info__heading">Mira Studio Milan</h2>
              <p className="contact-info__text">
                Via Montenapoleone 124, Quadrilatero della Moda<br />
                20121 Milano MI, Italy
              </p>
            </div>

            <div className="contact-info__block">
              <span className="contact-info__label">Direct Inquiries</span>
              <p className="contact-info__text">
                General &amp; Client Care: <strong>care@mirastudio-demo.com</strong><br />
                Press &amp; Editorial: <strong>press@mirastudio-demo.com</strong><br />
                Response Time: Within 24 business hours
              </p>
            </div>

            <div className="contact-info__block">
              <span className="contact-info__label">Studio Hours</span>
              <p className="contact-info__text">
                Monday &ndash; Friday: 9:00 &ndash; 18:00 CET<br />
                Saturday: 10:00 &ndash; 16:00 CET (By Appointment)<br />
                Sunday: Closed
              </p>
            </div>

            {/* Quick FAQ Box */}
            <div className="contact-info__faq">
              <span className="contact-info__label">Frequently Asked</span>

              <div className="contact-faq-item">
                <div className="contact-faq-item__q">Do you ship worldwide?</div>
                <div className="contact-faq-item__a">
                  Yes, we ship carbon-neutral courier to over 35 countries with compostable packaging.
                </div>
              </div>

              <div className="contact-faq-item">
                <div className="contact-faq-item__q">What is your returns policy?</div>
                <div className="contact-faq-item__a">
                  We offer 30-day complimentary returns for unworn pieces with tags attached.
                </div>
              </div>
            </div>
          </aside>

          {/* ── Contact Form Column (Right) ───────────────────────── */}
          <section className="contact-card" aria-label="Send a message">
            {submittedData ? (
              <div className="contact-success" role="status">
                <div className="contact-success__icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h2 className="contact-success__title">Simulated Message Received</h2>
                <p className="contact-success__text">
                  Thank you, <strong>{submittedData.name}</strong>! Your simulated message regarding
                  &ldquo;{submittedData.subject}&rdquo; has been received. In a live store, our client care specialists would reply to <strong>{submittedData.email}</strong>.
                </p>

                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn--primary btn--md"
                  style={{ marginTop: 'var(--space-sm)' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="contact-card__title">Send an Inquiry</h2>
                <p className="contact-card__subtitle">
                  Fill in your details below and a member of our studio team will respond promptly.
                </p>

                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <Input
                    id="contact-name"
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Elena Rossi"
                    required
                    error={errors.name}
                    autoComplete="name"
                  />

                  <Input
                    id="contact-email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="elena@example.com"
                    required
                    error={errors.email}
                    autoComplete="email"
                  />

                  {/* Subject Dropdown */}
                  <div className="form-field">
                    <label htmlFor="contact-subject" className="form-field__label">
                      <span>Subject <span className="form-field__required">*</span></span>
                    </label>
                    <select
                      id="contact-subject"
                      className="form-field__input"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                    >
                      {SUBJECT_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Field */}
                  <div className="form-field">
                    <label htmlFor="contact-message" className="form-field__label">
                      <span>Message <span className="form-field__required">*</span></span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      className={`form-field__textarea${errors.message ? ' form-field__textarea--error' : ''}`}
                      placeholder="Share your questions about sizing, materials, or appointments..."
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      required
                    />
                    {errors.message && (
                      <span id="contact-message-error" className="form-field__error-msg" role="alert">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {errors.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn--primary btn--lg"
                    disabled={isSubmitting}
                    style={{ marginTop: 'var(--space-xs)', width: '100%' }}
                  >
                    {isSubmitting ? 'Sending Message...' : 'Submit Message (Demo)'}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
