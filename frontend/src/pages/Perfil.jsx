import React from "react";
import NavbarPerfil from "../components/layouts/NavbarPerfil";
import Sidebar from "../components/layouts/Sidebar";
import "../styles/Perfil.css";

function Perfil() {
  return (
    <div className="perfil-page">
      <NavbarPerfil />
      <Sidebar />

      <div className="perfil-content">

        <h3 className="section-title">INFORMACION GENERAL</h3>

        <div className="perfil-grid">

          {/* PERFIL */}
          <div className="perfil-card">
            <h4>PERFIL</h4>

            <div className="perfil-info">
              <img
                src="/perfilprueba.png"
                alt="perfil"
                className="perfil-avatar"
              />

              <div>
                <p className="perfil-nombre">
                  Gabriel Castellanos Wilches
                </p>
                <p className="perfil-email">
                  gabrielycast14032@gmail.com
                </p>
              </div>

              <button className="edit-btn">✏</button>
            </div>
          </div>

          {/* ULTIMAS COMPRAS */}
          <div className="compras-card">
            <h4>Ultimas Compras</h4>
            <p>No hay compras todavia</p>
          </div>

        </div>

        {/* SALDO */}
        <div className="saldo-section">

          <h4>Saldo Total</h4>
          <h1 className="saldo-total">0,00 COP</h1>

          <div className="saldo-item">
            <div>
              <p className="saldo-title">Saldo De Regalo</p>
              <span className="saldo-desc">
                Saldo obtenido de tarjetas de regalo
              </span>
            </div>

            <div className="saldo-right">
              <span className="saldo-value">0,00 COP</span>
              <button className="saldo-btn">+</button>
            </div>
          </div>

          <div className="saldo-item">
            <div>
              <p className="saldo-title">Saldo De Ganancias</p>
              <span className="saldo-desc">
                Saldo obtenido de las ventas realizadas
              </span>
            </div>

            <div className="saldo-right">
              <span className="saldo-value">0,00 COP</span>
              <button className="saldo-btn">+</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Perfil;