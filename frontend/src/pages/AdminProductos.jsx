import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import AdminProductosTable from "../components/layouts/AdminProductosTable";
import AdminProductoModal from "../components/layouts/AdminProductoModal";
import "../styles/Perfil.css";

import {
  getProductos,
  updateProducto,
  deleteProducto,
} from "../api/productosService";

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [form, setForm] = useState({
    Nombre: "",
    Categoria: "",
    PrecioPorLibra: "",
    StockLibras: "",
    Descripcion: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (producto) => {
    setProductoEdit(producto);
    setForm({
      Nombre: producto.Nombre,
      Categoria: producto.Categoria,
      PrecioPorLibra: producto.PrecioPorLibra,
      StockLibras: producto.StockLibras,
      Descripcion: producto.Descripcion || "",
    });
    setMensaje("");
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    setLoadingEdit(true);
    setMensaje("");
    try {
      await updateProducto(productoEdit.Id, {
        Nombre: form.Nombre,
        Categoria: form.Categoria,
        PrecioPorLibra: Number(form.PrecioPorLibra),
        StockLibras: Number(form.StockLibras),
        Descripcion: form.Descripcion,
      });
      setMensaje("¡Producto actualizado!");
      fetchProductos();
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
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await deleteProducto(id);
      setProductos(productos.filter((p) => p.Id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar");
    }
  };

  return (
    <div className="perfil-page">
      <NavbarPerfil />
      <Sidebar />

      <div className="perfil-content">
        <h3 className="section-title">GESTIÓN DE PRODUCTOS</h3>

        {loading && <p style={{ color: "#07393c" }}>Cargando productos...</p>}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        {!loading && !error && (
          <AdminProductosTable
            productos={productos}
            onEditar={abrirModal}
            onEliminar={handleEliminar}
          />
        )}

        {modalOpen && (
          <AdminProductoModal
            form={form}
            setForm={setForm}
            onGuardar={handleGuardar}
            onCancelar={() => setModalOpen(false)}
            loading={loadingEdit}
            mensaje={mensaje}
            mostrarImagen={false} // ← admin no ve imagen
          />
        )}
      </div>
    </div>
  );
}

export default AdminProductos;
