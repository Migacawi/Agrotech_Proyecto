import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFire, FaHeart, FaRegHeart } from "react-icons/fa";
import "../../styles/Card.css";
import useFavoritosStore from "../../store/favoritosStore";
import useCartStore from "../../store/cartStore";

function Card({ item }) {
  const navigate = useNavigate();
  const { toggleFavorito, esFavorito } = useFavoritosStore();
  const { addItem } = useCartStore();
  const esFav = esFavorito(item.id);

  const goToProduct = () => {
    navigate("/producto", { state: item });
  };

  const handleAgregarCarrito = (e) => {
    e.stopPropagation();
    if (item.stock <= 0) return; // guardia extra por si acaso
    addItem({
      id: item.id,
      nombre: item.titulo,
      precio: item.precio,
      imagen: item.img,
      stock: item.stock,
    });
  };

  const handleToggleFavorito = (e) => {
    e.stopPropagation();
    toggleFavorito(item.id);
  };

  return (
    <div className="card" onClick={goToProduct}>
      <img
        src={item.img}
        alt={item.titulo}
        className="card-image"
        onError={(e) => {
          e.target.src =
            "https://images.unsplash.com/photo-1464965911861-74ce9de9ce19";
        }}
      />

      {/* Botón corazón */}
      <button
        className={`card-heart-btn ${esFav ? "active" : ""}`}
        onClick={handleToggleFavorito}
        title={esFav ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        {esFav ? (
          <FaHeart aria-hidden style={{ color: "#e63946" }} />
        ) : (
          <FaRegHeart aria-hidden style={{ color: "#fff" }} />
        )}
      </button>

      <div className="card-content">
        <p className="card-desde">Desde</p>
        <h3 className="card-title">{item.titulo}</h3>
        <p className="card-price">
          ${item.precio?.toLocaleString("es-CO")}
          <span className="card-unit"> /libra</span>
        </p>
        {item.descuentoPorcentaje > 0 && (
          <p className="card-discount">
            <FaFire aria-hidden className="card-discount-icon" /> {item.descuento}{" "}
            OFF
          </p>
        )}

        {/* Botón con lógica de stock */}
        <button
          className={`card-comprar-btn ${item.stock <= 0 ? "disabled" : ""}`}
          onClick={handleAgregarCarrito}
          disabled={item.stock <= 0}
        >
          {item.stock <= 0 ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}

export default Card;
