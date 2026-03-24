import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";

import "../styles/DescripcionProduct.css";
import Footer from "../components/layouts/Footer";

import useCartStore from "../store/cartStore";

function DescripcionProduct() {
  const location = useLocation();
  const navigate  = useNavigate();
  const producto  = location.state;

  const { addItem } = useCartStore();

  if (!producto) {
    return (
      <div className="perfil-page">
        <Navbar />
        <Categorias />
        <div className="descripcion-container">
          <p>No hay información del producto</p>
        </div>
      </div>
    );
  }

  const precio              = producto?.precio ?? 0;
  const stock               = producto?.stock ?? 0;
  const descuentoPorcentaje = producto?.descuentoPorcentaje ?? 0;
  const precioDescontado    = precio - (precio * descuentoPorcentaje) / 100;

  const fechaCosechaFormateada = producto.fechaCosecha
    ? new Date(producto.fechaCosecha).toLocaleDateString("es-CO", {
        year:  "numeric",
        month: "long",
        day:   "numeric",
      })
    : null;

  const ofertasVendedor = (producto.todosLosProductos || [])
    .filter(p => p.VendedorId === producto.vendedorId && p.Id !== producto.id)
    .slice(0, 4)
    .map(p => ({
      id:          p.Id,
      nombre:      p.Nombre,
      precio:      p.PrecioPorLibra,
      stock:       p.StockLibras,
      descripcion: p.Descripcion,
      img:
        p.Imagenes?.find(i => i.EsPrincipal)?.UrlImagen ||
        p.Imagenes?.[0]?.UrlImagen ||
        "https://images.unsplash.com/photo-1464965911861-74ce9de9ce19",
    }));

  const handleAgregarCarrito = () => {
    addItem({
      id:     producto.id,
      nombre: producto.titulo,
      precio: precioDescontado,
      imagen: producto.img,
      stock:  stock,
    });
  };

  const navegarAProducto = (idDestino) => {
    const crudo = producto.todosLosProductos.find(p => p.Id === idDestino);
    if (!crudo) return;

    const adaptado = {
      id:                  crudo.Id,
      titulo:              crudo.Nombre,
      precio:              crudo.PrecioPorLibra,
      descuento:           "0%",
      img:
        crudo.Imagenes?.find(i => i.EsPrincipal)?.UrlImagen ||
        crudo.Imagenes?.[0]?.UrlImagen ||
        "https://images.unsplash.com/photo-1464965911861-74ce9de9ce19",
      stock:               crudo.StockLibras,
      descripcionCorta:    crudo.Descripcion,
      detalles:            crudo.Detalles,
      fechaCosecha:        crudo.FechaCosecha,
      vendedorId:          crudo.VendedorId,
      vendedorNombre:      crudo.Usuario?.Nombre || crudo.Usuario?.nombre || "Vendedor",
      region:              "Colombia",
      envio:               "A convenir",
      descuentoPorcentaje: 0,
      todosLosProductos:   producto.todosLosProductos,
    };

    navigate("/producto", { state: adaptado });
  };

  return (
    <div style={{ background: "#07393C", minHeight: "100vh", color: "white" }}>
      <Navbar />
      <Categorias />

      <div className="descripcion-container">
        <div className="descripcion-imagen">
          <img src={producto.img} alt={producto.titulo} />
        </div>

        <div className="descripcion-info">
          <h1 className="producto-titulo">{producto.titulo}</h1>
          <p className="producto-subtitulo">{producto.descripcionCorta}</p>

          <div className="precio-container">
            <span className="precio-oferta">
              ${precioDescontado.toLocaleString()}
            </span>
            {descuentoPorcentaje > 0 && (
              <>
                <span className="precio-original">
                  ${precio.toLocaleString()}
                </span>
                <span className="precio-descuento">
                  {descuentoPorcentaje}% OFF
                </span>
              </>
            )}
          </div>

          <div className="detalles-producto">
            <p>Envio: {producto.envio}</p>
            <p>Disponible: {stock.toLocaleString()} libras</p>
            <p>Region: {producto.region}</p>
            {fechaCosechaFormateada && (
              <p>Fecha de cosecha: {fechaCosechaFormateada}</p>
            )}
            {producto.vendedorNombre && (
              <p>Vendedor: {producto.vendedorNombre}</p>
            )}
          </div>

          <button className="btn-carrito" onClick={handleAgregarCarrito}>
            Anadir Al Carrito - ${precioDescontado.toLocaleString()}
          </button>

          <div className="ofertas-vendedor">
            <h3>Mas productos de este vendedor</h3>
            {ofertasVendedor.length === 0 ? (
              <p style={{ color: "#a0c2c1", fontSize: "0.9rem" }}>
                Este vendedor no tiene otros productos publicados.
              </p>
            ) : (
              ofertasVendedor.map((oferta) => (
                <div
                  key={oferta.id}
                  className="oferta-item"
                  onClick={() => navegarAProducto(oferta.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    cursor: "pointer",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(116, 226, 215, 0.2)",
                  }}
                >
                  <img
                    src={oferta.img}
                    alt={oferta.nombre}
                    style={{
                      width: "55px",
                      height: "55px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "0.95rem" }}>
                      {oferta.nombre}
                    </p>
                    {oferta.descripcion && (
                      <p style={{ margin: 0, color: "#aaa", fontSize: "0.82rem" }}>
                        {oferta.descripcion}
                      </p>
                    )}
                    <p style={{ margin: 0, color: "#74e2d7", fontSize: "0.88rem" }}>
                      ${oferta.precio.toLocaleString()} / libra
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {(producto.descripcionCorta || producto.detalles) && (
        <div className="descripcion-extra">
          {producto.descripcionCorta && (
            <div className="extra-card">
              <h3 className="extra-title">Descripcion</h3>
              <p className="extra-text">{producto.descripcionCorta}</p>
            </div>
          )}
          {producto.detalles && (
            <div className="extra-card">
              <h3 className="extra-title">Detalles Adicionales</h3>
              <p className="extra-text">{producto.detalles}</p>
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default DescripcionProduct;