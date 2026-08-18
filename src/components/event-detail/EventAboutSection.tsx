import React from 'react';
import { EventItem } from '../../types/event';

interface EventAboutSectionProps {
  event: EventItem;
}

export const EventAboutSection: React.FC<EventAboutSectionProps> = ({ event }) => {
  const organizer = event.organizer || {
    name: 'Sunu Prod',
    initials: 'SP',
    eventsCount: 24,
    memberSince: '2021',
  };

  return (
    <div className="space-y-6 text-left">
      {/* Section Title */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
        À propos de cet évènement
      </h2>

      {/* Description Text */}
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
        {event.description ||
          "Après une tournée sold-out en Europe, Wally B. Seck retrouve son public sénégalais pour une soirée exceptionnelle au Dakar Arena. Au programme : ses plus grands tubes, des featurings surprises et une scénographie pensée spécialement pour cette date unique. Une première partie assurée par de jeunes talents locaux ouvrira la soirée dès 18h00."}
      </p>

      {/* Organizer Card Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F7F8] border border-gray-100/80 flex items-center gap-3.5">
        
        {/* Organizer Avatar / Initials */}
        <div className="w-11 h-11 rounded-full bg-[#7C3AED] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
          {organizer.initials || 'SP'}
        </div>

        {/* Organizer Metadata */}
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug">
            Organisé par {organizer.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
            {organizer.eventsCount || 24} événements organisés • Membre depuis {organizer.memberSince || '2021'}
          </p>
        </div>
      </div>
    </div>
  );
};
