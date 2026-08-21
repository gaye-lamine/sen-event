import React from 'react';
import { Camera, MapPin, User } from 'lucide-react';
import { UserProfileData } from '../../types/dashboard';

export interface DashboardHeaderBannerProps {
  profile: UserProfileData;
  upcomingTicketsCount: number;
  followedEventsCount: number;
  totalSpent: string;
  onSelectTicketsTab?: () => void;
  onSelectFavoritesTab?: () => void;
}

export const DashboardHeaderBanner: React.FC<DashboardHeaderBannerProps> = ({
  profile,
  upcomingTicketsCount,
  followedEventsCount,
  totalSpent,
  onSelectTicketsTab,
  onSelectFavoritesTab,
}) => {
  return (
    <div
      className="w-full text-white py-8 sm:py-10 px-4 sm:px-6 lg:px-8 shadow-sm relative overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, #6347EA 0%, #5439DD 50%, #462DC9 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Profil Utilisateur */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/70 shadow-md bg-amber-100 flex items-center justify-center">
              <img
                src={profile.avatarUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <User className="w-8 h-8 text-amber-800" />
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-xs hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
              aria-label="Modifier la photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-1 flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-white/70" />
              <span>{profile.city}</span>
              <span>•</span>
              <span>Membre depuis {profile.memberSince}</span>
            </p>
          </div>
        </div>

        {/* 3 Statistiques Principales */}
        <div className="flex items-center gap-8 sm:gap-12 md:gap-14 border-t md:border-t-0 pt-4 md:pt-0 border-white/15">
          <div
            onClick={onSelectTicketsTab}
            className="cursor-pointer hover:opacity-90 transition-opacity text-left"
          >
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {upcomingTicketsCount}
            </p>
            <p className="text-[11px] sm:text-xs text-white/75 font-normal mt-0.5 whitespace-nowrap">
              Billets à venir
            </p>
          </div>

          <div
            onClick={onSelectFavoritesTab}
            className="cursor-pointer hover:opacity-90 transition-opacity text-left"
          >
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {followedEventsCount}
            </p>
            <p className="text-[11px] sm:text-xs text-white/75 font-normal mt-0.5 whitespace-nowrap">
              Évènements suivis
            </p>
          </div>

          <div className="text-left">
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {totalSpent}
            </p>
            <p className="text-[11px] sm:text-xs text-white/75 font-normal mt-0.5 whitespace-nowrap">
              Dépensé cette année
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
