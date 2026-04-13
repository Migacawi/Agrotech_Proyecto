import React from "react";
import { FaCheck, FaMoneyBillWave } from "react-icons/fa";

const lineStyle = { display: "flex", alignItems: "center", gap: "10px", margin: 0 };

function PagoEfectivo({ onCerrar }) {
  return (
    <div className="pago-modal-overlay" onClick={onCerrar}>
      <div className="pago-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pago-modal-icon">
          <FaMoneyBillWave aria-hidden size={44} />
        </div>
        <h3 className="pago-modal-titulo">Pago contra entrega</h3>
        <p className="pago-modal-texto">
          Tu pedido será entregado en la dirección indicada. El pago se realiza
          en efectivo al momento de recibir tu pedido.
        </p>
        <div className="pago-modal-info">
          <p style={lineStyle}>
            <FaCheck aria-hidden style={{ color: "#74e2d7", flexShrink: 0 }} />
            Sin cargos adicionales
          </p>
          <p style={lineStyle}>
            <FaCheck aria-hidden style={{ color: "#74e2d7", flexShrink: 0 }} />
            Paga cuando recibas
          </p>
          <p style={lineStyle}>
            <FaCheck aria-hidden style={{ color: "#74e2d7", flexShrink: 0 }} />
            Entrega en 24-48 horas
          </p>
        </div>
        <button className="pago-modal-btn" onClick={onCerrar}>
          Entendido
        </button>
      </div>
    </div>
  );
}

export default PagoEfectivo;
