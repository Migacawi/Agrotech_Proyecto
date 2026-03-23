import React, { useState, useRef, useEffect } from "react";
import "../../styles/Navbar.css";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function Navbar() {
  const logo = "/logo3.png";
  const bandera = "/colombia.png";

  const [openCart, setOpenCart] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartRef = useRef(null);
  const searchRef = useRef(null);

  const toggleCart = () => setOpenCart(!openCart);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setOpenCart(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      {/* izquierda */}
      <Link to="/" className="navbar-left">
        <img src={logo} alt="Agrotech" className="logo" />
        <span className="brand">AGROTECH</span>
      </Link>

      {/* centro — barra normal en desktop */}
      <div className="navbar-center">
        <input
          type="text"
          placeholder="Busca frutas, verduras y mas"
          className="search-bar"
        />
      </div>

      {/* derecha */}
      <div className="navbar-right">
        {/* lupa — solo visible en mobile */}
        <div className="search-mobile" ref={searchRef}>
          <button className="search-icon-btn" onClick={toggleSearch}>
            <FaSearch />
          </button>
          {searchOpen && (
            <div className="search-dropdown">
              <input
                type="text"
                placeholder="Busca frutas, verduras y mas"
                className="search-bar-mobile"
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="language">
          <img src={bandera} alt="Colombia" className="flag" />
          <span className="language-text">Español Latinoamerica | COP</span>
        </div>

        <div className="favoritos">
          <img src="/corazon.png" alt="favoritos" className="icon" />
        </div>

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
              <button className="buy-btn">Comprar ahora</button>
            </Link>
            <Link to="/carrito">
              <button className="view-btn">Ver carrito</button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
