import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/BotonVt.css";

function BotonVt({ texto = "Ver todo" }) {

  const navigate = useNavigate();

  return (
    <div className="boton-vt-container">
      <button
        className="boton-vt"
        onClick={() => navigate("/ver-todo")}
      >
        {texto}
      </button>
    </div>
  );
}

export default BotonVt;