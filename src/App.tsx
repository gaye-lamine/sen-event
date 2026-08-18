import React, { useState, useEffect } from 'react';
import {
  EventItem,
  CategoryItem,
  EventCategory,
  DateFilterType,
  BookingConfirmation,
  TicketTier,
} from './types/event';
import { eventService } from './services/api/eventService';
import { Navbar } from './components/layout/Navbar';
import { CategoryPills } from './components/hero/CategoryPills';
import { HeroSection } from './components/hero/HeroSection';
import { FeaturedEventsSection } from './components/events/FeaturedEventsSection';
import { DateFilterSection } from './components/events/DateFilterSection';
import { AllEventsSection } from './components/events/AllEventsSection';
import { OrganizerBanner } from './components/cta/OrganizerBanner';
import { Footer } from './components/layout/Footer';
import { BookingModal } from './components/events/BookingModal';
import { AuthModal } from './components/auth/AuthModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { EventDetailPage } from './pages/EventDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';

/**
 * ============================================================================
 * COMPOSANT PRINCIPAL : SUNUEVENTS APPLICATION
 * ============================================================================
 */

export const App: React.FC = () => {
  // --------------------------------------------------------------------------
  // VUE ACTIVE : 'home' | 'event-detail' | 'checkout'
  // --------------------------------------------------------------------------
  const [currentView, setCurrentView] = useState<'home' | 'event-detail' | 'checkout'>('home');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedCheckoutTiers, setSelectedCheckoutTiers] = useState<
    { tier: TicketTier; quantity: number }[]
  >([]);

  // --------------------------------------------------------------------------
  // ÉTATS GLOBAUX : ÉVÉNEMENTS, CATÉGORIES ET FILTRES
  // --------------------------------------------------------------------------
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilterType>('today');
  const [dateFilteredEvents, setDateFilteredEvents] = useState<EventItem[]>([]);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // --------------------------------------------------------------------------
  // ÉTATS DES MODALES (EN ATTENTE DE CONNEXION BACKEND)
  // --------------------------------------------------------------------------
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<EventItem | null>(null);
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
  }>({ isOpen: false, mode: 'login' });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<
    { event: EventItem; quantity: number; tierName: string; price: number }[]
  >([]);

  // 1. Chargement initial des catégories et des événements vedettes
  useEffect(() => {
    const loadInitialData = async () => {
      const cats = await eventService.getCategories();
      setCategories(cats);

      const featured = await eventService.getFeaturedEvents();
      setFeaturedEvents(featured);

      if (featured.length > 0) {
        setSelectedEvent(featured[0]);
      }
    };

    loadInitialData();
  }, []);

  // 2. Chargement des événements selon le filtre temporel ("C'est quand, la sortie ?")
  useEffect(() => {
    const loadDateEvents = async () => {
      const events = await eventService.getEventsByDateFilter(dateFilter);
      setDateFilteredEvents(events);
    };

    loadDateEvents();
  }, [dateFilter]);

  // 3. Chargement des événements avec recherche et pagination
  useEffect(() => {
    const loadAllEvents = async () => {
      const response = await eventService.getAllEvents(
        {
          category: selectedCategory,
          query: searchQuery,
        },
        currentPage,
        8
      );

      if (currentPage === 1) {
        setAllEvents(response.data);
      } else {
        setAllEvents((prev) => {
          const ids = new Set(prev.map((e) => e.id));
          const newItems = response.data.filter((e) => !ids.has(e.id));
          return [...prev, ...newItems];
        });
      }
      setHasMoreEvents(response.hasMore);
      setIsLoadingMore(false);
    };

    loadAllEvents();
  }, [selectedCategory, searchQuery, currentPage]);

  // --------------------------------------------------------------------------
  // GESTIONNAIRES D'ACTIONS & NAVIGATION
  // --------------------------------------------------------------------------
  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEventDetail = (event: EventItem) => {
    setSelectedEvent(event);
    setCurrentView('event-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCheckout = (
    tiers?: { tier: TicketTier; quantity: number }[]
  ) => {
    if (tiers) {
      setSelectedCheckoutTiers(tiers);
    }
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: EventCategory) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTimeout(() => {
      const el = document.getElementById('all-events-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (currentView !== 'home' && query.trim()) {
      setCurrentView('home');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  };

  /** Traite le checkout depuis la page de détail */
  const handleProceedToCheckout = (
    selectedTiers: { tier: TicketTier; quantity: number }[]
  ) => {
    handleOpenCheckout(selectedTiers);
  };

  /** Traite le succès d'une réservation */
  const handleBookingSuccess = (confirmation: BookingConfirmation) => {
    setCartItems((prev) => [
      ...prev,
      {
        event: confirmation.event,
        quantity: confirmation.quantity,
        tierName: confirmation.tierName,
        price: confirmation.event.startingPrice,
      },
    ]);
  };

  // Récupération des événements similaires (excluant l'événement actuel)
  const similarEvents = allEvents.filter(
    (e) => !selectedEvent || e.id !== selectedEvent.id
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-brand-300 selection:text-gray-900">
      
      {/* Header Fixe / Sticky (Navbar + Filtres de Catégories sur la page d'accueil) */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
        {/* 1. Barre de navigation principale */}
        <Navbar
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onNavigateHome={handleNavigateHome}
          /* onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })} // Décommenter pour activer les modales d'authentification */
          cartCount={cartItems.length}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* 2. Filtres par catégorie (Visibles uniquement sur la page d'accueil) */}
        {currentView === 'home' && (
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}
      </header>

      {/* =================================================================== */}
      {/* VUE 1 : TUNNEL D'ACHAT & RÉSERVATION (CHECKOUT STEPPER)             */}
      {/* =================================================================== */}
      {currentView === 'checkout' && selectedEvent ? (
        <main className="flex-1">
          <CheckoutPage
            event={selectedEvent}
            initialTiers={selectedCheckoutTiers}
            onNavigateHome={handleNavigateHome}
          />
        </main>
      ) : currentView === 'event-detail' && selectedEvent ? (
        /* ================================================================= */
        /* VUE 2 : PAGE DE DÉTAIL D'UN ÉVÉNEMENT                             */
        /* ================================================================= */
        <main className="flex-1">
          <EventDetailPage
            event={selectedEvent}
            similarEvents={similarEvents}
            onNavigateHome={handleNavigateHome}
            onSelectEvent={handleOpenEventDetail}
            onProceedToCheckout={handleProceedToCheckout}
          />
        </main>
      ) : (
        /* ================================================================= */
        /* VUE 3 : PAGE D'ACCUEIL PRINCIPALE                                 */
        /* ================================================================= */
        <main className="flex-1">
          {/* Section Hero principale avec recherche en direct */}
          <HeroSection
            searchQuery={searchQuery}
            onSearch={handleSearch}
          />

          {/* Section 1 : "Évènements vedettes" */}
          <FeaturedEventsSection
            events={featuredEvents}
            onBook={handleOpenEventDetail}
          />

          {/* Section 2 : "C'est quand, la sortie ?" */}
          <DateFilterSection
            activeFilter={dateFilter}
            onFilterChange={setDateFilter}
            events={dateFilteredEvents}
            onBook={handleOpenEventDetail}
          />

          {/* Section 3 : "Tous les évènements" avec résultats de recherche en direct */}
          <AllEventsSection
            events={allEvents}
            hasMore={hasMoreEvents}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
            onBook={handleOpenEventDetail}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
          />

          {/* Bannière CTA pour organisateurs */}
          <OrganizerBanner
            /* onBecomeOrganizer={() => setAuthModalState({ isOpen: true, mode: 'signup' })} // Décommenter pour activer */
          />
        </main>
      )}

      {/* Pied de page (Footer) */}
      <Footer />

      {/* =================================================================== */}
      {/* MODALE : DÉTAILS DE L'ÉVÉNEMENT (COMMENTÉE / DÉSACTIVÉE ACTUELLEMENT)*/}
      {/* =================================================================== */}
      {/*
      <BookingModal
        event={selectedEventForBooking}
        isOpen={!!selectedEventForBooking}
        onClose={() => setSelectedEventForBooking(null)}
        onBookingSuccess={handleBookingSuccess}
      />
      */}

      {/* =================================================================== */}
      {/* MODALE : AUTHENTIFICATION LOGIN / SIGNUP (COMMENTÉE ACTUELLEMENT)   */}
      {/* =================================================================== */}
      {/*
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
      />
      */}

      {/* =================================================================== */}
      {/* TIROIR : PANIER D'ACHATS                                            */}
      {/* =================================================================== */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={(index) =>
          setCartItems((prev) => prev.filter((_, i) => i !== index))
        }
        onCheckout={() => {
          setIsCartOpen(false);
          handleOpenCheckout();
        }}
      />
    </div>
  );
};

export default App;
