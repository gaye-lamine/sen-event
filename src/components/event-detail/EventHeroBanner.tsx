import React, { useState } from 'react';
import { Calendar, MapPin, Heart, ArrowRight, Users, Star } from 'lucide-react';
import { EventHeroBannerProps } from '../../types';
import { IconHelper } from '../common/IconHelper';
import { formatNumber, formatRating, formatPrice } from '../../utils';
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

  const formattedAttendees = event.attendeesCount ? formatNumber(event.attendeesCount) : null;
  const rating = event.rating ? formatRating(event.rating) : null;
  const reviewsCount = event.reviewsCount || null;

  return (
    <div className="w-full">
      <div
        className="relative overflow-hidden rounded-3xl lg:rounded-[32px] bg-gradient-to-br from-[#BE8423] via-[#C68D2B] to-[#996515] p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-amber-900/10"
        style={{
          background: event.ambientColor
            ? `linear-gradient(135deg, ${event.ambientColor} 0%, #12142B 100%)`
            : undefined,
        }}
      >
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
            <div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform -rotate-1 hover:rotate-0 transition-transform duration-300 flex items-center justify-center"
              style={{
                background: event.image || event.posterUrl ? undefined : (event.ambientColor || 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)'),
              }}
            >
              {event.image || event.posterUrl ? (
                <img
                  src={event.posterUrl || event.image || ''}
                  alt={event.title}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center text-white relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg mb-2 border border-white/20">
                    <IconHelper
                      name={event.categoryIcon || event.category}
                      className="w-7 h-7 text-white"
                    />
                  </div>
                  <span className="font-extrabold text-xs sm:text-sm uppercase tracking-tight line-clamp-2">
                    {event.title}
                  </span>
                </div>
              )}
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
              {event.date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-white/80" />
                  <span>{event.date} {event.time ? `• ${event.time}` : ''}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-white/80" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* Badges métadonnées réelles */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/90">
              {/* Badge Organisateur réel */}
              {event.organizer?.name && (
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <span className="text-white/70">Par :</span>
                  <span className="font-bold text-white">{event.organizer.name}</span>
                </div>
              )}

              {/* Badge Participants réels */}
              <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <Users className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  <strong className="text-white font-bold">{event.attendeesCount ?? 0}</strong> {(event.attendeesCount ?? 0) > 1 ? 'participants' : 'participant'}
                </span>
              </div>

              {/* Badge Billetterie / Statut */}
              <div className="flex items-center gap-1.5 bg-emerald-500/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-400/30 text-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">Billetterie ouverte</span>
              </div>

              {/* Note / Avis si disponibles */}
              {rating && (
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span className="font-bold text-white">{rating}</span>
                  {reviewsCount && <span className="text-white/60">({reviewsCount} avis)</span>}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={onScrollToTickets}
                type="button"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 bg-white text-gray-950 text-xs sm:text-sm font-bold rounded-full hover:bg-amber-50 active:scale-95 transition-all shadow-lg cursor-pointer"
              >
                <span>Voir les billets</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {event.startingPrice > 0 && (
                <span className="text-xs sm:text-sm font-semibold text-white/90 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-full">
                  À partir de <strong className="font-black text-white">{formatPrice(event.startingPrice, event.currency)}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
