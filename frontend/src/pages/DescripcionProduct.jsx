import React from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";

import "../styles/DescripcionProduct.css";
import Footer from "../components/layouts/Footer";

import useCartStore from "../store/cartStore";

function DescripcionProduct() {
  const location = useLocation();
  const producto = location.state;

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

  const precio = producto?.precio ?? 0;
  const stock = producto?.stock ?? 0;
  const descuentoPorcentaje = producto?.descuentoPorcentaje ?? 0;
  const precioDescontado = precio - (precio * descuentoPorcentaje) / 100;

  const handleAgregarCarrito = () => {
    addItem({
      id: producto.id,
      nombre: producto.titulo,
      precio: precioDescontado,
      imagen: producto.img,
      stock: stock,
    });
  };

  return (
    <div style={{ background: "#07393C", minHeight: "100vh", color: "white" }}>
      <Navbar />
      <Categorias />

      {/* PARTE SUPERIOR — imagen + info */}
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
            <p>Envío: {producto.envio}</p>
            <p>Disponible: {stock.toLocaleString()} unidades</p>
            <p>Región: {producto.region}</p>
          </div>

          <button className="btn-carrito" onClick={handleAgregarCarrito}>
            🛒 Añadir Al Carrito - ${precioDescontado.toLocaleString()}
          </button>

          <div className="ofertas-vendedor">
            <h3>Ofertas del Vendedor</h3>
            {producto.ofertasVendedor?.map((oferta, idx) => (
              <div key={idx} className="oferta-item">
                <p>
                  <b>{oferta.cantidad}</b> {oferta.producto}
                </p>
                <p className="precio-oferta-vendedor">
                  ${oferta.precio.toLocaleString()}{" "}
                  <span>{oferta.detalle}</span>
                </p>
              </div>
            ))}
            <button className="ver-mas">Ver Mas Ofertas</button>
          </div>
        </div>
      </div>

      {/* PARTE INFERIOR — descripción y detalles */}
      {(producto.descripcionCorta || producto.detalles) && (
        <div className="descripcion-extra">
          {producto.descripcionCorta && (
            <div className="extra-card">
              <h3 className="extra-title">📋 Descripción</h3>
              <p className="extra-text">{producto.descripcionCorta}</p>
            </div>
          )}

          {producto.detalles && (
            <div className="extra-card">
              <h3 className="extra-title">🔍 Detalles Adicionales</h3>
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
