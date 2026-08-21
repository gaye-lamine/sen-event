import React, { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Heart,
  MapPin,
  Music,
  Trophy,
  Theater,
  Film,
  Sparkles,
  Mic,
  Loader2,
  LucideIcon,
} from 'lucide-react';
import { FavoriteEvent } from '../../../types/dashboard';
import { DashboardSectionHeader } from '../ui/DashboardSectionHeader';

export interface FavoritesTabProps {
  favorites: FavoriteEvent[];
  onRemoveFavorite: (id: string | number) => void;
  onBookEvent?: (eventId: string | number) => void;
  onNavigateHome: () => void;
}

const getCategoryIcon = (category: string, CustomIcon?: LucideIcon): LucideIcon => {
  if (CustomIcon) return CustomIcon;
  const normalized = (category || '').toLowerCase();
  if (normalized.includes('musique') || normalized.includes('concert')) return Music;
  if (normalized.includes('sport') || normalized.includes('foot') || normalized.includes('match')) return Trophy;
  if (normalized.includes('theatre') || normalized.includes('humour') || normalized.includes('comedie')) return Theater;
  if (normalized.includes('cinema') || normalized.includes('film')) return Film;
  if (normalized.includes('festival')) return Sparkles;
  if (normalized.includes('conference') || normalized.includes('formation')) return Mic;
  return Sparkles;
};

export const FavoritesTab: React.FC<FavoritesTabProps> = ({
  favorites,
  onRemoveFavorite,
  onBookEvent,
  onNavigateHome,
}) => {
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  const handleRemove = async (eventId: string | number) => {
    setRemovingId(eventId);
    try {
      await onRemoveFavorite(eventId);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left">
      <DashboardSectionHeader
        title="Mes favoris"
        subtitle="Les évènements que tu as mis de côté pour plus tard."
      />

      {favorites.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-gray-800">
            Aucun favori enregistré
          </h4>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Explore le catalogue d’évènements et clique sur le cœur pour les retrouver instantanément ici.
          </p>
          <button
            type="button"
            onClick={onNavigateHome}
            className="mt-5 px-6 py-2.5 rounded-full bg-[#12142B] hover:bg-[#0A0C1B] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            Découvrir les évènements
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((event) => {
            const targetId = event.event_id || event.id;
            const CategoryIcon = getCategoryIcon(event.category, event.categoryIcon);
            const isRemoving = removingId === targetId;

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
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/wally.png';
                    }}
                  />

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-gray-900 flex items-center gap-1 shadow-2xs">
                    <CategoryIcon className="w-3 h-3 text-gray-800" />
                    <span>{event.category || 'Évènement'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(targetId)}
                    disabled={isRemoving}
                    title="Retirer des favoris"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-[#EF4444] flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isRemoving ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                    ) : (
                      <Heart className="w-4 h-4 fill-[#EF4444]" />
                    )}
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
                    onClick={() => onBookEvent?.(targetId)}
                    className="px-4 py-2 rounded-full bg-[#12142B] hover:bg-[#0A0C1B] text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
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
