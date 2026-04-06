import React, { useState } from "react";
import * as XLSX from "xlsx";

const ITEMS_POR_PAGINA = 20;
const th = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "bold",
};
const td = {
  padding: "12px 16px",
  fontSize: "14px",
  borderBottom: "1px solid #f0f0f0",
};

const colorEstado = {
  Pendiente: { bg: "#fff3cd", color: "#856404" },
  Enviado: { bg: "#cce5ff", color: "#004085" },
  Entregado: { bg: "#d4edda", color: "#155724" },
  Cancelado: { bg: "#f8d7da", color: "#721c24" },
};

function AdminPedidosTable({ pedidos, onVerDetalle, onEliminar }) {
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState("");

  const filtrados = pedidos.filter((p) => {
    const q = busqueda.toLowerCase();
    return (
      String(p.Id).includes(q) ||
      p.Usuario?.Nombre?.toLowerCase().includes(q) ||
      p.Usuario?.Email?.toLowerCase().includes(q) ||
      p.Estado?.toLowerCase().includes(q)
    );
  });

  const totalPaginas = Math.ceil(filtrados.length / ITEMS_POR_PAGINA);
  const inicio = (pagina - 1) * ITEMS_POR_PAGINA;
  const pedidosPagina = filtrados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  const irA = (n) => setPagina(Math.min(Math.max(1, n), totalPaginas));

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPagina(1);
  };

  const exportarExcel = () => {
    const datos = filtrados.map((p) => ({
      ID: p.Id,
      Comprador: p.Usuario?.Nombre || "—",
      Email: p.Usuario?.Email || "—",
      Total: Number(p.Total),
      Estado: p.Estado,
      Fecha:
        p.CreadoEn || p.createdAt
          ? new Date(p.CreadoEn || p.createdAt).toLocaleDateString("es-CO")
          : "—",
      Productos: (p.Detalles || [])
        .map(
          (d) => `${d.Producto?.Nombre || "Producto"} x${d.CantidadLibras}lb`,
        )
        .join(", "),
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
    XLSX.writeFile(wb, "pedidos.xlsx");
  };

  return (
    <div
      style={{ background: "white", borderRadius: "6px", overflow: "hidden" }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Buscar por ID, comprador, email o estado..."
          value={busqueda}
          onChange={handleBusqueda}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "13px",
          }}
        />
        <button
          onClick={exportarExcel}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#1d6f42",
            color: "white",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
            whiteSpace: "nowrap",
          }}
        >
          📥 Exportar Excel
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#07393c", color: "white" }}>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Comprador</th>
            <th style={th}>Total</th>
            <th style={th}>Estado</th>
            <th style={th}>Fecha</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosPagina.map((p, i) => {
            const estiloEstado = colorEstado[p.Estado] || {
              bg: "#eee",
              color: "#333",
            };
            const fecha =
              p.CreadoEn || p.createdAt
                ? new Date(p.CreadoEn || p.createdAt).toLocaleDateString(
                    "es-CO",
                  )
                : "—";
            return (
              <tr
                key={p.Id}
                style={{ background: i % 2 === 0 ? "#f9f9f9" : "white" }}
              >
                <td style={td}>#{p.Id}</td>
                <td style={td}>
                  <p style={{ margin: 0, fontWeight: "600" }}>
                    {p.Usuario?.Nombre || "—"}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                    {p.Usuario?.Email || ""}
                  </p>
                </td>
                <td style={td}>
                  <strong>
                    ${Number(p.Total).toLocaleString("es-CO")} COP
                  </strong>
                </td>
                <td style={td}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      background: estiloEstado.bg,
                      color: estiloEstado.color,
                    }}
                  >
                    {p.Estado}
                  </span>
                </td>
                <td style={td}>{fecha}</td>
                <td style={{ ...td, display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => onVerDetalle(p)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#07393c",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    👁 Ver
                  </button>
                  <button
                    onClick={() => onEliminar(p.Id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#ff4d4d",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "13px",
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

      {filtrados.length === 0 && (
        <p style={{ padding: "20px", color: "#aaa", textAlign: "center" }}>
          {busqueda
            ? "No se encontraron resultados."
            : "No hay pedidos registrados."}
        </p>
      )}

      {totalPaginas > 1 && (
        <Paginador
          pagina={pagina}
          totalPaginas={totalPaginas}
          irA={irA}
          total={filtrados.length}
        />
      )}
    </div>
  );
}

export default AdminPedidosTable;

function Paginador({ pagina, totalPaginas, irA, total }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderTop: "1px solid #f0f0f0",
        background: "white",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      <span style={{ fontSize: "13px", color: "#666" }}>
        Total: <strong>{total}</strong> — Página <strong>{pagina}</strong> de{" "}
        <strong>{totalPaginas}</strong>
      </span>
      <div style={{ display: "flex", gap: "4px" }}>
        <BtnPag onClick={() => irA(1)} disabled={pagina === 1}>
          «
        </BtnPag>
        <BtnPag onClick={() => irA(pagina - 1)} disabled={pagina === 1}>
          ‹
        </BtnPag>
        {Array.from({ length: totalPaginas }, (_, i) => i + 1)
          .filter(
            (n) => n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 1,
          )
          .reduce((acc, n, idx, arr) => {
            if (idx > 0 && n - arr[idx - 1] > 1) acc.push("...");
            acc.push(n);
            return acc;
          }, [])
          .map((item, idx) =>
            item === "..." ? (
              <span
                key={`sep-${idx}`}
                style={{ padding: "0 4px", color: "#aaa" }}
              >
                …
              </span>
            ) : (
              <BtnPag
                key={item}
                onClick={() => irA(item)}
                activo={item === pagina}
              >
                {item}
              </BtnPag>
            ),
          )}
        <BtnPag
          onClick={() => irA(pagina + 1)}
          disabled={pagina === totalPaginas}
        >
          ›
        </BtnPag>
        <BtnPag
          onClick={() => irA(totalPaginas)}
          disabled={pagina === totalPaginas}
        >
          »
        </BtnPag>
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
        padding: "5px 10px",
        borderRadius: "5px",
        fontSize: "13px",
        cursor: disabled ? "default" : "pointer",
        border: "1px solid #e0e0e0",
        background: activo ? "#07393c" : disabled ? "#f5f5f5" : "white",
        color: activo ? "white" : disabled ? "#ccc" : "#333",
        fontWeight: activo ? "bold" : "normal",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}
