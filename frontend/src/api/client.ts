export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * A simple fetch wrapper that acts as our API client.
 * In development, we don't strictly need a Bearer token because the backend
 * auth middleware has a local dev bypass.
 */
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}
