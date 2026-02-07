export function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') {
    return {};
  }
  const token = localStorage.getItem('token');
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
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

/**
 * Refresh the access token using the refresh token
 * Returns true if refresh was successful, false otherwise
 */
export async function refreshAccessToken(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return false;
  }

  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${base}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    if (data.success && data.data) {
      localStorage.setItem('token', data.data.token);
      if (data.data.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

/**
 * Check if token is expired or about to expire (within 2 minutes)
 * Returns true if token needs refresh
 */
export function shouldRefreshToken(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  try {
    // Decode JWT token (without verification, just to check expiration)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const twoMinutes = 2 * 60 * 1000;

    // Refresh if token expires within 2 minutes
    return exp - now < twoMinutes;
  } catch (error) {
    // If we can't decode, assume it needs refresh
    return true;
  }
}
