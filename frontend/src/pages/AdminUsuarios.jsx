import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import AdminUsuariosTable from "../components/layouts/AdminUsuariosTable";
import AdminUsuarioModal from "../components/layouts/AdminUsuarioModal";
import "../styles/Perfil.css";
import { toastExito, toastError, exito, error, confirmarEliminar } from "../utils/swal";

import {
  getUsuarios,
  updateUsuario,
  deleteUsuario,
} from "../api/usuariosService";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [form, setForm] = useState({ Nombre: "", Email: "" });
  const [mensaje, setMensaje] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      await updateUsuario(usuarioEdit.Id, {
        Nombre: form.Nombre,
        Email: form.Email,
      });
      setModalOpen(false);
      setMensaje("");
      fetchUsuarios();
      toastExito('¡Usuario actualizado!', 'Los cambios fueron guardados.');
    } catch (err) {
      setMensaje(err.message || "Error al actualizar");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleEliminar = async (id) => {
    const usuario = usuarios.find(u => u.Id === id);
    const ok = await confirmarEliminar(usuario?.Nombre || `usuario #${id}`);
    if (!ok) return;

    try {
      await deleteUsuario(id);
      setUsuarios(usuarios.filter((u) => u.Id !== id));
      toastExito('Usuario eliminado');
    } catch (err) {
      toastError('Error', err.message || 'No se pudo eliminar el usuario.');
    }
  };

  return (
    <div className="perfil-page">
      <NavbarPerfil onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="perfil-content">
        <h3 className="section-title">GESTIÓN DE USUARIOS</h3>

        {loading && <p style={{ color: "#07393c" }}>Cargando usuarios...</p>}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        {!loading && !error && (
          <AdminUsuariosTable
            usuarios={usuarios}
            onEditar={abrirModal}
            onEliminar={handleEliminar}
            onActualizar={fetchUsuarios}
          />
        )}

        {modalOpen && (
          <AdminUsuarioModal
            form={form}
            setForm={setForm}
            onGuardar={handleGuardar}
            onCancelar={() => setModalOpen(false)}
            loading={loadingEdit}
            mensaje={mensaje}
          />
        )}
      </div>
    </div>
  );
}

export default AdminUsuarios;