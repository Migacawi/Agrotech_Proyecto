import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";
import Footer from "../components/layouts/Footer";
import "../styles/Checkout.css";

import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import PagoEfectivo from "../components/ui/PagoEfectivo";
import PagoTransferencia from "../components/ui/PagoTransferencia";
import PagoTarjeta from "../components/ui/PagoTarjeta";
import {
  FaCheck,
  FaCreditCard,
  FaExclamation,
  FaMoneyBillWave,
  FaQuestion,
  FaTimes,
  FaUniversity,
} from "react-icons/fa";

/* ── Sweet Alert inline ── */
const ALERT_ICONS = {
  success: <FaCheck />,
  error: <FaTimes />,
  warning: <FaExclamation />,
  confirm: <FaQuestion />,
};

const saBase = {
  fontFamily: "'Segoe UI', sans-serif",
  border: "none",
  cursor: "pointer",
  borderRadius: "8px",
  padding: "11px 28px",
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "0.3px",
  transition: "opacity 0.15s",
};

const saStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(4,22,22,0.82)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  box: {
    background: "#07393C",
    border: "1px solid #1a5c60",
    borderRadius: "14px",
    padding: "36px 32px 28px",
    width: "100%",
    maxWidth: "360px",
    textAlign: "center",
    position: "relative",
    fontFamily: "'Segoe UI', sans-serif",
  },
  badge: {
    position: "absolute",
    top: "-13px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#74e2d7",
    color: "#07393C",
    fontSize: "11px",
    fontWeight: 700,
    padding: "3px 14px",
    borderRadius: "20px",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },
  icon: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
  },
  icon_success: {
    background: "rgba(122,184,168,0.15)",
    border: "2px solid #7ab8a8",
    color: "#7ab8a8",
  },
  icon_error: {
    background: "rgba(255,112,112,0.12)",
    border: "2px solid #ff7070",
    color: "#ff7070",
  },
  icon_warning: {
    background: "rgba(250,182,87,0.12)",
    border: "2px solid #fab657",
    color: "#fab657",
  },
  icon_confirm: {
    background: "rgba(116,226,215,0.10)",
    border: "2px solid #74e2d7",
    color: "#74e2d7",
  },
  title: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#e8f5f3",
    marginBottom: "10px",
    lineHeight: 1.3,
  },
  text: {
    fontSize: "13.5px",
    color: "#7ab8a8",
    marginBottom: "24px",
    lineHeight: 1.55,
  },
  highlight: { color: "#74e2d7", fontWeight: 600 },
  btnRow: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  btnPrimary: { ...saBase, background: "#74e2d7", color: "#07393C" },
  btnDanger: { ...saBase, background: "#ff7070", color: "#fff" },
  btnWarning: { ...saBase, background: "#fab657", color: "#07393C" },
  btnSecondary: {
    ...saBase,
    background: "transparent",
    border: "1px solid #2e686c",
    color: "#7ab8a8",
  },
};

const btnConfirmStyle = {
  success: saStyles.btnPrimary,
  error: saStyles.btnDanger,
  warning: saStyles.btnWarning,
  confirm: saStyles.btnPrimary,
};

function SweetAlert({
  type = "success",
  title,
  text,
  badge,
  highlight,
  confirmText = "Aceptar",
  cancelText,
  onConfirm,
  onCancel,
  onClose,
}) {
  const iconStyle = { ...saStyles.icon, ...saStyles[`icon_${type}`] };

  const renderText = () => {
    if (!highlight || !text?.includes(highlight))
      return <p style={saStyles.text}>{text}</p>;
    const parts = text.split(highlight);
    return (
      <p style={saStyles.text}>
        {parts[0]}
        <strong style={saStyles.highlight}>{highlight}</strong>
        {parts[1]}
      </p>
    );
  };

  return (
    <div
      style={saStyles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div style={saStyles.box} role="dialog" aria-modal="true">
        {badge && <span style={saStyles.badge}>{badge}</span>}
        <div style={iconStyle}>{ALERT_ICONS[type]}</div>
        <p style={saStyles.title}>{title}</p>
        {renderText()}
        <div style={saStyles.btnRow}>
          <button
            style={btnConfirmStyle[type]}
            onClick={onConfirm}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {confirmText}
          </button>
          {cancelText && (
            <button
              style={saStyles.btnSecondary}
              onClick={onCancel ?? onClose}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#74e2d7")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#2e686c")
              }
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Checkout ── */
function Checkout() {
  const navigate = useNavigate();

  const { items, addItem, removeItem, deleteItem, getTotal, clearCart } =
    useCartStore();
  const { user } = useAuthStore();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [barrio, setBarrio] = useState("");
  const [ciudad, setCiudad] = useState("Bogotá");
  const [telefono, setTelefono] = useState("");
  const [pago, setPago] = useState("efectivo");
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const [modalPagoOpen, setModalPagoOpen] = useState(false);

  const [errores, setErrores] = useState({
    nombre: "",
    barrio: "",
    telefono: "",
  });

  const subtotal = getTotal();

  const validarNombre = (val) => {
    if (!val.trim()) return "";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val))
      return "Solo se permiten letras.";
    if (val.trim().length < 5) return "Mínimo 5 caracteres.";
    return "";
  };

  const validarBarrio = (val) => {
    if (!val.trim()) return "";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val))
      return "Solo se permiten letras.";
    return "";
  };

  const validarTelefono = (val) => {
    if (!val.trim()) return "";
    if (!/^\d+$/.test(val)) return "Solo se permiten números.";
    if (val.length > 10) return "Máximo 10 dígitos.";
    return "";
  };

  const handleNombre = (e) => {
    const val = e.target.value;
    if (val.length > 20) return;
    setNombre(val);
    setErrores((prev) => ({ ...prev, nombre: validarNombre(val) }));
  };

  const handleBarrio = (e) => {
    const val = e.target.value;
    if (val.length > 20) return;
    setBarrio(val);
    setErrores((prev) => ({ ...prev, barrio: validarBarrio(val) }));
  };

  const handleTelefono = (e) => {
    const val = e.target.value;
    if (val.length > 10) return;
    if (val && !/^\d*$/.test(val)) return;
    setTelefono(val);
    setErrores((prev) => ({ ...prev, telefono: validarTelefono(val) }));
  };

  const ejecutarPedido = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // 1. Petición para crear el pedido
      const resPedido = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/pedidos`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          CompradorId: user?.id,
          Total: subtotal,
          Estado: "Pendiente",
          detalles: items.map((i) => ({
            ProductoId: i.id,
            Cantidad: i.cantidad,
            PrecioUnitario: i.precio,
          })),
        }),
      });

      // Validar si el backend respondió con un error de red o de servidor
      if (!resPedido.ok) {
        let textoError = "Error interno en el servidor de pedidos.";
        try {
          const errorData = await resPedido.json();
          textoError = errorData.error || errorData.message || textoError;
        } catch (_) {
          textoError = `Error en el servidor (${resPedido.status}): No se pudo registrar el pedido.`;
        }
        throw new Error(textoError);
      }

      // Si la respuesta es exitosa, se parsea el JSON con seguridad
      const dataPedido = await resPedido.json();
      const pedidoId = dataPedido.Id;

      // 2. Petición para procesar el pago
      const resPago = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/pagos/procesar`, {
        method: "POST",
        headers,
        body: JSON.stringify({ pedidoId, metodoPago: pago }),
      });

      // Validar la respuesta de la pasarela de pago
      if (!resPago.ok) {
        let textoErrorPago = "Error al procesar la pasarela de pago.";
        try {
          const errorDataPago = await resPago.json();
          textoErrorPago = errorDataPago.error || errorDataPago.message || textoErrorPago;
        } catch (_) {
          textoErrorPago = `Error en el servidor de pagos (${resPago.status}).`;
        }
        throw new Error(textoErrorPago);
      }

      const dataPago = await resPago.json();

      // Limpiar carrito tras éxito total
      clearCart();

      setAlerta({
        type: "success",
        title: "¡Pedido confirmed!",
        text: `Tu pedido #${pedidoId} fue registrado con éxito. Recibirás tu domicilio pronto.`,
        confirmText: "Ver mi pedido",
        onConfirm: () => {
          setAlerta(null);
          navigate(`/confirmacion/${pedidoId}`, {
            state: {
              mensaje: dataPago.mensaje,
              estadoPago: dataPago.pago?.Estado,
              metodoPago: pago,
              total: subtotal,
              items,
              vendedor: items[0]?.vendedor || null,
            },
          });
        },
      });
    } catch (err) {
      setAlerta({
        type: "error",
        title: "Error al procesar",
        text: err.message || "Ocurrió un error inesperado. Intenta de nuevo.",
        confirmText: "Reintentar",
        cancelText: "Cancelar",
        onConfirm: () => setAlerta(null),
        onCancel: () => setAlerta(null),
      });
    } finally {
      setCargando(false);
    }
  };

  const validarFormulario = () => {
    const errNombre = validarNombre(nombre);
    const errBarrio = validarBarrio(barrio);
    const errTelefono = validarTelefono(telefono);
    setErrores({ nombre: errNombre, barrio: errBarrio, telefono: errTelefono });

    if (items.length === 0) {
      setAlerta({
        type: "warning",
        title: "Carrito vacío",
        text: "No tienes productos en el carrito. Agrega algo antes de continuar.",
        confirmText: "Ir a la tienda",
        onConfirm: () => {
          setAlerta(null);
          navigate("/ver-todo");
        },
      });
      return false;
    }

    if (!nombre.trim() || !direccion.trim() || !telefono.trim()) {
      setAlerta({
        type: "warning",
        title: "Faltan datos",
        text: "Por favor completa todos los campos obligatorios.",
        confirmText: "Entendido",
        onConfirm: () => setAlerta(null),
      });
      return false;
    }

    if (nombre.trim().length < 5) {
      setAlerta({
        type: "warning",
        title: "Nombre muy corto",
        text: "El nombre debe tener al menos 5 caracteres.",
        confirmText: "Entendido",
        onConfirm: () => setAlerta(null),
      });
      return false;
    }

    if (errNombre || errBarrio || errTelefono) {
      setAlerta({
        type: "warning",
        title: "Revisa los datos",
        text: "Corrige los errores en el formulario antes de continuar.",
        confirmText: "Entendido",
        onConfirm: () => setAlerta(null),
      });
      return false;
    }

    if (telefono.length !== 10) {
      setAlerta({
        type: "warning",
        title: "Teléfono inválido",
        text: "El teléfono debe tener exactamente 10 dígitos.",
        confirmText: "Entendido",
        onConfirm: () => setAlerta(null),
      });
      return false;
    }

    return true;
  };

  const confirmarPedido = () => {
    if (!validarFormulario()) return;
    setModalPagoOpen(true);
  };

  const opcionesPago = [
    { value: "efectivo", label: "Contra entrega", Icon: FaMoneyBillWave },
    { value: "transferencia", label: "Transferencia", Icon: FaUniversity },
    { value: "tarjeta", label: "Tarjeta", Icon: FaCreditCard },
  ];

  const estiloErrorCampo = {
    color: "#ff7070",
    fontSize: "11px",
    marginTop: "4px",
  };

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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {p.imagen && (
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        style={{
                          width: 44,
                          height: 44,
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

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexShrink: 0,
                    }}
                  >
                    <button
                      className="qty-btn"
                      onClick={() => removeItem(p.id)}
                    >
                      −
                    </button>
                    <span className="qty-badge">{p.cantidad}</span>
                    <button className="qty-btn" onClick={() => addItem(p)}>
                      +
                    </button>
                    <button
                      type="button"
                      className="qty-btn qty-btn--delete"
                      onClick={() => deleteItem(p.id)}
                      aria-label="Quitar producto del carrito"
                    >
                      <FaTimes aria-hidden size={12} />
                    </button>
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
              onChange={handleNombre}
              style={{ borderColor: errores.nombre ? "#ff7070" : undefined }}
            />
            {errores.nombre && <p style={estiloErrorCampo}>{errores.nombre}</p>}
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
              <select
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
              >
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
                onChange={handleBarrio}
                style={{ borderColor: errores.barrio ? "#ff7070" : undefined }}
              />
              {errores.barrio && (
                <p style={estiloErrorCampo}>{errores.barrio}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono *</label>
            <input
              type="tel"
              placeholder="3001234567"
              value={telefono}
              onChange={handleTelefono}
              style={{ borderColor: errores.telefono ? "#ff7070" : undefined }}
            />
            {errores.telefono && (
              <p style={estiloErrorCampo}>{errores.telefono}</p>
            )}
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
                <div className="pago-icon">
                  <op.Icon aria-hidden size={22} />
                </div>
                <p className="pago-label">{op.label}</p>
              </div>
            ))}
          </div>

          <button
            className={`btn-confirmar ${cargando ? "cargando" : ""}`}
            onClick={confirmarPedido}
            disabled={cargando || items.length === 0}
          >
            {cargando ? "Procesando pedido..." : "Confirmar pedido"}
          </button>
        </div>
      </div>

      {/* ── MODALES DE PAGO ── */}
      {modalPagoOpen && pago === "efectivo" && (
        <PagoEfectivo
          onConfirmar={() => {
            setModalPagoOpen(false);
            ejecutarPedido();
          }}
          onCancelar={() => setModalPagoOpen(false)}
        />
      )}
      {modalPagoOpen && pago === "transferencia" && (
        <PagoTransferencia
          total={subtotal}
          onConfirmar={() => {
            setModalPagoOpen(false);
            ejecutarPedido();
          }}
          onCerrar={() => setModalPagoOpen(false)}
        />
      )}
      {modalPagoOpen && pago === "tarjeta" && (
        <PagoTarjeta
          total={subtotal}
          onConfirmar={() => {
            setModalPagoOpen(false);
            ejecutarPedido();
          }}
          onCerrar={() => setModalPagoOpen(false)}
        />
      )}

      {/* ── SWEET ALERT ── */}
      {alerta && <SweetAlert {...alerta} onClose={() => setAlerta(null)} />}

      <Footer />
    </>
  );
}

export default Checkout;
