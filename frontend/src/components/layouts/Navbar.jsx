import React, { useState, useRef, useEffect } from "react";
import "../../styles/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {

  const logo = "/logo3.png";
  const bandera = "/colombia.png";

  const [openCart, setOpenCart] = useState(false);
  const cartRef = useRef(null);

  const toggleCart = () => {
    setOpenCart(!openCart);
  };

  // cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setOpenCart(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="navbar">

      {/* izquierda */}

      <div className="navbar-left">
        <img src={logo} alt="Agrotech" className="logo" />
        <span className="brand">AGROTECH</span>
      </div>

      {/* centro */}

      <div className="navbar-center">
        <input
          type="text"
          placeholder="Busca frutas, verduras y mas"
          className="search-bar"
        />
      </div>

      {/* derecha */}

      <div className="navbar-right">

        <div className="language">
          <img src={bandera} alt="Colombia" className="flag" />
          <span>Español Latinoamerica | COP</span>
        </div>

        <div className="favoritos">
          <img src="/corazon.png" alt="favoritos" className="icon" />
        </div>

        {/* carrito */}

        <div className="carrito" onClick={toggleCart}>
          <img src="/carrito.png" alt="carrito" className="icon" />
        </div>

        <Link to="/perfil" className="perfil">
          <img src="/perfil.png" alt="perfil" className="icon" />
        </Link>

      </div>

      {/* popup carrito */}

      {openCart && (
        <div className="cart-popup" ref={cartRef}>

          <h3>Carrito</h3>

          <p>No hay productos aún</p>

          <div className="cart-buttons">

            <Link to="/checkout">
              <button className="buy-btn">
                Comprar ahora
              </button>
            </Link>

            <Link to="/carrito">
              <button className="view-btn">
                Ver carrito
              </button>
            </Link>

          </div>

        </div>
      )}

    </header>
  );
}

export default Navbar;