import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/BotonVt.css";

function BotonVt({ texto = "Ver todo" }) {

  const navigate = useNavigate();

  return (
    <button
      className="boton-vt"
      onClick={() => navigate("/ver-todo")}
    >
      {texto}
    </button>
  );
}

export default BotonVt;
