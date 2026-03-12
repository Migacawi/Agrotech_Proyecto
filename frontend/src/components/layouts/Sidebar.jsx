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
        {/* Mi cuenta */}
        <li>
          <button className="menu-btn" onClick={() => toggleMenu("cuenta")}>
            <FaUser /> Mi cuenta <span>{openMenus.cuenta ? "▲" : "▼"}</span>
          </button>
          {openMenus.cuenta && (
            <ul className="submenu">
              <li>Perfil</li>
              <li>Datos personales</li>
            </ul>
          )}
        </li>

        {/* Saldo */}
        <li>
          <button className="menu-btn" onClick={() => toggleMenu("saldo")}>
            <FaWallet /> Saldo <span>{openMenus.saldo ? "▲" : "▼"}</span>
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
            <FaShoppingCart /> Compras <span>{openMenus.compras ? "▲" : "▼"}</span>
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
            <FaMoneyBillWave /> Ventas <span>{openMenus.ventas ? "▲" : "▼"}</span>
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
            <FaCog /> Ajustes <span>{openMenus.ajustes ? "▲" : "▼"}</span>
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