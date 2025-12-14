export function getAuthHeaders() {
  const token = localStorage.getItem('token') || '';
  // Normalize 'undefined' string
  const normalized = token === 'undefined' ? '' : token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (normalized) {
    headers['Authorization'] = `Bearer ${normalized}`;
  }

  // Debug: helpful when diagnosing missing token issues in the browser console
  // (will be removed or gated behind a debug flag in production)
  // eslint-disable-next-line no-console
  console.debug('[moii-auth] getAuthHeaders token present:', !!normalized);

  return headers;
}
