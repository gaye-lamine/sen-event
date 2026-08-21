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

export class DashboardService {
  /**
   * 1. Récupère la liste des billets de l'utilisateur connecté avec compteurs
   */
  public async getUserTickets(status?: 'upcoming' | 'past'): Promise<UserTicketsResponse> {
    const params = status ? { status } : {};
    return await apiClient.get<UserTicketsResponse>('/user/tickets', { params });
  }

  /**
   * 2. Télécharge le fichier PDF binaire du billet de commande
   */
  public async downloadTicketPdf(orderNumber: string, _ticketTitle?: string): Promise<void> {
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
      throw new Error('Impossible de télécharger le fichier PDF.');
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
  }

  /**
   * 3. Récupère la liste des évènements enregistrés en favoris
   */
  public async getUserFavorites(): Promise<UserFavoritesResponse> {
    return await apiClient.get<UserFavoritesResponse>('/user/favorites');
  }

  /**
   * 4. Ajoute ou retire un évènement des favoris (Toggle)
   */
  public async toggleFavorite(eventId: string | number): Promise<ToggleFavoriteResponse> {
    return await apiClient.post<ToggleFavoriteResponse, Record<string, never>>(
      `/user/favorites/${eventId}/toggle`,
      {}
    );
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
    const response = await apiClient.put<
      { success: boolean; message: string; data: { user: AuthUser } },
      typeof payload
    >('/user/profile', payload);

    if (response?.data?.user) {
      localStorage.setItem('sen_event_user', JSON.stringify(response.data.user));
    }

    return response;
  }

  /**
   * 6. Met à jour le mot de passe utilisateur
   */
  public async updateUserPassword(payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ success: boolean; message: string }> {
    return await apiClient.put<
      { success: boolean; message: string },
      typeof payload
    >('/user/password', payload);
  }
}

export const dashboardService = new DashboardService();
