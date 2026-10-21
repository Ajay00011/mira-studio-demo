import { Link } from 'react-router-dom';
import usePageTransition from '../hooks/usePageTransition';
import './Placeholder.css';

export default function NotFound() {
  const transitionClass = usePageTransition();

  return (
    <main className={`main-content ${transitionClass}`}>
      <section className="placeholder-page not-found">
        <div className="placeholder-page__inner">
          <p className="not-found__code">404</p>
          <h1 className="placeholder-page__title">Page Not Found</h1>
          <p className="placeholder-page__text">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn--primary">Go Home</Link>
            <Link to="/shop" className="btn btn--secondary">Browse Shop</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
