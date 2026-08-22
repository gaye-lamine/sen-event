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
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gray-900 text-white font-black text-sm flex items-center justify-center shadow-xs">
              {organizer.initials || organizer.name?.slice(0, 2).toUpperCase() || 'OG'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-gray-900">
                  {organizer.name}
                </span>
                {organizer.verified && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Vérifié
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {organizer.eventsCount ? `${organizer.eventsCount} évènements organisés • ` : ''}Membre depuis {organizer.memberSince || '2026'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
