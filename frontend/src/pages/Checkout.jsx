import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";
import Footer from "../components/layouts/Footer";
import "../styles/Checkout.css";

import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

function Checkout() {
  const navigate = useNavigate();

  const { items, addItem, removeItem, deleteItem, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [nombre,    setNombre]    = useState("");
  const [direccion, setDireccion] = useState("");
  const [barrio,    setBarrio]    = useState("");
  const [ciudad,    setCiudad]    = useState("Bogotá");
  const [telefono,  setTelefono]  = useState("");
  const [pago,      setPago]      = useState("efectivo");
  const [cargando,  setCargando]  = useState(false);
  const [error,     setError]     = useState(null);

  const subtotal = getTotal();

  const confirmarPedido = async () => {
    console.log("user:", user);
    console.log("items:", items);
    console.log("subtotal:", subtotal);

    if (!nombre.trim() || !direccion.trim() || !telefono.trim()) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (items.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const resPedido = await fetch("https://cautious-goldfish-5gq54w94q459h5xg-3000.app.github.dev/api/pedidos", {
        method: "POST",
        headers,
        body: JSON.stringify({
          CompradorId: user?.id,
          Total:       subtotal,
          Estado:      "Pendiente",
          detalles:    items.map((i) => ({
            ProductoId:     i.id,
            Cantidad:       i.cantidad,
            PrecioUnitario: i.precio,
          })),
        }),
      });

      const dataPedido = await resPedido.json();
      console.log("respuesta pedido:", dataPedido);

      if (!resPedido.ok) throw new Error(dataPedido.error || "Error al crear el pedido.");

      const pedidoId = dataPedido.Id;

      const resPago = await fetch("https://cautious-goldfish-5gq54w94q459h5xg-3000.app.github.dev/api/pagos/procesar", {
        method: "POST",
        headers,
        body: JSON.stringify({
          pedidoId,
          metodoPago: pago,
        }),
      });

      const dataPago = await resPago.json();
      console.log("respuesta pago:", dataPago);

      if (!resPago.ok) throw new Error(dataPago.error || "Error al procesar el pago.");

      clearCart();

          navigate(`/confirmacion/${pedidoId}`, {
        state: {
          mensaje:    dataPago.mensaje,
          estadoPago: dataPago.pago?.Estado,
          metodoPago: pago,
          total:      subtotal,
          items:      items,                          // ← agregar
          vendedor:   items[0]?.vendedor || null,     // ← agregar si tienes el dato
        },
    });

    } catch (err) {
      setError(err.message || "Ocurrió un error. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const opcionesPago = [
    { value: "efectivo",      label: "Contra entrega", icon: "💵" },
    { value: "transferencia", label: "Transferencia",  icon: "🏦" },
    { value: "tarjeta",       label: "Tarjeta",        icon: "💳" },
  ];

  return (
    <>
      <Navbar />
      <Categorias />

      <div className="checkout-page">

        {/* ── RESUMEN ── */}
        <div className="checkout-card">
          <p className="section-title">Resumen del pedido</p>

          {items.length === 0 ? (
            <p style={{ color: "#7ab8a8", fontSize: "14px" }}>
              No tienes productos en el carrito.
            </p>
          ) : (
            <>
              <p className="items-count">
                {items.length} producto{items.length !== 1 ? "s" : ""}
              </p>

              {items.map((p) => (
                <div key={p.id} className="product-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {p.imagen && (
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        style={{
                          width: 44, height: 44,
                          borderRadius: 6,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div>
                      <p className="product-name">{p.nombre}</p>
                      <p className="product-meta">
                        ${p.precio.toLocaleString("es-CO")} / libra
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <button className="qty-btn" onClick={() => removeItem(p.id)}>−</button>
                    <span className="qty-badge">{p.cantidad}</span>
                    <button className="qty-btn" onClick={() => addItem(p)}>+</button>
                    <button className="qty-btn qty-btn--delete" onClick={() => deleteItem(p.id)}>✕</button>
                  </div>

                  <p className="product-price">
                    ${(p.precio * p.cantidad).toLocaleString("es-CO")}
                  </p>
                </div>
              ))}

              <div className="divider" />

              <div className="subtotal-row">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString("es-CO")}</span>
              </div>
              <div className="subtotal-row">
                <span>Envío</span>
                <span className="badge-envio">Gratis</span>
              </div>
              <div className="total-row">
                <span className="total-label">Total a pagar</span>
                <span className="total-amount">
                  ${subtotal.toLocaleString("es-CO")} COP
                </span>
              </div>
            </>
          )}
        </div>

        {/* ── FORMULARIO ── */}
        <div className="checkout-card">
          <p className="section-title">Datos de envío</p>

          <div className="form-group">
            <label className="form-label">Nombre completo *</label>
            <input
              type="text"
              placeholder="Ej: Carlos Ramírez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dirección *</label>
            <input
              type="text"
              placeholder="Calle 45 # 12-30, Apt 201"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ciudad</label>
              <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
                <option>Bogotá</option>
                <option>Medellín</option>
                <option>Cali</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Barrio</label>
              <input
                type="text"
                placeholder="Chapinero"
                value={barrio}
                onChange={(e) => setBarrio(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono *</label>
            <input
              type="tel"
              placeholder="300 123 4567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="divider" />
          <p className="section-title">Método de pago</p>

          <div className="pago-options">
            {opcionesPago.map((op) => (
              <div
                key={op.value}
                className={`pago-option ${pago === op.value ? "active" : ""}`}
                onClick={() => setPago(op.value)}
              >
                <div className="pago-icon">{op.icon}</div>
                <p className="pago-label">{op.label}</p>
              </div>
            ))}
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button
            className={`btn-confirmar ${cargando ? "cargando" : ""}`}
            onClick={confirmarPedido}
            disabled={cargando || items.length === 0}
          >
            {cargando ? "Procesando pedido..." : "Confirmar pedido"}
          </button>
        </div>

      </div>

      <Footer />
    </>
  );
}

export default Checkout;