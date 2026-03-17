import axiosClient from './axiosClient';

/**
 * Obtener imágenes de un producto (pública)
 * GET /api/imagenesproducto/producto/:productoId
 */
export const getImagenesByProducto = async (productoId) => {
  const { data } = await axiosClient.get(`/imagenesproducto/producto/${productoId}`);
  return data;
};

/**
 * Subir imágenes a un producto (requiere auth + rol vendedor + ser dueño)
 * POST /api/imagenesproducto/:productoId/subir
 * Envía multipart/form-data con campo "imagenes" (máx 5 archivos)
 */
export const subirImagenes = async (productoId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('imagenes', file));

  const { data } = await axiosClient.post(
    `/imagenesproducto/${productoId}/subir`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};

/**
 * Eliminar imagen (requiere auth + rol vendedor + ser dueño del producto)
 * DELETE /api/imagenesproducto/:id
 */
export const deleteImagen = async (id) => {
  const { data } = await axiosClient.delete(`/imagenesproducto/${id}`);
  return data;
};

/**
 * Marcar imagen como principal (requiere auth + rol vendedor + ser dueño)
 * PUT /api/imagenesproducto/:id/principal
 */
export const setPrincipal = async (id) => {
  const { data } = await axiosClient.put(`/imagenesproducto/${id}/principal`);
  return data;
};