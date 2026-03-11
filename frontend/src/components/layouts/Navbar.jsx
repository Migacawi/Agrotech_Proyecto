import React from "react";
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import "../../styles/Navbar.css";

function Navbar() {

  const logo = "/logo3.png";
  const bandera = "/colombia.png";

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

        <FaHeart className="icon" />
        <FaShoppingCart className="icon" />
        <FaUser className="icon" />

      </div>

    </header>
  );
}

export default Navbar;