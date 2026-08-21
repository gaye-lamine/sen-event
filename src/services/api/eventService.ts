/**
 * @file eventService.ts
 * @description Couche de service métier pour la gestion des événements, catégories, filtres et réservations.
 */

import { apiClient } from './apiClient';
import {
  EventItem,
  CategoryItem,
  DateFilterType,
  FilterParams,
  PaginatedResponse,
  BookingRequest,
  BookingConfirmation,
} from '../../types/event';
import { MOCK_EVENTS, CATEGORIES } from '../../data/mockEvents';

export class EventService {
  /**
   * Récupère la liste de toutes les catégories d'événements disponibles.
   */
  public async getCategories(): Promise<CategoryItem[]> {
    try {
      const res = await apiClient.get<CategoryItem[] | { success?: boolean; data?: CategoryItem[] }>(
        '/categories'
      );
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { data?: CategoryItem[] }).data)) {
        return (res as { data: CategoryItem[] }).data;
      }
      return CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  }

  /**
   * Récupère les événements mis en avant pour le carrousel vedette.
   */
  public async getFeaturedEvents(): Promise<EventItem[]> {
    try {
      const res = await apiClient.get<EventItem[] | { success?: boolean; data?: EventItem[] }>(
        '/events/featured'
      );
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { data?: EventItem[] }).data)) {
        return (res as { data: EventItem[] }).data;
      }
      return MOCK_EVENTS.filter((e) => e.isFeatured);
    } catch {
      return MOCK_EVENTS.filter((e) => e.isFeatured);
    }
  }

  /**
   * Filtre les événements selon un critère temporel spécifique.
   */
  public async getEventsByDateFilter(filter: DateFilterType): Promise<EventItem[]> {
    try {
      const res = await apiClient.get<EventItem[] | { success?: boolean; data?: EventItem[] }>(
        '/events/by-date',
        {
          params: { filter },
        }
      );
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { data?: EventItem[] }).data)) {
        return (res as { data: EventItem[] }).data;
      }
      const matches = MOCK_EVENTS.filter(
        (e) => !e.isFeatured && e.dateCategory?.includes(filter)
      );
      return matches.length > 0
        ? matches.slice(0, 4)
        : MOCK_EVENTS.filter((e) => !e.isFeatured).slice(0, 4);
    } catch {
      const matches = MOCK_EVENTS.filter(
        (e) => !e.isFeatured && e.dateCategory?.includes(filter)
      );
      return matches.length > 0
        ? matches.slice(0, 4)
        : MOCK_EVENTS.filter((e) => !e.isFeatured).slice(0, 4);
    }
  }

  /**
   * Récupère la liste paginée des événements avec critères de recherche et filtres de catégorie.
   */
  public async getAllEvents(
    params: FilterParams = {},
    page = 1,
    limit = 8
  ): Promise<PaginatedResponse<EventItem>> {
    try {
      const res = await apiClient.get<
        PaginatedResponse<EventItem> | { success?: boolean; data?: PaginatedResponse<EventItem> | EventItem[] }
      >('/events', {
        params: {
          category: params.category,
          dateFilter: params.dateFilter,
          query: params.query,
          page,
          limit,
        },
      });

      if (res && 'data' in res && Array.isArray((res as PaginatedResponse<EventItem>).data)) {
        return res as PaginatedResponse<EventItem>;
      }

      if (res && 'data' in res && (res as { data?: { data?: EventItem[] } }).data?.data) {
        return (res as { data: PaginatedResponse<EventItem> }).data;
      }

      let results = [...MOCK_EVENTS];
      if (params.category && params.category !== 'all') {
        results = results.filter((e) => e.category === params.category);
      }
      return {
        data: results.slice(0, limit),
        total: results.length,
        page,
        limit,
        hasMore: false,
      };
    } catch {
      let results = [...MOCK_EVENTS];
      if (params.category && params.category !== 'all') {
        results = results.filter((e) => e.category === params.category);
      }
      if (params.query && params.query.trim()) {
        const q = params.query.toLowerCase().trim();
        results = results.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.subtitle?.toLowerCase().includes(q) ||
            e.location.toLowerCase().includes(q)
        );
      }
      const startIndex = (page - 1) * limit;
      const pagedData = results.slice(0, startIndex + limit);

      return {
        data: pagedData,
        total: results.length,
        page,
        limit,
        hasMore: pagedData.length < results.length,
      };
    }
  }

  /**
   * Récupère un événement spécifique par son identifiant unique ou slug.
   */
  public async getEventById(id: string | number): Promise<EventItem | null> {
    try {
      const res = await apiClient.get<EventItem | { success?: boolean; data?: EventItem }>(
        `/events/${id}`
      );
      if (res && 'id' in res) return res as EventItem;
      if (res && 'data' in res && res.data) return res.data;
      return MOCK_EVENTS.find((e) => String(e.id) === String(id) || e.slug === id) || null;
    } catch {
      return MOCK_EVENTS.find((e) => String(e.id) === String(id) || e.slug === id) || null;
    }
  }

  /**
   * Crée une réservation pour un événement.
   */
  public async bookEvent(booking: BookingRequest): Promise<BookingConfirmation> {
    return await apiClient.post<BookingConfirmation, BookingRequest>('/bookings', booking);
  }

  public async createBooking(booking: BookingRequest): Promise<BookingConfirmation> {
    return await this.bookEvent(booking);
  }
}

export const eventService = new EventService();
