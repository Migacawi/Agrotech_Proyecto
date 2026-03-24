import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/CategoriasHome.css";

const CATEGORIAS = [
  { nombre: "Todas las ofertas", ruta: "/ver-todo" },
  { nombre: "Frutas",            ruta: "/ver-todo?categoria=Frutas" },
  { nombre: "Verduras",          ruta: "/ver-todo?categoria=Verduras" },
  { nombre: "Granos",            ruta: "/ver-todo?categoria=Granos" },
  { nombre: "Tuberculos",        ruta: "/ver-todo?categoria=Tuberculos" },
  { nombre: "Fertilizantes",     ruta: "/ver-todo?categoria=Fertilizantes" },
];

function CategoriasHome({ open, onClose }) {
  const navigate = useNavigate();

  const handleClick = (ruta) => {
    onClose();
    navigate(ruta);
  };

  return (
    <>
      {open && (
        <div className="categorias-overlay" onClick={onClose} />
      )}

      <div className={`categorias-panel ${open ? "open" : ""}`}>

        <div className="categorias-panel-header">
          <span>Categorías</span>
          <button className="categorias-close" onClick={onClose}>✕</button>
        </div>

        <ul className="categorias-panel-list">
          {CATEGORIAS.map((cat) => (
            <li
              key={cat.nombre}
              className="categorias-panel-item"
              onClick={() => handleClick(cat.ruta)}
            >
              <span>{cat.nombre}</span>
              <span className="categorias-arrow">›</span>
            </li>
          ))}
        </ul>

      </div>
    </>
  );
}

export default CategoriasHome;