import React from "react";
import "../../styles/Categorias.css";

function Categorias() {
  return (
    <nav className="categorias-bar">

      <ul className="categorias-container">

        <li>Categorias</li>
        <li>Fertilizantes</li>
        <li>Comprar</li>
        <li>Vender</li>

        <li className="oferta-pill">
          Ofertas Flash
        </li>

        <li>Fertilizantes</li>
        <li>Salir</li>

      </ul>

    </nav>
  );
}

export default Categorias;