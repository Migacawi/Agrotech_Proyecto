import React, { useState } from "react";
import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";
import "../styles/AñadirProduct.css";
import Footer from "../components/layouts/Footer";
import { useNavigate } from "react-router-dom";

import { createProducto } from "../api/productosService";
import { subirImagenes } from "../api/imagenesService";
import useAuthStore from "../store/authStore";

function AñadirProduct() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [producto, setProducto] = useState({
    nombre: "",
    categoria: "",
    fechaCosecha: "",
    precio: "",
    stock: "",
    descripcion: "",
    detalles: "",
  });

  const [imagen, setImagen]         = useState(null);
  const [preview, setPreview]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccessMsg("");
  setLoading(true);

  try {
    const nuevoProducto = await createProducto({
      Nombre:        producto.nombre,
      Descripcion:   producto.descripcion,
      Categoria:     producto.categoria,
      PrecioPorLibra: Number(producto.precio),
      StockLibras:   Number(producto.stock),
    });

    if (imagen) {
      await subirImagenes(nuevoProducto.Id, [imagen]);
    }

    setSuccessMsg("¡Producto publicado correctamente!");
    setTimeout(() => navigate("/"), 1500);

  } catch (err) {
    setError(err.message || "Error al publicar el producto");
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <Navbar />
      <Categorias />

      <div className="add-product-container">
        <h1 className="titulo">Añadir Nuevo Producto</h1>

        {error && (
          <div style={{
            background: '#ff4d4d22', border: '1px solid #ff4d4d',
            borderRadius: '8px', padding: '10px 14px',
            color: '#ff6b6b', marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: '#74e2d722', border: '1px solid #74e2d7',
            borderRadius: '8px', padding: '10px 14px',
            color: '#74e2d7', marginBottom: '16px'
          }}>
            {successMsg}
          </div>
        )}

        <form className="add-product-form" onSubmit={handleSubmit}>

          {/* IMAGEN */}
          <div className="image-upload">
            <label>Foto del Producto</label>
            <label className="image-box">
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                hidden
              />
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: '100%', height: '200px',
                    objectFit: 'cover', borderRadius: '8px'
                  }}
                />
              ) : (
                <>
                  <span>+ Añadir Imagen</span>
                  <p>Haz clic para subir una foto</p>
                </>
              )}
            </label>
          </div>

          {/* GRID DE INPUTS */}
          <div className="form-grid">

            <div className="form-group">
              <label>Nombre del Producto</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Mango Tommy"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select name="categoria" onChange={handleChange} required>
                <option value="">Seleccionar</option>
                <option value="Frutas">Frutas</option>
                <option value="Verduras">Verduras</option>
                <option value="Granos">Granos</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fecha de Cosecha</label>
              <input
                type="date"
                name="fechaCosecha"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Precio por Libra (COP)</label>
              <input
                type="number"
                name="precio"
                placeholder="Ej: 5250"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock Disponible (Libras)</label>
              <input
                type="number"
                name="stock"
                placeholder="Ej: 100"
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* DESCRIPCION */}
          <div className="form-group full">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              rows="4"
              placeholder="Describe tu producto..."
              onChange={handleChange}
            />
          </div>

          {/* DETALLES */}
          <div className="form-group full">
            <label>Detalles adicionales</label>
            <textarea
              name="detalles"
              rows="3"
              placeholder="Calidad, tamaño, origen, etc."
              onChange={handleChange}
            />
          </div>

          <button
            className="btn-publicar"
            type="submit"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Publicando..." : "Publicar Producto"}
          </button>

        </form>
      </div>

      <Footer />
    </div>
  );
}

export default AñadirProduct;