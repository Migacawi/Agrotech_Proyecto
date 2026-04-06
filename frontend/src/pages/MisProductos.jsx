import React, { useEffect, useState } from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import AdminProductosTable from "../components/layouts/AdminProductosTable";
import AdminProductoModal from "../components/layouts/AdminProductoModal";
import "../styles/Perfil.css";
import { subirImagenes, setPrincipal } from "../api/imagenesService";

import { getProductos, updateProducto } from "../api/productosService";
import useAuthStore from "../store/authStore";

function MisProductos() {
  const { user } = useAuthStore();

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
  const [precioOriginal, setPrecioOriginal] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, [user]);

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      // Filtra solo los productos del vendedor autenticado
      const misProd = data.filter((p) => p.VendedorId === user?.id);
      setProductos(misProd);
    } catch (err) {
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (producto) => {
    setProductoEdit(producto);
    setPrecioOriginal(Number(producto.PrecioPorLibra));
    setForm({
      Nombre: producto.Nombre,
      Categoria: producto.Categoria,
      PrecioPorLibra: producto.PrecioPorLibra,
      StockLibras: producto.StockLibras,
      Descripcion: producto.Descripcion || "",
      imagenActual:
        producto.Imagenes?.find((i) => i.EsPrincipal)?.UrlImagen ||
        producto.Imagenes?.[0]?.UrlImagen ||
        null,
      imagenFile: null,
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

      // Si hay imagen nueva la sube
      if (form.imagenFile) {
        // Sube la nueva imagen
        const nuevasImagenes = await subirImagenes(productoEdit.Id, [
          form.imagenFile,
        ]);

        // Marca la nueva como principal
        if (nuevasImagenes?.imagenes?.[0]?.Id) {
          await setPrincipal(nuevasImagenes.imagenes[0].Id);
        }
      }

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

  // Calcula el descuento si el precio nuevo es menor al original
  const precioNuevo = Number(form.PrecioPorLibra);
  const descuento =
    precioOriginal > 0 && precioNuevo < precioOriginal
      ? Math.round(((precioOriginal - precioNuevo) / precioOriginal) * 100)
      : 0;

  return (
    <div className="perfil-page">
      <NavbarPerfil onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="perfil-content">
        <h3 className="section-title">MIS PRODUCTOS</h3>

        {loading && <p style={{ color: "#07393c" }}>Cargando productos...</p>}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        {!loading && !error && productos.length === 0 && (
          <p style={{ color: "#aaa" }}>No tienes productos publicados aún.</p>
        )}

        {!loading && !error && productos.length > 0 && (
          <AdminProductosTable
            productos={productos}
            onEditar={abrirModal}
            onEliminar={null} // vendedor no puede eliminar, solo admin
          />
        )}

        {modalOpen && (
          <>
            {/* Muestra el descuento calculado arriba del modal */}
            {descuento > 0 && (
              <div
                style={{
                  position: "fixed",
                  top: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#07393c",
                  color: "#74e2d7",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  zIndex: 1001,
                  fontWeight: "bold",
                  fontSize: "14px",
                  border: "1px solid #74e2d7",
                }}
              >
                🏷️ Descuento aplicado: {descuento}% OFF
              </div>
            )}

            <AdminProductoModal
              form={form}
              setForm={setForm}
              onGuardar={handleGuardar}
              onCancelar={() => setModalOpen(false)}
              loading={loadingEdit}
              mensaje={mensaje}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default MisProductos;
