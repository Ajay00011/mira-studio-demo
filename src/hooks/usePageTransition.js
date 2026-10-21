import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that triggers a fade-in / slide-up page transition
 * whenever the route changes.
 */
export default function usePageTransition() {
  const location = useLocation();
  const [transitionClass, setTransitionClass] = useState('page-transition-enter');
  const timeoutRef = useRef(null);

  useEffect(() => {
    /* Reset to enter state */
    setTransitionClass('page-transition-enter');

    /* Trigger active state on next frame */
    timeoutRef.current = requestAnimationFrame(() => {
      setTransitionClass('page-transition-enter page-transition-active');
    });

    /* Scroll to top on route change */
    window.scrollTo({ top: 0, behavior: 'instant' });

    return () => {
      if (timeoutRef.current) cancelAnimationFrame(timeoutRef.current);
    };
  }, [location.pathname]);

  return transitionClass;
}
