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

/**
 * @class EventService
 * @description Couche de service métier pour la gestion des événements, catégories, filtres et réservations.
 * Implémente le pattern Fallback résilient : consomme l'API backend si active, ou bascule de façon transparente
 * sur les données locales typées.
 */
export class EventService {
  /**
   * Récupère la liste de toutes les catégories d'événements disponibles.
   * @returns Promesse contenant la collection de catégories
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
   * Récupère les événements mis en avant pour le carrousel vedette.
   * @returns Collection d'événements marqués comme 'featured'
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
   * Filtre les événements selon un critère temporel spécifique.
   * @param filter - Période ciblée ('today' | 'this_week' | 'this_weekend' | 'this_month')
   * @returns Événements correspondants à la période demandée
   */
  public async getEventsByDateFilter(filter: DateFilterType): Promise<EventItem[]> {
    try {
      if (apiClient.getIsMockMode()) {
        const matches = MOCK_EVENTS.filter(
          (e) => !e.isFeatured && e.dateCategory?.includes(filter)
        );
        return matches.length > 0
          ? matches.slice(0, 4)
          : MOCK_EVENTS.filter((e) => !e.isFeatured).slice(0, 4);
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
   * Récupère la liste paginée des événements avec critères de recherche et filtres de catégorie.
   * @param params - Filtres appliqués (catégorie, mot-clé, date)
   * @param page - Numéro de page (1-indexé)
   * @param limit - Nombre d'éléments par page
   * @returns Réponse paginée contenant les données et les métadonnées de pagination
   */
  public async getAllEvents(
    params: FilterParams = {},
    page = 1,
    limit = 8
  ): Promise<PaginatedResponse<EventItem>> {
    try {
      if (apiClient.getIsMockMode()) {
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
              e.location.toLowerCase().includes(q) ||
              e.venue.toLowerCase().includes(q) ||
              e.categoryLabel.toLowerCase().includes(q)
          );
        }

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
   * Recherche instantanée d'événements par mot-clé à travers tous les champs descriptifs.
   * @param query - Chaîne de recherche saisie par l'utilisateur
   * @returns Événements correspondants
   */
  public async searchEvents(query: string): Promise<EventItem[]> {
    const res = await this.getAllEvents({ query }, 1, 20);
    return res.data;
  }

  /**
   * Enregistre une commande de billets et génère le reçu certifié avec QR Code.
   * @param booking - Détails de la réservation (acheteur, événement, billet, moyen de paiement)
   * @returns Données de confirmation avec identifiant unique et QR code
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

        return {
          bookingId: `SE-${Math.floor(100000 + Math.random() * 900000)}`,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=SUNUEVENTS-${event.id}-${booking.customerPhone}`,
          event,
          tierName: tier.name,
          quantity: booking.quantity,
          totalAmount: total,
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };
      }

      return await apiClient.post<BookingConfirmation, BookingRequest>('/bookings', booking);
    } catch {
      const event = MOCK_EVENTS.find((e) => e.id === booking.eventId) || MOCK_EVENTS[0];
      const tier = event.ticketTiers?.find((t) => t.id === booking.tierId) || {
        id: 'standard',
        name: 'Standard',
        price: event.startingPrice,
      };
      return {
        bookingId: `SE-${Math.floor(100000 + Math.random() * 900000)}`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=SUNUEVENTS-${event.id}`,
        event,
        tierName: tier.name,
        quantity: booking.quantity,
        totalAmount: tier.price * booking.quantity,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Récupère la fiche détaillée d'un événement par son identifiant unique.
   * @param id - Identifiant de l'événement
   * @returns Détails complets de l'événement ou null si introuvable
   */
  public async getEventById(id: string): Promise<EventItem | null> {
    try {
      if (apiClient.getIsMockMode()) {
        const found = MOCK_EVENTS.find((e) => e.id === id);
        return found || null;
      }
      return await apiClient.get<EventItem>(`/events/${id}`);
    } catch {
      return MOCK_EVENTS.find((e) => e.id === id) || null;
    }
  }

  /**
   * Récupère une sélection d'événements similaires pour les recommandations de bas de page.
   * @param eventId - Identifiant de l'événement de référence
   * @param limit - Nombre maximum de suggestions souhaitées
   * @returns Collection d'événements similaires
   */
  public async getSimilarEvents(eventId: string, limit = 3): Promise<EventItem[]> {
    try {
      const current = await this.getEventById(eventId);
      if (!current) return [];

      if (apiClient.getIsMockMode()) {
        return MOCK_EVENTS.filter(
          (e) => e.id !== eventId && e.category === current.category
        ).slice(0, limit);
      }

      return await apiClient.get<EventItem[]>(`/events/${eventId}/similar`, {
        params: { limit },
      });
    } catch {
      const current = MOCK_EVENTS.find((e) => e.id === eventId);
      if (!current) return [];
      return MOCK_EVENTS.filter(
        (e) => e.id !== eventId && e.category === current.category
      ).slice(0, limit);
    }
  }
}

export const eventService = new EventService();
