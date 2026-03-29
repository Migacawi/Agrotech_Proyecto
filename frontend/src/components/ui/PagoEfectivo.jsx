import React from "react";

function PagoEfectivo({ onCerrar }) {
  return (
    <div className="pago-modal-overlay" onClick={onCerrar}>
      <div className="pago-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pago-modal-icon">💵</div>
        <h3 className="pago-modal-titulo">Pago contra entrega</h3>
        <p className="pago-modal-texto">
          Tu pedido será entregado en la dirección indicada. El pago se realiza
          en efectivo al momento de recibir tu pedido.
        </p>
        <div className="pago-modal-info">
          <p>✅ Sin cargos adicionales</p>
          <p>✅ Paga cuando recibas</p>
          <p>✅ Entrega en 24-48 horas</p>
        </div>
        <button className="pago-modal-btn" onClick={onCerrar}>
          Entendido
        </button>
      </div>
    </div>
  );
}

export default PagoEfectivo;
