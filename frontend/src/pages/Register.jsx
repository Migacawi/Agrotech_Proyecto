import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { register, loginConGoogle } from '../api/authService';
import useAuthStore       from '../store/authStore';
import EmailField         from '../components/layouts/EmailField';
import PasswordField      from '../components/layouts/PasswordField';
import "../styles/Register.css";
import Swal from 'sweetalert2';

function Register() {
  const [form, setForm] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading]         = useState(false);
  const navigate                      = useNavigate();
  const { setToken }                  = useAuthStore();

  const imagenFondo = "/fondo_proyecto.jpg";
  const imagenLogo  = "/logo.png";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!form.name.trim())
      errors.name = 'El nombre es obligatorio.';
    if (!form.email.trim())
      errors.email = 'El correo es obligatorio.';
    if (form.password.length < 8)
      errors.password = 'La contraseña debe tener al menos 8 caracteres.';
    else if (!/[A-Z]/.test(form.password))
      errors.password = 'La contraseña debe tener al menos una letra mayúscula.';
    else if (!/[0-9]/.test(form.password))
      errors.password = 'La contraseña debe tener al menos un número.';
    else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password))
      errors.password = 'La contraseña debe tener al menos un carácter especial (!@#$...).';
    if (form.password !== form.confirmPassword)
      errors.confirmPassword = 'Las contraseñas no coinciden.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await Swal.fire({
        icon: 'success',
        title: '¡Cuenta creada!',
        text: 'Tu cuenta fue creada correctamente.',
        confirmButtonColor: '#07393c',
      });
      navigate('/login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Error al crear la cuenta',
        confirmButtonColor: '#07393c',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { token } = await loginConGoogle(credentialResponse.credential);
      setToken(token);
      const rol = useAuthStore.getState().getRole()?.toLowerCase();
      if (rol === 'administrador')  navigate('/admin/usuarios');
      else if (rol === 'vendedor')  navigate('/mis-productos');
      else                          navigate('/');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error con Google',
        text: err.message || 'No se pudo registrar con Google',
        confirmButtonColor: '#07393c',
      });
    }
  };

  const handleGoogleError = () => {
    Swal.fire({
      icon: 'error',
      title: 'Error con Google',
      text: 'No se pudo completar el registro con Google',
      confirmButtonColor: '#07393c',
    });
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

            <EmailField value={form.email} onChange={handleChange} error={fieldErrors.email} />
            <PasswordField value={form.password} onChange={handleChange} error={fieldErrors.password} />
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
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              shape="rectangular"
              text="signup_with"
              locale="es"
              width="100%"
            />
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