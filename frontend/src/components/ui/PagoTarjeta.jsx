import React, { useState } from "react";

function PagoTarjeta({ total, onConfirmar, onCerrar }) {
  const [form, setForm] = useState({
    numero: "",
    nombre: "",
    vencimiento: "",
    cvv: "",
  });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "numero") {
      value = value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }
    if (name === "vencimiento") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const errs = {};
    if (form.numero.replace(/\s/g, "").length < 16)
      errs.numero = "Número inválido";
    if (!form.nombre.trim()) errs.nombre = "Ingresa el nombre";
    if (form.vencimiento.length < 5) errs.vencimiento = "Fecha inválida";
    if (form.cvv.length < 3) errs.cvv = "CVV inválido";
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmar = () => {
    if (validar()) onConfirmar(form);
  };

  return (
    <div className="pago-modal-overlay" onClick={onCerrar}>
      <div className="pago-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pago-modal-icon">💳</div>
        <h3 className="pago-modal-titulo">Pago con tarjeta</h3>

        <div className="pago-tarjeta-preview">
          <span>{form.numero || "•••• •••• •••• ••••"}</span>
          <span>{form.vencimiento || "MM/AA"}</span>
        </div>

        <div className="pago-modal-campo">
          <label>Número de tarjeta</label>
          <input
            name="numero"
            placeholder="1234 5678 9012 3456"
            value={form.numero}
            onChange={handleChange}
          />
          {errores.numero && <p className="pago-error">{errores.numero}</p>}
        </div>

        <div className="pago-modal-campo">
          <label>Nombre en la tarjeta</label>
          <input
            name="nombre"
            placeholder="Como aparece en la tarjeta"
            value={form.nombre}
            onChange={handleChange}
          />
          {errores.nombre && <p className="pago-error">{errores.nombre}</p>}
        </div>

        <div className="pago-modal-fila">
          <div className="pago-modal-campo">
            <label>Vencimiento</label>
            <input
              name="vencimiento"
              placeholder="MM/AA"
              value={form.vencimiento}
              onChange={handleChange}
            />
            {errores.vencimiento && (
              <p className="pago-error">{errores.vencimiento}</p>
            )}
          </div>
          <div className="pago-modal-campo">
            <label>CVV</label>
            <input
              name="cvv"
              placeholder="123"
              value={form.cvv}
              onChange={handleChange}
              type="password"
            />
            {errores.cvv && <p className="pago-error">{errores.cvv}</p>}
          </div>
        </div>

        <p className="pago-modal-total">
          Total: <strong>${total.toLocaleString("es-CO")} COP</strong>
        </p>

        <div className="pago-modal-botones">
          <button className="pago-modal-btn-secundario" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="pago-modal-btn" onClick={handleConfirmar}>
            Pagar ahora
          </button>
        </div>
      </div>
    </div>
  );
}

export default PagoTarjeta;
