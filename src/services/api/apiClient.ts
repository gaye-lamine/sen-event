/**
 * @file apiClient.ts
 * @description Client HTTP centralisé pour la communication avec l'API REST Laravel / InTouch.
 * Gère automatiquement le basculement entre le mode développement (mock) et l'API de production.
 */

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiClient {
  private baseUrl: string;
  private isMockMode: boolean;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';
    this.isMockMode = import.meta.env.VITE_USE_REAL_BACKEND !== 'true';
  }

  public getIsMockMode(): boolean {
    return this.isMockMode;
  }

  public setMockMode(mock: boolean): void {
    this.isMockMode = mock;
  }

  /**
   * Effectue une requête HTTP GET sécurisée.
   * @param endpoint - Chemin relatif de la ressource API (ex: '/events')
   * @param options - Paramètres de requête et options fetch
   * @returns Données typées renvoyées par l'API
   */
  public async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    if (this.isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      throw new Error(`MOCK_MODE_ACTIVE: Endpoint "${endpoint}" routed through local mock handler.`);
    }

    let url = `${this.baseUrl}${endpoint}`;
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, val]) => {
        if (val !== undefined) searchParams.append(key, String(val));
      });
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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
      let errorMsg =
        (errorData as { message?: string })?.message ||
        `API Error [${response.status}]: ${response.statusText}`;
      const validationErrors = (errorData as { errors?: Record<string, string[]> })?.errors;
      if (validationErrors) {
        const details = Object.values(validationErrors).flat().join(' • ');
        if (details) errorMsg = details;
      }
      const err = new Error(errorMsg);
      (err as unknown as { data?: unknown; status?: number }).data = errorData;
      (err as unknown as { status?: number }).status = response.status;
      throw err;
    }

    return response.json();
  }

  /**
   * Effectue une requête HTTP POST avec charge utile JSON.
   * @param endpoint - Chemin relatif de la ressource API
   * @param body - Objet payload envoyé dans le corps de la requête
   * @param options - Options de configuration fetch supplémentaires
   * @returns Réponse typée renvoyée par l'API
   */
  public async post<T, B = unknown>(endpoint: string, body: B, options: RequestOptions = {}): Promise<T> {
    if (this.isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      throw new Error(`MOCK_MODE_ACTIVE: Endpoint "${endpoint}" routed through local mock handler.`);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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
      let errorMsg =
        (errorData as { message?: string })?.message ||
        `API Error [${response.status}]: ${response.statusText}`;
      const validationErrors = (errorData as { errors?: Record<string, string[]> })?.errors;
      if (validationErrors) {
        const details = Object.values(validationErrors).flat().join(' • ');
        if (details) errorMsg = details;
      }
      const err = new Error(errorMsg);
      (err as unknown as { data?: unknown; status?: number }).data = errorData;
      (err as unknown as { status?: number }).status = response.status;
      throw err;
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
