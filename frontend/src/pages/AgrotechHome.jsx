import React, { useState, useEffect } from 'react';
import Navbar from "../components/layouts/Navbar";
import Card from "../components/ui/Card";
import Categorias from "../components/layouts/categorias";
import "../styles/AgrotechHome.css";
import BotonVt from "../components/ui/BotonVt";
import Footer from "../components/layouts/Footer";

import { getProductos } from '../api/productosService';

function AgrotechHome() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const adaptarProducto = (p) => {
    const imagenPrincipal =
      p.Imagenes?.find((i) => i.EsPrincipal)?.UrlImagen ||
      p.Imagenes?.[0]?.UrlImagen ||
      'https://images.unsplash.com/photo-1464965911861-74ce9de9ce19';

    return {
      id:                  p.Id,
      titulo:              p.Nombre,
      precio:              p.PrecioPorLibra,
      descuento:           '0%',
      img:                 imagenPrincipal,
      stock:               p.StockLibras,
      descripcionCorta:    p.Descripcion,
      region:              'Colombia',
      envio:               'A convenir',
      descuentoPorcentaje: 0,
    };
  };

  return (
    <div className="app-container">

      <Navbar />
      <Categorias />

      {/* HERO */}
      <div className="hero-banner">
        <img src="/fondo_main.jpg" alt="Frutas frescas" />
      </div>

      {/* OFERTAS */}
      <section className="product-section ofertas-bg">

        <h2 className="section-title">Ofertas Destacadas</h2>

        {loading && (
          <p style={{ color: '#74e2d7', textAlign: 'center', padding: '20px' }}>
            Cargando productos...
          </p>
        )}

        {error && (
          <p style={{ color: '#ff6b6b', textAlign: 'center', padding: '20px' }}>
            {error}
          </p>
        )}

        {!loading && !error && productos.length === 0 && (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '20px' }}>
            No hay productos disponibles aún.
          </p>
        )}

        {!loading && !error && productos.length > 0 && (
          <>
            <div className="card-grid">
              {productos.slice(0, 8).map((p) => (
                <Card key={p.Id} item={adaptarProducto(p)} />
              ))}
            </div>
            <BotonVt />
          </>
        )}

      </section>

      <Footer />
    </div>
  );
}

export default AgrotechHome;