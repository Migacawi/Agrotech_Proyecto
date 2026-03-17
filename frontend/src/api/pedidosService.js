import axiosClient from './axiosClient';

/**
 * Obtener todos los pedidos
 * GET /api/pedidos
 * Incluye: Usuario, Detalles, Pago
 */
export const getPedidos = async () => {
  const { data } = await axiosClient.get('/pedidos');
  return data;
};

/**
 * Obtener pedido por ID
 * GET /api/pedidos/:id
 */
export const getPedidoById = async (id) => {
  const { data } = await axiosClient.get(`/pedidos/${id}`);
  return data;
};

/**
 * Crear pedido
 * POST /api/pedidos
 * Body: { UsuarioId, Estado, Total, ... }
 */
export const createPedido = async (pedidoData) => {
  const { data } = await axiosClient.post('/pedidos', pedidoData);
  return data;
};

/**
 * Actualizar estado de pedido
 * PUT /api/pedidos/:id
 */
export const updatePedido = async (id, pedidoData) => {
  const { data } = await axiosClient.put(`/pedidos/${id}`, pedidoData);
  return data;
};

/**
 * Eliminar pedido
 * DELETE /api/pedidos/:id
 */
export const deletePedido = async (id) => {
  const { data } = await axiosClient.delete(`/pedidos/${id}`);
  return data;
};