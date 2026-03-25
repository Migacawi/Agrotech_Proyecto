import React, { useState } from 'react';
import '../../styles/SidebarFiltro.css';

const CATEGORIAS = ['Frutas', 'Verduras', 'Granos', 'Tuberculos', 'Fertilizantes'];

function SidebarFiltro({ productos = [], onFiltrar }) {
  const [precioMin, setPrecioMin]                 = useState('');
  const [precioMax, setPrecioMax]                 = useState('');
  const [categoriasActivas, setCategoriasActivas] = useState([]);
  const [soloOfertas, setSoloOfertas]             = useState(false);

  const [abiertoPrecio,    setAbiertoPrecio]    = useState(true);
  const [abiertoOfertas,   setAbiertoOfertas]   = useState(true);
  const [abiertoCategoria, setAbiertoCategoria] = useState(true);

  const toggleCategoria = (cat) => {
    const nuevas = categoriasActivas.includes(cat)
      ? categoriasActivas.filter(c => c !== cat)
      : [...categoriasActivas, cat];
    setCategoriasActivas(nuevas);
    onFiltrar({ categorias: nuevas, precioMin, precioMax, soloOfertas });
  };

  const handlePrecio = (min, max) => {
    onFiltrar({ categorias: categoriasActivas, precioMin: min, precioMax: max, soloOfertas });
  };

  const handleOfertas = (valor) => {
    setSoloOfertas(valor);
    onFiltrar({ categorias: categoriasActivas, precioMin, precioMax, soloOfertas: valor });
  };

  const contarCategoria = (cat) =>
    productos.filter(p => p.Categoria?.toLowerCase() === cat.toLowerCase()).length;

  const totalOfertas = productos.filter(p =>
    Number(p.PrecioOriginal) > Number(p.PrecioPorLibra)
  ).length;

  return (
    <aside className="sidebar-container">

      {/* Precio */}
      <div className="filtro-seccion">
        <div className="filtro-header" onClick={() => setAbiertoPrecio(!abiertoPrecio)}>
          <span>Precio (COP)</span>
          <span>{abiertoPrecio ? '⌃' : '⌵'}</span>
        </div>
        {abiertoPrecio && (
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
        )}
      </div>

      {/* Ofertas */}
      <div className="filtro-seccion">
        <div className="filtro-header" onClick={() => setAbiertoOfertas(!abiertoOfertas)}>
          <span>Ofertas</span>
          <span>{abiertoOfertas ? '⌃' : '⌵'}</span>
        </div>
        {abiertoOfertas && (
          <div className="filtro-body">
            <div className="checkbox-item">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  checked={soloOfertas}
                  onChange={(e) => handleOfertas(e.target.checked)}
                />
                <span>Solo productos con oferta</span>
              </div>
              <span className="count">{totalOfertas}</span>
            </div>
          </div>
        )}
      </div>

      {/* Categoría */}
      <div className="filtro-seccion">
        <div className="filtro-header" onClick={() => setAbiertoCategoria(!abiertoCategoria)}>
          <span>Categoria</span>
          <span>{abiertoCategoria ? '⌃' : '⌵'}</span>
        </div>
        {abiertoCategoria && (
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
        )}
      </div>

    </aside>
  );
}

export default SidebarFiltro;