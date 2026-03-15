import React, { useState } from "react";
import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";
import Footer from "../components/layouts/Footer";
import "../styles/Checkout.css";

function Checkout() {

  const [direccion, setDireccion] = useState("");
  const [pago, setPago] = useState("efectivo");

  const productos = [
    { id: 1, nombre: "Tomate", precio: 2500, cantidad: 2 },
    { id: 2, nombre: "Papa", precio: 1800, cantidad: 1 }
  ];

  const total = productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const confirmarPedido = () => {
    alert("Pedido realizado correctamente");
  };

  return (
    <>
      <Navbar />
      <Categorias />

      <div className="checkout-page">

        {/* RESUMEN */}
        <div className="resumen">

          <h2>Resumen del pedido</h2>

          {productos.map((p) => (
            <div key={p.id} className="producto-resumen">
              <span>{p.nombre}</span>
              <span>{p.cantidad} x {p.precio} COP</span>
            </div>
          ))}

          <div className="total">
            Total: {total} COP
          </div>

        </div>

        {/* FORMULARIO */}
        <div className="checkout-form">

          <h2>Datos de envío</h2>

          <input
            type="text"
            placeholder="Dirección de entrega"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />

          <h2>Método de pago</h2>

          <select
            value={pago}
            onChange={(e) => setPago(e.target.value)}
          >
            <option value="efectivo">Pago contra entrega</option>
            <option value="transferencia">Transferencia bancaria</option>
            <option value="tarjeta">Tarjeta</option>
          </select>

          <button className="confirmar-btn" onClick={confirmarPedido}>
            Confirmar pedido
          </button>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default Checkout;