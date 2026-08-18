import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EventItem } from '../../types/event';
import { EventCard } from './EventCard';

interface FeaturedEventsSectionProps {
  events: EventItem[];
  onBook: (event: EventItem) => void;
}

export const FeaturedEventsSection: React.FC<FeaturedEventsSectionProps> = ({
  events,
  onBook,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [events]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth * 0.75;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollability, 350);
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          
          {/* Section Title with Yellow Marker Highlight */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            <span className="relative inline-block">
              <span className="relative z-10">Évènements vedettes</span>
              <span
                className="absolute bottom-[2px] left-0 right-0 h-[8px] sm:h-[10px] bg-[#FFC23C]/75 rounded-xs -z-0"
                aria-hidden="true"
              />
            </span>
          </h2>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              type="button"
              className={`
                w-8 h-8 rounded-full border bg-white flex items-center justify-center transition-all shadow-xs cursor-pointer
                ${
                  canScrollLeft
                    ? 'border-gray-300 text-gray-800 hover:bg-gray-100 active:scale-95'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-60'
                }
              `}
              aria-label="Événements précédents"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              type="button"
              className={`
                w-8 h-8 rounded-full border bg-white flex items-center justify-center transition-all shadow-xs cursor-pointer
                ${
                  canScrollRight
                    ? 'border-gray-300 text-gray-800 hover:bg-gray-100 active:scale-95'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-60'
                }
              `}
              aria-label="Événements suivants"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* Smooth Horizontal Carousel Track with Snap */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-3 snap-x snap-mandatory"
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="w-[280px] sm:w-[300px] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start"
            >
              <EventCard
                event={event}
                variant="featured"
                onBook={onBook}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
