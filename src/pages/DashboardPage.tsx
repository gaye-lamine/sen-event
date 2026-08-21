import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  DashboardTabType,
  DashboardPageProps,
  UserProfileData,
  FavoriteEvent,
  PaymentMethod,
} from '../types/dashboard';
import {
  MOCK_USER_PROFILE,
  MOCK_USER_TICKETS,
  MOCK_FAVORITE_EVENTS,
  MOCK_PAYMENT_METHODS,
} from '../data/mockDashboard';
import { DashboardHeaderBanner } from '../components/dashboard/DashboardHeaderBanner';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { OverviewTab } from '../components/dashboard/tabs/OverviewTab';
import { TicketsTab } from '../components/dashboard/tabs/TicketsTab';
import { FavoritesTab } from '../components/dashboard/tabs/FavoritesTab';
import { NotificationsTab } from '../components/dashboard/tabs/NotificationsTab';
import { PaymentMethodsTab } from '../components/dashboard/tabs/PaymentMethodsTab';
import { ProfileInfoTab } from '../components/dashboard/tabs/ProfileInfoTab';
import { SecurityTab } from '../components/dashboard/tabs/SecurityTab';

/**
 * @page DashboardPage
 * @description Espace personnel / Tableau de bord d'Aminata Diop :
 * Architecture modulaire avec séparation nette des composants :
 * - DashboardHeaderBanner : Bandeau supérieur, avatar, infos et 3 KPI
 * - DashboardSidebar : Menu latéral et encart organisateur
 * - 7 Onglets modulaires dédiés :
 *   1. OverviewTab (Vue d'ensemble)
 *   2. TicketsTab (Mes billets à venir / passés)
 *   3. FavoritesTab (Mes favoris avec réservation directe)
 *   4. NotificationsTab (Préférences notifications & canaux)
 *   5. PaymentMethodsTab (Moyens de paiement Wave, OM, Visa & PCI-DSS)
 *   6. ProfileInfoTab (Informations personnelles & ville)
 *   7. SecurityTab (Mot de passe & sécurité du compte)
 */
export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateHome,
  onLogout,
  searchQuery = '',
  onSearch,
  cartCount = 0,
  onOpenCart,
  onViewTicket,
  onBookEvent,
}) => {
  // État de navigation des onglets
  const [activeTab, setActiveTab] = useState<DashboardTabType>('overview');

  // Données locales avec état pour persistance d'interaction dans la session
  const [profile, setProfile] = useState<UserProfileData>(MOCK_USER_PROFILE);
  const [favorites, setFavorites] = useState<FavoriteEvent[]>(MOCK_FAVORITE_EVENTS);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);

  // Gestion des favoris
  const handleRemoveFavorite = (favId: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== favId));
  };

  // Gestion des moyens de paiement
  const handleSetDefaultPayment = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === methodId,
      }))
    );
  };

  // Mise à jour du profil
  const handleUpdateProfile = (updatedData: Partial<UserProfileData>) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const upcomingTickets = MOCK_USER_TICKETS.filter((t) => t.status === 'upcoming');
  const pastTickets = MOCK_USER_TICKETS.filter((t) => t.status === 'past');

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-between font-sans selection:bg-brand-300 selection:text-gray-900">
      {/* 1. EN-TÊTE / NAVBAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20 gap-4">
          <Navbar
            searchQuery={searchQuery}
            onSearch={onSearch}
            onNavigateHome={onNavigateHome}
            isAuthenticated={true}
            onLogout={onLogout}
            cartCount={cartCount}
            onOpenCart={onOpenCart}
          />
        </div>
      </div>

      {/* 2. BANDEAU SUPÉRIEUR DÉGRADÉ VIOLET & KPI */}
      <DashboardHeaderBanner
        profile={profile}
        upcomingTicketsCount={upcomingTickets.length}
        followedEventsCount={favorites.length}
        totalSpent="76 500 F"
        onSelectTicketsTab={() => setActiveTab('tickets')}
        onSelectFavoritesTab={() => setActiveTab('favorites')}
      />

      {/* 3. CORPS PRINCIPAL & ONGLETS */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* MENU LATÉRAL DE GAUCHE */}
          <DashboardSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onLogout={onLogout}
            onBecomeOrganizer={onNavigateHome}
          />

          {/* SECTION CENTRALE DYNAMIQUE */}
          <section className="lg:col-span-9 space-y-6 text-left">
            {activeTab === 'overview' && (
              <OverviewTab
                upcomingCount={upcomingTickets.length}
                pastCount={pastTickets.length + 7}
                favoritesCount={favorites.length}
                onSelectUpcomingTickets={() => setActiveTab('tickets')}
                onSelectPastTickets={() => setActiveTab('tickets')}
                onSelectFavorites={() => setActiveTab('favorites')}
                onViewFeaturedTicket={() => onViewTicket?.()}
              />
            )}

            {activeTab === 'tickets' && (
              <TicketsTab tickets={MOCK_USER_TICKETS} />
            )}

            {activeTab === 'favorites' && (
              <FavoritesTab
                favorites={favorites}
                onRemoveFavorite={handleRemoveFavorite}
                onBookEvent={onBookEvent}
                onNavigateHome={onNavigateHome}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsTab
                userEmail={profile.email}
                userPhone={profile.phone}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentMethodsTab
                paymentMethods={paymentMethods}
                onSetDefaultPayment={handleSetDefaultPayment}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileInfoTab
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {activeTab === 'security' && (
              <SecurityTab onLogout={onLogout} />
            )}
          </section>
        </div>
      </main>

      {/* 4. PIED DE PAGE GLOBAL */}
      <Footer onNavigateHome={onNavigateHome} />
    </div>
  );
};
