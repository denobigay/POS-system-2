import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../AxiosInstance";
import Receipt from "../receipt/Receipt";
import { orderService } from "../../services/orderService";

const ReceiptView: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/loadOrders`);
        const found = res.data.orders.find(
          (o: any) => o.order_id.toString() === orderId
        );
        setOrder(found);
      } catch (e) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    if (order) orderService.printReceiptFromOrder(order);
  };
  const handleDownload = () => {
    handlePrint();
  };
  const handleClose = () => {
    navigate("/orders");
  };

  if (loading)
    return <div className="text-center p-5 text-white">Loading...</div>;
  if (!order)
    return <div className="text-center p-5 text-danger">Order not found.</div>;

  return (
    <Receipt
      order={order}
      onClose={handleClose}
      onPrint={handlePrint}
      onDownload={handleDownload}
    />
  );
};

export default ReceiptView;
