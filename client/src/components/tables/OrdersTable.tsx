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
  customer_name?: string;
  customer_email?: string;
  total_amount: number;
  amount_paid: number;
  change_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  user?: User;
  order_items?: OrderItem[];
}

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onViewDetails: (order: Order) => void;
  onViewReceipt: (order: Order) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  loading,
  onViewDetails,
  onViewReceipt,
}) => {
  return (
    <table className="table table-dark table-striped table-hover mt-3 align-middle">
      <thead>
        <tr>
          <th className="align-middle text-center">ID</th>
          <th className="align-middle text-center">Date</th>
          <th className="align-middle text-center">User</th>
          <th className="align-middle text-center">Customer Name</th>
          <th className="align-middle text-center">Customer Email</th>
          <th className="align-middle text-end">Total</th>
          <th className="align-middle text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={6} className="text-center">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </td>
          </tr>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <tr key={order.order_id}>
              <td className="align-middle text-center">{order.order_id}</td>
              <td className="align-middle text-center">
                {new Date(order.created_at).toLocaleString()}
              </td>
              <td className="align-middle text-center">
                {order.user
                  ? `${order.user.first_name} ${order.user.last_name}`
                  : "-"}
              </td>
              <td className="align-middle text-center">
                {order.customer_name || "-"}
              </td>
              <td className="align-middle text-center">
                {order.customer_email || "-"}
              </td>
              <td className="align-middle text-end">
                ₱{Number(order.total_amount).toFixed(2)}
              </td>
              <td className="align-middle text-center">
                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onViewDetails(order)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => onViewReceipt(order)}
                  >
                    View Receipt
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center">
              No orders found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default OrdersTable;
