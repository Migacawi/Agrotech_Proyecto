import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import "../styles/Perfil.css";

import { getUsuarios, updateUsuario, deleteUsuario } from "../api/usuariosService";

function AdminUsuarios() {
  const [usuarios, setUsuarios]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [modalOpen, setModalOpen]     = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [form, setForm]               = useState({ Nombre: "", Email: "" });
  const [mensaje, setMensaje]         = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (usuario) => {
    setUsuarioEdit(usuario);
    setForm({ Nombre: usuario.Nombre, Email: usuario.Email });
    setMensaje("");
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    setLoadingEdit(true);
    setMensaje("");
    try {
      await updateUsuario(usuarioEdit.Id, { Nombre: form.Nombre, Email: form.Email });
      setMensaje("¡Usuario actualizado!");
      fetchUsuarios();
      setTimeout(() => {
        setModalOpen(false);
        setMensaje("");
      }, 1500);
    } catch (err) {
      setMensaje(err.message || "Error al actualizar");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      await deleteUsuario(id);
      setUsuarios(usuarios.filter((u) => u.Id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar");
    }
  };

  return (
    <div className="perfil-page">
      <NavbarPerfil />
      <Sidebar />

      <div className="perfil-content">
        <h3 className="section-title">GESTIÓN DE USUARIOS</h3>

        {loading && <p style={{ color: '#07393c' }}>Cargando usuarios...</p>}
        {error   && <p style={{ color: '#ff6b6b' }}>{error}</p>}

        {!loading && !error && (
          <div style={{ background: 'white', borderRadius: '6px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#07393c', color: 'white' }}>
                <tr>
                  <th style={th}>ID</th>
                  <th style={th}>Nombre</th>
                  <th style={th}>Email</th>
                  <th style={th}>Rol</th>
                  <th style={th}>Registro</th>
                  <th style={th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, i) => (
                  <tr key={u.Id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                    <td style={td}>{u.Id}</td>
                    <td style={td}>{u.Nombre}</td>
                    <td style={td}>{u.Email}</td>
                    <td style={td}>
                      <span style={{
                        background: u.Rol?.Nombre?.toLowerCase() === 'admin' ? '#07393c' : '#e0f0f0',
                        color:      u.Rol?.Nombre?.toLowerCase() === 'admin' ? 'white'   : '#07393c',
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px'
                      }}>
                        {u.Rol?.Nombre || 'Sin rol'}
                      </span>
                    </td>
                    <td style={td}>
                      {u.FechaRegistro
                        ? new Date(u.FechaRegistro).toLocaleDateString('es-CO')
                        : '-'}
                    </td>
                    <td style={{ ...td, display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => abrirModal(u)}
                        style={{
                          padding: '6px 12px', borderRadius: '6px',
                          border: 'none', background: '#07393c',
                          color: 'white', cursor: 'pointer', fontSize: '13px'
                        }}
                      >
                        ✏ Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(u.Id)}
                        style={{
                          padding: '6px 12px', borderRadius: '6px',
                          border: 'none', background: '#ff4d4d',
                          color: 'white', cursor: 'pointer', fontSize: '13px'
                        }}
                      >
                        🗑 Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {usuarios.length === 0 && (
              <p style={{ padding: '20px', color: '#aaa', textAlign: 'center' }}>
                No hay usuarios registrados.
              </p>
            )}
          </div>
        )}
      </div>

      {/* MODAL EDITAR */}
      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white', borderRadius: '12px',
            padding: '32px', width: '100%', maxWidth: '400px',
            display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <h3 style={{ margin: 0, color: '#07393c' }}>Editar Usuario</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#555' }}>Nombre</label>
              <input
                value={form.Nombre}
                onChange={(e) => setForm({ ...form, Nombre: e.target.value })}
                style={{
                  padding: '10px', borderRadius: '8px',
                  border: '1px solid #ccc', fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#555' }}>Email</label>
              <input
                value={form.Email}
                onChange={(e) => setForm({ ...form, Email: e.target.value })}
                style={{
                  padding: '10px', borderRadius: '8px',
                  border: '1px solid #ccc', fontSize: '14px'
                }}
              />
            </div>

            {mensaje && (
              <p style={{
                color: mensaje.includes('Error') ? '#ff6b6b' : '#07393c',
                fontSize: '13px', margin: 0
              }}>
                {mensaje}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  padding: '10px 20px', borderRadius: '8px',
                  border: '1px solid #ccc', background: 'white', cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={loadingEdit}
                style={{
                  padding: '10px 20px', borderRadius: '8px',
                  border: 'none', background: '#07393c',
                  color: 'white', cursor: 'pointer',
                  opacity: loadingEdit ? 0.7 : 1
                }}
              >
                {loadingEdit ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Estilos de tabla
const th = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: 'bold',
};

const td = {
  padding: '12px 16px',
  fontSize: '14px',
  borderBottom: '1px solid #f0f0f0',
};

export default AdminUsuarios;