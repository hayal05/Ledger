import axios from "axios";

// Base URL comes from Vite env var so it can point at localhost in dev
// and the deployed Render backend in production.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const TOKEN_STORAGE_KEY = "ledgerpro_token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_STORAGE_KEY),
  set: (token) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every outgoing request, if present.
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages and handle expired/invalid sessions globally.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    if (status === 401) {
      tokenStorage.clear();
      // Avoid redirect loops if the 401 came from the login/register call itself.
      const isAuthEndpoint = error.config?.url?.includes("/auth/");
      if (!isAuthEndpoint && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => d.msg).join(" ")
          : "Something went wrong. Please try again.";

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
