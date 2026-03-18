import axiosClient from './axiosClient';

/**
 * Obtener todos los usuarios (admin)
 * GET /api/usuarios
 */
export const getUsuarios = async () => {
  const { data } = await axiosClient.get('/usuarios');
  return data;
};

/**
 * Obtener usuario por ID
 * GET /api/usuarios/:id
 */
export const getUsuarioById = async (id) => {
  const { data } = await axiosClient.get(`/usuarios/${id}`);
  return data;
};

/**
 * Crear usuario
 * POST /api/usuarios
 * Body: { Nombre, Email, PasswordHash, RolNombre | RolId }
 * Validaciones: Nombre 7-13 chars, Email válido, Password mín 6 chars
 */
export const createUsuario = async (usuarioData) => {
  const { data } = await axiosClient.post('/usuarios', usuarioData);
  return data;
};

/**
 * Actualizar usuario
 * PUT /api/usuarios/:id
 */
export const updateUsuario = async (id, usuarioData) => {
  const { data } = await axiosClient.put(`/usuarios/${id}`, usuarioData);
  return data;
};

/**
 * Eliminar usuario
 * DELETE /api/usuarios/:id
 */
export const deleteUsuario = async (id) => {
  const { data } = await axiosClient.delete(`/usuarios/${id}`);
  return data;
};