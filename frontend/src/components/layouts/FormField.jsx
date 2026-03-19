import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function FormField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  extra = null,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="input-group">

      <div className="password-label-row">
        {label && <label htmlFor={name}>{label}</label>}
        {extra && <span>{extra}</span>}
      </div>

      <div className="password-input-wrapper">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          style={error ? { borderColor: '#e74c3c' } : {}}
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {error && <span className="field-error-msg">{error}</span>}

    </div>
  );
}

export default FormField;