import React, { useState } from 'react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authService';
import EmailField    from '../components/layouts/EmailField';
import PasswordField from '../components/layouts/PasswordField';
import "../styles/Register.css";

function Register() {
  const [form, setForm] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const navigate                      = useNavigate();

  const imagenFondo = "/fondo_proyecto.jpg";
  const imagenLogo  = "/logo.png";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim())
      errors.name = 'El nombre es obligatorio.';
    if (!form.email.trim())
      errors.email = 'El correo es obligatorio.';
    if (form.password.length < 6)
      errors.password = 'La contraseña debe tener al menos 6 caracteres.';
    if (form.password !== form.confirmPassword)
      errors.confirmPassword = 'Las contraseñas no coinciden.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    try {
      await register({
        Nombre:       form.name,
        Email:        form.email,
        PasswordHash: form.password,
        RolNombre:    'Vendedor',
      });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
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
          <h1 className="welcome-title">Crear Cuenta</h1>

          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit} noValidate>

            <div className="input-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                required
                autoComplete="name"
                style={fieldErrors.name ? { borderColor: '#e74c3c' } : {}}
              />
              {fieldErrors.name && (
                <span className="field-error-msg">{fieldErrors.name}</span>
              )}
            </div>

            <EmailField
              value={form.email}
              onChange={handleChange}
              error={fieldErrors.email}
            />

            <PasswordField
              value={form.password}
              onChange={handleChange}
              error={fieldErrors.password}
            />

            <PasswordField
              name="confirmPassword"
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              error={fieldErrors.confirmPassword}
            />

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Creando cuenta…' : 'Registrarse'}
            </button>

          </form>

          <div className="social-login-divider">
            <span>O regístrate con:</span>
          </div>

          <div className="social-buttons">
            <button className="social-button google"><FaGoogle /> Google</button>
          </div>

          <div className="footer">
            <span>¿Ya tienes una cuenta?</span>{' '}
            <Link to="/login" className="create-account">Iniciar Sesión</Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;