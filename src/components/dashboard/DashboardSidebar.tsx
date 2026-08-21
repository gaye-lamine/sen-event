import React from 'react';
import {
  LayoutGrid,
  Ticket,
  Heart,
  Bell,
  CreditCard,
  User,
  Shield,
  LogOut,
} from 'lucide-react';
import { DashboardTabType } from '../../types/dashboard';

export interface DashboardSidebarProps {
  activeTab: DashboardTabType;
  onSelectTab: (tab: DashboardTabType) => void;
  onLogout: () => void;
  onBecomeOrganizer: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  onBecomeOrganizer,
}) => {
  return (
    <aside className="lg:col-span-3 space-y-6">
      <nav className="space-y-1">
        <button
          type="button"
          onClick={() => onSelectTab('overview')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
            activeTab === 'overview'
              ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
              : 'text-gray-600 hover:bg-white hover:text-gray-900'
          }`}
        >
          <LayoutGrid
            className={`w-4 h-4 ${
              activeTab === 'overview' ? 'text-[#FF5722]' : 'text-gray-500'
            }`}
          />
          <span>Vue d'ensemble</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('tickets')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
            activeTab === 'tickets'
              ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
              : 'text-gray-600 hover:bg-white hover:text-gray-900'
          }`}
        >
          <Ticket
            className={`w-4 h-4 ${
              activeTab === 'tickets' ? 'text-[#FF5722]' : 'text-gray-500'
            }`}
          />
          <span>Mes billets</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('favorites')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
            activeTab === 'favorites'
              ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
              : 'text-gray-600 hover:bg-white hover:text-gray-900'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              activeTab === 'favorites' ? 'text-[#FF5722]' : 'text-gray-500'
            }`}
          />
          <span>Mes favoris</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('notifications')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
            activeTab === 'notifications'
              ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
              : 'text-gray-600 hover:bg-white hover:text-gray-900'
          }`}
        >
          <Bell
            className={`w-4 h-4 ${
              activeTab === 'notifications' ? 'text-[#FF5722]' : 'text-gray-500'
            }`}
          />
          <span>Notifications</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('payments')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
            activeTab === 'payments'
              ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
              : 'text-gray-600 hover:bg-white hover:text-gray-900'
          }`}
        >
          <CreditCard
            className={`w-4 h-4 ${
              activeTab === 'payments' ? 'text-[#FF5722]' : 'text-gray-500'
            }`}
          />
          <span>Moyens de paiement</span>
        </button>

        <div className="pt-3 pb-1 border-t border-gray-200/80 my-2" />

        <button
          type="button"
          onClick={() => onSelectTab('profile')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
            activeTab === 'profile'
              ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
              : 'text-gray-600 hover:bg-white hover:text-gray-900'
          }`}
        >
          <User
            className={`w-4 h-4 ${
              activeTab === 'profile' ? 'text-[#FF5722]' : 'text-gray-500'
            }`}
          />
          <span>Mes informations</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('security')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
            activeTab === 'security'
              ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
              : 'text-gray-600 hover:bg-white hover:text-gray-900'
          }`}
        >
          <Shield
            className={`w-4 h-4 ${
              activeTab === 'security' ? 'text-[#FF5722]' : 'text-gray-500'
            }`}
          />
          <span>Sécurité</span>
        </button>

        <div className="pt-3 pb-1 border-t border-gray-200/80 my-2" />

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Se déconnecter</span>
        </button>
      </nav>

      {/* ENCART CTA ORGANISATEUR */}
      <div
        className="text-white p-5 rounded-2xl shadow-xs text-left"
        style={{
          background: 'linear-gradient(123.97deg, #FF5A36 0%, #B23412 100%)',
        }}
      >
        <h4 className="font-bold text-sm text-white">
          Envie d'organiser ?
        </h4>
        <p className="text-[11px] text-white/90 mt-1 leading-relaxed">
          Crée ta billetterie et vends tes propres évènements.
        </p>
        <button
          type="button"
          onClick={onBecomeOrganizer}
          className="w-full py-2.5 bg-white text-[#B23412] font-bold text-xs rounded-xl mt-3 text-center shadow-xs hover:bg-gray-50 transition-all active:scale-98 cursor-pointer"
        >
          Devenir organisateur
        </button>
      </div>
    </aside>
  );
};
