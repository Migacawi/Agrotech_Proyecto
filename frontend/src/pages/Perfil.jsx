import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import "../styles/Perfil.css";
import ImageCropper from "../components/ui/ImageCropper";

import useAuthStore from "../store/authStore";
import { getPedidos } from "../api/pedidosService";
import { getUsuarioById, updateUsuario, updateFotoUsuario } from "../api/usuariosService";
import { toastExito, toastError } from "../utils/swal";
import { FaPen } from "react-icons/fa";

const IconoPerfil = ({ src }) => {
  if (src) return (
    <img src={src} alt="perfil" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }} />
  );
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="30" fill="#e0e0e0" />
      <circle cx="30" cy="22" r="10" fill="#bdbdbd" />
      <ellipse cx="30" cy="48" rx="18" ry="10" fill="#bdbdbd" />
    </svg>
  );
};

function Perfil() {
  const { user } = useAuthStore();
  const [usuario,        setUsuario]        = useState(null);
  const [modalOpen,      setModalOpen]      = useState(false);
  const [form,           setForm]           = useState({
    Nombre:            "",
    PasswordHash:      "",
    PasswordActual:    "",
    ConfirmarPassword: "",
  });
  const [imagenFile,     setImagenFile]     = useState(null);
  const [preview,        setPreview]        = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [mensaje,        setMensaje]        = useState("");
  const [cropperOpen,    setCropperOpen]    = useState(false);
  const [ultimasCompras, setUltimasCompras] = useState([]);
  const [saldoGanancias, setSaldoGanancias] = useState(0);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const fetchUsuario = async () => {
      try {
        const data = await getUsuarioById(user.id);
        setUsuario(data);
        setForm({ Nombre: data.Nombre, PasswordHash: "", PasswordActual: "", ConfirmarPassword: "" });
        if (data.FotoUrl) setPreview(data.FotoUrl);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      }
    };
    fetchUsuario();
  }, [user]);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const todos = await getPedidos();
        const mias = todos
          .filter(p => p.CompradorId === user?.id || p.Usuario?.Id === user?.id)
          .sort((a, b) => b.Id - a.Id)
          .slice(0, 3);
        setUltimasCompras(mias);
      } catch {}
    };
    if (user?.id) fetchCompras();
  }, [user]);

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const todos = await getPedidos();
        const ganado = todos
          .filter(p => p.Estado === "Entregado")
          .flatMap(p => (p.Detalles || []).map(d => ({ ...d, pedidoEstado: p.Estado })))
          .filter(d => d.Producto?.VendedorId === user?.id)
          .reduce((acc, d) => acc + Number(d.Subtotal), 0);
        setSaldoGanancias(ganado);
      } catch {}
    };
    if (user?.id) fetchSaldo();
  }, [user]);

  const handleImagen   = () => setCropperOpen(true);
  const handleCropDone = (file, prev) => { setImagenFile(file); setPreview(prev); setCropperOpen(false); };

  const handleGuardar = async () => {
    setMensaje("");

    // Validación local básica
    if (form.PasswordHash.trim() !== "") {
      if (!form.PasswordActual.trim()) {
        setMensaje("Debes ingresar tu contraseña actual.");
        return;
      }
      if (form.PasswordHash !== form.ConfirmarPassword) {
        setMensaje("Las contraseñas nuevas no coinciden.");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = { Nombre: form.Nombre };
      if (form.PasswordHash.trim() !== "") {
        payload.PasswordHash = form.PasswordHash;
        payload.PasswordActual = form.PasswordActual; // el back verifica con bcrypt
      }
      const actualizado = await updateUsuario(user.id, payload);
      setUsuario(actualizado);

      if (imagenFile) {
        const res = await updateFotoUsuario(user.id, imagenFile);
        setPreview(res.FotoUrl);
        setUsuario(prev => ({ ...prev, FotoUrl: res.FotoUrl }));
      }

      toastExito('¡Perfil actualizado!');
      setTimeout(() => { setModalOpen(false); setMensaje(""); setImagenFile(null); }, 800);
    } catch (err) {
      const msg = err.message || "Error al actualizar";
      setMensaje(msg);
      toastError('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const colorBadge = (estado) => ({
    Pendiente: { bg: "#fff3cd", color: "#856404" },
    Enviado:   { bg: "#cce5ff", color: "#004085" },
    Entregado: { bg: "#d4edda", color: "#155724" },
    Cancelado: { bg: "#f8d7da", color: "#721c24" },
  })[estado] || { bg: "#eee", color: "#555" };

  const inputStyle = {
    padding: "10px", borderRadius: "8px",
    border: "1px solid #ccc", fontSize: "14px",
    fontFamily: "K2D, sans-serif", color: "#333",
    background: "white", width: "100%", boxSizing: "border-box",
  };

  const labelStyle = { fontSize: "13px", color: "#555", fontFamily: "K2D, sans-serif" };

  return (
    <div className="perfil-page">
      <NavbarPerfil onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="perfil-content">
        <h3 className="section-title">INFORMACION GENERAL</h3>

        <div className="perfil-grid">

          {/* Card perfil */}
          <div className="perfil-card">
            <h4>PERFIL</h4>
            <div className="perfil-info">
              <IconoPerfil src={usuario?.FotoUrl || preview} />
              <div>
                <p className="perfil-nombre">{usuario?.Nombre || "Cargando..."}</p>
                <p className="perfil-email">{usuario?.Email || user?.email || "Cargando..."}</p>
              </div>
              <button
                type="button"
                className="edit-btn"
                style={{ color: "black", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                title="Editar perfil"
                aria-label="Editar perfil"
                onClick={() => {
                  setModalOpen(true);
                  setForm(prev => ({ ...prev, PasswordHash: "", PasswordActual: "", ConfirmarPassword: "" }));
                }}
              >
                <FaPen aria-hidden />
              </button>
            </div>
          </div>

          {/* Card últimas compras */}
          <div className="compras-card">
            <h4>Ultimas Compras</h4>
            {ultimasCompras.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>No hay compras todavía</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {ultimasCompras.map(p => {
                  const nombres = (p.Detalles || []).map(d => d.Producto?.Nombre || `#${d.ProductoId}`).join(", ");
                  const badge   = colorBadge(p.Estado);
                  return (
                    <div key={p.Id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0", gap: "8px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: "#07393c", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          #{p.Id} · {nombres || "—"}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>
                          ${Number(p.Total).toLocaleString("es-CO")} COP
                        </p>
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px", background: badge.bg, color: badge.color, whiteSpace: "nowrap", flexShrink: 0 }}>
                        {p.Estado}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Saldo */}
        <div className="saldo-section">
          <h4>Saldo Total</h4>
          <h1 className="saldo-total">${saldoGanancias.toLocaleString("es-CO")} COP</h1>
          <div className="saldo-item">
            <div>
              <p className="saldo-title">Saldo De Ganancias</p>
              <span className="saldo-desc">Saldo obtenido de las ventas realizadas</span>
            </div>
            <div className="saldo-right">
              <span className="saldo-value">${saldoGanancias.toLocaleString("es-CO")} COP</span>
            </div>
          </div>
        </div>

      </div>

      {cropperOpen && (
        <ImageCropper aspect={1} circular={true} onCropDone={handleCropDone} onCancel={() => setCropperOpen(false)} />
      )}

      {/* MODAL */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "32px", width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "90vh", overflowY: "auto" }}>

            <h3 style={{ margin: 0, color: "#07393c", fontFamily: "K2D, sans-serif" }}>Editar Perfil</h3>

            {/* Foto */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <IconoPerfil src={preview || usuario?.FotoUrl} />
              <button type="button" onClick={handleImagen} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #07393c", color: "#07393c", cursor: "pointer", fontSize: "13px", background: "white", fontFamily: "K2D, sans-serif" }}>
                Cambiar foto
              </button>
            </div>

            {/* Nombre */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={labelStyle}>Nombre</label>
              <input
                value={form.Nombre}
                onChange={e => setForm({ ...form, Nombre: e.target.value })}
                style={inputStyle}
              />
            </div>

            {/* Contraseña actual */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={labelStyle}>
                Contraseña actual <span style={{ color: "#aaa" }}>(solo si quieres cambiarla)</span>
              </label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña actual"
                value={form.PasswordActual}
                onChange={e => setForm({ ...form, PasswordActual: e.target.value })}
                style={inputStyle}
              />
            </div>

            {/* Nueva contraseña */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={labelStyle}>
                Nueva contraseña <span style={{ color: "#aaa" }}>(dejar vacío para no cambiar)</span>
              </label>
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={form.PasswordHash}
                onChange={e => setForm({ ...form, PasswordHash: e.target.value })}
                style={inputStyle}
              />
            </div>

            {/* Confirmar contraseña */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={labelStyle}>Confirmar nueva contraseña</label>
              <input
                type="password"
                placeholder="Repite la nueva contraseña"
                value={form.ConfirmarPassword}
                onChange={e => setForm({ ...form, ConfirmarPassword: e.target.value })}
                style={inputStyle}
              />
            </div>

            {mensaje && (
              <p style={{ color: mensaje.includes("Error") || mensaje.includes("incorrecta") || mensaje.includes("coinciden") || mensaje.includes("Debes") || mensaje.includes("caracteres") ? "#ff6b6b" : "#07393c", fontSize: "13px", margin: 0, fontFamily: "K2D, sans-serif" }}>
                {mensaje}
              </p>
            )}

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => { setModalOpen(false); setImagenFile(null); }}
                style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #ccc", background: "white", cursor: "pointer", fontFamily: "K2D, sans-serif", color: "#333", fontSize: "14px" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={loading}
                style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#07393c", color: "white", cursor: "pointer", opacity: loading ? 0.7 : 1, fontFamily: "K2D, sans-serif", fontSize: "14px", fontWeight: 600 }}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Perfil;