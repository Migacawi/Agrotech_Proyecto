import React, { useState } from "react";

function PagoTransferencia({ total, onConfirmar, onCerrar }) {
  const [comprobante, setComprobante] = useState("");

  return (
    <div className="pago-modal-overlay" onClick={onCerrar}>
      <div className="pago-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pago-modal-icon">🏦</div>
        <h3 className="pago-modal-titulo">Transferencia bancaria</h3>
        <p className="pago-modal-texto">
          Realiza la transferencia a los siguientes datos:
        </p>

        <div className="pago-modal-datos">
          <div className="pago-dato-row">
            <span className="pago-dato-label">Banco</span>
            <span className="pago-dato-valor">Bancolombia</span>
          </div>
          <div className="pago-dato-row">
            <span className="pago-dato-label">Tipo</span>
            <span className="pago-dato-valor">Cuenta Ahorros</span>
          </div>
          <div className="pago-dato-row">
            <span className="pago-dato-label">Número</span>
            <span className="pago-dato-valor">123-456789-00</span>
          </div>
          <div className="pago-dato-row">
            <span className="pago-dato-label">A nombre de</span>
            <span className="pago-dato-valor">Agrotech S.A.S</span>
          </div>
          <div className="pago-dato-row">
            <span className="pago-dato-label">Valor</span>
            <span className="pago-dato-valor pago-dato-total">
              ${total.toLocaleString("es-CO")} COP
            </span>
          </div>
        </div>

        <div className="pago-modal-campo">
          <label>Número de comprobante</label>
          <input
            type="text"
            placeholder="Ej: 2024031500001"
            value={comprobante}
            onChange={(e) => setComprobante(e.target.value)}
          />
        </div>

        <div className="pago-modal-botones">
          <button className="pago-modal-btn-secundario" onClick={onCerrar}>
            Cancelar
          </button>
          <button
            className="pago-modal-btn"
            onClick={() => onConfirmar({ comprobante })}
            disabled={!comprobante.trim()}
          >
            Confirmar pago
          </button>
        </div>
      </div>
    </div>
  );
}

export default PagoTransferencia;
