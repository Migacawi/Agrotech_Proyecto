import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * cartStore — gestiona el carrito de compras
 *
 * Cada item: {
 *   id          → Id del producto
 *   nombre      → Nombre del producto
 *   precio      → Precio unitario
 *   imagen      → URL imagen principal (o null)
 *   cantidad    → Unidades en carrito
 *   stock       → Stock disponible
 * }
 */
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // ─── Agrega o incrementa un producto ──────────────────────────────────
      addItem: (producto) => {
        const { items } = get();
        const existing = items.find((i) => i.id === producto.id);

        if (existing) {
          // No superar el stock disponible
          if (existing.cantidad >= existing.stock) return;
          set({
            items: items.map((i) =>
              i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...producto, cantidad: 1 }] });
        }
      },

      // ─── Decrementa o elimina si llega a 0 ───────────────────────────────
      removeItem: (id) => {
        const { items } = get();
        const existing = items.find((i) => i.id === id);
        if (!existing) return;

        if (existing.cantidad <= 1) {
          set({ items: items.filter((i) => i.id !== id) });
        } else {
          set({
            items: items.map((i) =>
              i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i
            ),
          });
        }
      },

      // ─── Elimina completamente un producto ───────────────────────────────
      deleteItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      // ─── Vacía el carrito ─────────────────────────────────────────────────
      clearCart: () => set({ items: [] }),

      // ─── Selectores derivados ─────────────────────────────────────────────
      getTotal: () =>
        get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),

      getTotalItems: () =>
        get().items.reduce((acc, i) => acc + i.cantidad, 0),

      // ─── Construye el payload para POST /api/pedidos + /api/detallepedido ─
      buildCheckoutPayload: (usuarioId) => {
        const { items, getTotal } = get();
        return {
          pedido: {
            UsuarioId: usuarioId,
            Total: getTotal(),
            Estado: 'pendiente',
          },
          detalles: items.map((i) => ({
            ProductoId: i.id,
            Cantidad: i.cantidad,
            PrecioUnitario: i.precio,
          })),
        };
      },
    }),
    {
      name: 'cart-storage', // persiste en localStorage
    }
  )
);

export default useCartStore;