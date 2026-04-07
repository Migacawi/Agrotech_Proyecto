import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { login, loginConGoogle } from "../api/authService";
import useAuthStore from "../store/authStore";
import useFavoritosStore from "../store/favoritosStore"; // ← nuevo
import EmailField from "../components/layouts/EmailField";
import PasswordField from "../components/layouts/PasswordField";
import "../styles/Login.css";
import Swal from "sweetalert2";

const swalBase = {
  background: '#062e2f',
  color: '#e8f5f0',
  confirmButtonColor: '#07393c',
};

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuthStore();
  const { recargarFavoritos } = useFavoritosStore(); // ← nuevo
  const navigate = useNavigate();

  const imagenFondo = "/fondo_proyecto.jpg";
  const imagenLogo = "/logo.png";

  const redirigirPorRol = () => {
    const rol = useAuthStore.getState().getRole()?.toLowerCase();
    if (rol === "administrador") navigate("/");
    else if (rol === "vendedor") navigate("/");
    else navigate("/");
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { token } = await login(form.email, form.password);
      setToken(token);
      recargarFavoritos(); // ← nuevo: carga los favoritos del usuario que entró
      redirigirPorRol();
    } catch (err) {
      Swal.fire({
        ...swalBase,
        icon: "error",
        title: "Error al iniciar sesión",
        text: err.message || "Correo o contraseña incorrectos",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { token } = await loginConGoogle(credentialResponse.credential);
      setToken(token);
      recargarFavoritos(); // ← nuevo: también para Google
      redirigirPorRol();
    } catch (err) {
      Swal.fire({
        ...swalBase,
        icon: "error",
        title: "Error con Google",
        text: err.message || "No se pudo iniciar sesión con Google",
      });
    }
  };

  const handleGoogleError = () => {
    Swal.fire({
      ...swalBase,
      icon: "error",
      title: "Error con Google",
      text: "No se pudo completar el inicio de sesión con Google",
    });
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <img
          src={imagenFondo}
          alt="Agrotech Background"
          className="main-bg-img"
        />
      </div>

      <div className="right-panel">
        <div className="header">
          <img src={imagenLogo} alt="Agrotech Logo" className="logo-img" />
        </div>

        <div className="content">
          <h1 className="welcome-title">Bienvenido</h1>

          <div onKeyDown={(e) => e.key === "Enter" && handleSubmit()}>
            <EmailField value={form.email} onChange={handleChange} />
            <PasswordField
              value={form.password}
              onChange={handleChange}
              showForgot={true}
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="login-button"
              disabled={loading}
            >
              {loading ? "Cargando…" : "Iniciar Sesión"}
            </button>
          </div>

          <div className="social-login-divider">
            <span>O inicia sesión con:</span>
          </div>

          <div className="social-buttons">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              shape="rectangular"
              text="signin_with"
              locale="es"
              width="100%"
            />
          </div>

          <div className="footer">
            <span>¿Aún no posees una cuenta?</span>{" "}
            <Link to="/registro" className="create-account">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
