import React, { useState, useEffect } from 'react';
import { EventItem, SelectedTierItem, AppView, AuthMode, OnboardingRole } from './types';
import { useEvents, useCart } from './hooks';
import { eventService } from './services/api/eventService';
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
 * Analyse l'URL courante pour déterminer la vue et les paramètres
 */
function parseRouteFromUrl(): { view: AppView; slug?: string } {
  if (typeof window === 'undefined') return { view: 'home' };
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');

  if (!pathname || pathname === 'home') {
    return { view: 'home' };
  }
  if (pathname.startsWith('events/') || pathname.startsWith('event/')) {
    const slug = pathname.replace(/^(events|event)\//, '');
    return { view: 'event-detail', slug };
  }
  if (pathname === 'checkout' || pathname.startsWith('checkout/')) {
    const slug = pathname.replace(/^checkout\/?/, '');
    return { view: 'checkout', slug: slug || undefined };
  }
  if (pathname === 'dashboard' || pathname === 'vue-d-ensemble' || pathname === 'mon-espace') {
    return { view: 'dashboard' };
  }
  if (pathname === 'login' || pathname === 'connexion') {
    return { view: 'login' };
  }
  if (pathname === 'onboarding') {
    return { view: 'onboarding' };
  }
  return { view: 'home' };
}

/**
 * @component AppContent
 * @description Contenu principal et orchestrateur d'état et de routage URL de Sunu Events.
 */
export const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sunu_events_auth') === 'true';
  });

  const initialRoute = parseRouteFromUrl();
  const [currentView, setCurrentView] = useState<AppView>(initialRoute.view);
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

  // Chargement direct de l'événement si l'utilisateur arrive directement sur /events/:slug
  useEffect(() => {
    const route = parseRouteFromUrl();
    if (route.view === 'event-detail' && route.slug) {
      eventService.getEventById(route.slug).then((ev) => {
        if (ev) setSelectedEvent(ev);
      });
    }
  }, []);

  // Synchronisation avec les boutons Précédent / Suivant du navigateur
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRouteFromUrl();
      setCurrentView(route.view);
      if (route.view === 'event-detail' && route.slug) {
        eventService.getEventById(route.slug).then((ev) => {
          if (ev) setSelectedEvent(ev);
        });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigateHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDashboard = () => {
    window.history.pushState({}, '', '/dashboard');
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: AuthMode = 'login') => {
    setAuthMode(mode);
    window.history.pushState({}, '', '/login');
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOnboarding = () => {
    window.history.pushState({}, '', '/onboarding');
    setCurrentView('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('sunu_events_auth', 'true');
    window.history.pushState({}, '', '/dashboard');
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOnboardingComplete = (role: OnboardingRole) => {
    setIsAuthenticated(true);
    localStorage.setItem('sunu_events_auth', 'true');
    localStorage.setItem('sunu_events_user_role', role);
    window.history.pushState({}, '', '/dashboard');
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sunu_events_auth');
    setAuthMode('login');
    window.history.pushState({}, '', '/login');
    setCurrentView('login');
  };

  const handleOpenEventDetail = (event: EventItem) => {
    setSelectedEvent(event);
    const targetUrl = `/events/${event.slug || event.id}`;
    window.history.pushState({}, '', targetUrl);
    setCurrentView('event-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCheckout = (tiers?: SelectedTierItem[]) => {
    if (tiers) {
      setSelectedCheckoutTiers(tiers);
    }
    const targetUrl = selectedEvent ? `/checkout/${selectedEvent.slug || selectedEvent.id}` : '/checkout';
    window.history.pushState({}, '', targetUrl);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryAndNavigate = (cat: typeof selectedCategory) => {
    handleCategorySelect(cat);
    if (currentView !== 'home') {
      window.history.pushState({}, '', '/');
      setCurrentView('home');
    }
  };

  const handleSearchAndNavigate = (q: string) => {
    handleSearch(q);
    if (currentView !== 'home' && q.trim()) {
      window.history.pushState({}, '', '/');
      setCurrentView('home');
    }
  };

  const similarEvents = allEvents;

  // 1. Vue Onboarding
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
