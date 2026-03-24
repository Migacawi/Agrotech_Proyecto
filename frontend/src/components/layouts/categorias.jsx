import React, { useState } from "react";
import "../../styles/Categorias.css";
import { FaBars } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import CategoriasHome from "./CategoriasHome";
import useAuthStore from "../../store/authStore";

function Categorias() {
  const [open, setOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleMenu = () => setOpen(!open);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <CategoriasHome open={panelOpen} onClose={() => setPanelOpen(false)} />

      <nav className="categorias-bar">
        <div className="linea-icon" onClick={toggleMenu}>
          <FaBars />
        </div>

        <ul className={`categorias-container ${open ? "open" : ""}`}>
          <li onClick={() => setPanelOpen(true)} style={{ cursor: "pointer" }}>
            Categorias
          </li>
          <li>
            <NavLink to="/ver-todo">Ver Todo</NavLink>
          </li>
          <li>
            <NavLink to="/añadir-producto">Vender</NavLink>
          </li>
          <li className="oferta-pill">Ofertas Flash</li>
          <li>
            <NavLink to="/" end>Inicio</NavLink>
          </li>
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>
            Cerrar Sesión
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Categorias;