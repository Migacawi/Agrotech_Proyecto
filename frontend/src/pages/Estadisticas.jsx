import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import "../styles/Perfil.css";
import "../styles/Estadisticas.css";
import useAuthStore from "../store/authStore";
import { getPedidos } from "../api/pedidosService";
import { getProductos } from "../api/productosService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

function Estadisticas() {
  const { user, isAdmin, isVendedor } = useAuthStore();
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [p, pr] = await Promise.all([getPedidos(), getProductos()]);
        setPedidos(p);
        setProductos(pr);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // ── Datos según rol ────────────────────────────────────────────────────────
  const esVendedor = isVendedor() || isAdmin();
  const esComprador = !isAdmin();

  // Pedidos donde el usuario es comprador
  const misCompras = pedidos.filter(
    (p) => p.CompradorId === user?.id || p.Usuario?.Id === user?.id,
  );

  // Detalles donde el vendedor soy yo
  const misVentasDetalles = [];
  pedidos.forEach((pedido) => {
    (pedido.Detalles || []).forEach((d) => {
      if (d.Producto?.VendedorId === user?.id) {
        misVentasDetalles.push({ ...d, pedido });
      }
    });
  });

  // Mis productos
  const misProductos = productos.filter((p) => p.VendedorId === user?.id);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const totalGanado = misVentasDetalles
    .filter((d) => d.pedido.Estado === "Entregado")
    .reduce((acc, d) => acc + Number(d.Subtotal), 0);

  const totalGastado = misCompras
    .filter((p) => p.Estado === "Entregado")
    .reduce((acc, p) => acc + Number(p.Total), 0);

  const pedidosPendientes = misCompras.filter(
    (p) => p.Estado === "Pendiente",
  ).length;
  const ventasPendientes = misVentasDetalles.filter(
    (d) => d.pedido.Estado === "Pendiente",
  ).length;

  // ── Gráfica ventas por mes ────────────────────────────────────────────────
  const ventasPorMes = {};
  misVentasDetalles.forEach((d) => {
    const fecha = d.pedido.FechaPedido || d.pedido.CreadoEn;
    if (!fecha) return;
    const mes = new Date(fecha).toLocaleString("es-CO", {
      month: "short",
      year: "2-digit",
    });
    ventasPorMes[mes] = (ventasPorMes[mes] || 0) + Number(d.Subtotal);
  });
  const dataVentas = Object.entries(ventasPorMes).map(([mes, total]) => ({
    mes,
    total,
  }));

  // ── Gráfica compras por mes ───────────────────────────────────────────────
  const comprasPorMes = {};
  misCompras.forEach((p) => {
    const fecha = p.FechaPedido || p.CreadoEn;
    if (!fecha) return;
    const mes = new Date(fecha).toLocaleString("es-CO", {
      month: "short",
      year: "2-digit",
    });
    comprasPorMes[mes] = (comprasPorMes[mes] || 0) + Number(p.Total);
  });
  const dataCompras = Object.entries(comprasPorMes).map(([mes, total]) => ({
    mes,
    total,
  }));

  // ── Productos más vendidos ────────────────────────────────────────────────
  const conteoProductos = {};
  misVentasDetalles.forEach((d) => {
    const nombre = d.Producto?.Nombre || `#${d.ProductoId}`;
    conteoProductos[nombre] =
      (conteoProductos[nombre] || 0) + Number(d.CantidadLibras);
  });
  const topProductos = Object.entries(conteoProductos)
    .map(([nombre, libras]) => ({ nombre, libras }))
    .sort((a, b) => b.libras - a.libras)
    .slice(0, 5);

  if (loading)
    return (
      <div className="perfil-page">
        <NavbarPerfil onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="perfil-content">
          <p style={{ color: "#07393c" }}>Cargando estadísticas...</p>
        </div>
      </div>
    );

  return (
    <div className="perfil-page">
      <NavbarPerfil onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="perfil-content">
        <h3 className="section-title">ESTADÍSTICAS</h3>

        {/* ── KPIs ── */}
        <div className="stats-kpi-grid">
          {esVendedor && (
            <>
              <div className="stats-kpi">
                <span className="stats-kpi-icon">💰</span>
                <p className="stats-kpi-valor">
                  ${totalGanado.toLocaleString("es-CO")}
                </p>
                <p className="stats-kpi-label">Ganancias confirmadas</p>
              </div>
              <div className="stats-kpi">
                <span className="stats-kpi-icon">📦</span>
                <p className="stats-kpi-valor">{misVentasDetalles.length}</p>
                <p className="stats-kpi-label">Ventas realizadas</p>
              </div>
              <div className="stats-kpi">
                <span className="stats-kpi-icon">🌿</span>
                <p className="stats-kpi-valor">{misProductos.length}</p>
                <p className="stats-kpi-label">Productos publicados</p>
              </div>
              <div className="stats-kpi">
                <span className="stats-kpi-icon">⏳</span>
                <p className="stats-kpi-valor">{ventasPendientes}</p>
                <p className="stats-kpi-label">Ventas pendientes</p>
              </div>
            </>
          )}

          {esComprador && (
            <>
              <div className="stats-kpi">
                <span className="stats-kpi-icon">🛒</span>
                <p className="stats-kpi-valor">{misCompras.length}</p>
                <p className="stats-kpi-label">Pedidos realizados</p>
              </div>
              <div className="stats-kpi">
                <span className="stats-kpi-icon">💳</span>
                <p className="stats-kpi-valor">
                  ${totalGastado.toLocaleString("es-CO")}
                </p>
                <p className="stats-kpi-label">Total gastado</p>
              </div>
              <div className="stats-kpi">
                <span className="stats-kpi-icon">📬</span>
                <p className="stats-kpi-valor">{pedidosPendientes}</p>
                <p className="stats-kpi-label">Pedidos pendientes</p>
              </div>
            </>
          )}
        </div>

        {/* ── Gráfica ventas por mes ── */}
        {esVendedor && dataVentas.length > 0 && (
          <div className="stats-card">
            <h4 className="stats-card-titulo">📈 Ventas por mes (COP)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dataVentas}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => [
                    `$${Number(v).toLocaleString("es-CO")}`,
                    "Ventas",
                  ]}
                />
                <Bar dataKey="total" fill="#07393c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── Gráfica compras por mes ── */}
        {esComprador && dataCompras.length > 0 && (
          <div className="stats-card">
            <h4 className="stats-card-titulo">📊 Compras por mes (COP)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dataCompras}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => [
                    `$${Number(v).toLocaleString("es-CO")}`,
                    "Gasto",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#07393c"
                  strokeWidth={2}
                  dot={{ fill: "#07393c" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── Top productos más vendidos ── */}
        {esVendedor && topProductos.length > 0 && (
          <div className="stats-card">
            <h4 className="stats-card-titulo">🏆 Productos más vendidos</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProductos} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="nombre"
                  type="category"
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip formatter={(v) => [`${v} lb`, "Vendido"]} />
                <Bar dataKey="libras" fill="#0d5559" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── Tabla últimas ventas ── */}
        {esVendedor && misVentasDetalles.length > 0 && (
          <div className="stats-card">
            <h4 className="stats-card-titulo">🧾 Últimas ventas</h4>
            <table className="stats-tabla">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Producto</th>
                  <th>Comprador</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {misVentasDetalles.slice(0, 8).map((d, i) => (
                  <tr key={i}>
                    <td>#{d.pedido.Id}</td>
                    <td>{d.Producto?.Nombre || "—"}</td>
                    <td>{d.pedido.Usuario?.Nombre || "—"}</td>
                    <td>{Number(d.CantidadLibras)} lb</td>
                    <td>${Number(d.Subtotal).toLocaleString("es-CO")}</td>
                    <td>
                      <span
                        className={`stats-badge stats-badge-${d.pedido.Estado?.toLowerCase()}`}
                      >
                        {d.pedido.Estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Tabla últimas compras ── */}
        {esComprador && misCompras.length > 0 && (
          <div className="stats-card">
            <h4 className="stats-card-titulo">🛍️ Últimas compras</h4>
            <table className="stats-tabla">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {misCompras.slice(0, 8).map((p, i) => (
                  <tr key={i}>
                    <td>#{p.Id}</td>
                    <td>
                      {(p.Detalles || [])
                        .map((d) => d.Producto?.Nombre || "—")
                        .join(", ")}
                    </td>
                    <td>${Number(p.Total).toLocaleString("es-CO")}</td>
                    <td>
                      <span
                        className={`stats-badge stats-badge-${p.Estado?.toLowerCase()}`}
                      >
                        {p.Estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Estadisticas;
