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
    ? rawTiers.map((t: any, idx: number) => {
        const rawAvail =
          t.quantity_available !== undefined && t.quantity_available !== null
            ? Number(t.quantity_available)
            : t.quantityAvailable !== undefined && t.quantityAvailable !== null
            ? Number(t.quantityAvailable)
            : undefined;

        const isSoldOut = rawAvail !== undefined ? rawAvail <= 0 : false;

        return {
          id: String(t.id || idx + 1),
          name: t.name || `Palier ${idx + 1}`,
          price: Number(t.price || 0),
          description: t.description || '',
          available: !isSoldOut,
          remainingCount: rawAvail,
          isSoldOut,
        };
      })
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


  // Calcul dynamique réel du nombre de participants / billets vendus depuis la base de données
  const totalSold = Array.isArray(rawTiers)
    ? rawTiers.reduce((acc: number, t: any) => {
        const total = Number(t.quantity_total ?? t.quantityTotal ?? 0);
        const avail = Number(t.quantity_available ?? t.availableQuantity ?? t.quantityAvailable ?? total);
        const sold = t.quantity_sold !== undefined ? Number(t.quantity_sold) : Math.max(0, total - avail);
        return acc + sold;
      }, 0)
    : 0;

  const attendeesCount =
    raw.attendees_count !== undefined && raw.attendees_count !== null
      ? Number(raw.attendees_count)
      : raw.attendeesCount !== undefined && raw.attendeesCount !== null
      ? Number(raw.attendeesCount)
      : raw.total_sold !== undefined && raw.total_sold !== null
      ? Number(raw.total_sold)
      : raw.totalSold !== undefined && raw.totalSold !== null
      ? Number(raw.totalSold)
      : totalSold;

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
    isSoldOut: Boolean(raw.is_sold_out ?? raw.isSoldOut),
    attendeesCount,
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
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Récupère la liste paginée des événements avec critères de recherche et filtres de catégorie.
   */
  public async getAllEvents(
    params: FilterParams = {},
    page = 1,
    limit = 12
  ): Promise<PaginatedResponse<EventItem>> {
    try {
      const searchTerm = (params.query || params.search || '').trim();
      let mappedType: string | undefined = undefined;

      if (params.category && params.category !== 'all') {
        if (params.category === 'sport') {
          mappedType = 'match';
        } else {
          mappedType = params.category;
        }
      }

      const queryParams: Record<string, any> = {
        page,
        limit,
        per_page: limit,
      };

      if (searchTerm) {
        queryParams.search = searchTerm;
        queryParams.q = searchTerm;
      }
      if (mappedType) {
        queryParams.type = mappedType;
        queryParams.category = mappedType;
      }

      const res = await apiClient.get<
        PaginatedResponse<any> | { success?: boolean; data?: any[] | { data?: any[]; total?: number } }
      >('/events', { params: queryParams });

      let rawList: any[] = [];
      let totalCount = 0;
      let hasMore = false;

      if (res && 'data' in res && Array.isArray((res as PaginatedResponse<any>).data)) {
        rawList = (res as PaginatedResponse<any>).data;
        totalCount = (res as any).total ?? rawList.length;
        hasMore = (res as any).hasMore !== undefined
          ? Boolean((res as any).hasMore)
          : (res as any).meta?.current_page < (res as any).meta?.last_page
          ? true
          : totalCount > page * limit;
      } else if (res && 'data' in res && (res as { data?: { data?: any[] } }).data?.data) {
        const inner = (res as { data: { data: any[]; total?: number; current_page?: number; last_page?: number } }).data;
        rawList = inner.data;
        totalCount = inner.total ?? rawList.length;
        hasMore = Boolean(inner.last_page ? (inner.current_page ?? 1) < inner.last_page : totalCount > page * limit);
      }

      let normalized = rawList.map(normalizeEvent);

      // Filtrage de cohérence côté client
      if (mappedType) {
        normalized = normalized.filter((e) =>
          e.category === params.category ||
          (params.category === 'sport' && (e.category === 'sport' || (e as any).type === 'match'))
        );
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        normalized = normalized.filter((e) =>
          e.title.toLowerCase().includes(q) ||
          e.subtitle?.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
        );
      }

      return {
        data: normalized,
        total: totalCount || normalized.length,
        page,
        limit,
        hasMore,
      };
    } catch (err) {
      console.error('Erreur getAllEvents:', err);
      return {
        data: [],
        total: 0,
        page,
        limit,
        hasMore: false,
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
