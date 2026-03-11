import React, { useState } from 'react';
import Navbar from "../components/layouts/Navbar";
import Card from "../components/ui/Card";
import Categorias from "../components/layouts/categorias";
import "../styles/AgrotechHome.css";
import BotonVt from "../components/ui/BotonVt";


const ofertas = [
  { id: 1, titulo: "Fresas", precio: "8000", descuento: "10%", img: "https://images.unsplash.com/photo-1464965911861-74ce9de9ce19" },
  { id: 2, titulo: "Mango Tommy", precio: "5250", descuento: "5%", img: "https://images.unsplash.com/photo-1553279768-865429fa0078" },
  { id: 3, titulo: "Banano", precio: "8000", descuento: "10%", img: "https://images.unsplash.com/photo-1464965911861-74ce9de9ce19" },
  { id: 4, titulo: "Pera", precio: "5250", descuento: "5%", img: "https://images.unsplash.com/photo-1553279768-865429fa0078" },
  { id: 5, titulo: "Sexo", precio: "5250", descuento: "5%", img: "https://images.unsplash.com/photo-1553279768-865429fa0078" },

];

function AgrotechHome() {

  return (
    <div className="app-container">

      <Navbar />
      
      <Categorias />
      

      {/* HERO */}
      <div className="hero-banner">
        <img 
          src="/fondo_main.jpg"
          alt="Frutas frescas"
        />
      </div>

      {/* OFERTAS */}
      <section className="product-section ofertas-bg">

        <h2>Ofertas Destacadas</h2>

        <div className="card-grid">

          {ofertas.map(item => (
            <Card key={item.id} item={item} />
          ))}

        </div>
        <BotonVt />

      </section>

    </div>
  );
}

export default AgrotechHome;