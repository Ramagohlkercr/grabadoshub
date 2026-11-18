import { ApiResponse } from '../types/product.js';

export class ApiError extends Error {
  statusCode: number;
  errors?: Array<{ field?: string; message: string }>;

  constructor(message: string, statusCode: number, errors?: Array<{ field?: string; message: string }>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Always include credentials (cookies) for authenticated requests
    credentials: 'include',
  };

  const response = await fetch(endpoint, config);

  if (response.status === 204) {
    return {} as T;
  }

  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Error al procesar la respuesta del servidor', response.status);
  }

  if (!response.ok || !data.success) {
    const errorMsg = data.message || `Error en la solicitud (Código ${response.status})`;
    throw new ApiError(errorMsg, response.status, data.errors);
  }

  return data.data;
}
