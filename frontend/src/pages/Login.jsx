import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { login, loginConGoogle } from "../api/authService";
import useAuthStore from "../store/authStore";
import useFavoritosStore from "../store/favoritosStore";
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
  const { recargarFavoritos } = useFavoritosStore();
  const navigate = useNavigate();

  const imagenLogo = "/logo.png";
  const imagenFondo = "/fondo_proyecto.jpg";

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // LA FUNCIÓN CLAVE: Recibe 'e' y evita la recarga
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 
    
    setLoading(true);
    try {
      const { token } = await login(form.email, form.password);
      setToken(token);
      recargarFavoritos();
      navigate("/"); // Redirección tras éxito
    } catch (err) {
      // Captura el error 401 y muestra la alerta sin refrescar la página
      Swal.fire({
        ...swalBase,
        icon: "error",
        title: "Error al iniciar sesión",
        text: err.response?.data?.error || "Correo o contraseña incorrectos",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { token } = await loginConGoogle(credentialResponse.credential);
      setToken(token);
      recargarFavoritos();
      navigate("/");
    } catch (err) {
      Swal.fire({
        ...swalBase,
        icon: "error",
        title: "Error con Google",
        text: err.response?.data?.error || "No se pudo iniciar sesión con Google",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <img src={imagenFondo} alt="Fondo" className="main-bg-img" />
      </div>

      <div className="right-panel">
        <div className="header">
          <img src={imagenLogo} alt="Logo" className="logo-img" />
        </div>

        <div className="content">
          <h1 className="welcome-title">Bienvenido</h1>

          {/* FORMULARIO CON EVENTO ONSUBMIT INTEGRADO */}
          <form onSubmit={handleSubmit} className="login-form">
            <EmailField name="email" value={form.email} onChange={handleChange} />
            <PasswordField
              name="password"
              value={form.password}
              onChange={handleChange}
              showForgot={true}
            />
            <button
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? "Cargando…" : "Iniciar Sesión"}
            </button>
          </form>

          <div className="social-login-divider">
            <span>O inicia sesión con:</span>
          </div>

          <div className="social-buttons">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => Swal.fire({...swalBase, icon: "error", title: "Error", text: "Error con Google"})}
              shape="rectangular"
              text="signin_with"
              locale="es"
              width="320"
            />
          </div>

          <div className="footer">
            <span>¿Aún no posees una cuenta?</span>{" "}
            <Link to="/registro" className="create-account">Crear Cuenta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;