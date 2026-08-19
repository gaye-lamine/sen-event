import React, { useState, useEffect } from 'react';
import {
  EventItem,
  CategoryItem,
  EventCategory,
  DateFilterType,
  SelectedTierItem,
  AppView,
  CartItem,
} from './types';
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

/**
 * @component App
 * @description Composant racine et orchestrateur d'état de l'application Sunu Events.
 * Gère le routage par état entre la page d'accueil, la fiche de détail et le tunnel de commande,
 * ainsi que la synchronisation des filtres et du panier.
 */
export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedCheckoutTiers, setSelectedCheckoutTiers] = useState<SelectedTierItem[]>([]);

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

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  useEffect(() => {
    const loadDateEvents = async () => {
      const events = await eventService.getEventsByDateFilter(dateFilter);
      setDateFilteredEvents(events);
    };

    loadDateEvents();
  }, [dateFilter]);

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

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleProceedToCheckout = (selectedTiers: SelectedTierItem[]) => {
    handleOpenCheckout(selectedTiers);
  };

  const similarEvents = allEvents.filter(
    (e) => !selectedEvent || e.id !== selectedEvent.id
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-brand-300 selection:text-gray-900">
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
        <Navbar
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onNavigateHome={handleNavigateHome}
          cartCount={cartItems.length}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {currentView === 'home' && (
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}
      </header>

      {currentView === 'checkout' && selectedEvent ? (
        <main className="flex-1">
          <CheckoutPage
            event={selectedEvent}
            initialTiers={selectedCheckoutTiers}
            onNavigateHome={handleNavigateHome}
          />
        </main>
      ) : currentView === 'event-detail' && selectedEvent ? (
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
        <main className="flex-1">
          <HeroSection
            searchQuery={searchQuery}
            onSearch={handleSearch}
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
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
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
