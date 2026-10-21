import { useEffect, useRef } from 'react';

/**
 * Custom hook that applies the `.revealed` class to elements with `.reveal`
 * when they enter the viewport, using IntersectionObserver.
 */
export default function useScrollReveal(containerRef, deps = []) {
  const observerRef = useRef(null);

  useEffect(() => {
    const container = containerRef?.current || document;

    const elements = container.querySelectorAll('.reveal:not(.revealed)');
    if (!elements.length) return;

    /* Respect reduced-motion preference */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, ...deps]);
}
