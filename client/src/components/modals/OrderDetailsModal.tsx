import React from "react";

interface OrderItem {
  order_item_id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product?: {
    product_name: string;
  };
}

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
}

interface Order {
  order_id: number;
  user_id: number;
  total_amount: number;
  amount_paid: number;
  change_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  user?: User;
  order_items?: OrderItem[];
}

interface OrderDetailsModalProps {
  show: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  show,
  onClose,
  order,
}) => {
  if (!show || !order) return null;
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      aria-labelledby="orderDetailsModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title" id="orderDetailsModalLabel">
              Order Details
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <strong>Order ID:</strong> {order.order_id}
              <br />
              <strong>Date:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
              <br />
              <strong>User:</strong>{" "}
              {order.user
                ? `${order.user.first_name} ${order.user.last_name}`
                : "-"}
              <br />
              <strong>Payment Method:</strong> {order.payment_method}
              <br />
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  order.status === "completed" ? "bg-success" : "bg-secondary"
                }`}
              >
                {order.status}
              </span>
              <br />
              <strong>Total:</strong> ₱{Number(order.total_amount).toFixed(2)}
              <br />
              <strong>Amount Paid:</strong> ₱
              {Number(order.amount_paid).toFixed(2)}
              <br />
              <strong>Change:</strong> ₱{Number(order.change_amount).toFixed(2)}
            </div>
            <h6>Order Items</h6>
            <table className="table table-dark table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.map((item, idx) => (
                    <tr key={item.order_item_id}>
                      <td>{idx + 1}</td>
                      <td>{item.product ? item.product.product_name : "-"}</td>
                      <td>{item.quantity}</td>
                      <td>₱{Number(item.price).toFixed(2)}</td>
                      <td>₱{Number(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
