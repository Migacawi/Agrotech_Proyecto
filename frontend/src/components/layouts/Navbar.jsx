import React, { useState, useRef, useEffect } from "react";
import "../../styles/Navbar.css";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import useFavoritosStore from "../../store/favoritosStore";
import useAuthStore from "../../store/authStore"; // ← nuevo
import { getUsuarioById } from "../../api/usuariosService"; // ← nuevo

function Navbar() {
  const logo = "/logo3.png";
  const bandera = "/colombia.png";
  const { favoritos } = useFavoritosStore();
  const { favoritosNoVistos } = useFavoritosStore();
  const [openCart, setOpenCart] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { items, removeItem, deleteItem, getTotal, getTotalItems } =
    useCartStore();
  const { user } = useAuthStore(); // ← nuevo
  const [fotoUrl, setFotoUrl] = useState(null); // ← nuevo

  // ← nuevo: carga la foto del usuario
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

  const toggleCart = () => setOpenCart(!openCart);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setOpenCart(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      {/* izquierda */}
      <Link to="/" className="navbar-left">
        <img src={logo} alt="Agrotech" className="logo" />
        <span className="brand">AGROTECH</span>
      </Link>

      {/* centro */}
      <div className="navbar-center">
        <input
          type="text"
          placeholder="Busca frutas, verduras y mas"
          className="search-bar"
        />
      </div>

      {/* derecha */}
      <div className="navbar-right">
        {/* lupa mobile */}
        <div className="search-mobile" ref={searchRef}>
          <button className="search-icon-btn" onClick={toggleSearch}>
            <FaSearch />
          </button>
          {searchOpen && (
            <div className="search-dropdown">
              <input
                type="text"
                placeholder="Busca frutas, verduras y mas"
                className="search-bar-mobile"
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="language">
          <img src={bandera} alt="Colombia" className="flag" />
          <span className="language-text">Español Latinoamerica | COP</span>
        </div>

        <div
          className="favoritos icon-container"
          onClick={() => navigate("/mis-favoritos")}
        >
          <img src="/corazon.png" alt="favoritos" className="icon" />
          {favoritosNoVistos > 0 && (
            <span className="icon-badge">{favoritosNoVistos}</span>
          )}
        </div>

        {/* carrito con contador */}
        <div
          className="carrito"
          onClick={toggleCart}
          style={{ position: "relative" }}
        >
          <img src="/carrito.png" alt="carrito" className="icon" />
          {getTotalItems() > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                background: "#74e2d7",
                color: "#07393c",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                fontSize: "11px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {getTotalItems()}
            </span>
          )}
        </div>

        {/* ← foto de perfil con imagen real o default */}
        <Link to="/perfil" className="perfil">
          <img
            src={fotoUrl || "/perfil.png"}
            alt="perfil"
            className="icon"
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        </Link>
      </div>

      {/* popup carrito */}
      {openCart && (
        <div className="cart-popup" ref={cartRef}>
          <h3>Carrito</h3>

          {items.length === 0 ? (
            <p style={{ color: "#aaa", fontSize: "14px" }}>
              No hay productos aún
            </p>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "12px",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      paddingBottom: "12px",
                    }}
                  >
                    <img
                      src={item.imagen || "/placeholder.png"}
                      alt={item.nombre}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: "6px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          fontWeight: "bold",
                        }}
                      >
                        {item.nombre}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "#74e2d7",
                        }}
                      >
                        ${Number(item.precio).toLocaleString("es-CO")} / lb
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          border: "none",
                          background: "rgba(255,255,255,0.2)",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontSize: "13px",
                          minWidth: "16px",
                          textAlign: "center",
                        }}
                      >
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => useCartStore.getState().addItem(item)}
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          border: "none",
                          background: "rgba(255,255,255,0.2)",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ff6b6b",
                          cursor: "pointer",
                          fontSize: "14px",
                          marginLeft: "4px",
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "12px 0",
                  fontWeight: "bold",
                }}
              >
                <span>Total:</span>
                <span style={{ color: "#74e2d7" }}>
                  ${getTotal().toLocaleString("es-CO")} COP
                </span>
              </div>
            </>
          )}

          <div className="cart-buttons">
            <Link to="/checkout" onClick={() => setOpenCart(false)}>
              <button className="buy-btn">Comprar ahora</button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
