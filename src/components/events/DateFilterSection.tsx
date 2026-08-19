import React from 'react';
import { DateFilterType, DateFilterSectionProps } from '../../types';
import { EventCard } from './EventCard';

const DATE_TABS: { id: DateFilterType; label: string }[] = [
  { id: 'today', label: "Aujourd'hui" },
  { id: 'this_week', label: 'Cette semaine' },
  { id: 'this_weekend', label: 'Ce week-end' },
  { id: 'this_month', label: 'Ce mois' },
];

export const DateFilterSection: React.FC<DateFilterSectionProps> = ({
  activeFilter,
  onFilterChange,
  events,
  onBook,
}) => {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5] border-y border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            <span>C'est quand, la </span>
            <span className="relative inline-block">
              <span className="relative z-10">sortie ?</span>
              {/* Yellow Marker Highlight under 'sortie ?' */}
              <span
                className="absolute bottom-[2px] left-[-2px] right-[-2px] h-[8px] sm:h-[10px] bg-[#FFC23C]/75 rounded-xs -z-0"
                aria-hidden="true"
              />
            </span>
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
            Filtre selon ton emploi du temps même à la dernière minute.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-6 sm:mb-8">
          {DATE_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                type="button"
                className={`
                  px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap
                  ${
                    isActive
                      ? 'border-2 border-[#EF4444] text-gray-900 bg-white font-bold shadow-xs'
                      : 'border border-gray-900/80 text-gray-800 bg-transparent font-medium hover:bg-black/5'
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4 Event Cards Grid */}
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
      </div>
    </section>
  );
};
