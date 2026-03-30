import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";
import Footer from "../components/layouts/Footer";
import "../styles/ConfirmacionPedido.css";
import { jsPDF } from "jspdf";

function ConfirmacionPedido() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const { mensaje, estadoPago, metodoPago, total, items, vendedor } = state;

  const labelMetodo = {
    efectivo: "Contra entrega",
    transferencia: "Transferencia",
    tarjeta: "Tarjeta",
  };

  const badgeClass = estadoPago === "Completado" ? "completado" : "pendiente";

  const handleDescargarComprobante = () => {
    const doc = new jsPDF();
    const verde = [7, 57, 60]; // #07393C
    const verdeClaro = [116, 226, 213]; // #74e2d5
    const gris = [100, 100, 100];
    const negro = [30, 30, 30];
    const ancho = doc.internal.pageSize.getWidth();

    // ── Encabezado ──────────────────────────────────────────
    doc.setFillColor(...verde);
    doc.rect(0, 0, ancho, 38, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("AGROTECH", 14, 18);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Comprobante de Pago", 14, 28);

    doc.setFontSize(10);
    doc.text(
      `Generado: ${new Date().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      ancho - 14,
      28,
      { align: "right" },
    );

    // ── Sección: Resumen ─────────────────────────────────────
    let y = 50;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...verde);
    doc.text("Resumen del pedido", 14, y);

    y += 2;
    doc.setDrawColor(...verdeClaro);
    doc.setLineWidth(0.5);
    doc.line(14, y + 2, ancho - 14, y + 2);
    y += 10;

    const fila = (label, valor, negrita = false) => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...gris);
      doc.text(label, 14, y);

      doc.setFont("helvetica", negrita ? "bold" : "normal");
      doc.setTextColor(...negro);
      doc.text(String(valor), ancho - 14, y, { align: "right" });
      y += 9;
    };

    fila("Número de pedido", `#${id}`);
    fila("Estado", estadoPago || "Pendiente");
    fila("Método de pago", labelMetodo[metodoPago] || metodoPago || "—");
    fila("Total pagado", `$${total?.toLocaleString("es-CO")} COP`, true);

    // ── Sección: Productos ───────────────────────────────────
    if (items && items.length > 0) {
      y += 6;
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...verde);
      doc.text("Productos", 14, y);

      y += 2;
      doc.setDrawColor(...verdeClaro);
      doc.line(14, y + 2, ancho - 14, y + 2);
      y += 10;

      // Cabecera tabla
      doc.setFillColor(240, 240, 240);
      doc.rect(14, y - 5, ancho - 28, 8, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...gris);
      doc.text("Producto", 16, y);
      doc.text("Libras", 110, y, { align: "center" });
      doc.text("Precio/lb", 145, y, { align: "center" });
      doc.text("Subtotal", ancho - 14, y, { align: "right" });
      y += 8;

      items.forEach((p, i) => {
        if (i % 2 === 0) {
          doc.setFillColor(249, 249, 249);
          doc.rect(14, y - 5, ancho - 28, 8, "F");
        }
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...negro);
        doc.setFontSize(10);
        doc.text(p.nombre || "—", 16, y);
        doc.text(String(p.cantidad), 110, y, { align: "center" });
        doc.text(`$${p.precio?.toLocaleString("es-CO")}`, 145, y, {
          align: "center",
        });
        doc.text(
          `$${(p.precio * p.cantidad).toLocaleString("es-CO")}`,
          ancho - 14,
          y,
          { align: "right" },
        );
        y += 9;
      });

      // Total final
      y += 2;
      doc.setDrawColor(...verde);
      doc.setLineWidth(0.4);
      doc.line(14, y, ancho - 14, y);
      y += 7;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...verde);
      doc.text("TOTAL", 14, y);
      doc.text(`$${total?.toLocaleString("es-CO")} COP`, ancho - 14, y, {
        align: "right",
      });
    }

    // ── Sección: Vendedor ────────────────────────────────────
    if (vendedor?.nombre) {
      y += 14;
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...verde);
      doc.text("Datos del vendedor", 14, y);

      y += 2;
      doc.setDrawColor(...verdeClaro);
      doc.setLineWidth(0.5);
      doc.line(14, y + 2, ancho - 14, y + 2);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...negro);
      doc.text(vendedor.nombre, 14, y);
      y += 8;
      doc.setTextColor(...gris);
      doc.text("Vendedor verificado en Agrotech", 14, y);
    }

    // ── Pie de página ────────────────────────────────────────
    const alturaPagina = doc.internal.pageSize.getHeight();
    doc.setFillColor(...verde);
    doc.rect(0, alturaPagina - 16, ancho, 16, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Agrotech — Conectando el campo con tu mesa  |  agrotech.com",
      ancho / 2,
      alturaPagina - 6,
      { align: "center" },
    );

    doc.save(`comprobante-pedido-${id}.pdf`);
  };

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
                  {p.imagen && <img src={p.imagen} alt={p.nombre} />}
                  <div className="confirmacion-producto-info">
                    <span className="confirmacion-producto-nombre">
                      {p.nombre}
                    </span>
                    <span className="confirmacion-producto-meta">
                      {p.cantidad} libra{p.cantidad !== 1 ? "s" : ""} × $
                      {p.precio?.toLocaleString("es-CO")}
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
                  <p className="confirmacion-vendedor-nombre">
                    {vendedor.nombre}
                  </p>
                  <p className="confirmacion-vendedor-label">
                    Vendedor verificado
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="confirmacion-botones">
            <button className="btn-secundario" onClick={() => navigate("/")}>
              Ir al inicio
            </button>
            <button
              className="btn-comprobante"
              onClick={handleDescargarComprobante}
            >
              📄 Descargar comprobante
            </button>
            <button
              className="btn-primario"
              onClick={() => navigate("/ver-todo")}
            >
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
