import React from 'react';
import { Calendar, Heart, MapPin, Ticket, User } from 'lucide-react';
import { DashboardSectionHeader } from '../ui/DashboardSectionHeader';

export interface OverviewTabProps {
  upcomingCount: number;
  pastCount: number;
  favoritesCount: number;
  onSelectUpcomingTickets: () => void;
  onSelectPastTickets: () => void;
  onSelectFavorites: () => void;
  onViewFeaturedTicket: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  upcomingCount,
  pastCount,
  favoritesCount,
  onSelectUpcomingTickets,
  onSelectPastTickets,
  onSelectFavorites,
  onViewFeaturedTicket,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <DashboardSectionHeader
        title="Vue d'ensemble"
        subtitle="Un aperçu rapide de ton activité sur Sunu Events."
      />

      {/* 3 Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={onSelectUpcomingTickets}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs cursor-pointer hover:border-gray-300 transition-all text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-[#F8F9FA] text-gray-600 flex items-center justify-center">
            <Ticket className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-3 tracking-tight">
            {upcomingCount}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Billets à venir
          </p>
        </div>

        <div
          onClick={onSelectPastTickets}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs cursor-pointer hover:border-gray-300 transition-all text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#10B981] flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-3 tracking-tight">
            {pastCount}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Évènements passés
          </p>
        </div>

        <div
          onClick={onSelectFavorites}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs cursor-pointer hover:border-gray-300 transition-all text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF1F2] text-[#F43F5E] flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-3 tracking-tight">
            {favoritesCount}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Favoris enregistrés
          </p>
        </div>
      </div>

      {/* Prochain Billet En Vedette */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs text-left">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <img
            src="/images/wally.png"
            alt="Wally B. Seck"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 shadow-xs"
          />
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#111827] leading-snug">
              Wally B. Seck en concert
            </h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Dakar Arena • Ven. 20 décembre 2026, 20h00</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
          <div className="text-left sm:text-right">
            <p className="text-lg sm:text-xl font-black text-[#111827] leading-tight">
              153
            </p>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
              JOURS RESTANTS
            </span>
          </div>

          <button
            type="button"
            onClick={onViewFeaturedTicket}
            className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-800 transition-all cursor-pointer shrink-0"
          >
            Voir le billet
          </button>
        </div>
      </div>

      {/* Activité Récente */}
      <div className="pt-2 text-left">
        <h3 className="font-bold text-sm sm:text-base text-[#111827] mb-3">
          Activité récente
        </h3>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs divide-y divide-gray-100">
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-[#111827]">
                  Achat de 3 billets — Wally B. Seck en concert
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Standard × 2, VIP × 1
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              Il y a 2 jours
            </span>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-[#111827]">
                  Ajouté aux favoris — Festival International de Jazz
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Saint-Louis, 5–8 mai
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              Il y a 5 jours
            </span>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-[#111827]">
                  Profil mis à jour
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Numéro de téléphone modifié
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              Il y a 2 semaines
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
