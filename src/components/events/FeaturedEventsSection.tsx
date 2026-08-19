import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FeaturedEventsSectionProps } from '../../types';
import { EventCard } from './EventCard';

/**
 * @component FeaturedEventsSection
 * @description Carrousel horizontal des événements à la une avec défilement fluide
 * et contrôles de navigation gauche/droite auto-désactivables selon la position de scroll.
 * @param {FeaturedEventsSectionProps} props - Contrat de propriétés du composant
 */
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

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollability, 350);
    }
  };

  if (events.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="text-left">
            <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-gray-900 tracking-tight">
              À la une cette semaine
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Les sorties les plus attendues à Dakar et au Sénégal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              type="button"
              className="p-2.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-xs"
              aria-label="Défiler vers la gauche"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>

            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              type="button"
              className="p-2.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-xs"
              aria-label="Défiler vers la droite"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x snap-mandatory"
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="w-[270px] sm:w-[300px] flex-shrink-0 snap-start"
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
