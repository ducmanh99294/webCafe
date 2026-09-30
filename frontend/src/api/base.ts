const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const fullUrl = `${API_BASE_URL}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  console.log("========== API REQUEST ==========");
  console.log("URL:", fullUrl);
  console.log("Method:", options.method || "GET");
  console.log("Headers:", options.headers);
  console.log("Body:", options.body);
  console.log("=================================");

  return fetch(fullUrl, finalOptions);
}