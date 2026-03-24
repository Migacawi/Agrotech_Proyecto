import React, { useState } from "react";
import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";
import "../styles/AñadirProduct.css";
import Footer from "../components/layouts/Footer";
import { useNavigate } from "react-router-dom";
import ImageCropper from "../components/ui/ImageCropper";
import Swal from "sweetalert2";

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

  const [imagen, setImagen]           = useState(null);
  const [preview, setPreview]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleImage = () => {
    setCropperOpen(true);
  };

  const handleCropDone = (file, previewUrl) => {
    setImagen(file);
    setPreview(previewUrl);
    setCropperOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación de imagen
    if (!imagen) {
      Swal.fire({
        icon: 'warning',
        title: 'Imagen requerida',
        text: 'Debes añadir una foto del producto.',
        confirmButtonColor: '#07393c',
      });
      setLoading(false);
      return;
    }

    // Validación de fecha
    if (!producto.fechaCosecha) {
      Swal.fire({
        icon: 'warning',
        title: 'Fecha requerida',
        text: 'Debes ingresar la fecha de cosecha.',
        confirmButtonColor: '#07393c',
      });
      setLoading(false);
      return;
    }

    // Validación de precio
    if (Number(producto.precio) <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Precio inválido',
        text: 'El precio por libra debe ser mayor a 0.',
        confirmButtonColor: '#07393c',
      });
      setLoading(false);
      return;
    }

    // Validación de stock
    if (Number(producto.stock) <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock inválido',
        text: 'El stock disponible debe ser mayor a 0.',
        confirmButtonColor: '#07393c',
      });
      setLoading(false);
      return;
    }

    try {
      const nuevoProducto = await createProducto({
        Nombre:         producto.nombre,
        Descripcion:    producto.descripcion,
        Categoria:      producto.categoria,
        PrecioPorLibra: Number(producto.precio),
        StockLibras:    Number(producto.stock),
        fechaCosecha:   producto.fechaCosecha,
      });

      if (imagen) {
        await subirImagenes(nuevoProducto.Id, [imagen]);
      }

      await Swal.fire({
        icon: 'success',
        title: '¡Producto publicado!',
        text: 'Tu producto fue publicado correctamente.',
        confirmButtonColor: '#07393c',
      });
      navigate("/");

    } catch (err) {
      console.log("Error del servidor:", err.response?.data);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || err.message || 'Error al publicar el producto',
        confirmButtonColor: '#07393c',
      });
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

        {cropperOpen && (
          <ImageCropper
            aspect={1}
            circular={false}
            onCropDone={handleCropDone}
            onCancel={() => setCropperOpen(false)}
          />
        )}

        <form className="add-product-form" onSubmit={handleSubmit}>

          <div className="image-upload">
            <label>Foto del Producto</label>
            <div className="image-box" onClick={handleImage} style={{ cursor: 'pointer' }}>
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                <>
                  <span>+ Añadir Imagen</span>
                  <p>Haz clic para subir una foto</p>
                </>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Nombre del Producto</label>
              <input type="text" name="nombre" placeholder="Ej: Mango Tommy" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select name="categoria" onChange={handleChange} required>
                <option value="">Seleccionar</option>
                <option value="Frutas">Frutas</option>
                <option value="Verduras">Verduras</option>
                <option value="Granos">Granos</option>
                <option value="Tuberculos">Tubérculos</option>
                <option value="Fertilizantes">Fertilizantes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fecha de Cosecha</label>
              <input type="date" name="fechaCosecha" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Precio por Libra (COP)</label>
              <input type="number" name="precio" placeholder="Ej: 5250" min="1" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Stock Disponible (Libras)</label>
              <input type="number" name="stock" placeholder="Ej: 100" min="1" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group full">
            <label>Descripción</label>
            <textarea name="descripcion" rows="4" placeholder="Describe tu producto..." onChange={handleChange} />
          </div>

          <div className="form-group full">
            <label>Detalles adicionales</label>
            <textarea name="detalles" rows="3" placeholder="Calidad, tamaño, origen, etc." onChange={handleChange} />
          </div>

          <button className="btn-publicar" type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? "Publicando..." : "Publicar Producto"}
          </button>

        </form>
      </div>

      <Footer />
    </div>
  );
}

export default AñadirProduct;