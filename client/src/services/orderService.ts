import axios from '../AxiosInstance';

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

interface OrderPayload {
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  items: OrderItem[];
  amountPaid: number;
  paymentMethod: string;
  discount: number;
  total: number;
}

export const orderService = {
  placeOrder: async (payload: OrderPayload) => {
    try {
      const response = await axios.post("http://localhost:8000/api/storeOrder", payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to place order");
    }
  },

  printReceipt: (cart: any[], subtotal: number, tax: number, discount: number, total: number, paymentMethod: string, amountPaid: number) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>SnackHub - Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .receipt { max-width: 300px; margin: 20px auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .logo { font-size: 24px; font-weight: bold; color: #198754; }
              .items { margin: 20px 0; }
              .item { margin: 5px 0; }
              .total { margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="logo">SnackHub</div>
                <div>Receipt</div>
                <div>${new Date().toLocaleString()}</div>
              </div>
              <div class="items">
                ${cart.map(item => `
                  <div class="item">
                    ${item.product.product_name} x ${item.quantity}
                    <div style="float: right;">₱${(item.product.price * item.quantity).toFixed(2)}</div>
                  </div>
                `).join('')}
              </div>
              <div class="total">
                <div>Subtotal: ₱${subtotal.toFixed(2)}</div>
                <div>Tax (12%): ₱${tax.toFixed(2)}</div>
                <div>Discount: ₱${discount.toFixed(2)}</div>
                <div style="font-weight: bold;">Total: ₱${total.toFixed(2)}</div>
                <div>Payment Method: ${paymentMethod}</div>
                <div>Amount Paid: ₱${Number(amountPaid).toFixed(2)}</div>
                <div>Change: ₱${(Number(amountPaid) - total).toFixed(2)}</div>
              </div>
              <div class="footer">
                <div>Thank you for your purchase!</div>
                <div>SnackHub</div>
              </div>
            </div>
            <div class="no-print" style="text-align: center; margin-top: 20px;">
              <button onclick="window.print()">Print Receipt</button>
              <button onclick="window.close()">Close</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  },

  printReceiptFromOrder: (order: any) => {
    if (!order) return;
    const { order_id, user, order_items, total_amount, amount_paid, change_amount, payment_method, created_at, discount } = order;
    const subtotal = order_items ? order_items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) : 0;
    const tax = subtotal * 0.12;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>SnackHub - Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .receipt { max-width: 300px; margin: 20px auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .logo { font-size: 24px; font-weight: bold; color: #198754; }
              .items { margin: 20px 0; }
              .item { margin: 5px 0; }
              .total { margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="logo">SnackHub</div>
                <div>Receipt #${order_id}</div>
                <div>${created_at ? new Date(created_at).toLocaleString() : new Date().toLocaleString()}</div>
                ${user ? `<div>Cashier: ${user.name || user.username || user.user_name}</div>` : ''}
              </div>
              <div class="items">
                ${order_items && order_items.map((item: any) => `
                  <div class="item">
                    ${item.product?.product_name || item.product_name} x ${item.quantity}
                    <div style="float: right;">₱${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                `).join('')}
              </div>
              <div class="total">
                <div>Subtotal: ₱${subtotal.toFixed(2)}</div>
                <div>Tax (12%): ₱${tax.toFixed(2)}</div>
                <div>Discount: ₱${discount ? Number(discount).toFixed(2) : '0.00'}</div>
                <div style="font-weight: bold;">Total: ₱${Number(total_amount).toFixed(2)}</div>
                <div>Payment Method: ${payment_method}</div>
                <div>Amount Paid: ₱${Number(amount_paid).toFixed(2)}</div>
                <div>Change: ₱${Number(change_amount).toFixed(2)}</div>
              </div>
              <div class="footer">
                <div>Thank you for your purchase!</div>
                <div>SnackHub</div>
              </div>
            </div>
            <div class="no-print" style="text-align: center; margin-top: 20px;">
              <button onclick="window.print()">Print Receipt</button>
              <button onclick="window.close()">Close</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
}; 