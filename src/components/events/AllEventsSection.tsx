import React from 'react';
import { ArrowDown, X, Search } from 'lucide-react';
import { EventItem } from '../../types/event';
import { EventCard } from './EventCard';

interface AllEventsSectionProps {
  events: EventItem[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore?: boolean;
  onBook: (event: EventItem) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const AllEventsSection: React.FC<AllEventsSectionProps> = ({
  events,
  hasMore,
  onLoadMore,
  isLoadingMore = false,
  onBook,
  searchQuery = '',
  onClearSearch,
}) => {
  return (
    <section id="all-events-section" className="py-12 sm:py-16 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Tous les évènements
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
              On t'affiche <span className="font-semibold text-gray-800">tous les évènements</span> utilise les filtres tout en haut pour affiner par genre.
            </p>
          </div>

          {/* Active Search Filter Badge */}
          {searchQuery && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-medium self-start sm:self-auto">
              <Search className="w-3.5 h-3.5 text-amber-600" />
              <span>
                Résultats pour : <strong className="font-bold">« {searchQuery} »</strong> ({events.length})
              </span>
              <button
                onClick={onClearSearch}
                type="button"
                className="ml-1 p-0.5 hover:bg-amber-200 rounded-full transition-colors cursor-pointer"
                title="Effacer la recherche"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 p-6">
            <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-gray-900 font-bold text-base">
              Aucun événement trouvé pour « {searchQuery} »
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Essayez un autre mot-clé (ex: Wally, Match, Festival, Dakar...)
            </p>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                type="button"
                className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-semibold hover:bg-black transition-all cursor-pointer"
              >
                Réinitialiser la recherche
              </button>
            )}
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
