import React, { useEffect, useState } from "react";
import axios from "../../AxiosInstance";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ReceiptProps {
  order: any;
  onClose: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({
  order,
  onClose,
  onPrint,
  onDownload,
}) => {
  if (!order) return null;
  const {
    order_id,
    user,
    order_items,
    total_amount,
    amount_paid,
    change_amount,
    created_at,
    discount,
  } = order;

  const handleDownloadPDF = async () => {
    const input = document.getElementById("receipt-content");
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`receipt-${order.order_id || "order"}.pdf`);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title">Receipt</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div id="receipt-content">
              <div className="text-center mb-4">
                <h4 className="text-danger fw-bold">SnackHub</h4>
                <div>Receipt #{order_id}</div>
                <div className="text-muted">
                  {created_at
                    ? new Date(created_at).toLocaleString()
                    : new Date().toLocaleString()}
                </div>
                {user && (
                  <div className="text-muted">
                    Cashier: {user.name || user.username || user.user_name}
                  </div>
                )}
              </div>

              <div className="mb-4">
                {order_items &&
                  order_items.map((item: any) => (
                    <div
                      key={item.product_id}
                      className="d-flex justify-content-between mb-2"
                    >
                      <div>
                        {item.product?.product_name || item.product_name} x{" "}
                        {item.quantity}
                      </div>
                      <div>₱{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
              </div>

              <div className="border-top border-secondary pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>
                    ₱
                    {order_items
                      ? order_items
                          .reduce(
                            (sum: number, item: any) =>
                              sum + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)
                      : "0.00"}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (12%):</span>
                  <span>
                    ₱
                    {order_items
                      ? (
                          order_items.reduce(
                            (sum: number, item: any) =>
                              sum + item.price * item.quantity,
                            0
                          ) * 0.12
                        ).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Discount:</span>
                  <span>
                    ₱{discount ? Number(discount).toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2 fw-bold">
                  <span>Total:</span>
                  <span>₱{Number(total_amount).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Payment Method:</span>
                  <span>Cash</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Amount Paid:</span>
                  <span>₱{Number(amount_paid).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Change:</span>
                  <span>₱{Number(change_amount).toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center mt-4">
                <div className="text-muted">Thank you for your purchase!</div>
                <div className="text-danger">SnackHub</div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={onPrint}>
              Print
            </button>
            <button className="btn btn-success" onClick={handleDownloadPDF}>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
