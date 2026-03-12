import React, { useState } from "react";
import { FaUser, FaWallet, FaShoppingCart, FaMoneyBillWave, FaCog, FaPlus } from "react-icons/fa"; // íconos

import "../../styles/Sidebar.css";

function Sidebar() {
  const [openMenus, setOpenMenus] = useState({
    cuenta: false,
    saldo: false,
    compras: false,
    ventas: false,
    ajustes: false
  });

  const toggleMenu = (menu) => {
    setOpenMenus({ ...openMenus, [menu]: !openMenus[menu] });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo3.png" alt="Agrotech" className="sidebar-logo" />
        <span>AGROTECH</span>
      </div>

      <ul className="menu">
        
      <li>
        <button className="menu-btn" onClick={() => toggleMenu("cuenta")}>
          <span className="menu-left">
        <FaUser /> Mi Cuenta
         
        </span>

        <span className="arrow">{openMenus.cuenta? "▲" : "▼"}</span>
        </button>
          {openMenus.cuenta && (
            <ul className="submenu">
              <li>Perfil</li>
              <li>Datos personales</li>
              <li>Estadisticas</li>
            </ul>
          )}
        </li>

        {/* Saldo */}
        <li>
        <button className="menu-btn" onClick={() => toggleMenu("saldo")}>
          <span className="menu-left">
        <FaWallet /> Saldo
         
        </span>

        <span className="arrow">{openMenus.saldo ? "▲" : "▼"}</span>
        </button>
          {openMenus.saldo && (
        <ul className="submenu">
        <li>Saldo Total</li>
        <li>Saldo de Regalo</li>
        <li>Saldo de Ganancias</li>
         </ul>
          )}
        </li>

        {/* Compras */}
                <li>
        <button className="menu-btn" onClick={() => toggleMenu("compras")}>
          <span className="menu-left">
        <FaShoppingCart /> Compras
         
        </span>

        <span className="arrow">{openMenus.compras ? "▲" : "▼"}</span>
        </button>
          {openMenus.compras && (
            <ul className="submenu">
              <li>Historial</li>
              <li>Devoluciones</li>
            </ul>
          )}
        </li>

        {/* Ventas */}
        <li>
        <button className="menu-btn" onClick={() => toggleMenu("ventas")}>
          <span className="menu-left">
        <FaMoneyBillWave /> Ventas
         
        </span>

        <span className="arrow">{openMenus.ventas ? "▲" : "▼"}</span>
        </button>
          {openMenus.ventas && (
            <ul className="submenu">
              <li>Mis ventas</li>
              <li>Reportes</li>
            </ul>
          )}
        </li>

        {/* Ajustes */}
        <li>
        <button className="menu-btn" onClick={() => toggleMenu("ajustes")}>
          <span className="menu-left">
        <FaCog /> Ajustes
         
        </span>

        <span className="arrow">{openMenus.ajustes ? "▲" : "▼"}</span>
        </button>
          {openMenus.ajustes && (
            <ul className="submenu">
              <li>Preferencias</li>
              <li>Seguridad</li>
            </ul>
          )}
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;