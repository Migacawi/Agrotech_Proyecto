import React, { useState, useEffect } from "react";
import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";
import SidebarFiltro from "../components/layouts/SidebarFiltro";
import Card from "../components/ui/Card";
import "../styles/VerTodo.css";
import Footer from "../components/layouts/Footer";
import { useSearchParams } from "react-router-dom";

import { getProductos } from "../api/productosService";

const PRODUCTOS_POR_PAGINA = 20;

function VerTodo() {
  const [productos, setProductos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagina, setPagina] = useState(1);
  const params = new URLSearchParams(location.search);
  const categoria = params.get("categoria");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);

        const categoriaURL = searchParams.get("categoria");
        const ofertasURL = searchParams.get("ofertas");

        let resultado = [...data];

        if (categoriaURL) {
          resultado = resultado.filter(
            (p) => p.Categoria?.toLowerCase() === categoriaURL.toLowerCase(),
          );
        }

        if (ofertasURL === "true") {
          resultado = resultado.filter(
            (p) => Number(p.PrecioOriginal) > Number(p.PrecioPorLibra),
          );
        }

        setFiltrados(resultado);
      } catch (err) {
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [searchParams]);

  const handleFiltrar = ({ categorias, precioMin, precioMax, soloOfertas }) => {
    let resultado = [...productos];

    if (soloOfertas) {
      resultado = resultado.filter(
        (p) => Number(p.PrecioOriginal) > Number(p.PrecioPorLibra),
      );
    }

    if (categorias.length > 0) {
      resultado = resultado.filter((p) =>
        categorias.some((c) => c.toLowerCase() === p.Categoria?.toLowerCase()),
      );
    }

    if (precioMin !== "") {
      resultado = resultado.filter(
        (p) => Number(p.PrecioPorLibra) >= Number(precioMin),
      );
    }

    if (precioMax !== "") {
      resultado = resultado.filter(
        (p) => Number(p.PrecioPorLibra) <= Number(precioMax),
      );
    }

    setFiltrados(resultado);
    setPagina(1);
  };

  const adaptarProducto = (p) => {
    const precioActual = Number(p.PrecioPorLibra);
    const precioOriginal = Number(p.PrecioOriginal) || precioActual;
    const descuento =
      precioOriginal > precioActual
        ? Math.round(((precioOriginal - precioActual) / precioOriginal) * 100)
        : 0;

    const imagenPrincipal =
      p.Imagenes?.find((i) => i.EsPrincipal)?.UrlImagen ||
      p.Imagenes?.[0]?.UrlImagen ||
      "https://images.unsplash.com/photo-1464965911861-74ce9de9ce19";

    return {
      id: p.Id,
      titulo: p.Nombre,
      precio: precioActual,
      precioOriginal: precioOriginal,
      descuento: descuento > 0 ? `${descuento}%` : "0%",
      descuentoPorcentaje: descuento,
      img: imagenPrincipal,
      stock: p.StockLibras,
      descripcionCorta: p.Descripcion,
      region: "Colombia",
      envio: "A convenir",
    };
  };

  const totalPaginas = Math.ceil(filtrados.length / PRODUCTOS_POR_PAGINA);
  const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
  const productosPagina = filtrados.slice(
    inicio,
    inicio + PRODUCTOS_POR_PAGINA,
  );

  const irAPagina = (num) => {
    setPagina(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categoriaActual = searchParams.get("categoria");
  const esOfertas = searchParams.get("ofertas") === "true";

  return (
    <div className="ver-todo-page">
      <Navbar />
      <Categorias />

      <div className="results-header-container">
        <div className="text-group-left">
          <p className="breadcrumb-text">
            Tienda &gt;{" "}
            {esOfertas
              ? "Ofertas Flash"
              : categoriaActual || "Todos los productos"}
          </p>
          <h2 className="results-count">
            {esOfertas
              ? `🔥 Ofertas Flash — ${filtrados.length} productos`
              : categoriaActual
                ? `${categoriaActual} — ${filtrados.length} productos`
                : "¡Compra las mejores frutas y verduras!"}
          </h2>
        </div>
        <span className="results-filter">Popularidad: los mas populares ▽</span>
      </div>

      <div className="main-content-wrapper">
        <SidebarFiltro productos={productos} onFiltrar={handleFiltrar} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <main
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            {loading && (
              <p
                style={{
                  color: "#74e2d7",
                  padding: "20px",
                  gridColumn: "span 4",
                }}
              >
                Cargando productos...
              </p>
            )}
            {error && (
              <p
                style={{
                  color: "#ff6b6b",
                  padding: "20px",
                  gridColumn: "span 4",
                }}
              >
                {error}
              </p>
            )}
            {!loading && !error && filtrados.length === 0 && (
              <p
                style={{ color: "#aaa", padding: "20px", gridColumn: "span 4" }}
              >
                No hay productos con esos filtros.
              </p>
            )}
            {!loading &&
              !error &&
              productosPagina.map((p) => (
                <Card key={p.Id} item={adaptarProducto(p)} />
              ))}
          </main>

          {!loading && totalPaginas > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                paddingBottom: "20px",
              }}
            >
              <button
                onClick={() => irAPagina(pagina - 1)}
                disabled={pagina === 1}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #74e2d7",
                  background: "transparent",
                  color: "#74e2d7",
                  cursor: pagina === 1 ? "not-allowed" : "pointer",
                  opacity: pagina === 1 ? 0.4 : 1,
                }}
              >
                ← Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => irAPagina(num)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "1px solid #74e2d7",
                      background: pagina === num ? "#74e2d7" : "transparent",
                      color: pagina === num ? "#07393C" : "#74e2d7",
                      cursor: "pointer",
                      fontWeight: pagina === num ? "bold" : "normal",
                    }}
                  >
                    {num}
                  </button>
                ),
              )}

              <button
                onClick={() => irAPagina(pagina + 1)}
                disabled={pagina === totalPaginas}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #74e2d7",
                  background: "transparent",
                  color: "#74e2d7",
                  cursor: pagina === totalPaginas ? "not-allowed" : "pointer",
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
