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

  return headers;
}
