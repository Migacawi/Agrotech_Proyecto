import Swal from 'sweetalert2';

// ── Paleta AgroTech ───────────────────────────────────────────────────────────
const VERDE       = '#07393c';
const VERDE_OSCURO = '#062e2f';
const TEXTO_CLARO  = '#e8f5f0';
const ROJO         = '#e63946';

// ── Base compartida para todos los modales ────────────────────────────────────
const base = {
  background:          VERDE_OSCURO,
  color:               TEXTO_CLARO,
  confirmButtonColor:  VERDE,
  cancelButtonColor:   ROJO,
  customClass: {
    popup:         'swal-agrotech',
    confirmButton: 'swal-btn-confirm',
    cancelButton:  'swal-btn-cancel',
  },
};

// ── Toast: notificación rápida en la esquina (3 seg) ─────────────────────────
const toast = Swal.mixin({
  toast:            true,
  position:         'top-end',
  showConfirmButton: false,
  timer:            3000,
  timerProgressBar: true,
  background:       VERDE_OSCURO,
  color:            TEXTO_CLARO,
  customClass: { popup: 'swal-agrotech-toast' },
  didOpen: (t) => {
    t.onmouseenter = Swal.stopTimer;
    t.onmouseleave = Swal.resumeTimer;
  },
});

// ── Helpers exportados ────────────────────────────────────────────────────────

/** Toast de éxito (top-right, 3s) */
export const toastExito = (titulo, texto = '') =>
  toast.fire({ icon: 'success', title: titulo, text: texto });

/** Toast de error (top-right, 4s) */
export const toastError = (titulo, texto = '') =>
  toast.fire({ icon: 'error', title: titulo, text: texto, timer: 4000 });

/** Modal de éxito con botón */
export const exito = (titulo, texto = '') =>
  Swal.fire({ ...base, icon: 'success', title: titulo, text: texto });

/** Modal de error con botón */
export const error = (titulo, texto = '') =>
  Swal.fire({ ...base, icon: 'error', title: titulo, text: texto,
    confirmButtonColor: ROJO });

/** Modal de advertencia simple */
export const advertencia = (titulo, texto = '') =>
  Swal.fire({ ...base, icon: 'warning', title: titulo, text: texto });

/**
 * Confirmación de eliminación — devuelve true si confirma
 * @param {string} nombre — qué se va a eliminar
 */
export const confirmarEliminar = async (nombre) => {
  const result = await Swal.fire({
    ...base,
    icon:              'warning',
    title:             '¿Eliminar?',
    html:              `<p style="margin:0;color:${TEXTO_CLARO}">Se eliminará <strong style="color:#ff9f9f">${nombre}</strong>.<br>Esta acción <u>no se puede deshacer</u>.</p>`,
    showCancelButton:  true,
    confirmButtonText: '🗑 Sí, eliminar',
    cancelButtonText:  'Cancelar',
    confirmButtonColor: ROJO,
    cancelButtonColor:  VERDE,
    reverseButtons:    true,
    focusCancel:       true,
  });
  return result.isConfirmed;
};

/**
 * Confirmación de cambio de rol
 * @param {string} nombre — nombre del usuario
 * @param {string} nuevoRol — rol al que pasará
 */
export const confirmarCambioRol = async (nombre, nuevoRol) => {
  const result = await Swal.fire({
    ...base,
    icon:              'question',
    title:             '¿Cambiar rol?',
    html:              `<p style="margin:0;color:${TEXTO_CLARO}"><strong>${nombre}</strong> pasará a ser <strong style="color:#74e2d7">${nuevoRol}</strong>.</p>`,
    showCancelButton:  true,
    confirmButtonText: '✅ Confirmar',
    cancelButtonText:  'Cancelar',
    reverseButtons:    true,
  });
  return result.isConfirmed;
};

/** Bienvenida al hacer login */
export const bienvenida = (nombre) =>
  toast.fire({
    icon:  'success',
    title: `¡Bienvenido, ${nombre}! 🌱`,
    timer: 2500,
  });

/** Toast de carrito */
export const carrito = (nombreProducto) =>
  toast.fire({
    icon:  'success',
    title: '🛒 Añadido al carrito',
    text:  nombreProducto,
    timer: 2000,
  });
