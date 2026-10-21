import './ReviewSummary.css';

export default function ReviewSummary({
  summary,
  onWriteReview
}) {
  if (!summary) return null;

  const {
    average = 4.9,
    count = 0,
    distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    trueToSizePercent = 94
  } = summary;

  const starRows = [5, 4, 3, 2, 1];

  return (
    <div className="review-summary" role="region" aria-label="Customer ratings overview">
      {/* ── Score Column ─────────────────────────────────────────── */}
      <div className="review-summary__score-col">
        <span className="review-summary__score">{average.toFixed(1)}</span>
        <div className="review-summary__stars" aria-hidden="true">
          {'★'.repeat(Math.round(average))}
          {'☆'.repeat(5 - Math.round(average))}
        </div>
        <span className="review-summary__count">
          Based on {count} {count === 1 ? 'verified review' : 'verified reviews'}
        </span>
        <div className="review-summary__fit-tag">
          <span aria-hidden="true">📏</span>
          <span>{trueToSizePercent}% report True to Size</span>
        </div>
      </div>

      {/* ── Distribution Bars ─────────────────────────────────────── */}
      <div className="review-summary__bars-col" aria-label="Rating breakdown">
        {starRows.map(stars => {
          const starCount = distribution[stars] || 0;
          const percentage = count > 0 ? Math.round((starCount / count) * 100) : 0;

          return (
            <div key={stars} className="review-bar-row">
              <span className="review-bar-row__label">{stars} ★</span>
              <div className="review-bar-row__track" aria-hidden="true">
                <div
                  className="review-bar-row__fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="review-bar-row__count">{starCount}</span>
            </div>
          );
        })}
      </div>

      {/* ── Write Review CTA Column ───────────────────────────────── */}
      <div className="review-summary__action-col">
        <button
          type="button"
          onClick={onWriteReview}
          className="btn btn--primary btn--md review-summary__write-btn"
        >
          Write a Review
        </button>
        <span className="review-summary__verified-note">
          Share your experience with the studio
        </span>
      </div>
    </div>
  );
}
