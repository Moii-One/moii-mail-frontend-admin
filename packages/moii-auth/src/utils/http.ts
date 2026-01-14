function maskToken(token: string) {
  if (!token) return '(none)';
  if (token.length <= 12) return token;
  return `${token.slice(0, 6)}...${token.slice(-6)}`;
}

export function getAuthHeaders(additional: Record<string, string> = {}) {
  const tokenRaw = localStorage.getItem('token') || '';
  const token = tokenRaw === 'undefined' ? '' : tokenRaw;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...additional,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Debug: print masked token info so we can tell if a token is being picked up
  // No debug logging here in normal operation.

  return headers;
}

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const mergedHeaders = {
    ...(init.headers as Record<string, string> || {}),
    ...getAuthHeaders(),
  };

  // Minimal logging removed in normal operation.

  const response = await fetch(input, { ...init, headers: mergedHeaders });

  // Note: 401 handling is now done globally in main.ts via fetch interceptor
  // Leave error handling to callers; don't log response bodies here.

  return response;
}

/**
 * Check if response is 401 Unauthorized and handle redirect to login
 * This function can be called manually after any authenticated API call if needed
 * Note: Global fetch interceptor in main.ts handles this automatically
 * @param response - Fetch Response object
 */
export function handleUnauthorizedResponse(response: Response) {
  if (response.status === 401) {
    // Clear the invalid token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Get current path to preserve for redirect after login
    const currentPath = window.location.pathname + window.location.search + window.location.hash;
    
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login')) {
      const redirectUrl = encodeURIComponent(currentPath);
      window.location.href = `/login?redirect=${redirectUrl}`;
    }
  }
}
