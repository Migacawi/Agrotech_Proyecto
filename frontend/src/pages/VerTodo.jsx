import React, { useState, useEffect } from 'react';
import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";
import SidebarFiltro from "../components/layouts/SidebarFiltro"; 
import Card from "../components/ui/Card";
import "../styles/VerTodo.css";
import Footer from "../components/layouts/Footer";

import { getProductos } from '../api/productosService';

const PRODUCTOS_POR_PAGINA = 20; // 4 columnas x 5 filas

function VerTodo() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [pagina, setPagina]       = useState(1);

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

  const totalPaginas   = Math.ceil(productos.length / PRODUCTOS_POR_PAGINA);
  const inicio         = (pagina - 1) * PRODUCTOS_POR_PAGINA;
  const productosPagina = productos.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);

  const irAPagina = (num) => {
    setPagina(num);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ver-todo-page">
      <Navbar />
      <Categorias />

      {/* Encabezado */}
      <div className="results-header-container">
        <div className="text-group-left">
          <p className="breadcrumb-text">Tienda &gt; Frutas y verduras</p>
          <h2 className="results-count">¡Compra las mejores frutas y verduras!</h2>
        </div>  
        <span className="results-filter">Popularidad: los mas populares ▽</span>
      </div>

      {/* Contenido principal */}
      <div className="main-content-wrapper">
        <SidebarFiltro />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px' }}>

          <main style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}>

            {loading && (
              <p style={{ color: '#74e2d7', padding: '20px', gridColumn: 'span 4' }}>
                Cargando productos...
              </p>
            )}

            {error && (
              <p style={{ color: '#ff6b6b', padding: '20px', gridColumn: 'span 4' }}>
                {error}
              </p>
            )}

            {!loading && !error && productos.length === 0 && (
              <p style={{ color: '#aaa', padding: '20px', gridColumn: 'span 4' }}>
                No hay productos disponibles aún.
              </p>
            )}

            {!loading && !error && productosPagina.map((p) => (
              <Card key={p.Id} item={adaptarProducto(p)} />
            ))}

          </main>

          {/* Paginación */}
          {!loading && totalPaginas > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              paddingBottom: '20px'
            }}>

              <button
                onClick={() => irAPagina(pagina - 1)}
                disabled={pagina === 1}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #74e2d7',
                  background: 'transparent',
                  color: '#74e2d7',
                  cursor: pagina === 1 ? 'not-allowed' : 'pointer',
                  opacity: pagina === 1 ? 0.4 : 1,
                }}
              >
                ← Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => irAPagina(num)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #74e2d7',
                    background: pagina === num ? '#74e2d7' : 'transparent',
                    color: pagina === num ? '#07393C' : '#74e2d7',
                    cursor: 'pointer',
                    fontWeight: pagina === num ? 'bold' : 'normal',
                  }}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => irAPagina(pagina + 1)}
                disabled={pagina === totalPaginas}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #74e2d7',
                  background: 'transparent',
                  color: '#74e2d7',
                  cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer',
                  opacity: pagina === totalPaginas ? 0.4 : 1,
                }}
              >
                Siguiente →
              </button>

            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default VerTodo;