import { useState, useEffect, useCallback } from 'react';
import Input from './Input';
import { addProductReview } from '../../data/reviews';
import './ReviewModal.css';

const RATING_FEEDBACK = {
  1: '1 Star &bull; Substandard',
  2: '2 Stars &bull; Disappointing',
  3: '3 Stars &bull; Acceptable',
  4: '4 Stars &bull; Very Pleased',
  5: '5 Stars &bull; Exceptional Quality'
};

const FIT_OPTIONS = ['Runs Small', 'True to Size', 'Runs Large'];

export default function ReviewModal({
  isOpen = false,
  onClose,
  productId,
  productName,
  onReviewSubmitted
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [fit, setFit] = useState('True to Size');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!author.trim()) errs.author = 'Please provide your name.';
    if (!email.trim()) {
      errs.email = 'Please provide your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Valid email required.';
    }
    if (!title.trim()) errs.title = 'Review headline is required.';
    if (!content.trim()) {
      errs.content = 'Please share your experience.';
    } else if (content.trim().length < 10) {
      errs.content = 'Review must be at least 10 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newRev = addProductReview(productId, {
      author,
      rating,
      title,
      content,
      fit,
      purchasedVariant: 'Verified Client'
    });

    if (newRev && onReviewSubmitted) {
      onReviewSubmitted(newRev);
    }

    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setAuthor('');
    setEmail('');
    setTitle('');
    setContent('');
    setRating(5);
    setFit('True to Size');
    setErrors({});
    onClose();
  };

  return (
    <div
      className="review-modal-backdrop"
      onClick={handleResetAndClose}
      role="presentation"
    >
      <div
        className="review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="review-modal__close-btn"
          onClick={handleResetAndClose}
          aria-label="Close review dialog"
        >
          &times;
        </button>

        {isSubmitted ? (
          <div className="review-modal-success" role="status">
            <div className="review-modal-success__icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="review-modal__title">Review Published</h2>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
              Thank you, <strong>{author}</strong>. Your feedback for <em>{productName}</em> has been added to our catalog.
            </p>
            <button
              type="button"
              className="btn btn--primary btn--md"
              onClick={handleResetAndClose}
              style={{ marginTop: 'var(--space-sm)' }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <header className="review-modal__header">
              <p className="review-modal__eyebrow">Client Feedback</p>
              <h2 className="review-modal__title" id="review-modal-title">
                Review {productName}
              </h2>
            </header>

            <form className="review-modal-form" onSubmit={handleSubmit} noValidate>
              {/* Star Rating Picker */}
              <div className="star-picker">
                <span className="star-picker__label">Your Rating *</span>
                <div
                  className="star-picker__stars-row"
                  role="radiogroup"
                  aria-label="Select star rating from 1 to 5"
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={rating === star}
                        className={`star-picker__star-btn${isFilled ? ' active' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`${star} of 5 stars`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
                <span
                  className="star-picker__feedback"
                  dangerouslySetInnerHTML={{ __html: RATING_FEEDBACK[hoverRating || rating] }}
                />
              </div>

              {/* Fit Evaluation */}
              <div className="fit-selector">
                <span className="star-picker__label">How does it fit?</span>
                <div className="fit-selector__options" role="radiogroup" aria-label="Fit evaluation">
                  {FIT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      role="radio"
                      aria-checked={fit === opt}
                      className={`fit-selector__btn${fit === opt ? ' active' : ''}`}
                      onClick={() => setFit(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <Input
                id="rev-author"
                label="Your Name"
                placeholder="Camille L."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                error={errors.author}
              />

              <Input
                id="rev-email"
                label="Email Address"
                type="email"
                placeholder="camille@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={errors.email}
                helperText="Demo mode: Email is kept strictly private."
              />

              <Input
                id="rev-title"
                label="Review Headline"
                placeholder="e.g. Flawless drape and tactile comfort"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                error={errors.title}
              />

              {/* Comments Textarea */}
              <div className="form-field">
                <label htmlFor="rev-content" className="form-field__label">
                  <span>Detailed Review <span className="form-field__required">*</span></span>
                </label>
                <textarea
                  id="rev-content"
                  rows={4}
                  className={`form-field__textarea${errors.content ? ' form-field__textarea--error' : ''}`}
                  placeholder="Share details regarding fit, texture, drape, and styling versatility..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  aria-invalid={Boolean(errors.content)}
                  aria-describedby={errors.content ? 'rev-content-error' : undefined}
                  required
                />
                {errors.content && (
                  <span id="rev-content-error" className="form-field__error-msg" role="alert">
                    {errors.content}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--lg review-modal-form__submit"
              >
                Submit Review
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
