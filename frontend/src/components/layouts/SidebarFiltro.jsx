import React from 'react';
import '../../styles/SidebarFiltro.css';

const categoriasData = [
  { id: 1, nombre: 'Frutas', cantidad: 575, checked: true },
  { id: 2, nombre: 'Verduras', cantidad: 732, checked: true },
  { id: 3, nombre: 'Hortalizas', cantidad: 220, checked: false },
  { id: 4, nombre: 'Granos', cantidad: 121, checked: false },
  { id: 5, nombre: 'Tuberculos', cantidad: 39, checked: false },
  { id: 6, nombre: 'Legumbres', cantidad: 110, checked: false },
  { id: 7, nombre: 'Frutos secos', cantidad: 10, checked: false },
  { id: 8, nombre: 'Fertilizantes', cantidad: 4, checked: false },
];

function SidebarFiltro() {
  return (
    <aside className="sidebar-container">
      {/* Sección Precio */}
      <div className="filtro-seccion">
        <div className="filtro-header"><span>Precio (COP)</span><span>⌵</span></div>
        <div className="filtro-body precio-inputs">
          <input type="text" className="dark-input" />
          <input type="text" className="dark-input" />
        </div>
      </div>

      {/* Sección Ciudad */}
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

      {/* Sección Categoría */}
      <div className="filtro-seccion">
        <div className="filtro-header"><span>Categoria</span><span>⌵</span></div>
        <div className="filtro-body">
          {categoriasData.map(cat => (
            <div key={cat.id} className="checkbox-item">
              <div className="checkbox-group">
                <input type="checkbox" checked={cat.checked} readOnly />
                <span>{cat.nombre}</span>
              </div>
              <span className="count">{cat.cantidad}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default SidebarFiltro;