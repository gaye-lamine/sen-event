import React, { useState } from 'react';
import { MapPin, Calendar, Heart, ArrowRight } from 'lucide-react';
import { EventCardProps } from '../../types';
import { IconHelper } from '../common/IconHelper';

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

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onToggleFavorite?.(event);
  };

  const handleCardClick = () => {
    onBook?.(event);
  };

  const formattedPrice = new Intl.NumberFormat('fr-FR').format(event.startingPrice);

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col bg-white rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 border border-transparent hover:border-[#FFC23C9C] hover:shadow-xl hover:shadow-[#FFC23C]/10 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
    >
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 border border-transparent group-hover:border-[#FFC23C9C] transition-colors duration-300">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

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

        {variant === 'featured' && (
          <button
            onClick={handleFavoriteClick}
            type="button"
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-700 hover:text-red-500 transition-colors shadow-sm"
            aria-label="Ajouter aux favoris"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
            />
          </button>
        )}

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
              {formattedPrice} {event.currency || 'F'}
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
