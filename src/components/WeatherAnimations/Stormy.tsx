import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import Rain from './Rain';

interface StormyProps {
  className?: string;
  isNight?: boolean;
}

export const Stormy = ({ className, isNight = false }: StormyProps) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const flashInterval = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 100);
    }, 5000 + Math.random() * 10000);

    return () => clearInterval(flashInterval);
  }, [prefersReducedMotion]);

  return (
    <div
      className={clsx('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      <Rain intensity="heavy" />
      
      {!prefersReducedMotion && flash && (
        <div
          className="absolute inset-0"
          style={{
            background: isNight ? 'rgba(250,250,230,0.6)' : 'rgba(255,255,255,0.8)',
            animation: 'flashFade 0.1s ease-out',
            zIndex: 50,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Stormy;