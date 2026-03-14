import React from 'react';
import Navbar from "../components/layouts/Navbar";
import Categorias from "../components/layouts/categorias";
import SidebarFiltro from "../components/layouts/SidebarFiltro"; 
import "../styles/VerTodo.css";
import Footer from "../components/layouts/Footer";

function VerTodo() {
  return (
    <div className="ver-todo-page">
      <Navbar />
      <Categorias />
      

      {/* 1. Encabezado de resultados: Ocupa todo el ancho */}
      <div className="results-header-container">
      {/* Agrupamos los textos de la izquierda */}
        <div className="text-group-left">
          <p className="breadcrumb-text">Tienda &gt; Frutas y verduras</p>
          <h2 className="results-count">¡Compra las mejores frutas y verduras!</h2>
        </div>  
        <span className="results-filter">Popularidad: los mas populares ▽</span>
      </div>

      {/* 2. Contenedor principal: Se divide en dos columnas */}
      <div className="main-content-wrapper">
        <SidebarFiltro />
        
        <main className="cards-grid-container">
          {/* Aquí es donde mapearás tus <Card /> más tarde */}
          <div className="temp-placeholder">
            Aquí aparecerán las tarjetas al lado del sidebar...
          </div>
        </main>
      </div>
      <Footer/>
    </div>
  );
}

export default VerTodo;