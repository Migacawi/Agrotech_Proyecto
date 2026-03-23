import React, { useState, useEffect } from "react";
import Navbar from "../components/layouts/Navbar";
import Card from "../components/ui/Card";
import Categorias from "../components/layouts/categorias";
import "../styles/AgrotechHome.css";
import BotonVt from "../components/ui/BotonVt";
import Footer from "../components/layouts/Footer";

import { getProductos } from "../api/productosService";

function AgrotechHome() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [indice, setIndice] = useState(0);
  const [indice2, setIndice2] = useState(0);

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

  // Rota ofertas cada 10 segundos
  useEffect(() => {
    if (productos.length <= 5) return;
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 5) % productos.length);
    }, 10000);
    return () => clearInterval(intervalo);
  }, [productos]);

  // Rota más vendidos cada 10 segundos (desfasado)
  useEffect(() => {
    if (productos.length <= 5) return;
    const intervalo = setInterval(() => {
      setIndice2((prev) => (prev + 5) % productos.length);
    }, 10000);
    return () => clearInterval(intervalo);
  }, [productos]);

  const adaptarProducto = (p) => {
    const imagenPrincipal =
      p.Imagenes?.find((i) => i.EsPrincipal)?.UrlImagen ||
      p.Imagenes?.[0]?.UrlImagen ||
      "https://images.unsplash.com/photo-1464965911861-74ce9de9ce19";

    return {
      id: p.Id,
      titulo: p.Nombre,
      precio: p.PrecioPorLibra,
      descuento: "0%",
      img: imagenPrincipal,
      stock: p.StockLibras,
      descripcionCorta: p.Descripcion,
      detalles: p.Detalles, // ← agrega esta línea
      region: "Colombia",
      envio: "A convenir",
      descuentoPorcentaje: 0,
    };
  };

  const productosVisibles =
    productos.length > 0
      ? [...productos, ...productos].slice(indice, indice + 5)
      : [];

  const masVendidosVisibles =
    productos.length > 0
      ? [...productos, ...productos].slice(indice2, indice2 + 5)
      : [];

  return (
    <div className="app-container">
      <Navbar />
      <Categorias />

      {/* HERO */}
      <div className="hero-banner">
        <img src="/fondo_main.jpg" alt="Frutas frescas" />
      </div>

      {/* OFERTAS DESTACADAS */}
      <section className="product-section ofertas-bg">
        <div className="section-header">
          <div className="section-title-wrapper">
            <span className="section-pill">🔥 Hot</span>
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

        {!loading && !error && productos.length === 0 && (
          <p style={{ color: "#aaa", textAlign: "center", padding: "20px" }}>
            No hay productos disponibles aún.
          </p>
        )}

        {!loading && !error && productos.length > 0 && (
          <>
            <div className="card-grid">
              {productosVisibles.map((p, i) => (
                <Card key={`oferta-${p.Id}-${i}`} item={adaptarProducto(p)} />
              ))}
            </div>
            <BotonVt />
          </>
        )}
      </section>

      {/* MÁS VENDIDOS */}
      {!loading && !error && productos.length > 0 && (
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
            {masVendidosVisibles.map((p, i) => (
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
