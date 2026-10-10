import React, { useEffect, useMemo, useState } from "react";

const API =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.rjrinfinity.com/api";

const SHOP_API = `${API}/griphill`;

const STATUS_LABELS = {
  CREATED: "Order Placed",
  PAYMENT_PENDING: "Payment Pending",
  PAID: "Payment Confirmed",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  PAYMENT_FAILED: "Payment Failed",
};

const STATUS_ORDER = [
  "CREATED",
  "PAID",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function formatMoney(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TrackOrder() {
  const params = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );

  const initialOrder = params.get("order") || "";
  const initialEmail = params.get("email") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [email, setEmail] = useState(initialEmail);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadOrder(orderNo = orderNumber, customerEmail = email) {
    if (!orderNo || !customerEmail) {
      setError("Please enter your order number and email address.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch(
        `${SHOP_API}/orders/${encodeURIComponent(
          orderNo.trim()
        )}?email=${encodeURIComponent(customerEmail.trim())}`
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Order not found. Please check your details."
        );
      }

      setOrder(data.order);

      // Keep URL shareable/bookmarkable.
      const newUrl =
        `${window.location.pathname}` +
        `?order=${encodeURIComponent(orderNo.trim())}` +
        `&email=${encodeURIComponent(customerEmail.trim())}`;

      window.history.replaceState({}, "", newUrl);
    } catch (err) {
      setError(err.message || "Unable to load order.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialOrder && initialEmail) {
      loadOrder(initialOrder, initialEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentStatus = order?.status || "CREATED";

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1050,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 30,
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            marginBottom: 25,
          }}
        >
          <h1 style={{ marginTop: 0 }}>Track Your Order</h1>

          <p style={{ color: "#666" }}>
            Enter your order number and the email address used during
            checkout.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadOrder();
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: 12,
              alignItems: "end",
            }}
          >
            <div>
              <label>Order Number</label>
              <input
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="GH-2026-000011"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
            >
              {loading ? "Checking..." : "Track Order"}
            </button>
          </form>

          {error && (
            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 10,
                background: "#fff1f1",
                color: "#b42318",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {order && (
          <>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 30,
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                marginBottom: 25,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ color: "#777" }}>Order Number</div>
                  <h2 style={{ margin: "5px 0" }}>
                    {order.order_number}
                  </h2>

                  <div style={{ color: "#777" }}>
                    Placed: {formatDate(order.created_at)}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#777" }}>Current Status</div>

                  <div
                    style={{
                      display: "inline-block",
                      marginTop: 6,
                      padding: "8px 16px",
                      borderRadius: 30,
                      background: "#111",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {STATUS_LABELS[currentStatus] || currentStatus}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 30,
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                marginBottom: 25,
              }}
            >
              <h2>Order Status</h2>

              <div
                style={{
                  display: "grid",
                  gap: 16,
                  marginTop: 25,
                }}
              >
                {STATUS_ORDER.map((status, index) => {
                  const historyItem = Array.isArray(order.history)
                    ? order.history.find(
                        (h) => h.status === status
                      )
                    : null;

                  const completed =
                    currentIndex >= index &&
                    currentIndex >= 0;

                  return (
                    <div
                      key={status}
                      style={{
                        display: "flex",
                        gap: 15,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          minWidth: 32,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: completed
                            ? "#111"
                            : "#e5e5e5",
                          color: completed ? "#fff" : "#777",
                          fontWeight: 700,
                        }}
                      >
                        {completed ? "✓" : index + 1}
                      </div>

                      <div>
                        <strong>
                          {STATUS_LABELS[status] || status}
                        </strong>

                        {historyItem?.createdAt && (
                          <div
                            style={{
                              color: "#777",
                              marginTop: 4,
                              fontSize: 14,
                            }}
                          >
                            {formatDate(historyItem.createdAt)}
                          </div>
                        )}

                        {historyItem?.remarks && (
                          <div
                            style={{
                              color: "#555",
                              marginTop: 4,
                            }}
                          >
                            {historyItem.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {(order.tracking_number ||
              order.courier_name ||
              order.estimated_delivery_date) && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 30,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  marginBottom: 25,
                }}
              >
                <h2>Delivery Information</h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(200px,1fr))",
                    gap: 20,
                    marginTop: 20,
                  }}
                >
                  <Info
                    label="Courier"
                    value={order.courier_name}
                  />

                  <Info
                    label="Tracking Number"
                    value={order.tracking_number}
                  />

                  <Info
                    label="Estimated Delivery"
                    value={
                      order.estimated_delivery_date
                        ? new Date(
                            order.estimated_delivery_date
                          ).toLocaleDateString("en-IN")
                        : "-"
                    }
                  />

                  <Info
                    label="Delivery Status"
                    value={order.delivery_status}
                  />
                </div>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(300px,1fr))",
                gap: 25,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 30,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                }}
              >
                <h2>Products</h2>

                {(order.items || []).map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 15,
                      padding: "15px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <div style={{ color: "#777" }}>
                        {item.sku} × {item.quantity}
                      </div>
                    </div>

                    <strong>
                      {formatMoney(item.lineTotal)}
                    </strong>
                  </div>
                ))}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 20,
                    fontSize: 18,
                  }}
                >
                  <strong>Total</strong>
                  <strong>{formatMoney(order.total)}</strong>
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 30,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                }}
              >
                <h2>Shipping Address</h2>

                <p style={{ lineHeight: 1.8 }}>
                  {order.shipping_address || "-"}
                </p>

                <hr />

                <Info
                  label="Customer"
                  value={order.customer_name}
                />

                <Info
                  label="Email"
                  value={order.customer_email}
                />

                <Info
                  label="Phone"
                  value={order.customer_phone}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div style={{ color: "#777", fontSize: 14 }}>
        {label}
      </div>

      <div style={{ marginTop: 4, fontWeight: 600 }}>
        {value || "-"}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  marginTop: 6,
  padding: "12px 14px",
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 15,
};

const buttonStyle = {
  padding: "12px 22px",
  border: "none",
  borderRadius: 8,
  background: "#111",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};