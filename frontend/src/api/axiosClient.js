import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5173";

const axiosClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor: adjunta el JWT automáticamente ───────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor: manejo global de errores ────────────────────────
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expirado o inválido → limpiar sesión
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (status === 403) {
      console.warn("Acceso denegado: no tienes permisos para esta acción.");
    }

    // Extraer mensaje legible del backend
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error desconocido";

    return Promise.reject(new Error(message));
  },
);

export default axiosClient;
