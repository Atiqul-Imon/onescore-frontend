export function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') {
    return {};
  }
  const token = localStorage.getItem('token');
  if (!token) {
    return {};
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export function getAuthFetchOptions(options: RequestInit = {}): RequestInit {
  return {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };
}

