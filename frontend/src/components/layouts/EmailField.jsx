import React from 'react';

function EmailField({ value, onChange, placeholder = 'Ingresa tu correo', error = '' }) {
  return (
    <div className="input-group">
      <label htmlFor="email">Correo electrónico</label>
      <input
        id="email"
        name="email"
        type="email"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        autoComplete="email"
        style={error ? { borderColor: '#e74c3c' } : {}}
      />
      {error && <span className="field-error-msg">{error}</span>}
    </div>
  );
}

export default EmailField;