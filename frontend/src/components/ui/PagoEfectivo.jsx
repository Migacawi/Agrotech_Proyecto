import React from "react";
import { FaCheck, FaMoneyBillWave } from "react-icons/fa";

function PagoEfectivo({ onConfirmar, onCancelar }) {
  return (
    <div className="pago-modal-overlay" onClick={onCancelar}>
      <div className="pago-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pago-modal-icon">
          <FaMoneyBillWave aria-hidden size={44} />
        </div>
        <h3 className="pago-modal-titulo">Pago contra entrega</h3>
        <p className="pago-modal-texto">
          Tu pedido será entregado en la dirección indicada. El pago se realiza
          en efectivo al momento de recibir tu pedido.
        </p>
        <div className="pago-modal-info pago-modal-info-beneficios">
          <p className="pago-modal-beneficio-linea">
            <FaCheck aria-hidden className="pago-modal-beneficio-icon" />
            Sin cargos adicionales
          </p>
          <p className="pago-modal-beneficio-linea">
            <FaCheck aria-hidden className="pago-modal-beneficio-icon" />
            Paga cuando recibas
          </p>
          <p className="pago-modal-beneficio-linea">
            <FaCheck aria-hidden className="pago-modal-beneficio-icon" />
            Entrega en 24-48 horas
          </p>
        </div>
        <div className="pago-modal-botones">
          <button
            type="button"
            className="pago-modal-btn-secundario"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button type="button" className="pago-modal-btn" onClick={onConfirmar}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

export default PagoEfectivo;
