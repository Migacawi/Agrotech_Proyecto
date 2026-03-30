import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import "../styles/Perfil.css";
import "../styles/MisVentas.css";
import useAuthStore from "../store/authStore";
import { getPedidos } from "../api/pedidosService";

const colorEstado = {
  Pendiente: { bg: "#fff3cd", color: "#856404" },
  Enviado: { bg: "#cce5ff", color: "#004085" },
  Entregado: { bg: "#d4edda", color: "#155724" },
  Cancelado: { bg: "#f8d7da", color: "#721c24" },
};

function MisVentas() {
  const { user } = useAuthStore();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const todos = await getPedidos();

        // Recolectar todos los detalles donde el producto pertenece a este vendedor
        const misVentas = [];
        todos.forEach((pedido) => {
          (pedido.Detalles || []).forEach((detalle) => {
            if (detalle.Producto?.VendedorId === user?.id) {
              misVentas.push({
                pedidoId: pedido.Id,
                estado: pedido.Estado,
                fecha: pedido.CreadoEn || pedido.createdAt,
                comprador:
                  pedido.Usuario?.Nombre || pedido.Usuario?.nombre || "—",
                producto: detalle.Producto,
                cantidadLibras: Number(detalle.CantidadLibras),
                precioUnitario: Number(detalle.PrecioUnitario),
                subtotal: Number(detalle.Subtotal),
              });
            }
          });
        });

        // Más recientes primero
        misVentas.sort((a, b) => b.pedidoId - a.pedidoId);
        setVentas(misVentas);
      } catch {
        setError("No se pudieron cargar las ventas.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchVentas();
  }, [user]);

  const formatFecha = (raw) =>
    raw
      ? new Date(raw).toLocaleDateString("es-CO", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  // Total ganado (solo entregados)
  const totalGanado = ventas
    .filter((v) => v.estado === "Entregado")
    .reduce((acc, v) => acc + v.subtotal, 0);

  return (
    <div className="perfil-page">
      <NavbarPerfil />
      <Sidebar />

      <div className="perfil-content">
        <h3 className="section-title">MIS VENTAS</h3>

        {loading && <p style={{ color: "#07393c" }}>Cargando ventas...</p>}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        {!loading && !error && ventas.length === 0 && (
          <div className="misventas-vacio">
            <span className="misventas-vacio-icon">📦</span>
            <h3>Aún no tienes ventas</h3>
            <p>Cuando alguien compre tus productos aparecerán aquí.</p>
          </div>
        )}

        {!loading && !error && ventas.length > 0 && (
          <>
            {/* Resumen */}
            <div className="misventas-resumen">
              <div className="misventas-stat">
                <span className="misventas-stat-label">Total ventas</span>
                <span className="misventas-stat-valor">{ventas.length}</span>
              </div>
              <div className="misventas-stat">
                <span className="misventas-stat-label">
                  Ganancias confirmadas
                </span>
                <span className="misventas-stat-valor verde">
                  ${totalGanado.toLocaleString("es-CO")} COP
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="misventas-grid">
              {ventas.map((v, i) => {
                const img =
                  v.producto?.Imagenes?.find((img) => img.EsPrincipal)
                    ?.UrlImagen ||
                  v.producto?.Imagenes?.[0]?.UrlImagen ||
                  "https://images.unsplash.com/photo-1464965911861-74ce9de9ce19";

                const badge = colorEstado[v.estado] || {
                  bg: "#eee",
                  color: "#555",
                };

                return (
                  <div key={i} className="misventas-card">
                    {/* Imagen */}
                    <div className="misventas-card-img">
                      <img
                        src={img}
                        alt={v.producto?.Nombre}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1464965911861-74ce9de9ce19";
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="misventas-card-info">
                      <div className="misventas-card-top">
                        <p className="misventas-nombre">
                          {v.producto?.Nombre || "Producto"}
                        </p>
                        <span
                          className="misventas-badge"
                          style={{ background: badge.bg, color: badge.color }}
                        >
                          {v.estado}
                        </span>
                      </div>

                      <p className="misventas-comprador">
                        Comprador: <strong>{v.comprador}</strong>
                      </p>

                      <div className="misventas-card-bottom">
                        <span className="misventas-meta">
                          {v.cantidadLibras} lb × $
                          {v.precioUnitario.toLocaleString("es-CO")}
                        </span>
                        <span className="misventas-subtotal">
                          ${v.subtotal.toLocaleString("es-CO")}
                        </span>
                      </div>

                      <div className="misventas-footer">
                        <span className="misventas-pedido">
                          Pedido #{v.pedidoId}
                        </span>
                        <span className="misventas-fecha">
                          {formatFecha(v.fecha)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MisVentas;
