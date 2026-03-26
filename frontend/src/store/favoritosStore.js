import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFavoritosStore = create(
  persist(
    (set, get) => ({
      favoritos: [],

      toggleFavorito: (id) => {
        const { favoritos } = get();
        const existe = favoritos.includes(id);
        set({
          favoritos: existe
            ? favoritos.filter((f) => f !== id)
            : [...favoritos, id],
        });
      },

      esFavorito: (id) => get().favoritos.includes(id),

      limpiarFavoritos: () => set({ favoritos: [] }),
    }),
    { name: "agrotech-favoritos" },
  ),
);

export default useFavoritosStore;
