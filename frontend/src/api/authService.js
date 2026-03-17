import axiosClient from './axiosClient';

/**
 * Login de usuario.
 * El backend devuelve { token } con payload: { id, email, rol }
 * 
 * POST /api/auth/login
 * Body: { email: string, password: string }
 */
export const login = async (email, password) => {
  const { data } = await axiosClient.post('/auth/login', { email, password });
  return data; // { token }
};

/**
 * Registro de nuevo usuario.
 * 
 * POST /api/usuarios
 * Body: { Nombre, Email, PasswordHash, RolNombre } 
 * RolNombre puede ser: 'admin' | 'vendedor' | 'comprador'
 */
export const register = async ({ Nombre, Email, PasswordHash, RolNombre }) => {
  const { data } = await axiosClient.post('/usuarios', {
    Nombre,
    Email,
    PasswordHash,
    RolNombre,
  });
  return data;
};