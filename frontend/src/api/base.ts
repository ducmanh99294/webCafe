const LOCAL_API_URL = import.meta.env.VITE_APP_API_URL;

const API_BASE_URL = LOCAL_API_URL || "";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const fullUrl = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const finalOptions: RequestInit = {
    ...options, 
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}), 
    },
  };

  return fetch(fullUrl, finalOptions);
}