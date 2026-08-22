import React from 'react';
import { EventAboutSectionProps } from '../../types';

/**
 * @component EventAboutSection
 * @description Section narrative présentant le descriptif de l'événement et la carte organisateur.
 * @param {EventAboutSectionProps} props - Contrat de propriétés du composant
 */
export const EventAboutSection: React.FC<EventAboutSectionProps> = ({ event }) => {
  const organizer = event.organizer;

  return (
    <div className="space-y-6 text-left">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
        À propos de cet évènement
      </h2>

      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
        {event.description && event.description.trim().length > 0
          ? event.description
          : "Aucune description détaillée n'a été ajoutée pour cet événement."}
      </p>

      {organizer && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#5B21B6] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
            {organizer.initials || organizer.name?.slice(0, 2).toUpperCase() || 'OG'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">
              Organisé par {organizer.name}
            </h4>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {organizer.eventsCount ? `${organizer.eventsCount} événements organisés • ` : ''}Membre depuis {organizer.memberSince || '2026'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
