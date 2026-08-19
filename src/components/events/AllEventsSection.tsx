import React from 'react';
import { ArrowDown } from 'lucide-react';
import { AllEventsSectionProps } from '../../types';
import { EventCard } from './EventCard';

/**
 * @component AllEventsSection
 * @description Grille complète de tous les événements disponibles avec pagination infinie
 * ou incrémentale et état vide en cas de recherche infructueuse.
 * @param {AllEventsSectionProps} props - Contrat de propriétés du composant
 */
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
    <section id="all-events-section" className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8 text-left">
          <div>
            <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-gray-900 tracking-tight">
              {searchQuery.trim() ? `Résultats pour "${searchQuery}"` : 'Tous les évènements'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {events.length} évènement{events.length > 1 ? 's' : ''} disponible{events.length > 1 ? 's' : ''}
            </p>
          </div>

          {searchQuery.trim() && onClearSearch && (
            <button
              onClick={onClearSearch}
              type="button"
              className="text-xs text-brand-600 hover:text-brand-700 font-semibold underline cursor-pointer"
            >
              Effacer la recherche
            </button>
          )}
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
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
          <div className="py-16 text-center bg-gray-50 rounded-3xl border border-gray-100 p-8">
            <p className="text-base text-gray-600 font-semibold">
              Aucun évènement trouvé pour votre recherche.
            </p>
            <p className="text-xs text-gray-400 mt-1.5">
              Essayez avec un autre mot-clé ou modifiez les filtres de catégorie.
            </p>
          </div>
        )}

        {hasMore && (
          <div className="mt-10 sm:mt-12 text-center">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              type="button"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 active:scale-95 border border-gray-200 text-gray-900 text-xs sm:text-sm font-bold rounded-full shadow-xs hover:shadow transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoadingMore ? 'Chargement...' : "Charger plus d'évènements"}</span>
              <ArrowDown className="w-4 h-4 text-gray-700 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
