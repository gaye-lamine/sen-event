import React from 'react';
import { ArrowRight, Calendar, Heart, MapPin } from 'lucide-react';
import { FavoriteEvent } from '../../../types/dashboard';
import { DashboardSectionHeader } from '../ui/DashboardSectionHeader';

export interface FavoritesTabProps {
  favorites: FavoriteEvent[];
  onRemoveFavorite: (id: string) => void;
  onBookEvent?: (eventId: string) => void;
  onNavigateHome: () => void;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({
  favorites,
  onRemoveFavorite,
  onBookEvent,
  onNavigateHome,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left">
      <DashboardSectionHeader
        title="Mes favoris"
        subtitle="Les évènements que tu as mis de côté pour plus tard."
      />

      {favorites.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
          <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-700">
            Aucun favori enregistré
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Explore les évènements et clique sur le cœur pour les retrouver ici.
          </p>
          <button
            type="button"
            onClick={onNavigateHome}
            className="mt-4 px-5 py-2 rounded-full bg-[#121526] text-white text-xs font-bold"
          >
            Découvrir les évènements
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((event) => {
            const CategoryIcon = event.categoryIcon;
            return (
              <div
                key={event.id}
                className="bg-white rounded-3xl p-3 border border-gray-200/70 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/4.8] bg-gray-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-gray-900 flex items-center gap-1 shadow-2xs">
                    <CategoryIcon className="w-3 h-3 text-gray-800" />
                    <span>{event.category}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveFavorite(event.id)}
                    title="Retirer des favoris"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-[#EF4444] flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-[#EF4444]" />
                  </button>
                </div>

                <div className="px-1.5 pt-3 pb-1">
                  <h3 className="font-bold text-sm sm:text-base text-[#111827] leading-snug line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{event.location}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{event.date}</span>
                  </p>
                </div>

                <div className="px-1.5 pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
                  <div>
                    <p className="text-sm font-black text-[#111827] leading-none">
                      {event.price}
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium">
                      à partir de
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBookEvent?.(event.id)}
                    className="px-4 py-2 rounded-full bg-[#121526] hover:bg-[#090B14] text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
                  >
                    <span>Réserver</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
