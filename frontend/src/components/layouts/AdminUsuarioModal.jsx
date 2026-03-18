import React from "react";

function AdminUsuarioModal({ form, setForm, onGuardar, onCancelar, loading, mensaje }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white', borderRadius: '12px',
        padding: '32px', width: '100%', maxWidth: '400px',
        display: 'flex', flexDirection: 'column', gap: '16px'
      }}>
        <h3 style={{ margin: 0, color: '#07393c' }}>Editar Usuario</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', color: '#555' }}>Nombre</label>
          <input
            value={form.Nombre}
            onChange={(e) => setForm({ ...form, Nombre: e.target.value })}
            style={{
              padding: '10px', borderRadius: '8px',
              border: '1px solid #ccc', fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', color: '#555' }}>Email</label>
          <input
            value={form.Email}
            onChange={(e) => setForm({ ...form, Email: e.target.value })}
            style={{
              padding: '10px', borderRadius: '8px',
              border: '1px solid #ccc', fontSize: '14px'
            }}
          />
        </div>

        {mensaje && (
          <p style={{
            color: mensaje.includes('Error') ? '#ff6b6b' : '#07393c',
            fontSize: '13px', margin: 0
          }}>
            {mensaje}
          </p>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancelar}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              border: '1px solid #ccc', background: 'white', cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onGuardar}
            disabled={loading}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              border: 'none', background: '#07393c',
              color: 'white', cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminUsuarioModal;