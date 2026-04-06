import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import "../styles/Perfil.css";
import "../styles/HistorialCompras.css";
import useAuthStore from "../store/authStore";
import { getPedidos } from "../api/pedidosService";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const colorEstado = {
  Pendiente: "badge-pendiente",
  Enviado: "badge-enviado",
  Entregado: "badge-entregado",
  Cancelado: "badge-cancelado",
};

function HistorialCompras() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [abierto, setAbierto] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchMisPedidos = async () => {
      try {
        const todos = await getPedidos();
        const misPedidos = todos
          .filter(
            (p) => p.CompradorId === user?.id || p.Usuario?.Id === user?.id,
          )
          .sort((a, b) => b.Id - a.Id);
        setPedidos(misPedidos);
      } catch {
        setError("No se pudo cargar el historial de compras.");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchMisPedidos();
  }, [user]);

  const toggle = (id) => setAbierto((prev) => (prev === id ? null : id));

  const preview = (detalles = []) =>
    detalles
      .map((d) => d.Producto?.Nombre || `Producto #${d.ProductoId}`)
      .join(" · ") || "—";

  const formatFecha = (raw) =>
    raw
      ? new Date(raw).toLocaleDateString("es-CO", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  // Filtro de búsqueda
  const pedidosFiltrados = pedidos.filter((p) => {
    const q = busqueda.toLowerCase();
    const nombres = (p.Detalles || [])
      .map((d) => d.Producto?.Nombre || "")
      .join(" ")
      .toLowerCase();
    return (
      String(p.Id).includes(q) ||
      p.Estado?.toLowerCase().includes(q) ||
      nombres.includes(q)
    );
  });

  // Exportar Excel
  const exportarExcel = () => {
    const datos = pedidosFiltrados.map((p) => ({
      "Pedido #": p.Id,
      Estado: p.Estado,
      Productos: (p.Detalles || [])
        .map((d) => d.Producto?.Nombre || `#${d.ProductoId}`)
        .join(", "),
      Total: Number(p.Total),
      Fecha: formatFecha(p.CreadoEn || p.createdAt),
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mis Compras");
    XLSX.writeFile(wb, "mis-compras.xlsx");
  };

  return (
    <div className="perfil-page">
      <NavbarPerfil onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="perfil-content">
        <h3 className="section-title">HISTORIAL DE COMPRAS</h3>

        {loading && <p style={{ color: "#07393c" }}>Cargando compras...</p>}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        {!loading && !error && pedidos.length === 0 && (
          <div className="historial-vacio">
            <span className="historial-vacio-icon">🛍️</span>
            <h3>Aún no tienes compras</h3>
            <p>Cuando realices un pedido aparecerá aquí.</p>
            <button
              className="historial-btn-tienda"
              onClick={() => navigate("/ver-todo")}
            >
              Ir a la tienda
            </button>
          </div>
        )}

        {!loading && !error && pedidos.length > 0 && (
          <>
            {/* Barra de herramientas */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                margin: "16px 0",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                placeholder="Buscar por ID, estado o producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "13px",
                }}
              />
              <button
                onClick={exportarExcel}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#1d6f42",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                }}
              >
                📥 Exportar Excel
              </button>
            </div>

            {pedidosFiltrados.length === 0 ? (
              <p
                style={{ color: "#aaa", textAlign: "center", padding: "20px" }}
              >
                No se encontraron resultados.
              </p>
            ) : (
              <div className="historial-lista">
                {pedidosFiltrados.map((pedido) => {
                  const estaAbierto = abierto === pedido.Id;
                  const badgeClass =
                    colorEstado[pedido.Estado] || "badge-pendiente";
                  const fecha = formatFecha(
                    pedido.CreadoEn || pedido.createdAt,
                  );

                  return (
                    <div key={pedido.Id} className="historial-card">
                      {/* Cabecera */}
                      <div
                        className="historial-card-header"
                        onClick={() => toggle(pedido.Id)}
                      >
                        <span className="historial-num">#{pedido.Id}</span>
                        <span className="historial-productos-preview">
                          {preview(pedido.Detalles)}
                        </span>
                        <span className={`historial-badge ${badgeClass}`}>
                          {pedido.Estado}
                        </span>
                        <span className="historial-total">
                          ${Number(pedido.Total).toLocaleString("es-CO")}
                        </span>
                        <span className="historial-fecha">{fecha}</span>
                        <span className="historial-chevron">
                          {estaAbierto ? "▲" : "▼"}
                        </span>
                      </div>

                      {/* Detalle expandible */}
                      {estaAbierto && (
                        <div className="historial-card-body">
                          {(pedido.Detalles || []).map((d) => (
                            <div key={d.Id} className="historial-fila">
                              <div>
                                <p className="historial-prod-nombre">
                                  {d.Producto?.Nombre ||
                                    `Producto #${d.ProductoId}`}
                                </p>
                                <p className="historial-prod-meta">
                                  {Number(d.CantidadLibras).toLocaleString(
                                    "es-CO",
                                  )}{" "}
                                  lb
                                  {" × "}$
                                  {Number(d.PrecioUnitario).toLocaleString(
                                    "es-CO",
                                  )}
                                </p>
                              </div>
                              <span className="historial-prod-sub">
                                ${Number(d.Subtotal).toLocaleString("es-CO")}
                              </span>
                            </div>
                          ))}
                          <div className="historial-total-fila">
                            <span>Total pagado</span>
                            <strong>
                              ${Number(pedido.Total).toLocaleString("es-CO")}{" "}
                              COP
                            </strong>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HistorialCompras;
