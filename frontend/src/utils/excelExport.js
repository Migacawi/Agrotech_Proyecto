/**
 * excelExport.js — Exportaciones Excel estilizadas para AgroTech
 * Usa ExcelJS para generar archivos con colores, tipografía y estructura profesional.
 */
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// ─── Colores AgroTech ──────────────────────────────────────────────────────────
const VERDE_HEX   = 'FF07393C'; // argb
const BLANCO_HEX  = 'FFFFFFFF';
const GRIS_CLARO  = 'FFF2F9F9';
const VERDE_SUAVE = 'FFD4EDDA';
const BORDE_HEX   = 'FFB2D8D8';

// Helper: aplica estilo a una celda de cabecera principal
function estiloTitulo(cell) {
  cell.font      = { name: 'Calibri', bold: true, size: 14, color: { argb: BLANCO_HEX } };
  cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: VERDE_HEX } };
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
}

// Helper: aplica estilo a una celda de cabecera de columna
function estiloHeader(cell) {
  cell.font      = { name: 'Calibri', bold: true, size: 11, color: { argb: BLANCO_HEX } };
  cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A5559' } };
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  cell.border    = borde();
}

// Helper: aplica estilo a una celda de datos
function estiloDato(cell, esImpar) {
  cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: esImpar ? 'FFFFFFFF' : GRIS_CLARO } };
  cell.alignment = { vertical: 'middle', horizontal: 'left' };
  cell.border    = borde();
  cell.font      = { name: 'Calibri', size: 10 };
}

function borde() {
  const lado = { style: 'thin', color: { argb: BORDE_HEX } };
  return { top: lado, left: lado, bottom: lado, right: lado };
}

// Helper: construir fila de cabeceras y aplicar estilos
function agregarHeaderRow(ws, cols) {
  const row = ws.addRow(cols.map(c => c.header));
  row.height = 28;
  row.eachCell(cell => estiloHeader(cell));
  return row;
}

// Helper: añadir fila de datos con estilos
function agregarDataRow(ws, values, esImpar) {
  const row = ws.addRow(values);
  row.height = 22;
  row.eachCell({ includeEmpty: true }, cell => estiloDato(cell, esImpar));
  return row;
}

// Helper: define columnas con anchos
function definirColumnas(ws, cols) {
  ws.columns = cols.map(c => ({
    key:   c.key,
    width: c.width || 18,
  }));
}

// Helper: fila inicial de título
function agregarTitulo(ws, titulo, numCols) {
  // Fila 1: vacía decorativa
  ws.addRow([]);
  // Fila 2: título centrado
  const row = ws.addRow([titulo]);
  row.height = 36;
  ws.mergeCells(`A2:${String.fromCharCode(64 + numCols)}2`);
  estiloTitulo(ws.getCell('A2'));
  // Fila 3: fecha de exportación
  const fechaRow = ws.addRow([`Exportado: ${new Date().toLocaleString('es-CO')}`]);
  fechaRow.height = 18;
  ws.mergeCells(`A3:${String.fromCharCode(64 + numCols)}3`);
  const fechaCell = ws.getCell('A3');
  fechaCell.font      = { name: 'Calibri', size: 10, italic: true, color: { argb: '666666' } };
  fechaCell.alignment = { horizontal: 'right' };
  // Fila 4: vacía separadora
  ws.addRow([]);
}

// ─── Exports Públicos ──────────────────────────────────────────────────────────

/** Exportar Usuarios */
export async function exportarUsuarios(usuarios) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'AgroTech';
  const ws = wb.addWorksheet('Usuarios', { views: [{ state: 'frozen', ySplit: 5 }] });

  const cols = [
    { key: 'id',       header: 'ID',              width: 8  },
    { key: 'nombre',   header: 'Nombre',           width: 28 },
    { key: 'email',    header: 'Correo',           width: 32 },
    { key: 'rol',      header: 'Rol',              width: 16 },
    { key: 'registro', header: 'Fecha de Registro',width: 22 },
  ];

  definirColumnas(ws, cols);
  agregarTitulo(ws, '🌱 AgroTech — Reporte de Usuarios', cols.length);
  agregarHeaderRow(ws, cols);

  usuarios.forEach((u, i) => {
    agregarDataRow(ws, [
      u.Id,
      u.Nombre,
      u.Email,
      u.Rol?.Nombre || '—',
      u.FechaRegistro ? new Date(u.FechaRegistro).toLocaleDateString('es-CO') : '—',
    ], i % 2 === 0);
  });

  // Fila de resumen
  const resumen = ws.addRow([`TOTAL: ${usuarios.length} usuario(s)`, '', '', '', '']);
  resumen.height = 20;
  ws.mergeCells(`A${resumen.number}:E${resumen.number}`);
  const rc = ws.getCell(`A${resumen.number}`);
  rc.font = { bold: true, color: { argb: BLANCO_HEX }, name: 'Calibri', size: 11 };
  rc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: VERDE_HEX } };
  rc.alignment = { horizontal: 'center' };

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `AgroTech_Usuarios_${new Date().toISOString().slice(0,10)}.xlsx`);
}

/** Exportar Productos */
export async function exportarProductos(productos) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'AgroTech';
  const ws = wb.addWorksheet('Productos', { views: [{ state: 'frozen', ySplit: 5 }] });

  const cols = [
    { key: 'id',        header: 'ID',             width: 8  },
    { key: 'nombre',    header: 'Nombre',          width: 28 },
    { key: 'categoria', header: 'Categoría',       width: 16 },
    { key: 'precio',    header: 'Precio / Libra',  width: 18 },
    { key: 'stock',     header: 'Stock (lb)',       width: 14 },
    { key: 'vendedor',  header: 'Vendedor',         width: 24 },
    { key: 'cosecha',   header: 'Fecha Cosecha',    width: 18 },
    { key: 'publicado', header: 'Publicado',        width: 18 },
  ];

  definirColumnas(ws, cols);
  agregarTitulo(ws, '🌿 AgroTech — Reporte de Productos', cols.length);
  agregarHeaderRow(ws, cols);

  productos.forEach((p, i) => {
    const row = agregarDataRow(ws, [
      p.Id,
      p.Nombre,
      p.Categoria,
      Number(p.PrecioPorLibra),
      Number(p.StockLibras),
      p.Usuario?.Nombre || '—',
      p.FechaCosecha  ? new Date(p.FechaCosecha).toLocaleDateString('es-CO')  : '—',
      p.FechaPublicacion ? new Date(p.FechaPublicacion).toLocaleDateString('es-CO') : '—',
    ], i % 2 === 0);

    // Formato de moneda en columna precio
    const precioCell = row.getCell(4);
    precioCell.numFmt = '"$"#,##0.00';
    precioCell.alignment = { horizontal: 'right' };
  });

  const resumen = ws.addRow([`TOTAL: ${productos.length} producto(s)`, '', '', '', '', '', '', '']);
  resumen.height = 20;
  ws.mergeCells(`A${resumen.number}:H${resumen.number}`);
  const rc = ws.getCell(`A${resumen.number}`);
  rc.font = { bold: true, color: { argb: BLANCO_HEX }, name: 'Calibri', size: 11 };
  rc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: VERDE_HEX } };
  rc.alignment = { horizontal: 'center' };

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `AgroTech_Productos_${new Date().toISOString().slice(0,10)}.xlsx`);
}

/** Exportar Pedidos */
export async function exportarPedidos(pedidos) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'AgroTech';
  const ws = wb.addWorksheet('Pedidos', { views: [{ state: 'frozen', ySplit: 5 }] });

  const cols = [
    { key: 'id',        header: 'ID',           width: 8  },
    { key: 'comprador', header: 'Comprador',     width: 26 },
    { key: 'email',     header: 'Email',         width: 30 },
    { key: 'total',     header: 'Total (COP)',   width: 16 },
    { key: 'estado',    header: 'Estado',        width: 14 },
    { key: 'fecha',     header: 'Fecha',         width: 18 },
    { key: 'productos', header: 'Productos',     width: 40 },
  ];

  definirColumnas(ws, cols);
  agregarTitulo(ws, '📦 AgroTech — Reporte de Pedidos', cols.length);
  agregarHeaderRow(ws, cols);

  let totalGeneral = 0;

  pedidos.forEach((p, i) => {
    const total = Number(p.Total) || 0;
    totalGeneral += total;

    const row = agregarDataRow(ws, [
      p.Id,
      p.Usuario?.Nombre || '—',
      p.Usuario?.Email || '—',
      total,
      p.Estado || '—',
      p.CreadoEn || p.createdAt
        ? new Date(p.CreadoEn || p.createdAt).toLocaleDateString('es-CO')
        : '—',
      (p.Detalles || []).map(d => `${d.Producto?.Nombre || 'Producto'} x${d.CantidadLibras}lb`).join(', '),
    ], i % 2 === 0);

    // Formato de moneda en columna total
    const totalCell = row.getCell(4);
    totalCell.numFmt = '"$"#,##0';
    totalCell.alignment = { horizontal: 'right' };

    // Color de estado
    const estadoCell = row.getCell(5);
    const colores = { Pendiente:'FFFFF3CD', Enviado:'FFCCE5FF', Entregado:'FFD4EDDA', Cancelado:'FFF8D7DA', Pagado:'FFD4EDDA' };
    if (colores[p.Estado]) {
      estadoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colores[p.Estado] } };
      estadoCell.font = { bold: true, name: 'Calibri', size: 10 };
    }
  });

  // Fila resumen con total general
  const resumen = ws.addRow([
    `TOTAL: ${pedidos.length} pedido(s)`, '', '',
    totalGeneral, '', '', '',
  ]);
  resumen.height = 22;
  const totalResumenCell = resumen.getCell(4);
  totalResumenCell.numFmt = '"$"#,##0';
  totalResumenCell.font   = { bold: true, color: { argb: BLANCO_HEX }, name: 'Calibri' };
  resumen.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: VERDE_HEX } };
    cell.font = { ...cell.font, color: { argb: BLANCO_HEX }, bold: true, name: 'Calibri', size: 11 };
  });
  ws.mergeCells(`A${resumen.number}:C${resumen.number}`);
  ws.getCell(`A${resumen.number}`).alignment = { horizontal: 'center' };

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `AgroTech_Pedidos_${new Date().toISOString().slice(0,10)}.xlsx`);
}
