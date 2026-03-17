import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { login } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken }          = useAuthStore();
  const navigate              = useNavigate();

  //ruta de las imagenesS
  const imagenFondo = "/fondo_proyecto.jpg"; 
  const imagenLogo = "/logo.png";


const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const { token } = await login(email, password);
    setToken(token);

    const rol = useAuthStore.getState().getRole();
    if (rol === 'admin') {
      navigate('/admin');
    } else if (rol === 'vendedor') {
      navigate('/mis-productos');
    } else {
      navigate('/');
    }

  } catch (err) {
    setError(err.message || 'Error al iniciar sesión');
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
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Correo electrónico </label>
              <input
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <div className="password-label-row">
                <label>Contraseña </label>
                <a href="#" className="forgot-password">¿Has olvidado tu contraseña?</a>
              </div>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">Iniciar Sesión</button>
          </form>

          <div className="social-login-divider">
            <span>O inicia sesión con:</span>
          </div>

          <div className="social-buttons">
            <button className="social-button google"><FaGoogle /> Google</button>
            <button className="social-button facebook"><FaFacebookF /> Facebook</button>
          </div>

          <div className="footer">
            <span>¿Aún no posees una cuenta?</span>{' '}
            <a href="#" className="create-account">Crear Cuenta</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;