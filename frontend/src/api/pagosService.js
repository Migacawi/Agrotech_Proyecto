import axiosClient from './axiosClient';

/**
 * Obtener todos los pagos
 * GET /api/pagos
 * Incluye: Pedidos
 */
export const getPagos = async () => {
  const { data } = await axiosClient.get('/pagos');
  return data;
};

/**
 * Obtener pago por ID
 * GET /api/pagos/:id
 */
export const getPagoById = async (id) => {
  const { data } = await axiosClient.get(`/pagos/${id}`);
  return data;
};

/**
 * Crear pago
 * POST /api/pagos
 * Body: { PedidoId, Monto, MetodoPago, Estado }
 */
export const createPago = async (pagoData) => {
  const { data } = await axiosClient.post('/pagos', pagoData);
  return data;
};

/**
 * Actualizar pago
 * PUT /api/pagos/:id
 */
export const updatePago = async (id, pagoData) => {
  const { data } = await axiosClient.put(`/pagos/${id}`, pagoData);
  return data;
};

/**
 * Eliminar pago
 * DELETE /api/pagos/:id
 */
export const deletePago = async (id) => {
  const { data } = await axiosClient.delete(`/pagos/${id}`);
  return data;
};