import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import "../styles/Perfil.css";

import useAuthStore from "../store/authStore";
import {
  getUsuarioById,
  updateUsuario,
  updateFotoUsuario,
} from "../api/usuariosService";

// Icono SVG de persona sin foto
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

  useEffect(() => {
    if (!user?.id) return;
    const fetchUsuario = async () => {
      try {
        const data = await getUsuarioById(user.id);
        setUsuario(data);
        setForm({ Nombre: data.Nombre, PasswordHash: "" });
        // Si ya tiene foto guardada la muestra
        if (data.FotoUrl) setPreview(data.FotoUrl);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      }
    };
    fetchUsuario();
  }, [user]);

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleGuardar = async () => {
    setLoading(true);
    setMensaje("");
    try {
      // 1. Actualizar nombre y/o contraseña
      const payload = { Nombre: form.Nombre };
      if (form.PasswordHash.trim() !== "") {
        payload.PasswordHash = form.PasswordHash;
      }
      const actualizado = await updateUsuario(user.id, payload);
      setUsuario(actualizado);

      // 2. Si hay imagen nueva, subirla
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

  return (
    <div className="perfil-page">
      <NavbarPerfil />
      <Sidebar />
      <div className="perfil-content">
        <h3 className="section-title">INFORMACION GENERAL</h3>
        <div className="perfil-grid">
          {/* PERFIL */}
          <div className="perfil-card">
            <h4>PERFIL</h4>
            <div className="perfil-info">
              {/* Muestra foto guardada o icono por defecto */}
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

          {/* ULTIMAS COMPRAS */}
          <div className="compras-card">
            <h4>Ultimas Compras</h4>
            <p>No hay compras todavia</p>
          </div>
        </div>

        {/* SALDO */}
        <div className="saldo-section">
          <h4>Saldo Total</h4>
          <h1 className="saldo-total">0,00 COP</h1>
          <div className="saldo-item">
            <div>
              <p className="saldo-title">Saldo De Regalo</p>
              <span className="saldo-desc">
                Saldo obtenido de tarjetas de regalo
              </span>
            </div>
            <div className="saldo-right">
              <span className="saldo-value">0,00 COP</span>
              <button className="saldo-btn">+</button>
            </div>
          </div>
          <div className="saldo-item">
            <div>
              <p className="saldo-title">Saldo De Ganancias</p>
              <span className="saldo-desc">
                Saldo obtenido de las ventas realizadas
              </span>
            </div>
            <div className="saldo-right">
              <span className="saldo-value">0,00 COP</span>
              <button className="saldo-btn">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
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

            {/* IMAGEN */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <IconoPerfil src={preview || usuario?.FotoUrl} />
              <label
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #07393c",
                  color: "#07393c",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Cambiar foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagen}
                  hidden
                />
              </label>
            </div>

            {/* NOMBRE */}
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

            {/* CONTRASEÑA */}
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
