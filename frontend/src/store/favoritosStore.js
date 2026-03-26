import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFavoritosStore = create(
  persist(
    (set, get) => ({
      favoritos: [],
      favoritosNoVistos: 0, // ✅ nuevo

      toggleFavorito: (id) => {
        const { favoritos, favoritosNoVistos } = get();
        const existe = favoritos.includes(id);

        set({
          favoritos: existe
            ? favoritos.filter((f) => f !== id)
            : [...favoritos, id],

          // ✅ solo suma si es nuevo favorito
          favoritosNoVistos: existe ? favoritosNoVistos : favoritosNoVistos + 1,
        });
      },

      esFavorito: (id) => get().favoritos.includes(id),

      limpiarFavoritos: () => set({ favoritos: [], favoritosNoVistos: 0 }),

      limpiarNoVistos: () => set({ favoritosNoVistos: 0 }), // ✅ nuevo
    }),
    { name: "agrotech-favoritos" },
  ),
);

export default useFavoritosStore;
