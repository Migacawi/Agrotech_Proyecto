import { create } from "zustand";
import useAuthStore from "./authStore";

// Helpers para leer/escribir en localStorage por usuario
const getKey = () => {
  const userId = useAuthStore.getState().user?.id;
  return userId ? `agrotech-favoritos-${userId}` : "agrotech-favoritos-guest";
};

const cargarFavoritos = () => {
  try {
    const data = localStorage.getItem(getKey());
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const guardarFavoritos = (favoritos) => {
  localStorage.setItem(getKey(), JSON.stringify(favoritos));
};

const useFavoritosStore = create((set, get) => ({
  favoritos: cargarFavoritos(),
  favoritosNoVistos: 0,

  // Recargar favoritos del usuario actual (llamar al hacer login)
  recargarFavoritos: () => {
    set({ favoritos: cargarFavoritos(), favoritosNoVistos: 0 });
  },

  toggleFavorito: (id) => {
    const { favoritos, favoritosNoVistos } = get();
    const existe = favoritos.includes(id);
    const nuevos = existe
      ? favoritos.filter((f) => f !== id)
      : [...favoritos, id];

    guardarFavoritos(nuevos);
    set({
      favoritos: nuevos,
      favoritosNoVistos: existe ? favoritosNoVistos : favoritosNoVistos + 1,
    });
  },

  esFavorito: (id) => get().favoritos.includes(id),

  limpiarFavoritos: () => {
    guardarFavoritos([]);
    set({ favoritos: [], favoritosNoVistos: 0 });
  },

  limpiarNoVistos: () => set({ favoritosNoVistos: 0 }),
}));

export default useFavoritosStore;
