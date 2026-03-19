import axiosClient from './axiosClient';

/**
 * Login de usuario.
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = async (email, password) => {
  const { data } = await axiosClient.post('/auth/login', { email, password });
  return data;
};

/**
 * Registro de nuevo usuario.
 * POST /api/usuarios
 * Body: { Nombre, Email, PasswordHash, RolNombre }
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