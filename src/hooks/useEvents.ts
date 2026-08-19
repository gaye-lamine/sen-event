import { useState, useEffect, useCallback } from 'react';
import { EventItem, CategoryItem, EventCategory, DateFilterType } from '../types';
import { eventService } from '../services/api/eventService';

/**
 * @hook useEvents
 * @description Encapsule la logique d'état, de chargement et de filtrage (catégories,
 * période chronologique, recherche en direct et pagination) des événements.
 */
export const useEvents = () => {
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

  useEffect(() => {
    const loadInitialData = async () => {
      const [cats, featured] = await Promise.all([
        eventService.getCategories(),
        eventService.getFeaturedEvents(),
      ]);
      setCategories(cats);
      setFeaturedEvents(featured);
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

  const handleCategorySelect = useCallback((category: EventCategory) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    const el = document.getElementById('all-events-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  }, []);

  return {
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
  };
};
