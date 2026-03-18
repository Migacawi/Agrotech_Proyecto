import React from "react";

const th = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: 'bold',
};

const td = {
  padding: '12px 16px',
  fontSize: '14px',
  borderBottom: '1px solid #f0f0f0',
};

function AdminUsuariosTable({ usuarios, onEditar, onEliminar }) {
  return (
    <div style={{ background: 'white', borderRadius: '6px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#07393c', color: 'white' }}>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Nombre</th>
            <th style={th}>Email</th>
            <th style={th}>Rol</th>
            <th style={th}>Registro</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u, i) => (
            <tr key={u.Id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
              <td style={td}>{u.Id}</td>
              <td style={td}>{u.Nombre}</td>
              <td style={td}>{u.Email}</td>
              <td style={td}>
                <span style={{
                  background: u.Rol?.Nombre?.toLowerCase() === 'administrador' ? '#07393c' : '#e0f0f0',
                  color:      u.Rol?.Nombre?.toLowerCase() === 'administrador' ? 'white'   : '#07393c',
                  padding: '3px 10px', borderRadius: '20px', fontSize: '12px'
                }}>
                  {u.Rol?.Nombre || 'Sin rol'}
                </span>
              </td>
              <td style={td}>
                {u.FechaRegistro
                  ? new Date(u.FechaRegistro).toLocaleDateString('es-CO')
                  : '-'}
              </td>
              <td style={{ ...td, display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onEditar(u)}
                  style={{
                    padding: '6px 12px', borderRadius: '6px',
                    border: 'none', background: '#07393c',
                    color: 'white', cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  ✏ Editar
                </button>
                <button
                  onClick={() => onEliminar(u.Id)}
                  style={{
                    padding: '6px 12px', borderRadius: '6px',
                    border: 'none', background: '#ff4d4d',
                    color: 'white', cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  🗑 Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {usuarios.length === 0 && (
        <p style={{ padding: '20px', color: '#aaa', textAlign: 'center' }}>
          No hay usuarios registrados.
        </p>
      )}
    </div>
  );
}

export default AdminUsuariosTable;