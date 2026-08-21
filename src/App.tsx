import React, { useState } from 'react';
import { EventItem, SelectedTierItem, AppView, AuthMode, OnboardingRole } from './types';
import { useEvents, useCart } from './hooks';
import { Navbar } from './components/layout/Navbar';
import { CategoryPills } from './components/hero/CategoryPills';
import { HeroSection } from './components/hero/HeroSection';
import { FeaturedEventsSection } from './components/events/FeaturedEventsSection';
import { DateFilterSection } from './components/events/DateFilterSection';
import { AllEventsSection } from './components/events/AllEventsSection';
import { OrganizerBanner } from './components/cta/OrganizerBanner';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { EventDetailPage } from './pages/EventDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedAccessGate } from './components/auth/ProtectedAccessGate';

/**
 * @component AppContent
 * @description Contenu principal et orchestrateur d'état de l'application Sunu Events.
 */
export const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sunu_events_auth') === 'true';
  });

  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedCheckoutTiers, setSelectedCheckoutTiers] = useState<SelectedTierItem[]>([]);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const {
    categories,
    selectedCategory,
    featuredEvents,
    dateFilter,
    dateFilteredEvents,
    allEvents,
    hasMoreEvents,
    isLoadingMore,
    searchQuery,
    setDateFilter,
    handleCategorySelect,
    handleSearch,
    handleClearSearch,
    handleLoadMore,
  } = useEvents();

  const {
    isCartOpen,
    cartItems,
    cartCount,
    openCart,
    closeCart,
    removeItem,
  } = useCart();

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDashboard = () => {
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOnboarding = () => {
    setCurrentView('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('sunu_events_auth', 'true');
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOnboardingComplete = (role: OnboardingRole) => {
    setIsAuthenticated(true);
    localStorage.setItem('sunu_events_auth', 'true');
    localStorage.setItem('sunu_events_user_role', role);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sunu_events_auth');
    setAuthMode('login');
    setCurrentView('login');
  };

  const handleOpenEventDetail = (event: EventItem) => {
    setSelectedEvent(event);
    setCurrentView('event-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCheckout = (tiers?: SelectedTierItem[]) => {
    if (tiers) {
      setSelectedCheckoutTiers(tiers);
    }
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryAndNavigate = (cat: typeof selectedCategory) => {
    handleCategorySelect(cat);
    if (currentView !== 'home') {
      setCurrentView('home');
    }
  };

  const handleSearchAndNavigate = (q: string) => {
    handleSearch(q);
    if (currentView !== 'home' && q.trim()) {
      setCurrentView('home');
    }
  };

  const similarEvents = allEvents.filter(
    (e) => !selectedEvent || e.id !== selectedEvent.id
  );

  // 1. Vue Onboarding (Étape 1 à 5)
  if (currentView === 'onboarding') {
    return (
      <OnboardingPage
        onNavigateHome={handleNavigateHome}
        onOpenLogin={() => handleOpenAuth('login')}
        onComplete={handleOnboardingComplete}
        searchQuery={searchQuery}
        onSearch={handleSearchAndNavigate}
        cartCount={cartCount}
        onOpenCart={openCart}
      />
    );
  }

  // 2. Vue Connexion
  if (!isAuthenticated || currentView === 'login') {
    return (
      <LoginPage
        initialMode={authMode}
        onNavigateHome={handleNavigateHome}
        onLoginSuccess={handleLoginSuccess}
        onOpenOnboarding={handleOpenOnboarding}
      />
    );
  }

  // 3. Vue Espace Personnel / Dashboard ("Vue d'ensemble")
  if (currentView === 'dashboard') {
    return (
      <DashboardPage
        onNavigateHome={handleNavigateHome}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearch={handleSearchAndNavigate}
        cartCount={cartCount}
        onOpenCart={openCart}
        onViewTicket={() => {
          if (featuredEvents[0]) {
            handleOpenEventDetail(featuredEvents[0]);
          }
        }}
        onBookEvent={(eventId) => {
          const ev = allEvents.find((e) => e.id === eventId) || featuredEvents[0];
          if (ev) {
            handleOpenEventDetail(ev);
          }
        }}
      />
    );
  }

  // 4. Application Complète (Accueil, Détail Évènement, Checkout)
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-brand-300 selection:text-gray-900">
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
        <Navbar
          searchQuery={searchQuery}
          onSearch={handleSearchAndNavigate}
          onNavigateHome={handleNavigateHome}
          onOpenAuth={handleOpenAuth}
          onOpenDashboard={handleOpenDashboard}
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
          cartCount={cartCount}
          onOpenCart={openCart}
        />

        {currentView === 'home' && (
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategoryAndNavigate}
          />
        )}
      </header>

      {currentView === 'checkout' && (selectedEvent || featuredEvents[0]) ? (
        <main className="flex-1">
          <CheckoutPage
            event={selectedEvent || featuredEvents[0]}
            initialTiers={selectedCheckoutTiers}
            onNavigateHome={handleNavigateHome}
          />
        </main>
      ) : currentView === 'event-detail' && (selectedEvent || featuredEvents[0]) ? (
        <main className="flex-1">
          <EventDetailPage
            event={selectedEvent || featuredEvents[0]}
            similarEvents={similarEvents}
            onNavigateHome={handleNavigateHome}
            onSelectEvent={handleOpenEventDetail}
            onProceedToCheckout={handleOpenCheckout}
          />
        </main>
      ) : (
        <main className="flex-1">
          <HeroSection
            searchQuery={searchQuery}
            onSearch={handleSearchAndNavigate}
          />

          <FeaturedEventsSection
            events={featuredEvents}
            onBook={handleOpenEventDetail}
          />

          <DateFilterSection
            activeFilter={dateFilter}
            onFilterChange={setDateFilter}
            events={dateFilteredEvents}
            onBook={handleOpenEventDetail}
          />

          <AllEventsSection
            events={allEvents}
            hasMore={hasMoreEvents}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            onBook={handleOpenEventDetail}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
          />

          <OrganizerBanner />
        </main>
      )}

      <Footer onNavigateHome={handleNavigateHome} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={cartItems}
        onRemoveItem={removeItem}
        onCheckout={() => {
          closeCart();
          handleOpenCheckout();
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ProtectedAccessGate>
      <AppContent />
    </ProtectedAccessGate>
  );
};

export default App;
