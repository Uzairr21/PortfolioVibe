import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

interface TechItem {
  name: string;
  icon: string;
}

interface TechCarouselProps {
  items: TechItem[];
  direction?: 'left' | 'right';
  speed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
}

export function TechCarousel({
  items,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
}: TechCarouselProps) {
  // Double the items to create the continuous effect
  const [carouselItems, setCarouselItems] = useState<TechItem[]>([]);
  
  useEffect(() => {
    // Double the items to ensure continuous carousel
    setCarouselItems([...items, ...items]);
  }, [items]);

  // Determine the animation duration based on the speed
  const getDuration = () => {
    const baseDuration = items.length * 5;
    switch (speed) {
      case 'slow':
        return baseDuration * 1.5;
      case 'fast':
        return baseDuration * 0.75;
      default:
        return baseDuration;
    }
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden w-full my-6",
        pauseOnHover && "hover:[animation-play-state:paused]"
      )}
    >
      <div
        className={cn(
          "inline-flex gap-4 whitespace-nowrap animate-marquee",
          direction === 'right' && "animate-marquee-reverse"
        )}
        style={{ 
          animationDuration: `${getDuration()}s`,
        }}
      >
        {carouselItems.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="flex items-center bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-border hover:border-accent/30 transition-all min-w-[180px]"
          >
            <span
              className="text-accent mr-3 text-xl"
              dangerouslySetInnerHTML={{ __html: tech.icon }}
            ></span>
            <span className="whitespace-nowrap">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}