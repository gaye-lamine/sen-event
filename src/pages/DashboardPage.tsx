import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  DashboardTabType,
  DashboardPageProps,
  UserProfileData,
  UserTicket,
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
import { authService } from '../services/api/authService';
import { dashboardService } from '../services/api/dashboardService';

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

  // Données locales avec état initialisé depuis l'utilisateur connecté réel
  const [profile, setProfile] = useState<UserProfileData>(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      return {
        firstName: currentUser.first_name || 'Lamine',
        lastName: currentUser.last_name || 'Gaye',
        email: currentUser.email || 'lamineg049@gmail.com',
        phone: currentUser.phone || '+221 77 223 80 13',
        city: currentUser.city || 'Dakar',
        memberSince: 'août 2026',
        avatarUrl: '/images/wally.png',
      };
    }
    return MOCK_USER_PROFILE;
  });
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [ticketCounts, setTicketCounts] = useState<{ upcoming: number; past: number; total: number }>({
    upcoming: 0,
    past: 0,
    total: 0,
  });
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);

  // Chargement des vrais billets et favoris depuis l'API Laravel
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ticketsRes, favsRes] = await Promise.allSettled([
          dashboardService.getUserTickets(),
          dashboardService.getUserFavorites(),
        ]);

        if (ticketsRes.status === 'fulfilled' && ticketsRes.value?.data?.tickets) {
          setTickets(ticketsRes.value.data.tickets);
        } else {
          setTickets([]);
        }

        if (ticketsRes.status === 'fulfilled' && ticketsRes.value?.data?.counts) {
          setTicketCounts(ticketsRes.value.data.counts);
        }

        if (favsRes.status === 'fulfilled' && favsRes.value?.data?.favorites) {
          setFavorites(favsRes.value.data.favorites);
        } else {
          setFavorites([]);
        }
      } catch (err) {
        console.error('Erreur de chargement des données dashboard:', err);
      }
    };

    loadDashboardData();
  }, []);

  // Gestion des favoris avec bascule API
  const handleRemoveFavorite = async (favId: string | number) => {
    // Mise à jour optimiste immédiate de l'interface
    setFavorites((prev) => prev.filter((f) => f.id !== String(favId) && f.event_id !== favId));
    try {
      await dashboardService.toggleFavorite(favId);
    } catch (err) {
      console.error('Erreur lors du retrait du favori:', err);
    }
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

  // Mise à jour du profil vers l'API Laravel
  const handleUpdateProfile = async (updatedData: Partial<UserProfileData>) => {
    const payload = {
      first_name: updatedData.firstName || profile.firstName,
      last_name: updatedData.lastName || profile.lastName,
      phone: updatedData.phone || profile.phone,
      city: updatedData.city ?? profile.city,
    };

    const response = await dashboardService.updateUserProfile(payload);
    const updatedUser = response?.data?.user;

    setProfile((prev) => ({
      ...prev,
      firstName: updatedUser?.first_name || payload.first_name,
      lastName: updatedUser?.last_name || payload.last_name,
      phone: updatedUser?.phone || payload.phone,
      city: updatedUser?.city || payload.city || 'Dakar',
    }));
  };

  const upcomingTickets = tickets.filter((t) => t.status === 'upcoming');
  const pastTickets = tickets.filter((t) => t.status === 'past');
  const totalSpentAmount = tickets.reduce((sum, t) => sum + (t.total_amount || 0), 0);
  const totalSpentFormatted = `${totalSpentAmount.toLocaleString('fr-FR')} F`;

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
        upcomingTicketsCount={ticketCounts.upcoming}
        followedEventsCount={favorites.length}
        totalSpent={totalSpentFormatted}
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
                upcomingCount={ticketCounts.upcoming || upcomingTickets.length}
                pastCount={ticketCounts.past || pastTickets.length}
                favoritesCount={favorites.length}
                onSelectUpcomingTickets={() => setActiveTab('tickets')}
                onSelectPastTickets={() => setActiveTab('tickets')}
                onSelectFavorites={() => setActiveTab('favorites')}
                onViewFeaturedTicket={() => onViewTicket?.()}
              />
            )}

            {activeTab === 'tickets' && (
              <TicketsTab tickets={tickets} />
            )}

            {activeTab === 'favorites' && (
              <FavoritesTab
                favorites={favorites}
                onRemoveFavorite={handleRemoveFavorite}
                onBookEvent={(id) => onBookEvent?.(String(id))}
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
