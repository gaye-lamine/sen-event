/**
 * @file dashboardService.ts
 * @description Service frontend pour la gestion des billets, favoris, profil et sécurité du Dashboard.
 * Connecté aux endpoints /v1/user & /v1/orders de l'API Laravel.
 */

import { apiClient } from './apiClient';
import {
  UserTicketsResponse,
  UserFavoritesResponse,
  ToggleFavoriteResponse,
} from '../../types/dashboard';
import { AuthUser } from './authService';
import { MOCK_USER_TICKETS, MOCK_FAVORITE_EVENTS } from '../../data/mockDashboard';

export class DashboardService {
  /**
   * 1. Récupère la liste des billets de l'utilisateur connecté avec compteurs
   */
  public async getUserTickets(status?: 'upcoming' | 'past'): Promise<UserTicketsResponse> {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.get<UserTicketsResponse>('/user/tickets', { params });
      return response;
    } catch (error) {
      if (apiClient.getIsMockMode()) {
        const filtered = status
          ? MOCK_USER_TICKETS.filter((t) => t.status === status)
          : MOCK_USER_TICKETS;
        const upcomingCount = MOCK_USER_TICKETS.filter((t) => t.status === 'upcoming').length;
        const pastCount = MOCK_USER_TICKETS.filter((t) => t.status === 'past').length;

        return {
          success: true,
          message: 'Billets récupérés en mode local.',
          data: {
            counts: {
              upcoming: upcomingCount,
              past: pastCount,
              total: MOCK_USER_TICKETS.length,
            },
            tickets: filtered,
          },
        };
      }
      throw error;
    }
  }

  /**
   * 2. Télécharge le fichier PDF binaire du billet de commande
   */
  public async downloadTicketPdf(orderNumber: string, ticketTitle?: string): Promise<void> {
    try {
      const token = localStorage.getItem('sen_event_auth_token');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8002/api/v1';
      const url = `${baseUrl}/orders/${orderNumber}/download-pdf`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          Accept: 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors du téléchargement du PDF [${response.status}]`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `billet-${orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      if (apiClient.getIsMockMode()) {
        // En mode mock développement, simuler un téléchargement propre
        const mockBlob = new Blob(
          [`Billet Sunu Events pour ${ticketTitle || orderNumber}\nCommande: ${orderNumber}`],
          { type: 'application/pdf' }
        );
        const url = window.URL.createObjectURL(mockBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `billet-${orderNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return;
      }
      throw error;
    }
  }

  /**
   * 3. Récupère la liste des évènements enregistrés en favoris
   */
  public async getUserFavorites(): Promise<UserFavoritesResponse> {
    try {
      const response = await apiClient.get<UserFavoritesResponse>('/user/favorites');
      return response;
    } catch (error) {
      if (apiClient.getIsMockMode()) {
        return {
          success: true,
          message: 'Favoris récupérés en mode local.',
          data: {
            count: MOCK_FAVORITE_EVENTS.length,
            favorites: MOCK_FAVORITE_EVENTS,
          },
        };
      }
      throw error;
    }
  }

  /**
   * 4. Ajoute ou retire un évènement des favoris (Toggle)
   */
  public async toggleFavorite(eventId: string | number): Promise<ToggleFavoriteResponse> {
    try {
      const response = await apiClient.post<ToggleFavoriteResponse, Record<string, never>>(
        `/user/favorites/${eventId}/toggle`,
        {}
      );
      return response;
    } catch (error) {
      if (apiClient.getIsMockMode()) {
        return {
          success: true,
          message: 'Favori mis à jour en mode local.',
          data: {
            event_id: eventId,
            is_favorite: true,
          },
        };
      }
      throw error;
    }
  }

  /**
   * 5. Met à jour les informations du profil utilisateur
   */
  public async updateUserProfile(payload: {
    first_name: string;
    last_name: string;
    phone: string;
    city?: string;
  }): Promise<{ success: boolean; message: string; data: { user: AuthUser } }> {
    try {
      const response = await apiClient.put<
        { success: boolean; message: string; data: { user: AuthUser } },
        typeof payload
      >('/user/profile', payload);

      if (response?.data?.user) {
        localStorage.setItem('sen_event_user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      if (apiClient.getIsMockMode()) {
        const currentUser = JSON.parse(localStorage.getItem('sen_event_user') || '{}');
        const updatedUser = {
          ...currentUser,
          first_name: payload.first_name,
          last_name: payload.last_name,
          phone: payload.phone,
          city: payload.city,
        };
        localStorage.setItem('sen_event_user', JSON.stringify(updatedUser));
        return {
          success: true,
          message: 'Profil mis à jour en mode local.',
          data: { user: updatedUser },
        };
      }
      throw error;
    }
  }

  /**
   * 6. Met à jour le mot de passe utilisateur
   */
  public async updateUserPassword(payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put<
        { success: boolean; message: string },
        typeof payload
      >('/user/password', payload);

      return response;
    } catch (error) {
      if (apiClient.getIsMockMode()) {
        return {
          success: true,
          message: 'Mot de passe mis à jour en mode local.',
        };
      }
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
