import './LoadingSpinner.css';

export default function LoadingSpinner({ label = 'Loading Collection...' }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="loading-spinner__ring" aria-hidden="true" />
      <span className="loading-spinner__text">{label}</span>
    </div>
  );
}
