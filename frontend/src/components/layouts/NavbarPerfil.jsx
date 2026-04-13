import React, { useEffect, useState } from "react";
import "../../styles/NavbarPerfil.css";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { getUsuarioById } from "../../api/usuariosService";

function NavbarPerfil({ onToggleSidebar }) {
  const logo = "/logo3.png";
  const { user } = useAuthStore();
  const [fotoUrl, setFotoUrl] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchFoto = async () => {
      try {
        const data = await getUsuarioById(user.id);
        if (data.FotoUrl) setFotoUrl(data.FotoUrl);
      } catch (err) {
        console.error("Error al cargar foto:", err);
      }
    };
    fetchFoto();
  }, [user]);

  return (
    <header className="NavbarPerfil">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Botón hamburguesa — solo visible en mobile via CSS */}
        <button
          className="navbar-hamburger"
          onClick={onToggleSidebar}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to="/" className="navbar-left" style={{ textDecoration: "none" }}>
          <img src={logo} alt="Agrotech" className="logo" />
          <span className="brand">AGROTECH</span>
        </Link>
      </div>

      <div className="perfil">
        <img
          src={fotoUrl || "/perfil.png"}
          alt="perfil"
          className="icon"
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
      </div>
    </header>
  );
}

export default NavbarPerfil;
