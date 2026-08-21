import React, { useState } from 'react';
import { Calendar, MapPin, Heart, ArrowRight, Users, Star } from 'lucide-react';
import { EventHeroBannerProps } from '../../types';
import { IconHelper } from '../common/IconHelper';
import { formatNumber, formatRating } from '../../utils';
import { dashboardService } from '../../services/api/dashboardService';

/**
 * @component EventHeroBanner
 * @description Grande bannière dorée de la page détail d'un événement avec affiche 3D inclinée,
 * métadonnées d'audience, note moyenne et bouton d'action vers les billets.
 * @param {EventHeroBannerProps} props - Contrat de propriétés du composant
 */
export const EventHeroBanner: React.FC<EventHeroBannerProps> = ({
  event,
  onScrollToTickets,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = async () => {
    setIsFavorite(!isFavorite);
    try {
      const targetId = event.slug || event.id;
      await dashboardService.toggleFavorite(targetId);
    } catch (err) {
      console.error('Erreur toggle favori:', err);
    }
  };

  const formattedAttendees = event.attendeesCount
    ? formatNumber(event.attendeesCount)
    : '2 480';
  const rating = event.rating ? formatRating(event.rating) : '4,8';
  const reviewsCount = event.reviewsCount || 320;

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl lg:rounded-[32px] bg-gradient-to-br from-[#BE8423] via-[#C68D2B] to-[#996515] p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-amber-900/10">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <button
          onClick={handleFavoriteClick}
          type="button"
          className="absolute top-5 right-5 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-red-500 transition-all shadow-md active:scale-95 cursor-pointer"
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-[#EF4444] text-[#EF4444]' : 'text-gray-700'
            }`}
          />
        </button>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 sm:gap-8 lg:gap-10">
          <div className="w-40 sm:w-48 md:w-56 lg:w-60 flex-shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white mb-3">
              <IconHelper
                name={event.categoryIcon || event.category}
                className="w-3.5 h-3.5 text-white"
              />
              <span>{event.categoryLabel}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {event.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-white/90">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-white/80" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-white/80" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/80">
              <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-full">
                <Users className="w-3.5 h-3.5 text-amber-300" />
                <span>{formattedAttendees} participants</span>
              </div>

              <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-full">
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span className="font-bold text-white">{rating}</span>
                <span className="text-white/60">({reviewsCount} avis)</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={onScrollToTickets}
                type="button"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 bg-white text-gray-950 text-xs sm:text-sm font-bold rounded-full hover:bg-amber-50 active:scale-95 transition-all shadow-lg cursor-pointer"
              >
                <span>Voir les billets</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
