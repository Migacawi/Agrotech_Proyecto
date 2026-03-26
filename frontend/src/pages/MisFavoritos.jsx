import React, { useEffect, useState } from "react";
import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";
import Card from "../components/ui/Card";
import Footer from "../components/layouts/Footer";
import { getProductos } from "../api/productosService";
import useFavoritosStore from "../store/favoritosStore";
import "../styles/MisFavoritos.css";

function MisFavoritos() {
  const { favoritos, limpiarFavoritos } = useFavoritosStore();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data.filter((p) => favoritos.includes(p.Id)));
      } catch (err) {
        setError("No se pudieron cargar los favoritos");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [favoritos]);

  const adaptarProducto = (p) => {
    const precioActual = Number(p.PrecioPorLibra);
    const precioOriginal = Number(p.PrecioOriginal) || precioActual;
    const descuento =
      precioOriginal > precioActual
        ? Math.round(((precioOriginal - precioActual) / precioOriginal) * 100)
        : 0;

    return {
      id: p.Id,
      titulo: p.Nombre,
      precio: precioActual,
      precioOriginal,
      descuento: descuento > 0 ? `${descuento}%` : "0%",
      descuentoPorcentaje: descuento,
      img:
        p.Imagenes?.find((i) => i.EsPrincipal)?.UrlImagen ||
        p.Imagenes?.[0]?.UrlImagen ||
        "https://images.unsplash.com/photo-1464965911861-74ce9de9ce19",
      stock: p.StockLibras,
      descripcionCorta: p.Descripcion,
      region: "Colombia",
      envio: "A convenir",
      vendedorId: p.VendedorId,
      vendedorNombre: p.Usuario?.Nombre || "Vendedor",
      todosLosProductos: [],
    };
  };

  return (
    <div className="favoritos-page">
      <Navbar />
      <Categorias />

      <div className="favoritos-header-container">
        <div className="text-group-left">
          <p className="breadcrumb-text">Tienda &gt; Mis Favoritos</p>
          <h2 className="results-count">
            ❤️ Mis Favoritos — {productos.length} producto
            {productos.length !== 1 ? "s" : ""}
          </h2>
        </div>
        {favoritos.length > 0 && (
          <button className="btn-limpiar-favoritos" onClick={limpiarFavoritos}>
            Limpiar lista
          </button>
        )}
      </div>

      <div className="favoritos-content">
        {loading && <p className="favoritos-estado">Cargando favoritos...</p>}
        {error && <p className="favoritos-estado error">{error}</p>}

        {!loading && !error && favoritos.length === 0 && (
          <div className="favoritos-vacio">
            <span className="favoritos-vacio-icon">🤍</span>
            <h3>Aún no tienes favoritos</h3>
            <p>
              Presiona el corazón en cualquier producto para guardarlo aquí.
            </p>
          </div>
        )}

        {!loading && !error && productos.length > 0 && (
          <div className="favoritos-grid">
            {productos.map((p) => (
              <Card key={p.Id} item={adaptarProducto(p)} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MisFavoritos;
