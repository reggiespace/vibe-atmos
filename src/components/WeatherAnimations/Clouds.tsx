import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface CloudsProps {
  className?: string;
  coverage?: 'few' | 'scattered' | 'broken' | 'overcast';
  isNight?: boolean;
}

export const Clouds = ({ className, coverage = 'scattered', isNight = false }: CloudsProps) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const getCloudCount = () => {
    if (prefersReducedMotion) return 0;
    switch (coverage) {
      case 'few': return 2;
      case 'scattered': return 4;
      case 'broken': return 6;
      case 'overcast': return 8;
      default: return 4;
    }
  };

  const cloudCount = getCloudCount();

  const generateClouds = () => {
    const clouds = [];
    const colors = isNight
      ? ['rgba(100,116,139,0.4)', 'rgba(71,85,105,0.35)', 'rgba(51,65,85,0.3)']
      : ['rgba(203,213,225,0.6)', 'rgba(148,163,184,0.5)', 'rgba(100,116,139,0.4)'];

    for (let i = 0; i < cloudCount; i++) {
      const width = 120 + Math.random() * 180;
      const height = width * (0.35 + Math.random() * 0.2);
      const top = 10 + Math.random() * 50;
      const left = -50 + Math.random() * 100;
      const duration = 40 + Math.random() * 60;
      const delay = Math.random() * 20;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const scale = 0.6 + Math.random() * 0.6;
      const opacity = 0.3 + Math.random() * 0.3;

      clouds.push({
        key: `cloud-${i}`,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          top: `${top}%`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          transform: `scale(${scale})`,
          opacity,
          '--cloud-scale': `${scale}`,
          '--cloud-opacity': opacity,
          '--cloud-drift-duration': `${duration}s`,
          '--cloud-pulse-duration': `${8 + Math.random() * 4}s`,
          '--cloud-bg': color,
        } as React.CSSProperties,
      });
    }
    return clouds;
  };

  const clouds = generateClouds();

  return (
    <div
      className={clsx('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {clouds.map((cloud) => (
          <div
            key={cloud.key}
            className="cloud"
            style={cloud.style}
          />
        ))}
      </div>
    </div>
  );
};

export default Clouds;