import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface SnowProps {
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  showSnowman?: boolean;
  isNight?: boolean;
  temperature?: number;
}

export const Snow = ({ 
  className, 
  intensity = 'medium', 
  showSnowman = false, 
  isNight = false,
  temperature 
}: SnowProps) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const getFlakeCount = () => {
    if (prefersReducedMotion) return { far: 0, near: 0 };
    switch (intensity) {
      case 'light': return { far: 8, near: 5 };
      case 'heavy': return { far: 25, near: 15 };
      default: return { far: 15, near: 10 };
    }
  };

  const { far, near } = getFlakeCount();

  const generateFlakes = (count: number, layer: 'far' | 'near') => {
    const flakes = [];
    const sizeRange = layer === 'far' ? [2, 4] : [5, 8];
    const speedRange = layer === 'far' ? [8, 12] : [5, 8];
    const opacityRange = layer === 'far' ? [0.3, 0.5] : [0.6, 0.9];

    for (let i = 0; i < count; i++) {
      const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
      const left = Math.random() * 100;
      const duration = Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0];
      const delay = Math.random() * 5;
      const opacity = Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0];
      const drift = (Math.random() - 0.5) * 30;
      const swayDuration = 3 + Math.random() * 4;

      flakes.push({
        key: `${layer}-${i}`,
        style: {
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          '--drift': `${drift}px`,
          '--sway': '30px',
          '--sway-duration': `${swayDuration}s`,
        } as React.CSSProperties,
      });
    }
    return flakes;
  };

  const farFlakes = generateFlakes(far, 'far');
  const nearFlakes = generateFlakes(near, 'near');

  const showSnowmanFinal = showSnowman && (temperature === undefined || temperature <= 2);

  return (
    <div
      className={clsx('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {farFlakes.map((flake) => (
          <div
            key={flake.key}
            className="snowflake far"
            style={flake.style}
          />
        ))}
        {nearFlakes.map((flake) => (
          <div
            key={flake.key}
            className="snowflake near"
            style={flake.style}
          />
        ))}
      </div>

      {showSnowmanFinal && (
        <Snowman isNight={isNight} />
      )}
    </div>
  );
};

interface SnowmanProps {
  isNight: boolean;
}

const Snowman = ({ isNight }: SnowmanProps) => {
  const [blink, setBlink] = useState(false);
  const [sway, setSway] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000 + Math.random() * 4000);

    const swayInterval = setInterval(() => {
      setSway((prev) => (prev === 0 ? 1 : prev === 1 ? -1 : 0));
    }, 3000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(swayInterval);
    };
  }, []);

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const scarfColor = isNight ? '#f87171' : '#ef4444';
  const bodyColor = isNight ? '#f8fafc' : '#ffffff';
  const bodyShadow = isNight ? 'rgba(96,165,250,0.3)' : 'rgba(148,163,184,0.4)';
  const accentColor = isNight ? '#94a3b8' : '#64748b';

  const swayTransform = prefersReducedMotion ? 'rotate(0deg)' : `rotate(${sway * 2}deg)`;

  return (
    <div
      className="absolute bottom-4 right-4 z-10 pointer-events-none"
      style={{ transform: swayTransform, transition: 'transform 3s ease-in-out' }}
      aria-hidden="true"
    >
      <svg width="80" height="110" viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="snowmanShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor={bodyShadow} floodOpacity="0.3"/>
          </filter>
        </defs>
        
        <g filter="url(#snowmanShadow)">
          {/* Bottom snowball */}
          <circle cx="40" cy="95" r="22" fill={bodyColor} stroke={accentColor} strokeWidth="0.5"/>
          
          {/* Middle snowball */}
          <circle cx="40" cy="65" r="17" fill={bodyColor} stroke={accentColor} strokeWidth="0.5"/>
          
          {/* Top snowball (head) */}
          <circle cx="40" cy="35" r="13" fill={bodyColor} stroke={accentColor} strokeWidth="0.5"/>
        </g>

        {/* Hat */}
        <g transform="translate(40, 18)">
          <rect x="-16" y="0" width="32" height="4" fill="#1e293b" rx="1"/>
          <rect x="-12" y="-14" width="24" height="14" fill="#1e293b" rx="1"/>
          <rect x="-12" y="-14" width="24" height="3" fill={isNight ? '#60a5fa' : '#3b82f6'} rx="1"/>
        </g>

        {/* Scarf */}
        <g transform="translate(40, 52)">
          <path d="M-17 0 Q-8 -3 0 0 Q8 -3 17 0" stroke={scarfColor} strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M-17 0 Q-10 8 -5 12" stroke={scarfColor} strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M17 0 Q10 8 5 12" stroke={scarfColor} strokeWidth="6" fill="none" strokeLinecap="round"/>
          <rect x="-19" y="-3" width="4" height="10" fill={scarfColor} rx="1" transform="rotate(-20 -19 -3)"/>
          <rect x="15" y="-3" width="4" height="10" fill={scarfColor} rx="1" transform="rotate(20 15 -3)"/>
        </g>

        {/* Arms */}
        <g stroke={accentColor} strokeWidth="2.5" strokeLinecap="round">
          <path d="M23 65 Q10 55 5 50"/>
          <path d="M20 62 Q8 68 3 75"/>
          <path d="M57 65 Q70 55 75 50"/>
          <path d="M60 62 Q72 68 77 75"/>
        </g>

        {/* Eyes */}
        <g transform="translate(40, 35)">
          <circle cx="-5" cy="-2" r={blink ? 0.5 : 2} fill="#1e293b"/>
          <circle cx="5" cy="-2" r={blink ? 0.5 : 2} fill="#1e293b"/>
        </g>

        {/* Carrot nose */}
        <polygon points="40,35 40,40 48,37" fill="#f97316" stroke="#ea580c" strokeWidth="0.5"/>

        {/* Buttons */}
        <g fill="#1e293b">
          <circle cx="40" cy="68" r="1.5"/>
          <circle cx="40" cy="75" r="1.5"/>
          <circle cx="40" cy="82" r="1.5"/>
        </g>

        {/* Smile */}
        <path d="M34 42 Q40 46 46 42" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

export default Snow;