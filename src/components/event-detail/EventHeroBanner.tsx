import React, { useState } from 'react';
import { Calendar, MapPin, Heart, ArrowRight, Users, Star } from 'lucide-react';
import { EventItem } from '../../types/event';
import { IconHelper } from '../common/IconHelper';

interface EventHeroBannerProps {
  event: EventItem;
  onScrollToTickets?: () => void;
}

export const EventHeroBanner: React.FC<EventHeroBannerProps> = ({
  event,
  onScrollToTickets,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const formattedAttendees = event.attendeesCount
    ? new Intl.NumberFormat('fr-FR').format(event.attendeesCount)
    : '2 480';
  const rating = event.rating ? event.rating.toFixed(1).replace('.', ',') : '4,8';
  const reviewsCount = event.reviewsCount || 320;

  return (
    <div className="w-full">
      {/* Golden Gradient Banner Container */}
      <div className="relative overflow-hidden rounded-3xl lg:rounded-[32px] bg-gradient-to-br from-[#BE8423] via-[#C68D2B] to-[#996515] p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-amber-900/10">
        
        {/* Subtle decorative background light effect */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Favorite Heart Button (Top-Right) */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          type="button"
          className="absolute top-5 right-5 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-red-500 transition-all shadow-md active:scale-95 cursor-pointer"
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className={`w-5 h-5 transition-transform active:scale-125 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
            }`}
          />
        </button>

        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
          
          {/* Left Side: 3D Tilted Poster Image */}
          <div className="w-48 sm:w-56 md:w-64 lg:w-72 flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300 border-2 border-white/30">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-auto object-cover aspect-[3/4]"
              />
            </div>
          </div>

          {/* Right Side: Event Details & Action */}
          <div className="flex-1 text-left">
            
            {/* Category Pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white mb-3 sm:mb-4 border border-white/20">
              <IconHelper
                name={event.categoryIcon || event.category}
                className="w-3.5 h-3.5 text-white"
              />
              <span>{event.categoryLabel}</span>
            </div>

            {/* Event Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {event.title}
            </h1>

            {/* Date & Location Metadata */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-white/90 mb-6">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white/80" />
                <span>{event.date}</span>
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white/80" />
                <span>{event.location}</span>
              </span>
            </div>

            {/* CTA Button: Acheter mon billet */}
            <div>
              <button
                onClick={onScrollToTickets}
                type="button"
                className="group inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 bg-[#0F141C] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-black active:scale-95 transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                <span>Acheter mon billet</span>
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FFC23C] group-hover:text-gray-950 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof & Rating Counters */}
      <div className="flex items-center justify-center gap-6 sm:gap-8 py-5 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span>
            <strong className="font-bold text-gray-900">{formattedAttendees}</strong> intéressés
          </span>
        </div>
        <div className="w-1 h-1 rounded-full bg-gray-300" />
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>
            <strong className="font-bold text-gray-900">{rating}</strong> ({reviewsCount} avis)
          </span>
        </div>
      </div>
    </div>
  );
};
