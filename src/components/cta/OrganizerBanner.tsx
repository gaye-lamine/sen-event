import React from 'react';
import { ArrowRight } from 'lucide-react';
import { OrganizerBannerProps } from '../../types';

/**
 * @component OrganizerBanner
 * @description Bannière d'appel à l'action pour les organisateurs d'événements
 * avec fond gradient métallique sombre et bouton d'action doré.
 * @param {OrganizerBannerProps} props - Contrat de propriétés du composant
 */
export const OrganizerBanner: React.FC<OrganizerBannerProps> = ({
  onBecomeOrganizer,
}) => {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl sm:rounded-[32px] bg-cta-gradient text-white p-7 sm:p-10 lg:p-14 shadow-2xl border border-white/5">
          <div
            className="absolute top-0 right-0 w-[400px] h-full bg-gradient-to-l from-amber-500/20 via-amber-600/10 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8">
            <div className="max-w-2xl text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                <div>Tu organises un évènement ?</div>
                <div className="mt-1">
                  <span className="relative inline-block">
                    <span className="relative z-10">Publie-le en 10 minutes.</span>
                    <span
                      className="absolute bottom-[3px] left-0 right-0 h-[8px] sm:h-[10px] bg-[#FFC23C]/75 rounded-xs -z-0"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </h2>

              <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-300 font-normal leading-relaxed">
                Crée ta billetterie, encaisse via Wave & Orange Money, suis tes ventes en direct.
              </p>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={onBecomeOrganizer}
                type="button"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#FFC23C] hover:bg-[#F59E0B] active:scale-95 text-gray-950 text-xs sm:text-sm font-extrabold rounded-full shadow-lg shadow-amber-500/25 transition-all duration-200 cursor-pointer"
              >
                <span>Devenir organisateur</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
