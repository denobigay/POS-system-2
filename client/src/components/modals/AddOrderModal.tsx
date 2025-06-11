import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
}

interface AddOrderModalProps {
  show: boolean;
  onClose: () => void;
  onOrderAdded: () => void;
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({
  show,
  onClose,
  onOrderAdded,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [orderItems, setOrderItems] = useState<
    { productId: string; quantity: string }[]
  >([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      axios
        .get("http://localhost:8000/api/loadUsers")
        .then((res) => setUsers(res.data.users));
      axios
        .get("http://localhost:8000/api/loadProducts")
        .then((res) => setProducts(res.data.products));
      setOrderItems([]);
      setSelectedUser("");
      setPaymentMethod("");
      setAmountPaid("");
    }
  }, [show]);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: "", quantity: "1" }]);
  };

  const handleItemChange = (idx: number, field: string, value: string) => {
    setOrderItems((items) =>
      items.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (idx: number) => {
    setOrderItems((items) => items.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        userId: selectedUser,
        items: orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        amountPaid: amountPaid,
        paymentMethod: paymentMethod,
      };
      await axios.post("http://localhost:8000/api/storeOrder", payload);
      onOrderAdded();
      onClose();
    } catch (error) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      aria-labelledby="addOrderModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content bg-dark text-white">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="addOrderModalLabel">
                Add Order
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">User/Cashier</label>
                  <select
                    className="form-select"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                  >
                    <option value="">Select user</option>
                    {users.map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.first_name} {user.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Payment Method</label>
                  <input
                    className="form-control"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Amount Paid</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <h6>Order Items</h6>
              {orderItems.map((item, idx) => (
                <div className="row mb-2" key={idx}>
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={item.productId}
                      onChange={(e) =>
                        handleItemChange(idx, "productId", e.target.value)
                      }
                      required
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option
                          key={product.product_id}
                          value={product.product_id}
                        >
                          {product.product_name} (₱
                          {Number(product.price).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      value={item.quantity}
                      min="1"
                      max={
                        products.find(
                          (p) => p.product_id.toString() === item.productId
                        )?.quantity || 1000
                      }
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={orderItems.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-success mt-2"
                onClick={handleAddItem}
              >
                Add Item
              </button>
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
                {loading ? "Saving..." : "Add Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrderModal;
