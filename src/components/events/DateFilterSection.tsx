import React from 'react';
import { DateFilterType, DateFilterSectionProps } from '../../types';
import { EventCard } from './EventCard';

const DATE_TABS: { id: DateFilterType; label: string }[] = [
  { id: 'today', label: "Aujourd'hui" },
  { id: 'this_week', label: 'Cette semaine' },
  { id: 'this_weekend', label: 'Ce week-end' },
  { id: 'this_month', label: 'Ce mois' },
];

/**
 * @component DateFilterSection
 * @description Section de filtrage chronologique rapide avec onglets temporels
 * et grille de cartes d'événements associées.
 * @param {DateFilterSectionProps} props - Contrat de propriétés du composant
 */
export const DateFilterSection: React.FC<DateFilterSectionProps> = ({
  activeFilter,
  onFilterChange,
  events,
  onBook,
}) => {
  return (
    <section className="py-8 sm:py-12 bg-[#FBFBFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="text-left">
            <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-gray-900 tracking-tight">
              C'est quand, la sortie ?
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Choisis ta disponibilité et trouve les meilleurs plans.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-gray-200/90 shadow-xs overflow-x-auto no-scrollbar">
            {DATE_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onFilterChange(tab.id)}
                  type="button"
                  className={`
                    px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? 'bg-[#0F141C] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                variant="date-section"
                onBook={onBook}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-3xl border border-gray-100 p-8">
            <p className="text-sm text-gray-500 font-medium">
              Aucun événement prévu pour cette période pour le moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
