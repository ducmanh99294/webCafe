const LOCAL_API_URL = import.meta.env.VITE_APP_API_URL;

const API_BASE_URL = LOCAL_API_URL || "";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const fullUrl = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  // 3. Cấu hình headers mặc định (Code của bạn đã đúng)
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  const finalOptions: RequestInit = {
    ...options, 
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}), 
    },
  };

  return fetch(fullUrl, finalOptions);
}