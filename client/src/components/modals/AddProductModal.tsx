import React, { ChangeEvent, FormEvent, RefObject } from "react";

interface AddProductModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  formData: {
    productName: string;
    price: string;
    quantity: string;
    productImage: File | null;
  };
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  loading?: boolean;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  show,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  onImageChange,
  fileInputRef,
  loading = false,
}) => {
  if (!show) return null;
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      aria-labelledby="addProductModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content bg-dark text-white">
          <form onSubmit={onSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="addProductModalLabel">
                Add Product
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="productName"
                    value={formData.productName}
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={onInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    onChange={onInputChange}
                    required
                    min="0"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Product Image</label>
                  <input
                    type="file"
                    className="form-control"
                    ref={fileInputRef}
                    onChange={onImageChange}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
