import React, { useState } from "react";
import "../../styles/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {

  const logo = "/logo3.png";
  const bandera = "/colombia.png";

  const [openCart, setOpenCart] = useState(false);

  const toggleCart = () => {
    setOpenCart(!openCart);
  };

  return (
    <header className="navbar">

      <div className="navbar-left">
        <img src={logo} alt="Agrotech" className="logo" />
        <span className="brand">AGROTECH</span>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          placeholder="Busca frutas, verduras y mas"
          className="search-bar"
        />
      </div>

      <div className="navbar-right">

        <div className="language">
          <img src={bandera} alt="Colombia" className="flag" />
          <span>Español Latinoamerica | COP</span>
        </div>

        <div className="favoritos">
          <img src="/corazon.png" alt="favoritos" className="icon" />
        </div>

        {/* ICONO CARRITO */}
        <div className="carrito" onClick={toggleCart}>
          <img src="/carrito.png" alt="carrito" className="icon" />
        </div>

        <Link to="/perfil" className="perfil">
           <img src="/perfil.png" alt="perfil" className="icon" />
        </Link>

      </div>

      {/* POPUP DEL CARRITO */}
      {openCart && (
        <div className="cart-popup">

          <h3>Tu carrito</h3>

          <div className="cart-items">
            <p>No hay productos aún</p>
          </div>

          <div className="cart-buttons">
            <button className="buy-now">Comprar ahora</button>

            <Link to="/carrito">
              <button className="view-cart">Ver carrito</button>
            </Link>
          </div>

        </div>
      )}

    </header>
  );
}

export default Navbar;
