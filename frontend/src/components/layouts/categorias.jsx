import React, { useState } from "react";
import "../../styles/Categorias.css";
import { FaBars } from "react-icons/fa"; // icono de línea/hamburger

function Categorias() {
  const [open, setOpen] = useState(false); // control del menú en móvil

  const toggleMenu = () => setOpen(!open);

  return (
    <nav className="categorias-bar">
      
      {/* Icono línea/hamburger visible en móvil */}
      <div className="linea-icon" onClick={toggleMenu}>
        <FaBars />
      </div>

      <ul className={`categorias-container ${open ? "open" : ""}`}>
        <li>Categorias</li>
        <li>Fertilizantes</li>
        <li>Comprar</li>
        <li>Vender</li>
        <li className="oferta-pill">Ofertas Flash</li>
        <li>Fertilizantes</li>
        <li>Salir</li>
      </ul>
    </nav>
  );
}

export default Categorias;