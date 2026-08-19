import React, { useState } from 'react';
import { EventItem, SelectedTierItem, AppView } from './types';
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

/**
 * @component App
 * @description Composant racine et orchestrateur d'état de l'application Sunu Events.
 * Gère le routage par état entre la page d'accueil, la fiche de détail et le tunnel de commande.
 */
export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedCheckoutTiers, setSelectedCheckoutTiers] = useState<SelectedTierItem[]>([]);

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

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-brand-300 selection:text-gray-900">
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
        <Navbar
          searchQuery={searchQuery}
          onSearch={handleSearchAndNavigate}
          onNavigateHome={handleNavigateHome}
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

export default App;
