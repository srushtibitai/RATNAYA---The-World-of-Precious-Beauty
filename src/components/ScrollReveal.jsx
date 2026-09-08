import React, { useEffect, useRef, useState } from 'react';

export function ScrollReveal({ children, animation = 'fade-up', delay = 0, className = '' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const getInitialClass = () => {
    if (animation === 'fade-left') return 'opacity-0 -translate-x-16';
    if (animation === 'fade-right') return 'opacity-0 translate-x-16';
    if (animation === 'zoom-in') return 'opacity-0 scale-90';
    return 'opacity-0 translate-y-14';
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : getInitialClass()
      } ${className}`}
    >
      {children}
    </div>
  );
}
