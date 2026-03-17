import axiosClient from './axiosClient';

/**
 * Obtener todos los productos (ruta pública)
 * GET /api/productos
 * Incluye: Usuarios (vendedor), ImagenesProducto, DetallePedido
 */
export const getProductos = async () => {
  const { data } = await axiosClient.get('/productos');
  return data;
};

/**
 * Obtener producto por ID (ruta pública)
 * GET /api/productos/:id
 */
export const getProductoById = async (id) => {
  const { data } = await axiosClient.get(`/productos/${id}`);
  return data;
};

/**
 * Crear producto (requiere auth — el VendedorId se toma del token en el backend)
 * POST /api/productos
 * Body: { Nombre, Descripcion, Precio, Stock, Categoria, ... }
 */
export const createProducto = async (productoData) => {
  const { data } = await axiosClient.post('/productos', productoData);
  return data;
};

/**
 * Editar producto (requiere auth + ser el dueño del producto)
 * PUT /api/productos/:id
 */
export const updateProducto = async (id, productoData) => {
  const { data } = await axiosClient.put(`/productos/${id}`, productoData);
  return data;
};

/**
 * Eliminar producto (requiere auth + rol admin)
 * DELETE /api/productos/:id
 */
export const deleteProducto = async (id) => {
  const { data } = await axiosClient.delete(`/productos/${id}`);
  return data;
};