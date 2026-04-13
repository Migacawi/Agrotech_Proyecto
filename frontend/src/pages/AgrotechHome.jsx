import React, { useState, useEffect } from "react";
import Navbar from "../components/layouts/Navbar";
import Card from "../components/ui/Card";
import Categorias from "../components/layouts/categorias";
import "../styles/AgrotechHome.css";
import BotonVt from "../components/ui/BotonVt";
import Footer from "../components/layouts/Footer";

import { getProductos } from "../api/productosService";
import { FaFire } from "react-icons/fa";

function AgrotechHome() {
  const [productos, setProductos]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const [indiceOfertas, setIndiceOfertas]   = useState(0);
  const [indiceVendidos, setIndiceVendidos] = useState(0);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Separar productos con oferta y sin oferta
  const productosConOferta = productos.filter(
    (p) => Number(p.PrecioOriginal) > Number(p.PrecioPorLibra)
  );
  const productosSinOferta = productos.filter(
    (p) => !(Number(p.PrecioOriginal) > Number(p.PrecioPorLibra))
  );

  // Carrusel Ofertas Destacadas
  useEffect(() => {
    if (productosConOferta.length <= 5) return;
    const intervalo = setInterval(() => {
      setIndiceOfertas((prev) => (prev + 5) % productosConOferta.length);
    }, 10000);
    return () => clearInterval(intervalo);
  }, [productosConOferta.length]);

  // Carrusel Más Vendidos
  useEffect(() => {
    if (productosSinOferta.length <= 5) return;
    const intervalo = setInterval(() => {
      setIndiceVendidos((prev) => (prev + 5) % productosSinOferta.length);
    }, 10000);
    return () => clearInterval(intervalo);
  }, [productosSinOferta.length]);

  const adaptarProducto = (p) => {
    const precioActual   = Number(p.PrecioPorLibra);
    const precioOriginal = Number(p.PrecioOriginal) || precioActual;
    const descuento      = precioOriginal > precioActual
      ? Math.round(((precioOriginal - precioActual) / precioOriginal) * 100)
      : 0;

    const imagenPrincipal =
      p.Imagenes?.find((i) => i.EsPrincipal)?.UrlImagen ||
      p.Imagenes?.[0]?.UrlImagen ||
      'https://images.unsplash.com/photo-1464965911861-74ce9de9ce19';

    return {
      id:                  p.Id,
      titulo:              p.Nombre,
      precio:              precioActual,
      precioOriginal:      precioOriginal,
      descuento:           descuento > 0 ? `${descuento}%` : '0%',
      descuentoPorcentaje: descuento,
      img:                 imagenPrincipal,
      stock:               p.StockLibras,
      descripcionCorta:    p.Descripcion,
      fechaCosecha:        p.FechaCosecha || null,
      vendedorId:          p.VendedorId,
      vendedorNombre:      p.Usuario?.Nombre || 'Vendedor',
      region:              'Colombia',
      envio:               'A convenir',
      todosLosProductos:   productos,
    };
  };

  // Slices circulares para cada sección
  const ofertasVisibles =
    productosConOferta.length > 0
      ? [...productosConOferta, ...productosConOferta].slice(indiceOfertas, indiceOfertas + 5)
      : [];

  const vendidosVisibles =
    productosSinOferta.length > 0
      ? [...productosSinOferta, ...productosSinOferta].slice(indiceVendidos, indiceVendidos + 5)
      : [];

  return (
    <div className="app-container">
      <Navbar />
      <Categorias />

      <div className="hero-banner">
        <img src="/fondo_main.jpg" alt="Frutas frescas" />
      </div>

      {/* ── OFERTAS DESTACADAS ── */}
      <section className="product-section ofertas-bg">
        <div className="section-header">
          <div className="section-title-wrapper">
            <span className="section-pill">
              <FaFire aria-hidden /> Hot
            </span>
            <h2 className="section-title">Ofertas Destacadas</h2>
          </div>
          <p className="section-subtitle">
            Los mejores precios del campo directo a tu mesa
          </p>
        </div>

        {loading && (
          <p style={{ color: "#74e2d7", textAlign: "center", padding: "20px" }}>
            Cargando productos...
          </p>
        )}
        {error && (
          <p style={{ color: "#ff6b6b", textAlign: "center", padding: "20px" }}>
            {error}
          </p>
        )}
        {!loading && !error && productosConOferta.length === 0 && (
          <p style={{ color: "#aaa", textAlign: "center", padding: "20px" }}>
            No hay ofertas disponibles en este momento.
          </p>
        )}

        {!loading && !error && productosConOferta.length > 0 && (
          <>
            <div className="card-grid">
              {ofertasVisibles.map((p, i) => (
                <Card key={`oferta-${p.Id}-${i}`} item={adaptarProducto(p)} />
              ))}
            </div>
            <BotonVt />
          </>
        )}
      </section>

      {/* ── MÁS VENDIDOS ── */}
      {!loading && !error && productosSinOferta.length > 0 && (
        <section className="product-section capacitaciones-bg">
          <div className="section-header">
            <div className="section-title-wrapper">
              <span className="section-pill vendidos">⭐ Top</span>
              <h2 className="section-title">Más Vendidos</h2>
            </div>
            <p className="section-subtitle">
              Los productos favoritos de nuestra comunidad
            </p>
          </div>
          <div className="card-grid">
            {vendidosVisibles.map((p, i) => (
              <Card key={`vendido-${p.Id}-${i}`} item={adaptarProducto(p)} />
            ))}
          </div>
          <BotonVt texto="Ver Todo" />
        </section>
      )}

      <Footer />
    </div>
  );
}

export default AgrotechHome;