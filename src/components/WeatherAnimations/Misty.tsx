import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface MistyProps {
  className?: string;
  isNight?: boolean;
}

export const Misty = ({ className, isNight = false }: MistyProps) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const layerCount = prefersReducedMotion ? 0 : 4;
  const colors = isNight
    ? ['rgba(100,116,139,0.15)', 'rgba(71,85,105,0.12)', 'rgba(51,65,85,0.1)', 'rgba(30,41,59,0.08)']
    : ['rgba(203,213,225,0.25)', 'rgba(148,163,184,0.2)', 'rgba(100,116,139,0.15)', 'rgba(71,85,105,0.1)'];

  const generateLayers = () => {
    const layers = [];
    for (let i = 0; i < layerCount; i++) {
      const duration = 30 + Math.random() * 40;
      const delay = Math.random() * 10;
      layers.push({
        key: `mist-${i}`,
        style: {
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          '--mist-bg': colors[i],
          '--mist-opacity': 0.1 + (0.05 * i),
        } as React.CSSProperties,
      });
    }
    return layers;
  };

  const layers = generateLayers();

  return (
    <div
      className={clsx('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {layers.map((layer) => (
          <div
            key={layer.key}
            className="mist-layer"
            style={layer.style}
          />
        ))}
      </div>
    </div>
  );
};

export default Misty;