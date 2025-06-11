import React from "react";

interface DeleteProductModalProps {
  show: boolean;
  onClose: () => void;
  onDelete: () => void;
  productName: string;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  show,
  onClose,
  onDelete,
  productName,
}) => {
  if (!show) return null;
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      aria-labelledby="deleteProductModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteProductModalLabel">
              Delete Product
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
              Are you sure you want to delete the product{" "}
              <strong>{productName}</strong>?
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
