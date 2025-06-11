import React, { useEffect, useState } from "react";
import axios from "axios";
import OrdersTable from "../tables/OrdersTable";
import OrderDetailsModal from "../modals/OrderDetailsModal";
import { useNavigate } from "react-router-dom";

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

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/loadOrders");
      setOrders(response.data.orders);
    } catch (error) {
      // Handle error (optional toast)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleViewReceipt = (order: Order) => {
    navigate(`/orders/${order.order_id}/receipt`);
  };

  return (
    <div className="p-4">
      <div className="d-flex text-white justify-content-between align-items-center mb-3">
        <h2>Orders</h2>
      </div>
      <div className="card bg-dark text-white">
        <div className="card-body">
          <OrdersTable
            orders={orders}
            loading={loading}
            onViewDetails={handleViewDetails}
            onViewReceipt={handleViewReceipt}
          />
        </div>
      </div>
      <OrderDetailsModal
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default Orders;
