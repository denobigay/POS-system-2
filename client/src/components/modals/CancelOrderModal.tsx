import React from "react";
import POS from "../pages/POS";

interface CancelOrderModalProps {
  show: boolean;
  onClose: () => void;
  onCancel: () => void;
  orderId: number | null;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  show,
  onClose,
  onCancel,
  orderId,
}) => {
  if (!show || !orderId) return null;
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      aria-labelledby="cancelOrderModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title" id="cancelOrderModalLabel">
              Cancel Order
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to cancel order <strong>#{orderId}</strong>?
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              No
            </button>
            <button className="btn btn-danger" onClick={onCancel}>
              Yes, Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
