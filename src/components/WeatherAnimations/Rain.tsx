import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface RainProps {
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
}

export const Rain = ({ className, intensity = 'medium' }: RainProps) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const getDropCount = () => {
    if (prefersReducedMotion) return 0;
    switch (intensity) {
      case 'light': return 20;
      case 'heavy': return 60;
      default: return 40;
    }
  };

  const dropCount = getDropCount();

  const generateDrops = () => {
    const drops = [];
    for (let i = 0; i < dropCount; i++) {
      const left = Math.random() * 100;
      const duration = 0.5 + Math.random() * 0.8;
      const delay = Math.random() * 3;
      const height = 15 + Math.random() * 25;
      const width = intensity === 'heavy' ? 2 : intensity === 'light' ? 1 : 1.5;
      const opacity = 0.3 + Math.random() * 0.4;

      drops.push({
        key: `drop-${i}`,
        style: {
          left: `${left}%`,
          height: `${height}px`,
          width: `${width}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          opacity,
        } as React.CSSProperties,
      });
    }
    return drops;
  };

  const drops = generateDrops();

  return (
    <div
      className={clsx('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {drops.map((drop) => (
          <div
            key={drop.key}
            className="raindrop"
            style={{
              ...drop.style,
              '--drop-opacity': drop.style.opacity,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {!prefersReducedMotion && (
        <div className="absolute inset-0" aria-hidden="true">
          {Array.from({ length: Math.min(8, Math.floor(dropCount / 5)) }).map((_, i) => (
            <div
              key={i}
              className="splash"
              style={{
                left: `${10 + (i * 100 / Math.min(8, Math.floor(dropCount / 5)))}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.2 + Math.random() * 0.2}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rain;