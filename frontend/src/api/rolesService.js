import axiosClient from './axiosClient';

/**
 * Obtener todos los roles
 * GET /api/roles
 */
export const getRoles = async () => {
  const { data } = await axiosClient.get('/roles');
  return data;
};

/**
 * Obtener rol por ID
 * GET /api/roles/:id
 */
export const getRolById = async (id) => {
  const { data } = await axiosClient.get(`/roles/${id}`);
  return data;
};

/**
 * Crear rol
 * POST /api/roles
 * Body: { Nombre }
 */
export const createRol = async (rolData) => {
  const { data } = await axiosClient.post('/roles', rolData);
  return data;
};

/**
 * Actualizar rol
 * PUT /api/roles/:id
 */
export const updateRol = async (id, rolData) => {
  const { data } = await axiosClient.put(`/roles/${id}`, rolData);
  return data;
};

/**
 * Eliminar rol
 * DELETE /api/roles/:id
 */
export const deleteRol = async (id) => {
  const { data } = await axiosClient.delete(`/roles/${id}`);
  return data;
};