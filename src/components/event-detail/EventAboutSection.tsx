import React from 'react';
import { EventAboutSectionProps } from '../../types';

/**
 * @component EventAboutSection
 * @description Section narrative présentant le descriptif de l'événement et la carte organisateur.
 * @param {EventAboutSectionProps} props - Contrat de propriétés du composant
 */
export const EventAboutSection: React.FC<EventAboutSectionProps> = ({ event }) => {
  const organizer = event.organizer || {
    name: 'Sunu Prod',
    initials: 'SP',
    eventsCount: 24,
    memberSince: '2021',
  };

  return (
    <div className="space-y-6 text-left">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
        À propos de cet évènement
      </h2>

      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
        {event.description ||
          "Retrouvez les plus grandes stars de la musique sénégalaise pour un show d'exception. Une soirée inoubliable avec des invités prestigieux, un son haute définition et une ambiance 100% festive dans la plus belle salle de Dakar."}
      </p>

      <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gray-900 text-white font-black text-sm flex items-center justify-center shadow-xs">
            {organizer.initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-gray-900">
                {organizer.name}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Vérifié
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {organizer.eventsCount} évènements organisés • Membre depuis {organizer.memberSince}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-3.5 py-1.5 border border-gray-300 rounded-full text-xs font-semibold text-gray-700 hover:bg-white hover:border-gray-400 transition-all cursor-pointer"
        >
          Profil
        </button>
      </div>
    </div>
  );
};
