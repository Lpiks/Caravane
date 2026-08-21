import React, { useMemo } from 'react';

export default function TopographyPattern() {
  const paths = useMemo(() => {
    const generatedPaths = [];
    // Generate a grid of "peaks" across the screen space
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 4; j++) {
        // Add deterministic pseudo-randomness so it stays the same on re-renders
        const cx = i * 160 + (i * 27 % 100) - 50;
        const cy = j * 160 + (j * 31 % 100) - 50;
        
        // Generate concentric contour lines for each peak
        for (let r = 15; r < 120; r += 18) {
          let d = 'M ';
          // Plot points around the circle with sinusoidal noise
          for (let a = 0; a <= Math.PI * 2; a += 0.4) {
            const noise = Math.sin(a * 4 + cx) * 6 + Math.cos(a * 3 + cy) * 5;
            const x = cx + Math.cos(a) * (r + noise);
            const y = cy + Math.sin(a) * (r + noise);
            d += `${a === 0 ? '' : 'L '}${x.toFixed(1)},${y.toFixed(1)} `;
          }
          d += 'Z';
          generatedPaths.push(d);
        }
      }
    }
    return generatedPaths;
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 mix-blend-multiply">
      {/* Decorative gradient overlay to fade the pattern edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-linen z-10" />
      
      <svg width="100%" height="100%" className="absolute inset-0">
        <g stroke="currentColor" strokeWidth="0.5" fill="none" className="text-terracotta">
          {paths.map((d, index) => (
            <path key={index} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}
