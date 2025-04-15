import { useEffect, useState, useRef, useCallback } from 'react';

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
  const trailLength = 10; // Reduced number of dots for better performance
  const frameRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);

  // Throttled cursor update function
  const updateCursorPosition = useCallback((e: MouseEvent) => {
    // Only update cursor position at most every 8ms (~120fps) for better performance
    const now = performance.now();
    if (now - lastUpdateTimeRef.current < 8) return;
    
    setCursor({ x: e.clientX, y: e.clientY });
    lastUpdateTimeRef.current = now;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', updateCursorPosition, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [updateCursorPosition]);

  useEffect(() => {
    const updateTrail = () => {
      setTrail((prevTrail) => {
        // Only add a dot if the cursor has moved significantly
        const lastDot = prevTrail[0];
        if (lastDot) {
          const dx = cursor.x - lastDot.x;
          const dy = cursor.y - lastDot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Skip updates for very small movements
          if (distance < 3) {
            return prevTrail;
          }
        }
        
        // Add new dot at the beginning with optimized unique ID
        const newDot = { ...cursor, id: Date.now() };
        
        // Keep only the most recent dots to match trailLength
        return [newDot, ...prevTrail.slice(0, trailLength - 1)];
      });
      
      // Use requestAnimationFrame for smoother animation
      frameRef.current = requestAnimationFrame(updateTrail);
    };

    // Start the animation loop
    frameRef.current = requestAnimationFrame(updateTrail);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [cursor, trailLength]);

  // Don't render anything until mouse has moved
  if (trail.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {trail.map((dot, index) => {
        // Calculate size and opacity based on position in trail
        const size = 12 - (index * 1);
        const opacity = 1 - (index / trail.length);
        
        // Skip rendering very small dots for better performance
        if (size < 3) return null;
        
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
              filter: index === 0 ? 'none' : `blur(${Math.min(index, 3)}px)`,
              boxShadow: index < 3 ? '0 0 8px 1px rgba(255, 87, 34, 0.5)' : 'none',
              transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
              zIndex: 9999 - index,
              willChange: 'left, top, width, height, opacity', // Optimize for animation
            }}
          />
        );
      })}
    </div>
  );
}