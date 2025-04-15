import { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface TrailDot extends CursorPosition {
  id: number;
}

export function CursorTrail() {
  const [cursor, setCursor] = useState<CursorPosition>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const trailLength = 15; // Number of dots in the trail

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateCursorPosition);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
    };
  }, []);

  useEffect(() => {
    const addDotToTrail = () => {
      setTrail((prevTrail) => {
        // Add new dot at the beginning
        const newDot = { ...cursor, id: Date.now() };
        
        // Keep only the most recent dots to match trailLength
        const updatedTrail = [newDot, ...prevTrail.slice(0, trailLength - 1)];
        
        return updatedTrail;
      });
    };

    // Update trail every 30ms
    const interval = setInterval(addDotToTrail, 30);

    return () => {
      clearInterval(interval);
    };
  }, [cursor]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {trail.map((dot, index) => {
        // Calculate size and opacity based on position in trail
        const size = 15 - (index * 1);
        const opacity = 1 - (index / trail.length);
        
        return (
          <div
            key={dot.id}
            style={{
              position: 'absolute',
              left: `${dot.x - size / 2}px`,
              top: `${dot.y - size / 2}px`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              backgroundColor: 'rgb(255, 87, 34)', // Orange color
              opacity: opacity,
              filter: `blur(${index === 0 ? 0 : 3}px)`,
              boxShadow: index < 5 ? '0 0 10px 2px rgba(255, 87, 34, 0.5)' : 'none',
              transition: 'opacity 200ms ease',
              zIndex: 9999 - index,
            }}
          />
        );
      })}
    </div>
  );
}