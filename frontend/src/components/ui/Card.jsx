import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Card.css";

function Card({ item }) {
  const navigate = useNavigate();

  const goToProduct = () => {
    navigate("/producto", { state: item });
  };

  return (
    <div className="card" onClick={goToProduct}>
      <img
        src={item.img}
        alt={item.titulo}
        className="card-image"
      />

      <div className="card-content">
        <h3 className="card-title">{item.titulo}</h3>
        <p className="card-desde">Desde</p>
        <p className="card-price">
          $ {item.precio} <span className="card-unit">kg</span>
        </p>
        <p className="card-discount">
          {item.descuento} Descuento
        </p>
        <button
          className="card-comprar-btn"
          onClick={(e) => { e.stopPropagation(); goToProduct(); }}
        >
          Comprar Ahora
        </button>
        <button
          className="card-heart-btn"
          onClick={(e) => e.stopPropagation()}
        >
          ❤️
        </button>
      </div>
    </div>
  );
}

export default Card;