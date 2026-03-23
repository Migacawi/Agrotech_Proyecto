import React, { useState } from "react";
import "../../styles/Categorias.css";
import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
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
            <Link to="/ver-todo">Ver Todo</Link>
          </li>
          <li>
            <Link to="/añadir-producto">Vender</Link>
          </li>
          <li className="oferta-pill">Ofertas Flash</li>
          <li>
            <Link to="/">Inicio</Link>
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
