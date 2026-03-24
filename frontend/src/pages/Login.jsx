import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authService';
import useAuthStore from '../store/authStore';
import EmailField    from '../components/layouts/EmailField';
import PasswordField from '../components/layouts/PasswordField';
import "../styles/Login.css";
import Swal from 'sweetalert2';

function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setToken }          = useAuthStore();
  const navigate              = useNavigate();

  const imagenFondo = "/fondo_proyecto.jpg";
  const imagenLogo  = "/logo.png";

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { token } = await login(form.email, form.password);
      setToken(token);
      const rol = useAuthStore.getState().getRole();
      if (rol === 'admin')         navigate('/admin');
      else if (rol === 'vendedor') navigate('/mis-productos');
      else                         navigate('/');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: err.message || 'Correo o contraseña incorrectos',
        confirmButtonColor: '#07393c',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <img src={imagenFondo} alt="Agrotech Background" className="main-bg-img" />
      </div>

      <div className="right-panel">
        <div className="header">
          <img src={imagenLogo} alt="Agrotech Logo" className="logo-img" />
        </div>

        <div className="content">
          <h1 className="welcome-title">Bienvenido</h1>

          <div onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}>
            <EmailField value={form.email} onChange={handleChange} />
            <PasswordField value={form.password} onChange={handleChange} showForgot={true} />
            <button type="button" onClick={handleSubmit} className="login-button" disabled={loading}>
              {loading ? 'Cargando…' : 'Iniciar Sesión'}
            </button>
          </div>

          <div className="social-login-divider">
            <span>O inicia sesión con:</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-button google"><FaGoogle /> Google</button>
          </div>

          <div className="footer">
            <span>¿Aún no posees una cuenta?</span>{' '}
            <Link to="/registro" className="create-account">Crear Cuenta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;