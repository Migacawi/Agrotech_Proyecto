import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";
import Footer from "../components/layouts/Footer";
import "../styles/ConfirmacionPedido.css";

function ConfirmacionPedido() {
  const { id }   = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state    = location.state || {};

  const { mensaje, estadoPago, metodoPago, total, items, vendedor } = state;

  const labelMetodo = {
    efectivo:      "💵 Contra entrega",
    transferencia: "🏦 Transferencia",
    tarjeta:       "💳 Tarjeta",
  };

  const badgeClass = estadoPago === "Completado" ? "completado" : "pendiente";

  return (
    <div style={{ background: "#062e2f", minHeight: "100vh" }}>
      <Navbar />
      <Categorias />

      <div className="confirmacion-page">
        <div className="confirmacion-wrapper">

          {/* Header */}
          <div className="confirmacion-card confirmacion-header">
            <div className="confirmacion-icon">✅</div>
            <h1 className="confirmacion-titulo">¡Pedido confirmado!</h1>
            <p className="confirmacion-mensaje">
              {mensaje || "Tu pedido fue procesado exitosamente."}
            </p>
          </div>

          {/* Número de pedido y estado */}
          <div className="confirmacion-card">
            <p className="confirmacion-section-title">Resumen del pedido</p>

            <div className="confirmacion-fila">
              <span className="confirmacion-label">Número de pedido</span>
              <span className="confirmacion-valor">#{id}</span>
            </div>

            <div className="confirmacion-fila">
              <span className="confirmacion-label">Estado</span>
              <span className={`badge-estado ${badgeClass}`}>
                {estadoPago || "Pendiente"}
              </span>
            </div>

            <div className="confirmacion-fila">
              <span className="confirmacion-label">Método de pago</span>
              <span className="confirmacion-valor">
                {labelMetodo[metodoPago] || metodoPago}
              </span>
            </div>

            <div className="confirmacion-fila">
              <span className="confirmacion-label">Total pagado</span>
              <span className="confirmacion-valor total">
                ${total?.toLocaleString("es-CO")} COP
              </span>
            </div>
          </div>

          {/* Productos */}
          {items && items.length > 0 && (
            <div className="confirmacion-card">
              <p className="confirmacion-section-title">
                Productos ({items.length})
              </p>
              {items.map((p) => (
                <div key={p.id} className="confirmacion-producto">
                  {p.imagen && (
                    <img src={p.imagen} alt={p.nombre} />
                  )}
                  <div className="confirmacion-producto-info">
                    <span className="confirmacion-producto-nombre">{p.nombre}</span>
                    <span className="confirmacion-producto-meta">
                      {p.cantidad} libra{p.cantidad !== 1 ? "s" : ""} × ${p.precio?.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <span className="confirmacion-producto-precio">
                    ${(p.precio * p.cantidad).toLocaleString("es-CO")}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Vendedor */}
          {vendedor && (
            <div className="confirmacion-card">
              <p className="confirmacion-section-title">Datos del vendedor</p>
              <div className="confirmacion-vendedor">
                <div className="confirmacion-vendedor-avatar">🧑‍🌾</div>
                <div>
                  <p className="confirmacion-vendedor-nombre">{vendedor.nombre}</p>
                  <p className="confirmacion-vendedor-label">Vendedor verificado</p>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="confirmacion-botones">
            <button className="btn-secundario" onClick={() => navigate("/")}>
              Ir al inicio
            </button>
            <button className="btn-primario" onClick={() => navigate("/ver-todo")}>
              Seguir comprando
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ConfirmacionPedido;