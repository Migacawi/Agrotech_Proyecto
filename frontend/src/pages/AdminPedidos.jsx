import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import AdminPedidosTable from "../components/layouts/AdminPedidosTable";
import AdminPedidoModal from "../components/layouts/AdminPedidoModal";
import "../styles/Perfil.css";
import { toastExito, toastError, confirmarEliminar } from "../utils/swal";
import { getPedidos, updatePedido, deletePedido } from "../api/pedidosService";

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSel, setPedidoSel] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const data = await getPedidos();
      setPedidos(data);
    } catch (err) {
      setError("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (pedido) => {
    setPedidoSel(pedido);
    setModalOpen(true);
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    setLoadingEdit(true);
    try {
      await updatePedido(pedidoSel.Id, { Estado: nuevoEstado });
      // Actualizar localmente sin recargar todo
      setPedidos((prev) =>
        prev.map((p) =>
          p.Id === pedidoSel.Id ? { ...p, Estado: nuevoEstado } : p,
        ),
      );
      setPedidoSel((prev) => ({ ...prev, Estado: nuevoEstado }));
      toastExito('Estado actualizado', `El pedido ahora está: ${nuevoEstado}`);
    } catch (err) {
      toastError('Error', err.message || 'No se pudo actualizar el estado.');
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleEliminar = async (id) => {
    const ok = await confirmarEliminar(`pedido #${id}`);
    if (!ok) return;

    try {
      await deletePedido(id);
      setPedidos((prev) => prev.filter((p) => p.Id !== id));
      if (pedidoSel?.Id === id) setModalOpen(false);
      toastExito('Pedido eliminado');
    } catch (err) {
      toastError('Error', err.message || 'No se pudo eliminar el pedido.');
    }
  };

  return (
    <div className="perfil-page">
      <NavbarPerfil onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="perfil-content">
        <h3 className="section-title">GESTIÓN DE PEDIDOS</h3>

        {loading && <p style={{ color: "#07393c" }}>Cargando pedidos...</p>}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        {!loading && !error && (
          <AdminPedidosTable
            pedidos={pedidos}
            onVerDetalle={abrirModal}
            onEliminar={handleEliminar}
          />
        )}

        {modalOpen && pedidoSel && (
          <AdminPedidoModal
            pedido={pedidoSel}
            onCambiarEstado={handleCambiarEstado}
            onCancelar={() => setModalOpen(false)}
            loading={loadingEdit}
          />
        )}
      </div>
    </div>
  );
}

export default AdminPedidos;
