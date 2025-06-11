import React, { useEffect, useState } from "react";
import axios from "../../AxiosInstance";
import { toast } from "react-toastify";
import Receipt from "../receipt/Receipt";
import { orderService } from "../../services/orderService";

interface Product {
  product_id: number;
  product_name: string;
  product_picture: string | null;
  price: number;
  quantity: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const POS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [discount, setDiscount] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/loadProducts");
        setProducts(res.data.products);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.product_id === product.product_id
      );
      if (existing) {
        return prev.map((item) =>
          item.product.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const handleCartQuantity = (productId: number, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.product_id === productId
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) =>
      prev.filter((item) => item.product.product_id !== productId)
    );
  };

  const discountValue =
    discount.trim() === ""
      ? 0
      : Math.max(0, Math.min(100, Math.floor(Number(discount))));
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.12;
  const discountAmount = (subtotal + tax) * (discountValue / 100);
  const total = subtotal + tax - discountAmount;

  const canPlaceOrder =
    cart.length > 0 &&
    amountPaid.trim() !== "" &&
    !isNaN(Number(amountPaid)) &&
    Number(amountPaid) >= total &&
    customerName.trim() !== "" &&
    customerEmail.trim() !== "";

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return;
    setPlacingOrder(true);
    try {
      const payload = {
        customerName,
        customerEmail,
        items: cart.map((item) => ({
          productId: item.product.product_id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        amountPaid: Number(amountPaid),
        discount: discountValue,
        total: total,
        paymentMethod: "Cash",
      };
      const response = await orderService.placeOrder(payload);

      // Send to Make.com webhook
      await fetch(
        "https://hook.us2.make.com/dc6h1xcolksvj50r9u5ynfzk5l7vvgji",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_name: customerName,
            customer_email: customerEmail,
            order_id: response.order?.order_id || "N/A",
            total_amount: response.order?.total_amount || total,
            items: cart
              .map(
                (item) =>
                  `${item.product.product_name} x ${item.quantity} (₱${item.product.price})`
              )
              .join("\n"),
          }),
        }
      );

      toast.success("Order placed successfully!");
      setCart([]);
      setAmountPaid("");
      setDiscount("");
      setCustomerName("");
      setCustomerEmail("");
      setLastOrder(response.order || payload);
      setShowReceipt(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handlePrint = () => {
    if (!lastOrder) return;
    orderService.printReceiptFromOrder(lastOrder);
  };

  const handleDownload = () => {
    handlePrint();
  };

  return (
    <div className="row g-4">
      {/* Left: Product Grid */}
      <div className="col-md-8 text-white">
        <h2>Products</h2>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '40vh' }}>
            <div className="d-flex align-items-center">
              <span className="text-white fw-bold fs-4 me-2">Loading </span>
              <div className="spinner-border text-danger" role="status" style={{ width: '1.5rem', height: '1.5rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {products.map((product) => (
              <div className="col" key={product.product_id}>
                <div className="card h-100">
                  {product.product_picture ? (
                    <img
                      src={`http://localhost:8000/${product.product_picture}`}
                      alt={product.product_name}
                      className="card-img-top"
                      style={{ height: 150, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center"
                      style={{ height: 150 }}
                    >
                      <span className="text-muted">No Image</span>
                    </div>
                  )}
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{product.product_name}</h6>
                    <div className="mb-2">
                      ₱{Number(product.price).toFixed(2)}
                    </div>
                    <button
                      className="btn btn-danger mt-auto"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}
                    >
                      {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Right: Cart/Order Summary */}
      <div className="col-md-4 d-flex flex-column min-vh-100">
        <div
          className="card shadow-lg bg-dark text-white flex-fill d-flex flex-column justify-content-between pos-order-summary-scroll"
          style={{ border: "none", minHeight: "100vh" }}
        >
          <div>
            <div className="card-header bg-dark border-0">
              <h5 className="mb-0">Order List</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="Enter customer name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Customer Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  placeholder="Enter customer email"
                />
              </div>
              {/* Cart Items or Placeholder */}
              {cart.length === 0 ? (
                <div className="text-center text-muted mb-3">
                  No items in cart.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    className="d-flex align-items-center mb-3"
                    key={item.product.product_id}
                  >
                    <div className="flex-grow-1">
                      <div>{item.product.product_name}</div>
                      <div className="small text-muted">
                        ₱{Number(item.product.price).toFixed(2)}
                      </div>
                    </div>
                    <input
                      type="number"
                      className="form-control mx-2"
                      style={{ width: 70 }}
                      min={1}
                      max={item.product.quantity}
                      value={item.quantity}
                      onChange={(e) =>
                        handleCartQuantity(
                          item.product.product_id,
                          Math.max(
                            1,
                            Math.min(
                              Number(e.target.value),
                              item.product.quantity
                            )
                          )
                        )
                      }
                    />
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleRemoveFromCart(item.product.product_id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
              {/* Always show these fields */}
              <div className="mb-3">
                <label className="form-label">Discount</label>
                <input
                  type="number"
                  className="form-control"
                  value={discount}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9]/g, "");
                    let num = Math.max(0, Math.min(100, Number(val)));
                    setDiscount(num.toString());
                  }}
                  min={0}
                  max={100}
                  step={1}
                  placeholder="Discount (%)"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Amount Paid</label>
                <input
                  type="number"
                  className="form-control"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  min={total}
                  step="0.01"
                  required
                />
              </div>
              {/* Always show summary */}
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Tax (12%):</span>
                <span>₱{tax.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Discount:</span>
                <span>₱{discountAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-danger w-100 mt-3"
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder || placingOrder}
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Receipt Modal */}
      {showReceipt && lastOrder && (
        <Receipt
          order={lastOrder}
          onClose={() => setShowReceipt(false)}
          onPrint={handlePrint}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default POS;
