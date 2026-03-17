import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * ProtectedRoute
 *
 * Uso en el router:
 *
 * // Solo autenticados:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/perfil" element={<Perfil />} />
 * </Route>
 *
 * // Solo admin:
 * <Route element={<ProtectedRoute roles={['admin']} />}>
 *   <Route path="/admin" element={<AdminPanel />} />
 * </Route>
 *
 * // Admin o vendedor:
 * <Route element={<ProtectedRoute roles={['admin', 'vendedor']} />}>
 *   <Route path="/mis-productos" element={<MisProductos />} />
 * </Route>
 */
const ProtectedRoute = ({ roles = [] }) => {
  const { isAuth, user } = useAuthStore();

  // No autenticado → al login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Se requiere un rol específico y el usuario no lo tiene
  if (roles.length > 0 && !roles.includes(user?.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
