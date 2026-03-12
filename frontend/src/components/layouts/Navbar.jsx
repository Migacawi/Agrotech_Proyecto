import React from "react";
import "../../styles/Navbar.css";
import { Link } from "react-router-dom";

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

        <div className="favoritos">
          <img src="/corazon.png" alt="favoritos" className="icon" />
        </div>

        <div className="carrito">
          <img src="/carrito.png" alt="carrito" className="icon" />
        </div>

        <Link to="/perfil" className="perfil">
           <img src="/perfil.png" alt="perfil" className="icon" />
        </Link>

      </div>

    </header>
  );
}

export default Navbar;