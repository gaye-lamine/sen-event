import React, { useState, useEffect } from 'react';
import {
  EventItem,
  CategoryItem,
  EventCategory,
  DateFilterType,
  BookingConfirmation,
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

export const App: React.FC = () => {
  // State Management
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

  // Modals & Drawers State
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<EventItem | null>(null);
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
  }>({ isOpen: false, mode: 'login' });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<
    { event: EventItem; quantity: number; tierName: string; price: number }[]
  >([]);

  // 1. Fetch initial categories and featured events
  useEffect(() => {
    const loadInitialData = async () => {
      const cats = await eventService.getCategories();
      setCategories(cats);

      const featured = await eventService.getFeaturedEvents();
      setFeaturedEvents(featured);
    };

    loadInitialData();
  }, []);

  // 2. Fetch events when Date filter tab changes ("C'est quand, la sortie ?")
  useEffect(() => {
    const loadDateEvents = async () => {
      const events = await eventService.getEventsByDateFilter(dateFilter);
      setDateFilteredEvents(events);
    };

    loadDateEvents();
  }, [dateFilter]);

  // 3. Fetch all events when category, search query, or page changes
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

  // Handlers
  const handleCategorySelect = (category: EventCategory) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    const el = document.getElementById('all-events-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  };

  const handleOpenBooking = (event: EventItem) => {
    setSelectedEventForBooking(event);
  };

  const handleBookingSuccess = (confirmation: BookingConfirmation) => {
    // Add to cart history
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

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-brand-300 selection:text-gray-900">
      
      {/* 1. Header Navigation */}
      <Navbar
        onSearch={handleSearch}
        onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. Top Category Pills Filter Bar */}
      <CategoryPills
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* 3. Hero Section with Glows, Floating 3D Tickets, Headline and Search */}
      <HeroSection onSearch={handleSearch} />

      {/* 4. Section 1: "Évènements vedettes" */}
      <FeaturedEventsSection
        events={featuredEvents}
        onBook={handleOpenBooking}
      />

      {/* 5. Section 2: "C'est quand, la sortie ?" */}
      <DateFilterSection
        activeFilter={dateFilter}
        onFilterChange={setDateFilter}
        events={dateFilteredEvents}
        onBook={handleOpenBooking}
      />

      {/* 6. Section 3: "Tous les évènements" */}
      <AllEventsSection
        events={allEvents}
        hasMore={hasMoreEvents}
        onLoadMore={handleLoadMore}
        isLoadingMore={isLoadingMore}
        onBook={handleOpenBooking}
      />

      {/* 7. Organizer CTA Banner */}
      <OrganizerBanner
        onBecomeOrganizer={() => setAuthModalState({ isOpen: true, mode: 'signup' })}
      />

      {/* 8. Footer */}
      <Footer />

      {/* Interactive Reservation / Booking Modal */}
      <BookingModal
        event={selectedEventForBooking}
        isOpen={!!selectedEventForBooking}
        onClose={() => setSelectedEventForBooking(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={(index) =>
          setCartItems((prev) => prev.filter((_, i) => i !== index))
        }
        onCheckout={() => {
          setIsCartOpen(false);
          if (cartItems.length > 0) {
            setSelectedEventForBooking(cartItems[0].event);
          }
        }}
      />
    </div>
  );
};

export default App;
