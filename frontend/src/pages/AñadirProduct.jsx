import React, { useState } from "react";
import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";
import "../styles/AñadirProduct.css";

function AñadirProduct() {

  const [producto, setProducto] = useState({
    nombre: "",
    categoria: "",
    fechaCosecha: "",
    precio: "",
    stock: "",
    descripcion: "",
    detalles: "",
    imagen: null
  });

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {
    setProducto({
      ...producto,
      imagen: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(producto);
  };

  return (
    <div>

      <Navbar />
      <Categorias />

      <div className="add-product-container">

        <h1 className="titulo">Añadir Nuevo Producto</h1>

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

    <span>+ Añadir Imagen</span>
    <p>Haz clic para subir una foto</p>
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
              />
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select name="categoria" onChange={handleChange}>
                <option>Seleccionar</option>
                <option>Frutas</option>
                <option>Verduras</option>
                <option>Granos</option>
                <option>Otros</option>
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
              />
            </div>

            <div className="form-group">
              <label>Stock Disponible (Libras)</label>
              <input
                type="number"
                name="stock"
                placeholder="Ej: 100"
                onChange={handleChange}
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

          <button className="btn-publicar">
            Publicar Producto
          </button>

        </form>

      </div>

    </div>
  );
}

export default AñadirProduct;
