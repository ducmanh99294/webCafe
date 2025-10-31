const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const fullUrl = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  // 3. Cấu hình headers mặc định
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  // 4. Gộp (merge) headers
  const finalOptions: RequestInit = {
    ...options, 
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}), 
    },
  };

  return fetch(fullUrl, finalOptions);
}