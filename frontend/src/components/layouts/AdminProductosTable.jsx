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

function AdminProductosTable({ productos, onEditar, onEliminar }) {
  return (
    <div style={{ background: 'white', borderRadius: '6px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#07393c', color: 'white' }}>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Imagen</th>
            <th style={th}>Nombre</th>
            <th style={th}>Categoría</th>
            <th style={th}>Precio/Libra</th>
            <th style={th}>Stock</th>
            <th style={th}>Vendedor</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p, i) => {
            const imagen =
              p.Imagenes?.find((img) => img.EsPrincipal)?.UrlImagen ||
              p.Imagenes?.[0]?.UrlImagen ||
              null;

            return (
              <tr key={p.Id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={td}>{p.Id}</td>
                <td style={td}>
                  {imagen ? (
                    <img
                      src={imagen}
                      alt={p.Nombre}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '6px' }}
                    />
                  ) : (
                    <div style={{
                      width: 50, height: 50, borderRadius: '6px',
                      background: '#e0e0e0', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      🌿
                    </div>
                  )}
                </td>
                <td style={td}>{p.Nombre}</td>
                <td style={td}>
                  <span style={{
                    background: '#e0f0f0', color: '#07393c',
                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px'
                  }}>
                    {p.Categoria}
                  </span>
                </td>
                <td style={td}>${Number(p.PrecioPorLibra).toLocaleString('es-CO')}</td>
                <td style={td}>{Number(p.StockLibras).toLocaleString('es-CO')} lb</td>
                <td style={td}>{p.Usuario?.Nombre || '-'}</td>
                <td style={{ ...td, display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onEditar(p)}
                    style={{
                      padding: '6px 12px', borderRadius: '6px',
                      border: 'none', background: '#07393c',
                      color: 'white', cursor: 'pointer', fontSize: '13px'
                    }}
                  >
                    ✏ Editar
                  </button>
                  <button
                    onClick={() => onEliminar(p.Id)}
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
            );
          })}
        </tbody>
      </table>

      {productos.length === 0 && (
        <p style={{ padding: '20px', color: '#aaa', textAlign: 'center' }}>
          No hay productos registrados.
        </p>
      )}
    </div>
  );
}

export default AdminProductosTable;