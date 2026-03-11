import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  //ruta de las imagenes
  const imagenFondo = "/fondo_proyecto.jpg"; 
  const imagenLogo = "/logo.png";


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login con:', email, password);
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