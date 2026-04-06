import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import AdminUsuariosTable from "../components/layouts/AdminUsuariosTable";
import AdminUsuarioModal from "../components/layouts/AdminUsuarioModal";
import "../styles/Perfil.css";
import Swal from "sweetalert2";

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
      Swal.fire({
        icon: "success",
        title: "¡Usuario actualizado!",
        text: "Los cambios fueron guardados correctamente.",
        confirmButtonColor: "#07393c",
        background: "#062e2f",
        color: "#e8f5f0",
      });
    } catch (err) {
      setMensaje(err.message || "Error al actualizar");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4d4d",
      cancelButtonColor: "#07393c",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#062e2f",
      color: "#e8f5f0",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUsuario(id);
      setUsuarios(usuarios.filter((u) => u.Id !== id));
      Swal.fire({
        icon: "success",
        title: "Usuario eliminado",
        confirmButtonColor: "#07393c",
        background: "#062e2f",
        color: "#e8f5f0",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo eliminar el usuario.",
        confirmButtonColor: "#07393c",
        background: "#062e2f",
        color: "#e8f5f0",
      });
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
