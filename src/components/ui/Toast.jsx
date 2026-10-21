import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Toast.css';

export default function Toast({
  isOpen = false,
  title = 'Added to Bag',
  message = '',
  actionTo = '/cart',
  actionLabel = 'View Bag',
  onClose,
  duration = 4500
}) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast ${isOpen ? 'toast--visible' : ''}`}>
        <div className="toast__content">
          <span className="toast__icon-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <div className="toast__text-group">
            <span className="toast__title">{title}</span>
            <span className="toast__message">{message}</span>
          </div>
        </div>

        <div className="toast__actions">
          {actionTo && (
            <Link to={actionTo} className="toast__link">
              {actionLabel} &rarr;
            </Link>
          )}
          <button
            type="button"
            className="toast__close"
            onClick={onClose}
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}
