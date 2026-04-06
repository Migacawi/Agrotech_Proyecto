import React, { useState } from "react";
import {
  FaUser,
  FaWallet,
  FaShoppingCart,
  FaMoneyBillWave,
  FaUsers,
  FaSignOutAlt,
  FaHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/Sidebar.css";
import useAuthStore from "../../store/authStore";
import useFavoritosStore from "../../store/favoritosStore";

function Sidebar({ isOpen, onClose }) {
  const { logout, isAdmin } = useAuthStore();
  const { favoritos } = useFavoritosStore();
  const navigate = useNavigate();

  const [openMenus, setOpenMenus] = useState({
    cuenta: false,
    saldo: false,
    compras: false,
    ventas: false,
    ajustes: false,
    admin: false,
  });

  const toggleMenu = (menu) =>
    setOpenMenus({ ...openMenus, [menu]: !openMenus[menu] });

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const ir = (ruta) => {
    navigate(ruta);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span>Menu</span>
          <button className="sidebar-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <ul className="menu">
          {/* Mi Cuenta */}
          <li>
            <button className="menu-btn" onClick={() => toggleMenu("cuenta")}>
              <span className="menu-left">
                <FaUser /> Mi Cuenta
              </span>
              <span className="arrow">{openMenus.cuenta ? "▲" : "▼"}</span>
            </button>
            {openMenus.cuenta && (
              <ul className="submenu">
                <li onClick={() => ir("/perfil")} style={{ cursor: "pointer" }}>
                  Perfil
                </li>
                <li
                  onClick={() => ir("/estadisticas")}
                  style={{ cursor: "pointer" }}
                >
                  Estadisticas
                </li>
                <li
                  onClick={() => ir("/mis-favoritos")}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaHeart style={{ marginRight: "6px" }} /> Mis Favoritos
                  {favoritos.length > 0 && (
                    <span
                      style={{
                        background: "#ff4d4d",
                        color: "white",
                        borderRadius: "10px",
                        fontSize: "11px",
                        padding: "1px 7px",
                        marginLeft: "6px",
                        fontWeight: "bold",
                      }}
                    >
                      {favoritos.length}
                    </span>
                  )}
                </li>
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
                <li onClick={() => ir("/saldo")} style={{ cursor: "pointer" }}>
                  Ver Saldo
                </li>
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
                <li
                  onClick={() => ir("/historial")}
                  style={{ cursor: "pointer" }}
                >
                  Historial
                </li>
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
                <li
                  onClick={() => ir("/mis-productos")}
                  style={{ cursor: "pointer" }}
                >
                  Mis Productos
                </li>
                <li
                  onClick={() => ir("/mis-ventas")}
                  style={{ cursor: "pointer" }}
                >
                  Mis ventas
                </li>
              </ul>
            )}
          </li>

          {/* Admin */}
          {isAdmin() && (
            <li>
              <button className="menu-btn" onClick={() => toggleMenu("admin")}>
                <span className="menu-left">
                  <FaUsers /> Administración
                </span>
                <span className="arrow">{openMenus.admin ? "▲" : "▼"}</span>
              </button>
              {openMenus.admin && (
                <ul className="submenu">
                  <li
                    onClick={() => ir("/admin/usuarios")}
                    style={{ cursor: "pointer" }}
                  >
                    Gestión de Usuarios
                  </li>
                  <li
                    onClick={() => ir("/admin/productos")}
                    style={{ cursor: "pointer" }}
                  >
                    Gestión de Productos
                  </li>
                  <li
                    onClick={() => ir("/admin/pedidos")}
                    style={{ cursor: "pointer" }}
                  >
                    Gestión de Pedidos
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Logout */}
          <li>
            <button className="menu-btn" onClick={handleLogout}>
              <span className="menu-left">
                <FaSignOutAlt /> Cerrar Sesión
              </span>
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default Sidebar;
