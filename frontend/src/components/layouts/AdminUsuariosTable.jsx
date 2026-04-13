import React, { useState } from "react";
import {
  FaArrowUp,
  FaEdit,
  FaFileDownload,
  FaTrash,
} from "react-icons/fa";
import { exportarUsuarios } from "../../utils/excelExport";
import { updateUsuario } from "../../api/usuariosService";
import useAuthStore from "../../store/authStore";
import { confirmarCambioRol, toastError, toastExito } from "../../utils/swal";

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

function AdminUsuariosTable({ usuarios, onEditar, onEliminar, onActualizar }) {
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [loadingRol, setLoadingRol] = useState(null);

  const rolActual = useAuthStore((s) => s.user?.rol?.toLowerCase());
  const esAdmin = rolActual === "administrador";

  const filtrados = usuarios.filter((u) => {
    const q = busqueda.toLowerCase();
    return (
      u.Nombre?.toLowerCase().includes(q) ||
      u.Email?.toLowerCase().includes(q) ||
      u.Rol?.Nombre?.toLowerCase().includes(q)
    );
  });

  const totalPaginas = Math.ceil(filtrados.length / ITEMS_POR_PAGINA);
  const inicio = (pagina - 1) * ITEMS_POR_PAGINA;
  const usuariosPagina = filtrados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  const irA = (n) => setPagina(Math.min(Math.max(1, n), totalPaginas));

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPagina(1);
  };

  const exportarExcel = () => exportarUsuarios(filtrados);

  const handleToggleRol = async (u) => {
    const ok = await confirmarCambioRol(u.Nombre, 'Administrador');
    if (!ok) return;

    setLoadingRol(u.Id);
    try {
      await updateUsuario(u.Id, {
        Nombre:    u.Nombre,
        Email:     u.Email,
        RolNombre: "Administrador",
      });
      toastExito(`${u.Nombre} ahora es Administrador`);
      onActualizar();
    } catch (err) {
      toastError('Error', err.message || 'No se pudo actualizar el rol');
    } finally {
      setLoadingRol(null);
    }
  };

  return (
    <div style={{ background: "white", borderRadius: "6px", overflow: "hidden" }}>

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
          placeholder="Buscar por nombre, email o rol..."
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
          type="button"
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
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaFileDownload aria-hidden /> Exportar Excel
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#07393c", color: "white" }}>
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
          {usuariosPagina.map((u, i) => {
            const esAdminTarget = u.Rol?.Nombre?.toLowerCase() === "administrador";

            return (
              <tr
                key={u.Id}
                style={{ background: i % 2 === 0 ? "#f9f9f9" : "white" }}
              >
                <td style={td}>{u.Id}</td>
                <td style={td}>{u.Nombre}</td>
                <td style={td}>{u.Email}</td>

                <td style={td}>
                  <span
                    style={{
                      background: esAdminTarget ? "#07393c" : "#e0f0f0",
                      color:      esAdminTarget ? "white"   : "#07393c",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                    }}
                  >
                    {u.Rol?.Nombre || "Sin rol"}
                  </span>
                </td>

                <td style={td}>
                  {u.FechaRegistro
                    ? new Date(u.FechaRegistro).toLocaleDateString("es-CO")
                    : "—"}
                </td>

                <td style={{ ...td, display: "flex", gap: "8px", flexWrap: "wrap" }}>

                  <button
                    type="button"
                    onClick={() => onEditar(u)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#07393c",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "13px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <FaEdit aria-hidden /> Editar
                  </button>

                  {esAdmin && !esAdminTarget && (
                    <button
                      type="button"
                      onClick={() => handleToggleRol(u)}
                      disabled={loadingRol === u.Id}
                      title="Hacer administrador"
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#1a6fb5",
                        color: "white",
                        cursor: loadingRol === u.Id ? "not-allowed" : "pointer",
                        fontSize: "13px",
                        opacity: loadingRol === u.Id ? 0.6 : 1,
                        whiteSpace: "nowrap",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {loadingRol === u.Id ? (
                        "..."
                      ) : (
                        <>
                          <FaArrowUp aria-hidden /> Hacer admin
                        </>
                      )}
                    </button>
                  )}

                  {!esAdminTarget && (
                    <button
                      type="button"
                      onClick={() => onEliminar(u.Id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#ff4d4d",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "13px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FaTrash aria-hidden /> Eliminar
                    </button>
                  )}

                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filtrados.length === 0 && (
        <p style={{ padding: "20px", color: "#aaa", textAlign: "center" }}>
          {busqueda ? "No se encontraron resultados." : "No hay usuarios registrados."}
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

export default AdminUsuariosTable;

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
        <BtnPag onClick={() => irA(1)} disabled={pagina === 1}>«</BtnPag>
        <BtnPag onClick={() => irA(pagina - 1)} disabled={pagina === 1}>‹</BtnPag>
        {Array.from({ length: totalPaginas }, (_, i) => i + 1)
          .filter((n) => n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 1)
          .reduce((acc, n, idx, arr) => {
            if (idx > 0 && n - arr[idx - 1] > 1) acc.push("...");
            acc.push(n);
            return acc;
          }, [])
          .map((item, idx) =>
            item === "..." ? (
              <span key={`sep-${idx}`} style={{ padding: "0 4px", color: "#aaa" }}>…</span>
            ) : (
              <BtnPag key={item} onClick={() => irA(item)} activo={item === pagina}>
                {item}
              </BtnPag>
            )
          )}
        <BtnPag onClick={() => irA(pagina + 1)} disabled={pagina === totalPaginas}>›</BtnPag>
        <BtnPag onClick={() => irA(totalPaginas)} disabled={pagina === totalPaginas}>»</BtnPag>
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