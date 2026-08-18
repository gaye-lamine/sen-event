import React from 'react';
import { EventItem } from '../../types/event';
import { EventCard } from '../events/EventCard';

interface SimilarEventsSectionProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export const SimilarEventsSection: React.FC<SimilarEventsSectionProps> = ({
  events,
  onSelectEvent,
}) => {
  if (events.length === 0) return null;

  return (
    <div className="space-y-6 text-left pt-6">
      {/* Section Title */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
        Évènements similaires
      </h2>

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.slice(0, 3).map((item) => (
          <EventCard
            key={item.id}
            event={item}
            variant="grid"
            onBook={onSelectEvent}
          />
        ))}
      </div>
    </div>
  );
};
