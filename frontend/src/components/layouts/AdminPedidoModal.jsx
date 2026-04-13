import React from "react";
import { FaCheck } from "react-icons/fa";

const ESTADOS = ["Pendiente", "Enviado", "Entregado", "Cancelado"];

const colorEstado = {
  Pendiente: { bg: "#fff3cd", color: "#856404" },
  Enviado:   { bg: "#cce5ff", color: "#004085" },
  Entregado: { bg: "#d4edda", color: "#155724" },
  Cancelado: { bg: "#f8d7da", color: "#721c24" },
};

function AdminPedidoModal({ pedido, onCambiarEstado, onCancelar, loading }) {
  if (!pedido) return null;

  const estiloEstado = colorEstado[pedido.Estado] || { bg: "#eee", color: "#333" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "white", borderRadius: "12px", padding: "32px", width: "100%", maxWidth: "520px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "90vh", overflowY: "auto" }}>

        {/* Cabecera */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "#07393c" }}>Pedido #{pedido.Id}</h3>
          <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", background: estiloEstado.bg, color: estiloEstado.color }}>
            {pedido.Estado}
          </span>
        </div>

        {/* Info comprador */}
        <div style={{ background: "#f9f9f9", borderRadius: "8px", padding: "12px" }}>
          <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#555" }}>Comprador</p>
          <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>
            {pedido.Usuario?.Nombre || pedido.Usuario?.nombre || "—"}
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
            {pedido.Usuario?.Email || pedido.Usuario?.email || ""}
          </p>
        </div>

        {/* Detalle productos */}
        <div>
          <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#555", fontWeight: "600" }}>
            Productos
          </p>
          {(pedido.Detalles || []).map((d) => (
            <div key={d.Id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontSize: "14px" }}>
              <span style={{ color: "#333" }}>{d.Producto?.Nombre || `Producto #${d.ProductoId}`}</span>
              <span style={{ color: "#555" }}>
                {Number(d.CantidadLibras).toLocaleString("es-CO")} lb × ${Number(d.PrecioUnitario).toLocaleString("es-CO")}
              </span>
              <span style={{ fontWeight: "600", color: "#07393c" }}>
                ${Number(d.Subtotal).toLocaleString("es-CO")}
              </span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
            <strong style={{ color: "#333" }}>
              Total: ${Number(pedido.Total).toLocaleString("es-CO")} COP
            </strong>
          </div>
        </div>

        {/* Cambiar estado */}
        <div>
          <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#555", fontWeight: "600" }}>
            Cambiar Estado
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {ESTADOS.map((estado) => {
              const activo  = pedido.Estado === estado;
              const estilos = colorEstado[estado];
              return (
                <button
                  key={estado}
                  onClick={() => !activo && onCambiarEstado(estado)}
                  disabled={activo || loading}
                  style={{
                    padding: "8px 16px", borderRadius: "20px", fontSize: "13px",
                    cursor: activo ? "default" : "pointer", border: "2px solid",
                    borderColor: activo ? estilos.color : "#ddd",
                    background: activo ? estilos.bg : "white",
                    color: activo ? estilos.color : "#555",
                    fontWeight: activo ? "bold" : "normal",
                    opacity: loading ? 0.6 : 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {activo ? (
                    <>
                      <FaCheck aria-hidden style={{ marginRight: "6px" }} />
                      {estado}
                    </>
                  ) : (
                    estado
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón cerrar */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onCancelar}
            style={{
              padding: "10px 20px", borderRadius: "8px",
              border: "1px solid #ccc", background: "white",
              cursor: "pointer", color: "#333",
            }}
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminPedidoModal;