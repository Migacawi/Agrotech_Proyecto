import React, { useState } from "react";

function AdminProductoModal({
  form,
  setForm,
  onGuardar,
  onCancelar,
  loading,
  mensaje,
  mostrarImagen = true,
}) {
  const [preview, setPreview] = useState(null);

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setForm({ ...form, imagenFile: file });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "32px",
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ margin: 0, color: "#07393c" }}>Editar Producto</h3>

        {/* IMAGEN */}

        {mostrarImagen && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", color: "#555" }}>
              Imagen del producto
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {(preview || form.imagenActual) && (
                <img
                  src={preview || form.imagenActual}
                  alt="preview"
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
              <label
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #07393c",
                  color: "#07393c",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Cambiar imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagen}
                  hidden
                />
              </label>
            </div>
          </div>
        )}

        {/* CAMPOS */}
        {[
          { label: "Nombre", key: "Nombre", type: "text" },
          { label: "Categoría", key: "Categoria", type: "text" },
          { label: "Precio por Libra", key: "PrecioPorLibra", type: "number" },
          { label: "Stock (Libras)", key: "StockLibras", type: "number" },
          { label: "Descripción", key: "Descripcion", type: "text" },
        ].map(({ label, key, type }) => (
          <div
            key={key}
            style={{ display: "flex", flexDirection: "column", gap: "6px" }}
          >
            <label style={{ fontSize: "13px", color: "#555" }}>{label}</label>
            <input
              type={type}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
          </div>
        ))}

        {mensaje && (
          <p
            style={{
              color: mensaje.includes("Error") ? "#ff6b6b" : "#07393c",
              fontSize: "13px",
              margin: 0,
            }}
          >
            {mensaje}
          </p>
        )}

        <div
          style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
        >
          <button
            onClick={onCancelar}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onGuardar}
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#07393c",
              color: "white",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProductoModal;
