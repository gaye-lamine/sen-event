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
  EventCategory,
  TicketTier,
} from '../../types/event';
import { MOCK_EVENTS, CATEGORIES } from '../../data/mockEvents';

const categoryMetaMap: Record<string, { label: string; icon: string }> = {
  concert: { label: 'Concert', icon: 'Music' },
  festival: { label: 'Festival', icon: 'Tent' },
  theatre: { label: 'Théâtre', icon: 'Theater' },
  sport: { label: 'Sport', icon: 'Trophy' },
  match: { label: 'Sport', icon: 'Trophy' },
  formation: { label: 'Formation', icon: 'GraduationCap' },
  conference: { label: 'Conférence', icon: 'Users' },
  soiree: { label: 'Soirée', icon: 'Moon' },
  humour: { label: 'Humour', icon: 'Smile' },
};

function normalizeEvent(raw: any): EventItem {
  if (!raw) return raw;

  const rawType = String(raw.type || raw.category || 'concert').toLowerCase();
  const categoryKey = rawType === 'match' ? 'sport' : rawType;
  const meta = categoryMetaMap[rawType] || categoryMetaMap[categoryKey] || { label: 'Événement', icon: 'Music' };

  const rawTiers = raw.ticket_types || raw.ticketTiers || [];
  const ticketTiers: TicketTier[] = Array.isArray(rawTiers)
    ? rawTiers.map((t: any, idx: number) => ({
        id: String(t.id || idx + 1),
        name: t.name || `Palier ${idx + 1}`,
        price: Number(t.price || 0),
        description: t.description || '',
        available: (t.quantity_available ?? t.quantityAvailable ?? 1) > 0,
        remainingCount: t.quantity_available ?? t.quantityAvailable ?? 0,
        isSoldOut: (t.quantity_available ?? t.quantityAvailable ?? 0) <= 0,
      }))
    : [];

  // Check poster: if poster_url is null or empty or if image is the generic placeholder
  let poster: string | null = null;
  if (raw.poster_url && typeof raw.poster_url === 'string' && raw.poster_url.trim().length > 0) {
    poster = raw.poster_url.trim();
  } else if (raw.posterUrl && typeof raw.posterUrl === 'string' && raw.posterUrl.trim().length > 0) {
    poster = raw.posterUrl.trim();
  } else if (
    raw.image &&
    typeof raw.image === 'string' &&
    raw.poster_url !== null &&
    !raw.image.includes('photo-1516450360452-9312f5e86fc7') &&
    !raw.image.includes('placeholder')
  ) {
    poster = raw.image;
  }

  const defaultCategoryColors: Record<string, string> = {
    sport: '#C9498E',
    match: '#C9498E',
    concert: '#4F46E5',
    festival: '#EA580C',
    theatre: '#9333EA',
    formation: '#2563EB',
    conference: '#0891B2',
    soiree: '#D97706',
    humour: '#E11D48',
  };

  const ambient =
    raw.ambient_color ||
    raw.ambientColor ||
    defaultCategoryColors[rawType] ||
    defaultCategoryColors[categoryKey] ||
    '#1E1B4B';


  return {
    id: String(raw.id),
    slug: raw.slug || String(raw.id),
    title: raw.title ?? '',
    subtitle: raw.description ? raw.description.slice(0, 80) : '',
    category: (categoryKey in categoryMetaMap ? categoryKey : 'concert') as EventCategory,
    categoryLabel: meta.label,
    categoryIcon: meta.icon,
    image: poster,
    posterUrl: poster,
    ambientColor: ambient,
    location: raw.venue_name ?? raw.address ?? raw.city ?? '',
    venue: raw.venue_name ?? raw.venue ?? '',
    city: raw.city ?? '',
    date: raw.start_date ?? raw.date ?? '',
    time: raw.start_time ?? raw.time ?? '',
    rawDate: raw.start_date ? `${raw.start_date}T${raw.start_time ?? '00:00:00'}Z` : (raw.date ?? new Date().toISOString()),
    startingPrice: Number(raw.starting_price ?? raw.startingPrice ?? (ticketTiers[0]?.price ?? 0)),
    currency: raw.currency ?? 'XOF',
    isFeatured: Boolean(raw.is_featured ?? raw.isFeatured),
    attendeesCount: raw.attendees_count ?? raw.attendeesCount ?? undefined,
    rating: raw.rating ?? undefined,
    reviewsCount: raw.reviews_count ?? raw.reviewsCount ?? undefined,
    organizer: raw.organizer
      ? {
          name: raw.organizer.name ?? `${raw.organizer.first_name ?? ''} ${raw.organizer.last_name ?? ''}`.trim(),
          initials: raw.organizer.initials ?? undefined,
          eventsCount: raw.organizer.events_count ?? raw.organizer.eventsCount ?? undefined,
          memberSince: raw.organizer.member_since ?? raw.organizer.memberSince ?? undefined,
          verified: Boolean(raw.organizer.is_verified ?? raw.organizer.verified),
          phone: raw.organizer.phone ?? undefined,
        }
      : undefined,
    ticketTiers,
    description: raw.description ?? '',
  };
}

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
      const res = await apiClient.get<EventItem[] | { success?: boolean; data?: any[] }>(
        '/events/featured'
      );
      if (Array.isArray(res)) return res.map(normalizeEvent);
      if (res && Array.isArray((res as { data?: any[] }).data)) {
        return (res as { data: any[] }).data.map(normalizeEvent);
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
      const res = await apiClient.get<EventItem[] | { success?: boolean; data?: any[] }>(
        '/events/by-date',
        {
          params: { filter },
        }
      );
      if (Array.isArray(res)) return res.map(normalizeEvent);
      if (res && Array.isArray((res as { data?: any[] }).data)) {
        return (res as { data: any[] }).data.map(normalizeEvent);
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
        PaginatedResponse<any> | { success?: boolean; data?: any[] | { data?: any[]; total?: number } }
      >('/events', {
        params: {
          category: params.category,
          dateFilter: params.dateFilter,
          query: params.query,
          page,
          limit,
        },
      });

      if (res && 'data' in res && Array.isArray((res as PaginatedResponse<any>).data)) {
        const rawList = (res as PaginatedResponse<any>).data;
        return {
          ...(res as PaginatedResponse<any>),
          data: rawList.map(normalizeEvent),
        };
      }

      if (res && 'data' in res && (res as { data?: { data?: any[] } }).data?.data) {
        const inner = (res as { data: { data: any[]; total?: number; current_page?: number } }).data;
        return {
          data: inner.data.map(normalizeEvent),
          total: inner.total || inner.data.length,
          page: inner.current_page || page,
          limit,
          hasMore: (inner.total || 0) > page * limit,
        };
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
      const res = await apiClient.get<any | { success?: boolean; data?: any }>(
        `/events/${id}`
      );
      if (res && 'id' in res) return normalizeEvent(res);
      if (res && 'data' in res && res.data) return normalizeEvent(res.data);
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
