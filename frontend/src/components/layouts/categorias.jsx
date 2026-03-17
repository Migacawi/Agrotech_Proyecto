import React, { useState } from "react";
import "../../styles/Categorias.css";
import { FaBars } from "react-icons/fa"; // icono de línea/hamburger
import { Link } from "react-router-dom";


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
        <li>
          <Link to="/ver-todo">Ver Todo</Link>
        </li>
        <li>
          <Link to="/añadir-producto">Vender</Link>
        </li>

        <li className="oferta-pill">Ofertas Flash</li>
        <li>
          <Link to="/">Inicio</Link>
        </li>

        <li>Cerrar Sesion</li>
      </ul>
    </nav>
  );
}

export default Categorias;