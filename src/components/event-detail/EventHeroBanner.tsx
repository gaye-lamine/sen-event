import React, { useState } from 'react';
import { Calendar, MapPin, Heart, ArrowRight, Users, Star } from 'lucide-react';
import { EventHeroBannerProps } from '../../types';
import { IconHelper } from '../common/IconHelper';
import { formatNumber, formatRating } from '../../utils';
import { dashboardService } from '../../services/api/dashboardService';

/**
 * @component EventHeroBanner
 * @description Grande bannière immersive de la page détail d'un événement avec affiche 3D inclinée,
 * métadonnées d'événement et bouton d'achat de billet conforme à la maquette.
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

  const hasAttendees = Boolean(event.attendeesCount && event.attendeesCount > 0);
  const hasRating = Boolean(event.rating && event.rating > 0);
  const showStats = hasAttendees || hasRating;

  // Évite les doublons de date/heure si la date contient déjà l'heure
  const displayDate = event.date?.includes('•') || !event.time
    ? event.date
    : `${event.date} • ${event.time}`;

  return (
    <div className="w-full">
      <div
        className="relative overflow-hidden rounded-3xl lg:rounded-[32px] p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-amber-900/10"
        style={{
          background: event.ambientColor
            ? `linear-gradient(135deg, ${event.ambientColor} 0%, #12142B 100%)`
            : 'linear-gradient(135deg, #C68D2B 0%, #996515 100%)',
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
              {displayDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-white/80" />
                  <span>{displayDate}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-white/80" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={onScrollToTickets}
                type="button"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#0F141C] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-full active:scale-95 transition-all shadow-lg cursor-pointer"
              >
                <span>Acheter mon billet</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques sous la bannière (affichées strictement si > 0) */}
      {showStats ? (
        <div className="flex items-center justify-center gap-8 py-5 text-xs sm:text-sm text-gray-500 font-medium">
          {hasAttendees && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span>
                <strong className="text-gray-900 font-bold">{formatNumber(event.attendeesCount!)}</strong> intéressés
              </span>
            </div>
          )}
          {hasRating && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>
                <strong className="text-gray-900 font-bold">{formatRating(event.rating!)}</strong>
                {event.reviewsCount ? <span className="text-gray-400 ml-1">({event.reviewsCount} avis)</span> : null}
              </span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
