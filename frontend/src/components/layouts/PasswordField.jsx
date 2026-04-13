import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function PasswordField({
  value,
  onChange,
  name         = 'password',
  label        = 'Contraseña',
  placeholder  = 'Ingresa tu contraseña',
  showForgot   = false,
  error        = '',
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-group">
      <div className="password-label-row">
        <label htmlFor={name}>{label}</label>
        {showForgot && (
          <Link to="/recuperar-password" className="forgot-password">
            ¿Has olvidado tu contraseña?
          </Link>
        )}
      </div>
      <div className="password-input-wrapper">
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          autoComplete={name === 'password' ? 'current-password' : 'new-password'}
          style={error ? { borderColor: '#e74c3c' } : {}}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {error && <span className="field-error-msg">{error}</span>}
    </div>
  );
}

export default PasswordField;