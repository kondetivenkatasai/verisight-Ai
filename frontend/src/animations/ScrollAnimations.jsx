import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function useScrollAnimation(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const {
      y = 40,
      opacity = 0,
      duration = 0.8,
      delay = 0,
      ease = 'power2.out',
    } = options;

    gsap.set(element, { y, opacity });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(element, { y: 0, opacity: 1, duration, delay, ease });
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return ref;
}

export function ScrollReveal({ children, className = '', ...options }) {
  const ref = useScrollAnimation(options);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default ScrollReveal;
