/**
 * @file apiClient.ts
 * @description Client HTTP centralisé pour la communication avec l'API REST Laravel.
 * Gère l'authentification Bearer JWT, les en-têtes JSON et les messages d'erreurs clairs.
 */

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  token?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8002/api/v1';
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  public getIsMockMode(): boolean {
    return false;
  }

  private getAuthHeader(token?: string): Record<string, string> {
    const savedToken = token || localStorage.getItem('sen_event_auth_token');
    return savedToken ? { Authorization: `Bearer ${savedToken}` } : {};
  }

  private formatErrorMessage(errorData: unknown, status: number, statusText: string): string {
    if (errorData && typeof errorData === 'object') {
      const dataObj = errorData as {
        message?: string;
        error?: string;
        errors?: Record<string, string[]>;
      };

      if (dataObj.errors && typeof dataObj.errors === 'object') {
        const errorList = Object.values(dataObj.errors).flat();
        if (errorList.length > 0) {
          return errorList.join(' • ');
        }
      }

      if (dataObj.message && typeof dataObj.message === 'string') {
        return dataObj.message;
      }
    }

    if (status === 401) {
      return 'Identifiant ou mot de passe incorrect.';
    }

    if (status === 403) {
      return 'Accès non autorisé.';
    }

    if (status === 404) {
      return 'Ressource introuvable.';
    }

    if (status >= 500) {
      return 'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.';
    }

    return statusText || 'Une erreur est survenue lors de la requête.';
  }

  /**
   * Effectue une requête HTTP GET.
   */
  public async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    let url = `${this.baseUrl}${endpoint}`;
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, val]) => {
        if (val !== undefined) searchParams.append(key, String(val));
      });
      url += `?${searchParams.toString()}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...this.getAuthHeader(options.token),
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        let errorData: unknown = null;
        try {
          errorData = await response.json();
        } catch {
          // Ignored
        }

        const message = this.formatErrorMessage(errorData, response.status, response.statusText);
        const err = new Error(message);
        (err as unknown as { data?: unknown; status?: number }).data = errorData;
        (err as unknown as { status?: number }).status = response.status;
        throw err;
      }

      return await response.json();
    } catch (err: unknown) {
      if (err instanceof Error && err.message.startsWith('Failed to fetch')) {
        throw new Error('Connexion au serveur impossible. Veuillez vérifier votre réseau.');
      }
      throw err;
    }
  }

  /**
   * Effectue une requête HTTP POST avec charge utile JSON.
   */
  public async post<T, B = unknown>(endpoint: string, body: B, options: RequestOptions = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...this.getAuthHeader(options.token),
          ...(options.headers || {}),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorData: unknown = null;
        try {
          errorData = await response.json();
        } catch {
          // Ignored
        }

        const message = this.formatErrorMessage(errorData, response.status, response.statusText);
        const err = new Error(message);
        (err as unknown as { data?: unknown; status?: number }).data = errorData;
        (err as unknown as { status?: number }).status = response.status;
        throw err;
      }

      return await response.json();
    } catch (err: unknown) {
      if (err instanceof Error && err.message.startsWith('Failed to fetch')) {
        throw new Error('Connexion au serveur impossible. Veuillez vérifier votre réseau.');
      }
      throw err;
    }
  }

  /**
   * Effectue une requête HTTP PUT avec charge utile JSON.
   */
  public async put<T, B = unknown>(endpoint: string, body: B, options: RequestOptions = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...this.getAuthHeader(options.token),
          ...(options.headers || {}),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorData: unknown = null;
        try {
          errorData = await response.json();
        } catch {
          // Ignored
        }

        const message = this.formatErrorMessage(errorData, response.status, response.statusText);
        const err = new Error(message);
        (err as unknown as { data?: unknown; status?: number }).data = errorData;
        (err as unknown as { status?: number }).status = response.status;
        throw err;
      }

      return await response.json();
    } catch (err: unknown) {
      if (err instanceof Error && err.message.startsWith('Failed to fetch')) {
        throw new Error('Connexion au serveur impossible. Veuillez vérifier votre réseau.');
      }
      throw err;
    }
  }

  /**
   * Effectue une requête HTTP DELETE.
   */
  public async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...this.getAuthHeader(options.token),
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        let errorData: unknown = null;
        try {
          errorData = await response.json();
        } catch {
          // Ignored
        }

        const message = this.formatErrorMessage(errorData, response.status, response.statusText);
        const err = new Error(message);
        (err as unknown as { data?: unknown; status?: number }).data = errorData;
        (err as unknown as { status?: number }).status = response.status;
        throw err;
      }

      return await response.json();
    } catch (err: unknown) {
      if (err instanceof Error && err.message.startsWith('Failed to fetch')) {
        throw new Error('Connexion au serveur impossible. Veuillez vérifier votre réseau.');
      }
      throw err;
    }
  }
}

export const apiClient = new ApiClient();
