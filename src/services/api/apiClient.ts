/**
 * Generic API Client with support for environment baseUrl and mock fallback.
 * When VITE_USE_REAL_BACKEND='true' and VITE_API_URL is configured,
 * requests are routed to the actual backend REST/GraphQL server.
 */

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;
  private isMockMode: boolean;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://api.sunuevents.sn/v1';
    // Defaults to mock mode until a real backend URL is enabled
    this.isMockMode = import.meta.env.VITE_USE_REAL_BACKEND !== 'true';
  }

  public getIsMockMode(): boolean {
    return this.isMockMode;
  }

  public setMockMode(mock: boolean): void {
    this.isMockMode = mock;
  }

  public async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    if (this.isMockMode) {
      // Simulate realistic network delay (50ms - 200ms)
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
      throw new Error(`API Error [${response.status}]: ${response.statusText}`);
    }

    return response.json();
  }

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
      throw new Error(`API Error [${response.status}]: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
