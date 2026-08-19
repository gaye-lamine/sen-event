import React, { useState } from 'react';
import { MapPin, Calendar, Heart, ArrowRight } from 'lucide-react';
import { EventItem, EventCardProps } from '../../types';
import { IconHelper } from '../common/IconHelper';

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

  // Format price display with FCFA/F
  const formattedPrice = new Intl.NumberFormat('fr-FR').format(event.startingPrice);

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col bg-white rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 border border-transparent hover:border-[#FFC23C9C] hover:shadow-xl hover:shadow-[#FFC23C]/10 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
    >
      {/* Poster Image Container with subtle #FFC23C9C border highlight */}
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 border border-transparent group-hover:border-[#FFC23C9C] transition-colors duration-300">
        
        {/* Event Poster Image */}
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Subtle dark gradient overlay for badge readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

        {/* Category Pill (Top-Left) */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-semibold text-gray-800 shadow-sm">
            <IconHelper
              name={event.categoryIcon || event.category}
              className="w-3.5 h-3.5 text-gray-700"
            />
            <span>{event.categoryLabel}</span>
          </span>
        </div>

        {/* Favorite Heart Button (Top-Right) */}
        {variant === 'featured' && (
          <button
            onClick={handleFavoriteClick}
            type="button"
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-red-500 transition-colors shadow-sm"
            aria-label="Ajouter aux favoris"
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
            />
          </button>
        )}
      </div>

      {/* Card Body Details */}
      <div className="pt-3.5 pb-2 px-1 flex flex-col flex-1">
        
        {/* Title (Color stays solid dark, no change on hover) */}
        <h3 className="font-bold text-sm sm:text-[15px] text-gray-900 leading-snug line-clamp-1">
          {event.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
          <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{event.date}</span>
        </div>

        {/* Dashed Separator & Price / Action Row */}
        <div className="mt-3 pt-2.5 border-t border-dashed border-gray-200 flex items-center justify-between">
          
          {/* Price */}
          <div>
            <div className="font-extrabold text-sm sm:text-base text-gray-900">
              {formattedPrice} {event.currency}
            </div>
            {variant === 'featured' && (
              <span className="text-[10px] text-gray-400 block -mt-0.5">
                à partir de
              </span>
            )}
          </div>

          {/* Action Button: Pill 'Réserver ->' with #FFC23C circle on hover or Circle '->' */}
          {variant === 'featured' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook?.(event);
              }}
              type="button"
              className="group/btn inline-flex items-center gap-2 pl-4 pr-1.5 py-1.5 bg-[#0F141C] text-white text-xs font-semibold rounded-full hover:bg-black active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span>Réserver</span>
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 text-white flex items-center justify-center transition-all duration-200 group-hover/btn:bg-[#FFC23C] group-hover/btn:text-gray-950">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook?.(event);
              }}
              type="button"
              className="w-8 h-8 rounded-full bg-[#0F141C] text-white flex items-center justify-center hover:bg-[#FFC23C] hover:text-gray-950 active:scale-95 transition-all shadow-sm cursor-pointer"
              aria-label="Voir l'événement"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
