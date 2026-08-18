import React from 'react';
import { ArrowDown } from 'lucide-react';
import { EventItem } from '../../types/event';
import { EventCard } from './EventCard';

interface AllEventsSectionProps {
  events: EventItem[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore?: boolean;
  onBook: (event: EventItem) => void;
}

export const AllEventsSection: React.FC<AllEventsSectionProps> = ({
  events,
  hasMore,
  onLoadMore,
  isLoadingMore = false,
  onBook,
}) => {
  return (
    <section id="all-events-section" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Tous les évènements
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
            On t'affiche <span className="font-semibold text-gray-800">tous les évènements</span> utilise les filtres tout en haut pour affiner par genre.
          </p>
        </div>

        {/* 8 Event Cards Grid (2 rows of 4 columns) */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                variant="grid"
                onBook={onBook}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">
              Aucun événement ne correspond à vos critères de recherche.
            </p>
          </div>
        )}

        {/* 'Charger plus d'évènements' Centered Button */}
        {hasMore && (
          <div className="mt-10 sm:mt-12 flex justify-center">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              type="button"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-gray-900 text-gray-900 text-xs sm:text-sm font-semibold hover:bg-gray-100/70 active:scale-95 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <span>{isLoadingMore ? 'Chargement en cours...' : "Charger plus d'évènements"}</span>
              <ArrowDown className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
