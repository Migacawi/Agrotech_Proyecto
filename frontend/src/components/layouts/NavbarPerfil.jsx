import React from "react";
import "../../styles/NavbarPerfil.css";
import { Link } from "react-router-dom";

function NavbarPerfil() {

  const logo = "/logo3.png";


  return (
    <header className="NavbarPerfil">

      <div className="navbar-left">
        <img src={logo} alt="Agrotech" className="logo" />
        <span className="brand">AGROTECH</span>
      </div>

        <div className="perfil">
          <img src="/perfilprueba.png" alt="perfil" className="icon" />
        </div>


      

    </header>
  );
}

export default NavbarPerfil;