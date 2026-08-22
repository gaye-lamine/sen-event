import React, { useState } from 'react';
import { MapPin, Calendar, Heart, ArrowRight } from 'lucide-react';
import { EventCardProps } from '../../types';
import { IconHelper } from '../common/IconHelper';
import { formatPrice } from '../../utils';
import { dashboardService } from '../../services/api/dashboardService';

/**
 * @component EventCard
 * @description Carte de présentation standardisée d'un événement avec affiche,
 * indicateurs de prix en FCFA, métadonnées et bouton de réservation avec pastille dorée au survol.
 * @param {EventCardProps} props - Contrat de propriétés du composant
 */
export const EventCard: React.FC<EventCardProps> = ({
  event,
  variant = 'grid',
  onBook,
  onToggleFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    onToggleFavorite?.(event);

    try {
      const targetId = event.slug || event.id;
      await dashboardService.toggleFavorite(targetId);
    } catch (err) {
      console.error('Erreur lors du toggle favori:', err);
    }
  };

  const handleCardClick = () => {
    onBook?.(event);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col bg-white rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 border border-transparent hover:border-[#FFC23C9C] hover:shadow-xl hover:shadow-[#FFC23C]/10 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
    >
      <div
        className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 border border-transparent group-hover:border-[#FFC23C9C] transition-colors duration-300 flex items-center justify-center"
        style={{
          background: event.image || event.posterUrl ? undefined : (event.ambientColor || 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)'),
        }}
      >
        {event.image || event.posterUrl ? (
          <img
            src={event.posterUrl || event.image || ''}
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full p-5 flex flex-col items-center justify-center text-center text-white relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-lg mb-3 z-10 border border-white/20">
              <IconHelper
                name={event.categoryIcon || event.category}
                className="w-7 h-7 text-white"
              />
            </div>
            <span className="font-extrabold text-sm sm:text-base leading-snug line-clamp-2 z-10 uppercase tracking-tight">
              {event.title}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-semibold text-gray-800 shadow-sm">
            <IconHelper
              name={event.categoryIcon || event.category}
              className="w-3.5 h-3.5 text-gray-700"
            />
            <span>{event.categoryLabel}</span>
          </span>
        </div>

        <button
          onClick={handleFavoriteClick}
          type="button"
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/85 backdrop-blur-md text-gray-700 hover:text-red-500 transition-all shadow-sm hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-[#EF4444] text-[#EF4444]' : 'text-gray-700'
            }`}
          />
        </button>

        {event.isSoldOut && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 bg-red-600/90 text-white text-[11px] font-bold rounded-md shadow-sm">
              Complet
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-4 text-left">
        <div className="flex items-center text-xs text-gray-500 mb-1.5">
          <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400 flex-shrink-0" />
          <span className="truncate">{event.date}</span>
        </div>

        <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-black transition-colors">
          {event.title}
        </h3>

        <div className="flex items-center text-xs text-gray-500 mt-1 mb-3 sm:mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        <div className="mt-auto pt-2.5 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium">À partir de</span>
            <span className="font-black text-sm sm:text-base text-gray-900 tracking-tight">
              {formatPrice(event.startingPrice, event.currency)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook?.(event);
            }}
            type="button"
            className="group/btn inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F141C] text-white text-xs font-semibold rounded-full hover:bg-black active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
          >
            <span>Réserver</span>
            <span className="flex items-center justify-center w-4 h-4 rounded-full transition-colors duration-200 group-hover/btn:bg-[#FFC23C]">
              <ArrowRight className="w-3 h-3 text-white transition-colors duration-200 group-hover/btn:text-[#0F141C]" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
