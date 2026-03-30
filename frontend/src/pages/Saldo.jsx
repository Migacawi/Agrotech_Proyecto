import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import "../styles/Perfil.css";
import "../styles/Saldo.css";
import useAuthStore from "../store/authStore";
import { getPedidos } from "../api/pedidosService";

function Saldo() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saldoGanancias, setSaldoGanancias] = useState(0);
  const [ventasEntregadas, setVentasEntregadas] = useState([]);

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const todos = await getPedidos();

        const detallesVendedor = [];
        todos.forEach((pedido) => {
          (pedido.Detalles || []).forEach((d) => {
            if (
              d.Producto?.VendedorId === user?.id &&
              pedido.Estado === "Entregado"
            ) {
              detallesVendedor.push({ ...d, pedido });
            }
          });
        });

        const total = detallesVendedor.reduce(
          (acc, d) => acc + Number(d.Subtotal),
          0,
        );
        setSaldoGanancias(total);
        setVentasEntregadas(detallesVendedor);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchSaldo();
  }, [user]);

  return (
    <div className="perfil-page">
      <NavbarPerfil />
      <Sidebar />

      <div className="perfil-content">
        <h3 className="section-title">SALDO</h3>

        {loading ? (
          <p style={{ color: "#07393c" }}>Cargando saldo...</p>
        ) : (
          <>
            {/* Total */}
            <div className="saldo-hero">
              <p className="saldo-hero-label">Saldo Total Disponible</p>
              <h1 className="saldo-hero-valor">
                ${saldoGanancias.toLocaleString("es-CO")} COP
              </h1>
              <p className="saldo-hero-sub">
                Calculado a partir de tus ventas confirmadas
              </p>
            </div>

            {/* Cards */}
            <div className="saldo-cards">
              <div className="saldo-card">
                <span className="saldo-card-icon">💰</span>
                <p className="saldo-card-label">Ganancias confirmadas</p>
                <p className="saldo-card-valor">
                  ${saldoGanancias.toLocaleString("es-CO")} COP
                </p>
                <p className="saldo-card-desc">Ventas con estado Entregado</p>
              </div>

              <div className="saldo-card">
                <span className="saldo-card-icon">📦</span>
                <p className="saldo-card-label">Ventas confirmadas</p>
                <p className="saldo-card-valor">{ventasEntregadas.length}</p>
                <p className="saldo-card-desc">Productos entregados</p>
              </div>

              <div className="saldo-card">
                <span className="saldo-card-icon">📊</span>
                <p className="saldo-card-label">Promedio por venta</p>
                <p className="saldo-card-valor">
                  $
                  {ventasEntregadas.length > 0
                    ? Math.round(
                        saldoGanancias / ventasEntregadas.length,
                      ).toLocaleString("es-CO")
                    : 0}{" "}
                  COP
                </p>
                <p className="saldo-card-desc">Por cada producto vendido</p>
              </div>
            </div>

            {/* Tabla de movimientos */}
            {ventasEntregadas.length > 0 && (
              <div className="saldo-movimientos">
                <h4 className="saldo-movimientos-titulo">📋 Movimientos</h4>
                <table className="saldo-tabla">
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Producto</th>
                      <th>Comprador</th>
                      <th>Cantidad</th>
                      <th>Ganancia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventasEntregadas.map((d, i) => (
                      <tr key={i}>
                        <td>#{d.pedido.Id}</td>
                        <td>{d.Producto?.Nombre || "—"}</td>
                        <td>{d.pedido.Usuario?.Nombre || "—"}</td>
                        <td>{Number(d.CantidadLibras)} lb</td>
                        <td style={{ color: "#07393c", fontWeight: 600 }}>
                          +${Number(d.Subtotal).toLocaleString("es-CO")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {ventasEntregadas.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  background: "white",
                  borderRadius: "10px",
                  color: "#aaa",
                }}
              >
                <p style={{ fontSize: "32px" }}>💳</p>
                <p>Aún no tienes ganancias confirmadas.</p>
                <p style={{ fontSize: "12px" }}>
                  Aparecerán aquí cuando tus pedidos sean marcados como
                  Entregado.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Saldo;
