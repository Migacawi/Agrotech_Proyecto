import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

/**
 * authStore — gestiona la sesión del usuario
 *
 * Estado:
 *   token    → JWT string | null
 *   user     → { id, email, rol } decodificado del token
 *   isAuth   → booleano de conveniencia
 *
 * Acciones:
 *   setToken(token)  → guarda token, decodifica user, persiste en localStorage
 *   logout()         → limpia todo
 *   getRole()        → devuelve el rol del usuario actual ('admin' | 'vendedor' | 'comprador')
 */
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
        set({ token: null, user: null, isAuth: false });
      },

      getRole: () => get().user?.rol ?? null,

      isAdmin: () => get().user?.rol === 'admin',
      isVendedor: () => get().user?.rol === 'vendedor',
      isComprador: () => get().user?.rol === 'comprador',
    }),
    {
      name: 'auth-storage', // clave en localStorage
      partialize: (state) => ({ token: state.token, user: state.user, isAuth: state.isAuth }),
    }
  )
);

export default useAuthStore;