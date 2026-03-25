import React, { useState } from "react";

const ITEMS_POR_PAGINA = 20;

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
  const [pagina, setPagina] = useState(1);

  const totalPaginas    = Math.ceil(productos.length / ITEMS_POR_PAGINA);
  const inicio          = (pagina - 1) * ITEMS_POR_PAGINA;
  const productosPagina = productos.slice(inicio, inicio + ITEMS_POR_PAGINA);

  const irA = (n) => setPagina(Math.min(Math.max(1, n), totalPaginas));

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
          {productosPagina.map((p, i) => {
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

      {totalPaginas > 1 && (
        <Paginador pagina={pagina} totalPaginas={totalPaginas} irA={irA} total={productos.length} />
      )}
    </div>
  );
}

export default AdminProductosTable;


// ── Componente compartido de paginación ──────────────────────────────────────
function Paginador({ pagina, totalPaginas, irA, total }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', borderTop: '1px solid #f0f0f0',
      background: 'white', flexWrap: 'wrap', gap: '8px'
    }}>
      <span style={{ fontSize: '13px', color: '#666' }}>
        Total: <strong>{total}</strong> — Página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong>
      </span>

      <div style={{ display: 'flex', gap: '4px' }}>
        <BtnPag onClick={() => irA(1)}           disabled={pagina === 1}>«</BtnPag>
        <BtnPag onClick={() => irA(pagina - 1)}  disabled={pagina === 1}>‹</BtnPag>

        {Array.from({ length: totalPaginas }, (_, i) => i + 1)
          .filter((n) => n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 1)
          .reduce((acc, n, idx, arr) => {
            if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...');
            acc.push(n);
            return acc;
          }, [])
          .map((item, idx) =>
            item === '...'
              ? <span key={`sep-${idx}`} style={{ padding: '0 4px', color: '#aaa' }}>…</span>
              : <BtnPag key={item} onClick={() => irA(item)} activo={item === pagina}>{item}</BtnPag>
          )}

        <BtnPag onClick={() => irA(pagina + 1)}      disabled={pagina === totalPaginas}>›</BtnPag>
        <BtnPag onClick={() => irA(totalPaginas)}    disabled={pagina === totalPaginas}>»</BtnPag>
      </div>
    </div>
  );
}

function BtnPag({ onClick, disabled, activo, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '5px 10px', borderRadius: '5px', fontSize: '13px', cursor: disabled ? 'default' : 'pointer',
        border: '1px solid #e0e0e0',
        background: activo ? '#07393c' : disabled ? '#f5f5f5' : 'white',
        color:      activo ? 'white'   : disabled ? '#ccc'    : '#333',
        fontWeight: activo ? 'bold' : 'normal',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}