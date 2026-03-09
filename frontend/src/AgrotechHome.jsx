import React from 'react';
import { Heart, ShoppingCart, User, ChevronDown } from 'lucide-react';
import './AgroTechHome.css'; // Importamos el archivo de estilos

const AgroTechHome = () => {
  // Datos de prueba
  const products = [
    { id: 1, name: 'Fresas', price: '8000', discount: '10%', img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Mango Tommy', price: '5250', discount: '5%', img: 'https://images.unsplash.com/photo-1553279768-865429fd0072?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Tomate', price: '6230', discount: '10%', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Naranja', price: '1500', discount: '40%', img: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=400' },
    { id: 5, name: 'Banano', price: '3100', discount: '12%', img: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="agrotech-container">
      
      {/* HEADER PRINCIPAL */}
      <header className="agrotech-header">
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L12 10M12 2C8 2 4 6 4 10C4 15 12 22 12 22C12 22 20 15 20 10C20 6 16 2 12 2Z" />
              </svg>
            </div>
          </div>
          <span className="logo-text">AGROTECH</span>
        </div>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Busca frutas, verduras y mas" 
            className="search-input"
          />
        </div>

        <div className="header-actions">
          <div className="region-selector">
            <img src="https://flagcdn.com/w20/co.png" alt="Colombia" className="flag-icon" />
            <span>Español Latinoamerica | COP</span>
            <ChevronDown className="icon-small" />
          </div>
          
          <div className="user-actions">
            <Heart className="icon-action" />
            <ShoppingCart className="icon-action" />
            <User className="icon-action" />
          </div>
        </div>
      </header>

      {/* BARRA DE NAVEGACIÓN */}
      <nav className="agrotech-nav">
        <a href="#categorias">Categorias</a>
        <a href="#capacitaciones">Capacitaciones</a>
        <a href="#comprar">Comprar</a>
        <a href="#vender">Vender</a>
        <a href="#flash" className="btn-flash">Ofertas Flash</a>
        <a href="#fertilizantes">Fertilizantes</a>
        <a href="#salir">Salir</a>
      </nav>

      {/* BANNER PRINCIPAL (Hero) */}
      <div className="hero-banner">
        <img 
          src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=2000" 
          alt="Frutas frescas en agua" 
          className="hero-image"
        />
      </div>

      {/* SECCIÓN DE OFERTAS DESTACADAS */}
      <main className="main-content">
        <h2 className="section-title">Ofertas Destacadas</h2>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img src={product.img} alt={product.name} className="product-image" />
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <span className="product-label">Desde</span>
                <div className="product-price-container">
                  <span className="product-price">$ {product.price}</span>
                  <span className="product-unit">kg</span>
                </div>
                <div className="product-discount">
                  {product.discount} Descuento
                </div>
                <div className="product-footer">
                  <Heart className="icon-heart-product" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <button className="btn-view-all">Ver Todo</button>
        </div>
      </main>

    </div>
  );
};

export default AgroTechHome;