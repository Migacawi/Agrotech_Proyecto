import React, { useState } from "react";
import { FaUser, FaWallet, FaShoppingCart, FaMoneyBillWave, FaCog, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/Sidebar.css";

import useAuthStore from "../../store/authStore";

function Sidebar() {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const [openMenus, setOpenMenus] = useState({
    cuenta:    false,
    saldo:     false,
    compras:   false,
    ventas:    false,
    ajustes:   false,
    admin:     false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus({ ...openMenus, [menu]: !openMenus[menu] });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span>Menu</span>
      </div>

      <ul className="menu">

        {/* Mi Cuenta */}
        <li>
          <button className="menu-btn" onClick={() => toggleMenu("cuenta")}>
            <span className="menu-left"><FaUser /> Mi Cuenta</span>
            <span className="arrow">{openMenus.cuenta ? "▲" : "▼"}</span>
          </button>
          {openMenus.cuenta && (
            <ul className="submenu">
              <li>Perfil</li>
              <li>Estadisticas</li>
            </ul>
          )}
        </li>

        {/* Saldo */}
        <li>
          <button className="menu-btn" onClick={() => toggleMenu("saldo")}>
            <span className="menu-left"><FaWallet /> Saldo</span>
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
            <span className="menu-left"><FaShoppingCart /> Compras</span>
            <span className="arrow">{openMenus.compras ? "▲" : "▼"}</span>
          </button>
          {openMenus.compras && (
            <ul className="submenu">
              <li>Historial</li>
            </ul>
          )}
        </li>

        {/* Ventas */}
        <li>
          <button className="menu-btn" onClick={() => toggleMenu("ventas")}>
            <span className="menu-left"><FaMoneyBillWave /> Ventas</span>
            <span className="arrow">{openMenus.ventas ? "▲" : "▼"}</span>
          </button>
          {openMenus.ventas && (
            <ul className="submenu">
              <li>Mis ventas</li>
            </ul>
          )}
        </li>

        {/* Ajustes */}
        <li>
          <button className="menu-btn" onClick={() => toggleMenu("ajustes")}>
            <span className="menu-left"><FaCog /> Ajustes</span>
            <span className="arrow">{openMenus.ajustes ? "▲" : "▼"}</span>
          </button>
          {openMenus.ajustes && (
            <ul className="submenu">
              <li>Preferencias</li>
              <li>Seguridad</li>
            </ul>
          )}
        </li>

        {/* Solo Administrador */}
        {isAdmin() && (
          <li>
            <button className="menu-btn" onClick={() => toggleMenu("admin")}>
              <span className="menu-left"><FaUsers /> Administración</span>
              <span className="arrow">{openMenus.admin ? "▲" : "▼"}</span>
            </button>
            {openMenus.admin && (
              <ul className="submenu">
                <li onClick={() => navigate("/admin/usuarios")} style={{ cursor: 'pointer' }}>
                  Gestión de Usuarios
                </li>
                <li onClick={() => navigate("/admin/productos")} style={{ cursor: 'pointer' }}>
                  Gestión de Productos
                </li>
                <li onClick={() => navigate("/admin/pedidos")} style={{ cursor: 'pointer' }}>
                  Gestión de Pedidos
                </li>
              </ul>
            )}
          </li>
        )}

        {/* Cerrar Sesión */}
        <li>
          <button className="menu-btn" onClick={handleLogout}>
            <span className="menu-left"><FaSignOutAlt /> Cerrar Sesión</span>
          </button>
        </li>

      </ul>
    </aside>
  );
}

export default Sidebar;