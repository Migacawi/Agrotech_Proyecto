import React from "react";
import "../../styles/Footer.css";

function Footer() {

  const logo = "/logo3.png";

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* LOGO Y DESCRIPCION */}
        <div className="footer-section">
          <img src={logo} alt="Agrotech" className="footer-logo" />
          <p>
            Agrotech es un marketplace agrícola donde productores y compradores
            pueden conectar para vender frutas, verduras y productos del campo
            de forma rápida y segura.
          </p>
        </div>

        {/* COMPRA */}
        <div className="footer-section">
          <h4>Comprar</h4>
          <ul>
            <li>Frutas</li>
            <li>Verduras</li>
            <li>Fertilizantes</li>
            <li>Ofertas</li>
          </ul>
        </div>

        {/* VENDER */}
        <div className="footer-section">
          <h4>Vender</h4>
          <ul>
            <li>Publicar producto</li>
            <li>Mis productos</li>
            <li>Mis ventas</li>
          </ul>
        </div>

        {/* AYUDA */}
        <div className="footer-section">
          <h4>Ayuda</h4>
          <ul>
            <li>Centro de ayuda</li>
            <li>Cómo comprar</li>
            <li>Cómo vender</li>
            <li>Contacto</li>
          </ul>
        </div>

      </div>

      {/* NEWSLETTER */}

      <div className="footer-newsletter">

        <p>Recibe ofertas agrícolas y novedades</p>

        <div className="newsletter-box">
          <input type="email" placeholder="Ingresa tu email" />
          <button>Suscribirse</button>
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
