import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface ClearSkyProps {
  className?: string;
  isNight: boolean;
}

export const ClearSky = ({ className, isNight }: ClearSkyProps) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (isNight) {
    return (
      <div
        className={clsx('absolute inset-0 overflow-hidden pointer-events-none', className)}
        aria-hidden="true"
      >
        <div className="absolute inset-0" aria-hidden="true">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 70}%`,
                animationDuration: `${2 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 4}s`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
              } as React.CSSProperties}
            />
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`shooting-${i}`}
              className="shooting-star"
              style={{
                left: `${10 + Math.random() * 30}%`,
                top: `${10 + Math.random() * 40}%`,
                animationDuration: `${8 + Math.random() * 10}s`,
                animationDelay: `${i * 7 + Math.random() * 3}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {!prefersReducedMotion && (
          <div className="absolute inset-0" aria-hidden="true">
            <div className="moon" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={clsx('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div className="sun" />
        <div className="sun-rays">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`ray-${i}`}
              className="sun-ray"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-60px)`,
                animationDelay: `${i * 0.1}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClearSky;