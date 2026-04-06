import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import "../styles/Perfil.css";
import ImageCropper from "../components/ui/ImageCropper";

import useAuthStore from "../store/authStore";
import { getPedidos } from "../api/pedidosService";
import {
  getUsuarioById,
  updateUsuario,
  updateFotoUsuario,
} from "../api/usuariosService";

const IconoPerfil = ({ src }) => {
  if (src)
    return (
      <img
        src={src}
        alt="perfil"
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
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
  const [usuario, setUsuario] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ Nombre: "", PasswordHash: "" });
  const [imagenFile, setImagenFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cropperOpen, setCropperOpen] = useState(false);
  const [ultimasCompras, setUltimasCompras] = useState([]);
  const [saldoGanancias, setSaldoGanancias] = useState(0); // ← aquí dentro
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cargar usuario
  useEffect(() => {
    if (!user?.id) return;
    const fetchUsuario = async () => {
      try {
        const data = await getUsuarioById(user.id);
        setUsuario(data);
        setForm({ Nombre: data.Nombre, PasswordHash: "" });
        if (data.FotoUrl) setPreview(data.FotoUrl);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      }
    };
    fetchUsuario();
  }, [user]);

  // Cargar últimas compras
  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const todos = await getPedidos();
        const mias = todos
          .filter(
            (p) => p.CompradorId === user?.id || p.Usuario?.Id === user?.id,
          )
          .sort((a, b) => b.Id - a.Id)
          .slice(0, 3);
        setUltimasCompras(mias);
      } catch {}
    };
    if (user?.id) fetchCompras();
  }, [user]);

  // Cargar saldo de ganancias
  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const todos = await getPedidos();
        const ganado = todos
          .filter((p) => p.Estado === "Entregado")
          .flatMap((p) =>
            (p.Detalles || []).map((d) => ({ ...d, pedidoEstado: p.Estado })),
          )
          .filter((d) => d.Producto?.VendedorId === user?.id)
          .reduce((acc, d) => acc + Number(d.Subtotal), 0);
        setSaldoGanancias(ganado);
      } catch {}
    };
    if (user?.id) fetchSaldo();
  }, [user]);

  const handleImagen = () => setCropperOpen(true);
  const handleCropDone = (file, preview) => {
    setImagenFile(file);
    setPreview(preview);
    setCropperOpen(false);
  };

  const handleGuardar = async () => {
    setLoading(true);
    setMensaje("");
    try {
      const payload = { Nombre: form.Nombre };
      if (form.PasswordHash.trim() !== "")
        payload.PasswordHash = form.PasswordHash;
      const actualizado = await updateUsuario(user.id, payload);
      setUsuario(actualizado);
      if (imagenFile) {
        const res = await updateFotoUsuario(user.id, imagenFile);
        setPreview(res.FotoUrl);
        setUsuario((prev) => ({ ...prev, FotoUrl: res.FotoUrl }));
      }
      setMensaje("¡Perfil actualizado correctamente!");
      setTimeout(() => {
        setModalOpen(false);
        setMensaje("");
        setImagenFile(null);
      }, 1500);
    } catch (err) {
      setMensaje(err.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  const colorBadge = (estado) =>
    ({
      Pendiente: { bg: "#fff3cd", color: "#856404" },
      Enviado: { bg: "#cce5ff", color: "#004085" },
      Entregado: { bg: "#d4edda", color: "#155724" },
      Cancelado: { bg: "#f8d7da", color: "#721c24" },
    })[estado] || { bg: "#eee", color: "#555" };

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
                <p className="perfil-nombre">
                  {usuario?.Nombre || "Cargando..."}
                </p>
                <p className="perfil-email">
                  {usuario?.Email || user?.email || "Cargando..."}
                </p>
              </div>
              <button className="edit-btn" onClick={() => setModalOpen(true)}>
                ✏
              </button>
            </div>
          </div>

          {/* Card últimas compras */}
          <div className="compras-card">
            <h4>Ultimas Compras</h4>
            {ultimasCompras.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>
                No hay compras todavía
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {ultimasCompras.map((p) => {
                  const nombres = (p.Detalles || [])
                    .map((d) => d.Producto?.Nombre || `#${d.ProductoId}`)
                    .join(", ");
                  const badge = colorBadge(p.Estado);
                  return (
                    <div
                      key={p.Id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                        gap: "8px",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#07393c",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          #{p.Id} · {nombres || "—"}
                        </p>
                        <p
                          style={{ margin: 0, fontSize: "11px", color: "#aaa" }}
                        >
                          ${Number(p.Total).toLocaleString("es-CO")} COP
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: badge.bg,
                          color: badge.color,
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
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
          <h1 className="saldo-total">
            ${saldoGanancias.toLocaleString("es-CO")} COP
          </h1>
          <div className="saldo-item">
            <div>
              <p className="saldo-title">Saldo De Ganancias</p>
              <span className="saldo-desc">
                Saldo obtenido de las ventas realizadas
              </span>
            </div>
            <div className="saldo-right">
              <span className="saldo-value">
                ${saldoGanancias.toLocaleString("es-CO")} COP
              </span>
            </div>
          </div>
        </div>
      </div>

      {cropperOpen && (
        <ImageCropper
          aspect={1}
          circular={true}
          onCropDone={handleCropDone}
          onCancel={() => setCropperOpen(false)}
        />
      )}

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "32px",
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <h3 style={{ margin: 0, color: "#07393c" }}>Editar Perfil</h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <IconoPerfil src={preview || usuario?.FotoUrl} />
              <button
                type="button"
                onClick={handleImagen}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #07393c",
                  color: "#07393c",
                  cursor: "pointer",
                  fontSize: "13px",
                  background: "white",
                }}
              >
                Cambiar foto
              </button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontSize: "13px", color: "#555" }}>Nombre</label>
              <input
                value={form.Nombre}
                onChange={(e) => setForm({ ...form, Nombre: e.target.value })}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontSize: "13px", color: "#555" }}>
                Nueva Contraseña{" "}
                <span style={{ color: "#aaa" }}>
                  (dejar vacío para no cambiar)
                </span>
              </label>
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={form.PasswordHash}
                onChange={(e) =>
                  setForm({ ...form, PasswordHash: e.target.value })
                }
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>

            {mensaje && (
              <p
                style={{
                  color: mensaje.includes("Error") ? "#ff6b6b" : "#07393c",
                  fontSize: "13px",
                  margin: 0,
                }}
              >
                {mensaje}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setModalOpen(false);
                  setImagenFile(null);
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#07393c",
                  color: "white",
                  cursor: "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
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
