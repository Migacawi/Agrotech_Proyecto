import axiosClient from './axiosClient';

/**
 * Obtener todos los detalles de pedido
 * GET /api/detallepedido
 */
export const getDetallePedidos = async () => {
  const { data } = await axiosClient.get('/detallepedido');
  return data;
};

/**
 * Obtener detalle por ID
 * GET /api/detallepedido/:id
 */
export const getDetallePedidoById = async (id) => {
  const { data } = await axiosClient.get(`/detallepedido/${id}`);
  return data;
};

/**
 * Crear detalle de pedido
 * POST /api/detallepedido
 * Body: { PedidoId, ProductoId, Cantidad, PrecioUnitario }
 */
export const createDetallePedido = async (detalleData) => {
  const { data } = await axiosClient.post('/detallepedido', detalleData);
  return data;
};

/**
 * Actualizar detalle de pedido
 * PUT /api/detallepedido/:id
 */
export const updateDetallePedido = async (id, detalleData) => {
  const { data } = await axiosClient.put(`/detallepedido/${id}`, detalleData);
  return data;
};

/**
 * Eliminar detalle de pedido
 * DELETE /api/detallepedido/:id
 */
export const deleteDetallePedido = async (id) => {
  const { data } = await axiosClient.delete(`/detallepedido/${id}`);
  return data;
};