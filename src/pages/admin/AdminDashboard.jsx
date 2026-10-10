import React, { useEffect, useState } from "react";
import { adminRequest } from "../../services/adminApi";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // RAZORPAY PAYMENT STATES
  // ---------------------------------------------------------

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [razorpayPayments, setRazorpayPayments] = useState([]);

  const [loadingRazorpayPayments, setLoadingRazorpayPayments] =
    useState(false);

  const [mappingPaymentId, setMappingPaymentId] =
    useState("");

  const [paymentError, setPaymentError] = useState("");

  const [paymentSuccess, setPaymentSuccess] =
    useState("");

  // ---------------------------------------------------------
  // LOAD DASHBOARD
  // ---------------------------------------------------------

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const result = await adminRequest(
        "/griphill/admin/dashboard"
      );

      setData(result);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------

  function logout() {
    localStorage.removeItem(
      "griphill_admin_token"
    );

    window.location.href =
      "/admin/login";
  }

  // ---------------------------------------------------------
  // OPEN RAZORPAY PAYMENT PANEL
  // ---------------------------------------------------------

  async function openRazorpayPayments(order) {
    try {
      setSelectedOrder(order);

      setRazorpayPayments([]);

      setPaymentError("");

      setPaymentSuccess("");

      setLoadingRazorpayPayments(true);

      const result =
        await adminRequest(
          `/griphill/admin/orders/${order.id}/razorpay-payments`
        );

      setRazorpayPayments(
        result?.payments || []
      );
    } catch (err) {
      setPaymentError(
        err?.message ||
          "Unable to fetch Razorpay payments."
      );
    } finally {
      setLoadingRazorpayPayments(false);
    }
  }

  // ---------------------------------------------------------
  // CLOSE RAZORPAY PAYMENT PANEL
  // ---------------------------------------------------------

  function closeRazorpayPayments() {
    setSelectedOrder(null);

    setRazorpayPayments([]);

    setPaymentError("");

    setPaymentSuccess("");

    setMappingPaymentId("");
  }

  // ---------------------------------------------------------
  // MAP RAZORPAY PAYMENT TO ORDER
  // ---------------------------------------------------------

  async function mapRazorpayPayment(
    order,
    payment
  ) {
    const confirmed =
      window.confirm(
        `Are you sure you want to map Razorpay payment ${payment.id} to order ${order.order_number}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setMappingPaymentId(
        payment.id
      );

      setPaymentError("");

      setPaymentSuccess("");

      const result =
        await adminRequest(
          `/griphill/admin/orders/${order.id}/payment`,
          {
            method: "PATCH",
            body: JSON.stringify({
              razorpayPaymentId:
                payment.id,
            }),
          }
        );

      setPaymentSuccess(
        result?.message ||
          "Payment successfully mapped to the order."
      );

      // Refresh dashboard
      await loadDashboard();

      // Find updated order
      const updatedOrder =
        (
          data?.orders || []
        ).find(
          (item) =>
            String(item.id) ===
            String(order.id)
        );

      if (updatedOrder) {
        setSelectedOrder({
          ...updatedOrder,
          razorpay_payment_id:
            payment.id,
          payment_status:
            "CAPTURED",
          status:
            updatedOrder.status ===
            "PENDING_PAYMENT"
              ? "PAID"
              : updatedOrder.status,
        });
      }

      // Close after successful mapping
      setTimeout(() => {
        setSelectedOrder(null);
        setRazorpayPayments([]);
        setMappingPaymentId("");
      }, 1200);
    } catch (err) {
      setPaymentError(
        err?.message ||
          "Unable to map Razorpay payment."
      );
    } finally {
      setMappingPaymentId("");
    }
  }

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div
        style={{
          padding: 40,
          fontFamily: "Arial, sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  // ---------------------------------------------------------
  // ERROR
  // ---------------------------------------------------------

  if (error) {
    return (
      <div
        style={{
          padding: 40,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            color: "#b91c1c",
            background: "#fee2e2",
            padding: 20,
            borderRadius: 12,
          }}
        >
          {error}
        </div>

        <button
          onClick={loadDashboard}
          style={{
            marginTop: 15,
            padding: "10px 18px",
            border: "none",
            borderRadius: 8,
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------
  // DATA
  // ---------------------------------------------------------

  const summary =
    data?.summary || {};

  const today =
    data?.today || {};

  const month =
    data?.month || {};

  const orders =
    data?.orders || [];

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: 30,
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          margin: "0 auto",
        }}
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 30,
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 32,
              }}
            >
              Grip Hill Admin
            </h1>

            <p
              style={{
                marginTop: 8,
                color: "#666",
              }}
            >
              Sales & Order Management
            </p>
          </div>

          <button
            onClick={logout}
            style={{
              padding:
                "10px 18px",
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(200px,1fr))",
            gap: 20,
          }}
        >
          <Card
            title="Total Orders"
            value={summary.orders}
          />

          <Card
            title="Total Sales"
            value={`₹${Number(
              summary.paid_amount ||
                0
            ).toLocaleString(
              "en-IN"
            )}`}
          />

          <Card
            title="Successful Payments"
            value={
              summary.successful_payments
            }
          />

          <Card
            title="Failed Payments"
            value={
              summary.failed_payments
            }
          />

          <Card
            title="Pending Payments"
            value={
              summary.pending_payments
            }
          />

          <Card
            title="Delivered Orders"
            value={
              summary.delivered_orders
            }
          />

          <Card
            title="Active Deliveries"
            value={
              summary.active_deliveries
            }
          />

          <Card
            title="Cancelled Orders"
            value={
              summary.cancelled_orders
            }
          />
        </div>

        {/* =====================================================
            SALES SUMMARY
        ====================================================== */}

        <div
          style={{
            marginTop: 30,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(300px,1fr))",
            gap: 20,
          }}
        >
          <Card
            title="Today's Sales"
            value={`₹${Number(
              today.paid_amount ||
                0
            ).toLocaleString(
              "en-IN"
            )}`}
          />

          <Card
            title="This Month"
            value={`₹${Number(
              month.paid_amount ||
                0
            ).toLocaleString(
              "en-IN"
            )}`}
          />

          <Card
            title="Average Order Value"
            value={`₹${Number(
              summary.average_order_value ||
                0
            ).toLocaleString(
              "en-IN"
            )}`}
          />
        </div>

        {/* =====================================================
            RECENT ORDERS
        ====================================================== */}

        <div
          style={{
            marginTop: 35,
            background: "#fff",
            padding: 25,
            borderRadius: 14,
            boxShadow:
              "0 3px 15px rgba(0,0,0,.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 20,
              gap: 15,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                }}
              >
                Recent Orders
              </h2>

              <p
                style={{
                  margin:
                    "6px 0 0",
                  color: "#777",
                  fontSize: 14,
                }}
              >
                Manage orders and
                Razorpay payments
              </p>
            </div>

            <button
              onClick={loadDashboard}
              style={{
                padding:
                  "9px 15px",
                border:
                  "1px solid #ddd",
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
          </div>

          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                minWidth: 1100,
              }}
            >
              <thead>
                <tr>
                  <th style={th}>
                    Order
                  </th>

                  <th style={th}>
                    Customer
                  </th>

                  <th style={th}>
                    Amount
                  </th>

                  <th style={th}>
                    Status
                  </th>

                  <th style={th}>
                    Payment
                  </th>

                  <th style={th}>
                    Razorpay Order
                  </th>

                  <th style={th}>
                    Razorpay Payment
                  </th>

                  <th style={th}>
                    Date
                  </th>

                  <th style={th}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      style={{
                        padding: 30,
                        textAlign:
                          "center",
                        color: "#777",
                      }}
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map(
                    (order) => (
                      <tr
                        key={
                          order.id
                        }
                      >
                        {/* ORDER */}

                        <td style={td}>
                          <strong>
                            {
                              order.order_number
                            }
                          </strong>
                        </td>

                        {/* CUSTOMER */}

                        <td style={td}>
                          <div
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {
                              order.customer_name
                            }
                          </div>

                          <div
                            style={{
                              fontSize: 12,
                              color: "#777",
                              marginTop: 4,
                            }}
                          >
                            {
                              order.customer_email
                            }
                          </div>
                        </td>

                        {/* AMOUNT */}

                        <td style={td}>
                          <strong>
                            ₹
                            {Number(
                              order.total ||
                                order.total_amount ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </td>

                        {/* STATUS */}

                        <td style={td}>
                          <StatusBadge
                            value={
                              order.status
                            }
                          />
                        </td>

                        {/* PAYMENT */}

                        <td style={td}>
                          <StatusBadge
                            value={
                              order.payment_status
                            }
                            payment
                          />
                        </td>

                        {/* RAZORPAY ORDER */}

                        <td style={td}>
                          {order.razorpay_order_id ? (
                            <code
                              style={{
                                fontSize: 11,
                                background:
                                  "#f5f5f5",
                                padding:
                                  "5px 7px",
                                borderRadius:
                                  5,
                                display:
                                  "inline-block",
                              }}
                            >
                              {
                                order.razorpay_order_id
                              }
                            </code>
                          ) : (
                            <span
                              style={{
                                color:
                                  "#999",
                              }}
                            >
                              Not created
                            </span>
                          )}
                        </td>

                        {/* RAZORPAY PAYMENT */}

                        <td style={td}>
                          {order.razorpay_payment_id ? (
                            <div>
                              <code
                                style={{
                                  fontSize: 11,
                                  background:
                                    "#ecfdf5",
                                  color:
                                    "#047857",
                                  padding:
                                    "5px 7px",
                                  borderRadius:
                                    5,
                                  display:
                                    "inline-block",
                                }}
                              >
                                {
                                  order.razorpay_payment_id
                                }
                              </code>
                            </div>
                          ) : (
                            <span
                              style={{
                                color:
                                  "#b45309",
                                fontWeight: 600,
                              }}
                            >
                              Not mapped
                            </span>
                          )}
                        </td>

                        {/* DATE */}

                        <td style={td}>
                          {order.created_at
                            ? new Date(
                                order.created_at
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </td>

                        {/* ACTION */}

                        <td style={td}>
                          {order.razorpay_order_id ? (
                            <button
                              onClick={() =>
                                openRazorpayPayments(
                                  order
                                )
                              }
                              style={{
                                padding:
                                  "8px 12px",
                                border:
                                  "none",
                                borderRadius:
                                  7,
                                background:
                                  order.razorpay_payment_id
                                    ? "#f3f4f6"
                                    : "#111",
                                color:
                                  order.razorpay_payment_id
                                    ? "#333"
                                    : "#fff",
                                cursor:
                                  "pointer",
                                whiteSpace:
                                  "nowrap",
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              {order.razorpay_payment_id
                                ? "View Payment"
                                : "Map Payment"}
                            </button>
                          ) : (
                            <span
                              style={{
                                color:
                                  "#999",
                                fontSize: 12,
                              }}
                            >
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      {/* </div> */}

        {/* =======================================================
            TESTIMONIAL MANAGEMENT
        ======================================================== */}

        <div style={{ marginTop: 35 }}>
          <TestimonialsManager />
        </div>
      </div>


      {/* =======================================================
          RAZORPAY PAYMENT MODAL
      ======================================================== */}

      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.55)",
            zIndex: 9999,
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: 20,
          }}
          onClick={
            closeRazorpayPayments
          }
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: 850,
              maxHeight:
                "90vh",
              overflowY: "auto",
              borderRadius: 18,
              padding: 28,
              boxShadow:
                "0 20px 60px rgba(0,0,0,.25)",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* MODAL HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start",
                gap: 20,
                marginBottom: 25,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  Razorpay Payment
                </h2>

                <p
                  style={{
                    margin:
                      "7px 0 0",
                    color: "#777",
                  }}
                >
                  Order{" "}
                  <strong>
                    {
                      selectedOrder.order_number
                    }
                  </strong>
                </p>
              </div>

              <button
                onClick={
                  closeRazorpayPayments
                }
                style={{
                  width: 36,
                  height: 36,
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "50%",
                  background:
                    "#fff",
                  cursor:
                    "pointer",
                  fontSize: 18,
                }}
              >
                ×
              </button>
            </div>

            {/* ORDER INFORMATION */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: 15,
                marginBottom: 25,
              }}
            >
              <InfoBox
                label="Order Number"
                value={
                  selectedOrder.order_number
                }
              />

              <InfoBox
                label="Order Amount"
                value={`₹${Number(
                  selectedOrder.total ||
                    selectedOrder.total_amount ||
                    0
                ).toLocaleString(
                  "en-IN"
                )}`}
              />

              <InfoBox
                label="Payment Status"
                value={
                  selectedOrder.payment_status ||
                  "PENDING"
                }
              />

              <InfoBox
                label="Order Status"
                value={
                  selectedOrder.status ||
                  "-"
                }
              />

              <InfoBox
                label="Razorpay Order ID"
                value={
                  selectedOrder.razorpay_order_id ||
                  "-"
                }
              />

              <InfoBox
                label="Mapped Payment ID"
                value={
                  selectedOrder.razorpay_payment_id ||
                  "Not mapped"
                }
              />
            </div>

            {/* ERROR */}

            {paymentError && (
              <div
                style={{
                  background:
                    "#fee2e2",
                  color:
                    "#991b1b",
                  border:
                    "1px solid #fecaca",
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 20,
                }}
              >
                <strong>
                  Payment Error
                </strong>

                <div
                  style={{
                    marginTop: 5,
                  }}
                >
                  {paymentError}
                </div>
              </div>
            )}

            {/* SUCCESS */}

            {paymentSuccess && (
              <div
                style={{
                  background:
                    "#ecfdf5",
                  color:
                    "#047857",
                  border:
                    "1px solid #a7f3d0",
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 20,
                }}
              >
                {paymentSuccess}
              </div>
            )}

            {/* LOADING */}

            {loadingRazorpayPayments && (
              <div
                style={{
                  padding: 30,
                  textAlign:
                    "center",
                  background:
                    "#f8f8f8",
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                  }}
                >
                  Fetching payments
                  from Razorpay...
                </div>

                <div
                  style={{
                    color: "#777",
                    marginTop: 7,
                    fontSize: 13,
                  }}
                >
                  Please wait.
                </div>
              </div>
            )}

            {/* PAYMENTS */}

            {!loadingRazorpayPayments &&
              !paymentError && (
                <div>
                  <h3
                    style={{
                      marginBottom: 15,
                    }}
                  >
                    Razorpay Payments
                  </h3>

                  {razorpayPayments.length ===
                  0 ? (
                    <div
                      style={{
                        background:
                          "#fff7ed",
                        color:
                          "#9a3412",
                        border:
                          "1px solid #fed7aa",
                        padding: 18,
                        borderRadius: 12,
                      }}
                    >
                      <strong>
                        No Razorpay
                        payment found.
                      </strong>

                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 13,
                        }}
                      >
                        There is currently
                        no payment recorded
                        against this Razorpay
                        order.
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        gap: 12,
                      }}
                    >
                      {razorpayPayments.map(
                        (payment) => {
                          const amount =
                            Number(
                              payment.amount ||
                                0
                            ) / 100;

                          const isCaptured =
                            payment.status ===
                            "captured";

                          const isMapped =
                            selectedOrder.razorpay_payment_id ===
                            payment.id;

                          return (
                            <div
                              key={
                                payment.id
                              }
                              style={{
                                border:
                                  "1px solid #e5e7eb",
                                borderRadius:
                                  12,
                                padding: 18,
                                background:
                                  isMapped
                                    ? "#ecfdf5"
                                    : "#fff",
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "space-between",
                                  alignItems:
                                    "flex-start",
                                  gap: 20,
                                  flexWrap:
                                    "wrap",
                                }}
                              >
                                {/* PAYMENT DETAILS */}

                                <div
                                  style={{
                                    flex: 1,
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight:
                                        700,
                                      fontSize:
                                        15,
                                    }}
                                  >
                                    {
                                      payment.id
                                    }
                                  </div>

                                  <div
                                    style={{
                                      display:
                                        "grid",
                                      gridTemplateColumns:
                                        "repeat(auto-fit,minmax(140px,1fr))",
                                      gap: 12,
                                      marginTop:
                                        12,
                                    }}
                                  >
                                    <SmallInfo
                                      label="Status"
                                      value={
                                        payment.status
                                      }
                                    />

                                    <SmallInfo
                                      label="Amount"
                                      value={`₹${amount.toLocaleString(
                                        "en-IN"
                                      )}`}
                                    />

                                    <SmallInfo
                                      label="Method"
                                      value={
                                        payment.method ||
                                        "-"
                                      }
                                    />

                                    <SmallInfo
                                      label="Currency"
                                      value={
                                        payment.currency ||
                                        "INR"
                                      }
                                    />
                                  </div>

                                  {payment.email && (
                                    <div
                                      style={{
                                        marginTop:
                                          10,
                                        fontSize:
                                          12,
                                        color:
                                          "#777",
                                      }}
                                    >
                                      Email:{" "}
                                      {
                                        payment.email
                                      }
                                    </div>
                                  )}

                                  {payment.contact && (
                                    <div
                                      style={{
                                        marginTop:
                                          5,
                                        fontSize:
                                          12,
                                        color:
                                          "#777",
                                      }}
                                    >
                                      Contact:{" "}
                                      {
                                        payment.contact
                                      }
                                    </div>
                                  )}
                                </div>

                                {/* ACTION */}

                                <div>
                                  {isMapped ? (
                                    <div
                                      style={{
                                        padding:
                                          "9px 14px",
                                        background:
                                          "#d1fae5",
                                        color:
                                          "#047857",
                                        borderRadius:
                                          8,
                                        fontWeight:
                                          700,
                                        fontSize:
                                          13,
                                      }}
                                    >
                                      ✓ Mapped
                                    </div>
                                  ) : isCaptured ? (
                                    <button
                                      onClick={() =>
                                        mapRazorpayPayment(
                                          selectedOrder,
                                          payment
                                        )
                                      }
                                      disabled={
                                        mappingPaymentId ===
                                        payment.id
                                      }
                                      style={{
                                        padding:
                                          "10px 16px",
                                        background:
                                          mappingPaymentId ===
                                          payment.id
                                            ? "#999"
                                            : "#111",
                                        color:
                                          "#fff",
                                        border:
                                          "none",
                                        borderRadius:
                                          8,
                                        cursor:
                                          mappingPaymentId ===
                                          payment.id
                                            ? "wait"
                                            : "pointer",
                                        fontWeight:
                                          700,
                                      }}
                                    >
                                      {mappingPaymentId ===
                                      payment.id
                                        ? "Mapping..."
                                        : "Map Payment"}
                                    </button>
                                  ) : (
                                    <div
                                      style={{
                                        padding:
                                          "9px 12px",
                                        background:
                                          "#fef2f2",
                                        color:
                                          "#b91c1c",
                                        borderRadius:
                                          8,
                                        fontSize:
                                          12,
                                        fontWeight:
                                          600,
                                      }}
                                    >
                                      Cannot Map
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* PAYMENT STATUS MESSAGE */}

                              {!isCaptured &&
                                !isMapped && (
                                  <div
                                    style={{
                                      marginTop:
                                        14,
                                      padding:
                                        10,
                                      background:
                                        "#fef2f2",
                                      color:
                                        "#991b1b",
                                      borderRadius:
                                        7,
                                      fontSize:
                                        12,
                                    }}
                                  >
                                    This payment
                                    cannot be
                                    mapped because
                                    its Razorpay
                                    status is{" "}
                                    <strong>
                                      {
                                        payment.status
                                      }
                                    </strong>
                                    .
                                  </div>
                                )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              )}

            {/* FOOTER */}

            <div
              style={{
                marginTop: 25,
                paddingTop: 18,
                borderTop:
                  "1px solid #eee",
                display: "flex",
                justifyContent:
                  "flex-end",
              }}
            >
              <button
                onClick={
                  closeRazorpayPayments
                }
                style={{
                  padding:
                    "10px 18px",
                  border:
                    "1px solid #ddd",
                  borderRadius: 8,
                  background:
                    "#fff",
                  cursor:
                    "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CARD
// ============================================================

function Card({
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: 22,
        boxShadow:
          "0 3px 15px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          color: "#777",
          fontSize: 14,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginTop: 8,
        }}
      >
        {value ?? 0}
      </div>
    </div>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  value,
  payment = false,
}) {
  const text =
    value || "UNKNOWN";

  let background =
    "#f3f4f6";

  let color =
    "#374151";

  const normalized =
    String(text).toUpperCase();

  if (
    normalized ===
      "CAPTURED" ||
    normalized ===
      "PAID" ||
    normalized ===
      "DELIVERED"
  ) {
    background =
      "#dcfce7";

    color =
      "#166534";
  }

  if (
    normalized ===
      "FAILED" ||
    normalized ===
      "PAYMENT_FAILED" ||
    normalized ===
      "CANCELLED"
  ) {
    background =
      "#fee2e2";

    color =
      "#991b1b";
  }

  if (
    normalized ===
      "PENDING" ||
    normalized ===
      "PENDING_PAYMENT" ||
    normalized ===
      "AUTHORIZED"
  ) {
    background =
      "#fef3c7";

    color =
      "#92400e";
  }

  if (
    normalized ===
      "PROCESSING" ||
    normalized ===
      "PACKED" ||
    normalized ===
      "SHIPPED" ||
    normalized ===
      "OUT_FOR_DELIVERY"
  ) {
    background =
      "#dbeafe";

    color =
      "#1d4ed8";
  }

  return (
    <span
      style={{
        display:
          "inline-block",
        padding:
          "5px 9px",
        borderRadius: 999,
        background,
        color,
        fontSize: 11,
        fontWeight: 700,
        whiteSpace:
          "nowrap",
      }}
    >
      {text}
    </span>
  );
}

// ============================================================
// INFO BOX
// ============================================================

function InfoBox({
  label,
  value,
}) {
  return (
    <div
      style={{
        background: "#f8f8f8",
        borderRadius: 10,
        padding: 14,
      }}
    >
      <div
        style={{
          color: "#777",
          fontSize: 11,
          marginBottom: 5,
          textTransform:
            "uppercase",
          letterSpacing:
            ".04em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: 600,
          fontSize: 13,
          wordBreak:
            "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ============================================================
// SMALL INFO
// ============================================================

function SmallInfo({
  label,
  value,
}) {
  return (
    <div>
      <div
        style={{
          color: "#888",
          fontSize: 10,
          textTransform:
            "uppercase",
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 3,
          fontSize: 13,
          fontWeight: 600,
          textTransform:
            label === "Status"
              ? "uppercase"
              : "none",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ============================================================
// TABLE STYLES
// ============================================================

const th = {
  textAlign: "left",
  padding: 12,
  borderBottom:
    "1px solid #ddd",
  fontSize: 12,
  color: "#666",
  whiteSpace: "nowrap",
};

const td = {
  padding: 12,
  borderBottom:
    "1px solid #eee",
  verticalAlign:
    "middle",
  fontSize: 13,
};