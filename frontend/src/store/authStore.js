import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

import useCartStore from './cartStore';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuth: false,

      setToken: (token) => {
        try {
          const decoded = jwtDecode(token);
          localStorage.setItem('token', token);
          set({ token, user: decoded, isAuth: true });
        } catch {
          console.error('Token inválido al decodificar');
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        useCartStore.getState().clearCart();
        set({ token: null, user: null, isAuth: false });
      },

      getRole: () => get().user?.rol ?? null,

      isAdmin:     () => get().user?.rol?.toLowerCase() === 'administrador',
      isVendedor:  () => get().user?.rol?.toLowerCase() === 'vendedor',
      isComprador: () => get().user?.rol?.toLowerCase() === 'comprador',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuth: state.isAuth }),
    }
  )
);

export default useAuthStore;