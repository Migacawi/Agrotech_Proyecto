import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Footer.css";

function Footer() {
  const logo = "/logo3.png";
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LOGO */}
        <div className="footer-section">
          <img src={logo} alt="Agrotech" className="footer-logo" />
          <p>
            Agrotech es un marketplace agrícola donde productores y compradores
            pueden conectar para vender frutas, verduras y productos del campo
            de forma rápida y segura.
          </p>
        </div>

        {/* COMPRAR */}
        <div className="footer-section">
          <h4>Comprar</h4>
          <ul>
            <li onClick={() => navigate("/ver-todo?categoria=frutas")}>
              Frutas
            </li>
            <li onClick={() => navigate("/ver-todo?categoria=verduras")}>
              Verduras
            </li>
            <li onClick={() => navigate("/ver-todo?categoria=fertilizantes")}>
              Fertilizantes
            </li>
            <li onClick={() => navigate("/ver-todo?ofertas=true")}>Ofertas</li>
          </ul>
        </div>

        {/* VENDER */}
        <div className="footer-section">
          <h4>Vender</h4>
          <ul>
            <li onClick={() => navigate("/añadir-producto")}>
              Publicar producto
            </li>
            <li onClick={() => navigate("/mis-productos")}>Mis productos</li>
            <li onClick={() => navigate("/mis-ventas")}>Mis ventas</li>
          </ul>
        </div>

        {/* REDES (ANTES AYUDA) */}
        <div className="footer-section">
          <h4>Nosotros</h4>
          <ul>
            <li
              onClick={() =>
                window.open(
                  "https://www.instagram.com/migacawi_draws?igsh=MWRpdzN3Z3FtZXd1Ng==",
                )
              }
            >
              📸 Instagram
            </li>
            <li onClick={() => window.open("https://github.com/tuusuario")}>
              💻 GitHub
            </li>
            <li onClick={() => window.open("https://linkedin.com")}>
              🔗 LinkedIn
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        <p>© 2026 Agrotech. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
