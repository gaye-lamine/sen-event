/**
 * @file authService.ts
 * @description Service frontend pour l'authentification, l'inscription, la connexion et l'onboarding.
 * Connecté aux endpoints de l'API Laravel /v1/auth & /v1/user.
 */

import { apiClient } from './apiClient';

export interface RegisterPayload {
  role: 'attendee' | 'organizer';
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  accept_terms: boolean;
}

export interface AuthUser {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'attendee' | 'organizer';
  is_verified: boolean;
  city?: string | null;
  categories?: string[];
  onboarding_completed: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user_id: string | number;
    phone: string;
    expires_in?: number;
    resend_available_in?: number;
    token_type?: string;
    access_token?: string;
    user?: AuthUser;
  };
}

export interface VerifyOtpPayload {
  phone: string;
  otp_code: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    token_type: string;
    access_token: string;
    expires_in: number;
    user: AuthUser;
  };
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  data: {
    resend_available_in: number;
  };
}

export interface PreferencesPayload {
  categories: string[];
  city: string;
}

export interface PreferencesResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
}

export interface LoginPayload {
  login?: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token_type: string;
    access_token: string;
    expires_in: number;
    user: AuthUser;
  };
}

export class AuthService {
  /**
   * 1. Initialise l'inscription (avec activation et token immédiats)
   */
  public async register(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse>('/auth/register', payload);
      if (response.data?.access_token) {
        localStorage.setItem('sen_event_auth_token', response.data.access_token);
      }
      if (response.data?.user) {
        localStorage.setItem('sen_event_user', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      if (apiClient.getIsMockMode()) {
        const mockUser: AuthUser = {
          id: 'mock-user-1',
          first_name: payload.first_name,
          last_name: payload.last_name,
          email: payload.email,
          phone: payload.phone,
          role: payload.role,
          is_verified: true,
          city: null,
          categories: [],
          onboarding_completed: false,
        };
        const mockToken = 'mock_jwt_token_development';
        localStorage.setItem('sen_event_auth_token', mockToken);
        localStorage.setItem('sen_event_user', JSON.stringify(mockUser));

        return {
          success: true,
          message: `Compte créé et activé avec succès pour ${payload.phone}.`,
          data: {
            user_id: 'mock-user-1',
            phone: payload.phone,
            token_type: 'Bearer',
            access_token: mockToken,
            user: mockUser,
            expires_in: 86400,
            resend_available_in: 59,
          },
        };
      }
      throw error;
    }
  }

  /**
   * 2. Connexion par Email ou Téléphone
   */
  public async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', payload);
      if (response.data?.access_token) {
        localStorage.setItem('sen_event_auth_token', response.data.access_token);
      }
      if (response.data?.user) {
        localStorage.setItem('sen_event_user', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      if (apiClient.getIsMockMode()) {
        const mockUser: AuthUser = {
          id: 'mock-user-login',
          first_name: 'Moussa',
          last_name: 'Faye',
          email: payload.email || (payload.login?.includes('@') ? payload.login : 'moussa.faye@email.com'),
          phone: payload.phone || (!payload.login?.includes('@') ? payload.login || '+221778889900' : '+221778889900'),
          role: 'attendee',
          is_verified: true,
          city: 'Dakar',
          categories: ['concert', 'humour'],
          onboarding_completed: true,
        };
        const mockToken = 'mock_jwt_token_login';
        localStorage.setItem('sen_event_auth_token', mockToken);
        localStorage.setItem('sen_event_user', JSON.stringify(mockUser));

        return {
          success: true,
          message: 'Connexion réussie.',
          data: {
            token_type: 'Bearer',
            access_token: mockToken,
            expires_in: 86400,
            user: mockUser,
          },
        };
      }
      throw error;
    }
  }

  /**
   * 3. Vérifie le code OTP à 6 chiffres et authentifie l'utilisateur (Token JWT)
   */
  public async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
    try {
      const response = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', payload);
      if (response.data?.access_token) {
        localStorage.setItem('sen_event_auth_token', response.data.access_token);
      }
      if (response.data?.user) {
        localStorage.setItem('sen_event_user', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      if (apiClient.getIsMockMode()) {
        const mockUser: AuthUser = {
          id: 'mock-user-1',
          first_name: 'Aminata',
          last_name: 'Diop',
          email: 'aminata.diop@email.com',
          phone: payload.phone,
          role: 'attendee',
          is_verified: true,
          city: null,
          categories: [],
          onboarding_completed: false,
        };
        const mockToken = 'mock_jwt_token_development';
        localStorage.setItem('sen_event_auth_token', mockToken);
        localStorage.setItem('sen_event_user', JSON.stringify(mockUser));
        return {
          success: true,
          message: 'Numéro de téléphone vérifié avec succès.',
          data: {
            token_type: 'Bearer',
            access_token: mockToken,
            expires_in: 86400,
            user: mockUser,
          },
        };
      }
      throw error;
    }
  }

  /**
   * 4. Renvoie un nouveau code OTP par SMS
   */
  public async resendOtp(phone: string): Promise<ResendOtpResponse> {
    try {
      return await apiClient.post<ResendOtpResponse>('/auth/resend-otp', { phone });
    } catch (error) {
      if (apiClient.getIsMockMode()) {
        return {
          success: true,
          message: 'Un nouveau code a été envoyé par SMS.',
          data: {
            resend_available_in: 59,
          },
        };
      }
      throw error;
    }
  }

  /**
   * 5. Enregistre les centres d'intérêt et la ville (Fin de l'onboarding)
   */
  public async updatePreferences(
    payload: PreferencesPayload,
    token?: string
  ): Promise<PreferencesResponse> {
    try {
      const response = await apiClient.put<PreferencesResponse>(
        '/user/preferences',
        payload,
        token ? { token } : {}
      );
      if (response.data?.user) {
        localStorage.setItem('sen_event_user', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      if (apiClient.getIsMockMode()) {
        const savedUserStr = localStorage.getItem('sen_event_user');
        const existingUser = savedUserStr ? JSON.parse(savedUserStr) : {};
        const updatedUser: AuthUser = {
          ...existingUser,
          categories: payload.categories,
          city: payload.city,
          onboarding_completed: true,
        };
        localStorage.setItem('sen_event_user', JSON.stringify(updatedUser));
        return {
          success: true,
          message: 'Préférences enregistrées avec succès.',
          data: {
            user: updatedUser,
          },
        };
      }
      throw error;
    }
  }

  /**
   * 6. Récupère le profil de l'utilisateur connecté depuis l'API (/auth/me)
   */
  public async getMe(): Promise<{ success: boolean; data: { user: AuthUser } }> {
    return await apiClient.get<{ success: boolean; data: { user: AuthUser } }>('/auth/me');
  }

  /**
   * Récupère l'utilisateur connecté stocké en local
   */
  public getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem('sen_event_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Déconnexion
   */
  public logout(): void {
    localStorage.removeItem('sen_event_auth_token');
    localStorage.removeItem('sen_event_user');
  }
}

export const authService = new AuthService();
