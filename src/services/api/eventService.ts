import { apiClient } from './apiClient';
import {
  EventItem,
  CategoryItem,
  EventCategory,
  DateFilterType,
  FilterParams,
  PaginatedResponse,
  BookingRequest,
  BookingConfirmation,
} from '../../types/event';
import { MOCK_EVENTS, CATEGORIES } from '../../data/mockEvents';

export class EventService {
  /**
   * Fetch all event categories with their metadata and icons
   */
  public async getCategories(): Promise<CategoryItem[]> {
    try {
      if (apiClient.getIsMockMode()) {
        return CATEGORIES;
      }
      return await apiClient.get<CategoryItem[]>('/categories');
    } catch {
      return CATEGORIES;
    }
  }

  /**
   * Fetch featured events displayed in the top carousel section
   */
  public async getFeaturedEvents(): Promise<EventItem[]> {
    try {
      if (apiClient.getIsMockMode()) {
        return MOCK_EVENTS.filter((e) => e.isFeatured);
      }
      return await apiClient.get<EventItem[]>('/events/featured');
    } catch {
      return MOCK_EVENTS.filter((e) => e.isFeatured);
    }
  }

  /**
   * Fetch events filtered by date section ("C'est quand, la sortie ?")
   */
  public async getEventsByDateFilter(filter: DateFilterType): Promise<EventItem[]> {
    try {
      if (apiClient.getIsMockMode()) {
        // Find events that match the requested date filter
        const matches = MOCK_EVENTS.filter(
          (e) => !e.isFeatured && e.dateCategory?.includes(filter)
        );
        if (matches.length > 0) {
          return matches.slice(0, 4);
        }
        // Fallback to top 4 non-featured items
        return MOCK_EVENTS.filter((e) => !e.isFeatured).slice(0, 4);
      }
      return await apiClient.get<EventItem[]>('/events/by-date', {
        params: { filter },
      });
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
   * Fetch paginated list of all events with filtering support
   */
  public async getAllEvents(
    params: FilterParams = {},
    page = 1,
    limit = 8
  ): Promise<PaginatedResponse<EventItem>> {
    try {
      if (apiClient.getIsMockMode()) {
        let results = [...MOCK_EVENTS];

        // Filter by category
        if (params.category && params.category !== 'all') {
          results = results.filter((e) => e.category === params.category);
        }

        // Filter by search query
        if (params.query && params.query.trim()) {
          const q = params.query.toLowerCase().trim();
          results = results.filter(
            (e) =>
              e.title.toLowerCase().includes(q) ||
              e.subtitle?.toLowerCase().includes(q) ||
              e.location.toLowerCase().includes(q) ||
              e.venue.toLowerCase().includes(q) ||
              e.categoryLabel.toLowerCase().includes(q)
          );
        }

        // Filter by date
        if (params.dateFilter) {
          results = results.filter((e) => e.dateCategory?.includes(params.dateFilter!));
        }

        const startIndex = (page - 1) * limit;
        const pagedData = results.slice(0, startIndex + limit);
        const hasMore = pagedData.length < results.length;

        return {
          data: pagedData,
          total: results.length,
          page,
          limit,
          hasMore,
        };
      }

      return await apiClient.get<PaginatedResponse<EventItem>>('/events', {
        params: {
          category: params.category,
          dateFilter: params.dateFilter,
          query: params.query,
          page,
          limit,
        },
      });
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
   * Search events across all attributes
   */
  public async searchEvents(query: string): Promise<EventItem[]> {
    const res = await this.getAllEvents({ query }, 1, 20);
    return res.data;
  }

  /**
   * Book tickets for an event
   */
  public async createBooking(booking: BookingRequest): Promise<BookingConfirmation> {
    try {
      if (apiClient.getIsMockMode()) {
        const event = MOCK_EVENTS.find((e) => e.id === booking.eventId) || MOCK_EVENTS[0];
        const tier = event.ticketTiers?.find((t) => t.id === booking.tierId) || {
          id: 'standard',
          name: 'Standard',
          price: event.startingPrice,
        };
        const total = tier.price * booking.quantity;

        // Simulate local booking confirmation
        return {
          bookingId: `SE-${Math.floor(100000 + Math.random() * 900000)}`,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=SUNUEVENTS-${event.id}-${booking.customerPhone}`,
          totalAmount: total,
          status: 'confirmed',
          event,
          tierName: tier.name,
          quantity: booking.quantity,
        };
      }

      return await apiClient.post<BookingConfirmation, BookingRequest>(
        '/bookings',
        booking
      );
    } catch {
      const event = MOCK_EVENTS.find((e) => e.id === booking.eventId) || MOCK_EVENTS[0];
      return {
        bookingId: `SE-${Math.floor(100000 + Math.random() * 900000)}`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=SUNUEVENTS-${event.id}-${booking.customerPhone}`,
        totalAmount: event.startingPrice * booking.quantity,
        status: 'confirmed',
        event,
        tierName: 'Standard',
        quantity: booking.quantity,
      };
    }
  }
}

export const eventService = new EventService();
