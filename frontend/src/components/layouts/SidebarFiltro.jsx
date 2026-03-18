import React, { useState } from 'react';
import '../../styles/SidebarFiltro.css';

const CATEGORIAS = ['Frutas', 'Verduras', 'Hortalizas', 'Granos', 'Tuberculos', 'Legumbres', 'Frutos secos', 'Fertilizantes'];

function SidebarFiltro({ productos = [], onFiltrar }) {
  const [precioMin, setPrecioMin]       = useState('');
  const [precioMax, setPrecioMax]       = useState('');
  const [categoriasActivas, setCategoriasActivas] = useState([]);

  const toggleCategoria = (cat) => {
    const nuevas = categoriasActivas.includes(cat)
      ? categoriasActivas.filter(c => c !== cat)
      : [...categoriasActivas, cat];
    setCategoriasActivas(nuevas);
    onFiltrar({ categorias: nuevas, precioMin, precioMax });
  };

  const handlePrecio = (min, max) => {
    onFiltrar({ categorias: categoriasActivas, precioMin: min, precioMax: max });
  };

  // Cuenta productos reales por categoría
  const contarCategoria = (cat) =>
    productos.filter(p => p.Categoria?.toLowerCase() === cat.toLowerCase()).length;

  return (
    <aside className="sidebar-container">

      {/* Precio */}
      <div className="filtro-seccion">
        <div className="filtro-header"><span>Precio (COP)</span><span>⌵</span></div>
        <div className="filtro-body precio-inputs">
          <input
            type="number"
            className="dark-input"
            placeholder="Min"
            value={precioMin}
            onChange={(e) => { setPrecioMin(e.target.value); handlePrecio(e.target.value, precioMax); }}
          />
          <input
            type="number"
            className="dark-input"
            placeholder="Max"
            value={precioMax}
            onChange={(e) => { setPrecioMax(e.target.value); handlePrecio(precioMin, e.target.value); }}
          />
        </div>
      </div>

      {/* Ciudad */}
      <div className="filtro-seccion">
        <div className="filtro-header"><span>Ciudad</span><span>^</span></div>
        <div className="filtro-body">
          <select className="dark-select">
            <option>Todas las ciudades</option>
            <option>Bogota</option>
            <option>Medellin</option>
            <option>Cali</option>
            <option>Barranquilla</option>
          </select>
        </div>
      </div>

      {/* Categoría */}
      <div className="filtro-seccion">
        <div className="filtro-header"><span>Categoria</span><span>⌵</span></div>
        <div className="filtro-body">
          {CATEGORIAS.map(cat => (
            <div key={cat} className="checkbox-item">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  checked={categoriasActivas.includes(cat)}
                  onChange={() => toggleCategoria(cat)}
                />
                <span>{cat}</span>
              </div>
              <span className="count">{contarCategoria(cat)}</span>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}

export default SidebarFiltro;