import './EmptyState.css';

export default function EmptyState({
  title = 'No products found',
  description = 'Try adjusting your search query, clearing filters, or exploring other categories.',
  actionLabel = 'Reset All Filters',
  onAction
}) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon-box" aria-hidden="true">
        <svg className="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" strokeDasharray="2 2" />
        </svg>
      </div>

      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn btn--primary empty-state__action"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
