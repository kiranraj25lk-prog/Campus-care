const BASE_URL = typeof window !== 'undefined' && (window.location.port === '3000' || window.location.port === '5173')
  ? 'http://127.0.0.1:5001/api'
  : '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('campuscare_token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not FormData, default to application/json
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => {
    const isFormData = body instanceof FormData;
    return apiRequest(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
  },
  put: (endpoint, body) => {
    const isFormData = body instanceof FormData;
    return apiRequest(endpoint, {
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body)
    });
  },
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' })
};
