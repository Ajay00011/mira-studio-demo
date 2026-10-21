import { useState, useMemo } from 'react';
import './ReviewList.css';

export default function ReviewList({ reviews = [] }) {
  const [starFilter, setStarFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [votedIds, setVotedIds] = useState({});

  const handleHelpful = (id) => {
    setVotedIds(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  // Filter & sort reviews
  const displayedReviews = useMemo(() => {
    let list = [...reviews];

    // Filter by star
    if (starFilter !== 'all') {
      const num = parseInt(starFilter, 10);
      list = list.filter(r => r.rating === num);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'helpful') {
        const aHelp = (a.helpfulCount || 0) + (votedIds[a.id] || 0);
        const bHelp = (b.helpfulCount || 0) + (votedIds[b.id] || 0);
        return bHelp - aHelp;
      }
      // 'recent' by default
      return new Date(b.date) - new Date(a.date);
    });

    return list;
  }, [reviews, starFilter, sortBy, votedIds]);

  if (!reviews.length) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-secondary)' }}>
        <p>No customer reviews have been submitted for this piece yet.</p>
        <p style={{ fontSize: 'var(--fs-xs)', marginTop: 'var(--space-xs)' }}>Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {/* ── Filter & Sort Controls ───────────────────────────────── */}
      <div className="review-list__controls">
        <div className="review-list__filters" role="tablist" aria-label="Filter reviews by star rating">
          {['all', '5', '4'].map(val => (
            <button
              key={val}
              type="button"
              className={`review-filter-btn${starFilter === val ? ' active' : ''}`}
              onClick={() => setStarFilter(val)}
            >
              {val === 'all' ? `All Reviews (${reviews.length})` : `${val} Stars`}
            </button>
          ))}
        </div>

        <div className="review-list__sort">
          <label htmlFor="review-sort" className="sr-only">Sort reviews</label>
          <select
            id="review-sort"
            className="review-list__sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* ── Review Cards List ────────────────────────────────────── */}
      {displayedReviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
          No reviews found matching the selected star filter.
        </div>
      ) : (
        displayedReviews.map((r) => {
          const initials = r.author
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2);

          const hasVoted = Boolean(votedIds[r.id]);
          const currentHelpful = (r.helpfulCount || 0) + (votedIds[r.id] || 0);

          return (
            <article key={r.id} className="review-card" aria-label={`Review by ${r.author}`}>
              <div className="review-card__header">
                <div className="review-card__author-group">
                  <div className="review-card__avatar" aria-hidden="true">
                    {initials}
                  </div>
                  <div className="review-card__author-info">
                    <div className="review-card__name-row">
                      <span className="review-card__author-name">{r.author}</span>
                      {r.verified && (
                        <span className="review-card__verified-badge">
                          ✓ Verified Buyer
                        </span>
                      )}
                    </div>
                    <time className="review-card__date">{r.date}</time>
                  </div>
                </div>

                <div className="review-card__rating-stars" aria-label={`${r.rating} out of 5 stars`}>
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </div>
              </div>

              <h3 className="review-card__title">{r.title}</h3>
              <p className="review-card__content">{r.content}</p>

              <div className="review-card__meta-bar">
                <div className="review-card__fit-info">
                  <span>Fit: <strong>{r.fit}</strong></span>
                  {r.purchasedVariant && (
                    <>
                      <span aria-hidden="true">&bull;</span>
                      <span dangerouslySetInnerHTML={{ __html: r.purchasedVariant }} />
                    </>
                  )}
                </div>

                <button
                  type="button"
                  className={`review-card__helpful-btn${hasVoted ? ' voted' : ''}`}
                  onClick={() => handleHelpful(r.id)}
                  disabled={hasVoted}
                  title="Mark as helpful"
                >
                  <span aria-hidden="true">👍</span>
                  <span>Helpful ({currentHelpful})</span>
                </button>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}
