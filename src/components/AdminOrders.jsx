import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  LogIn,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Truck,
  XCircle,
} from "lucide-react";

import "../components/Home.css";

import TestimonialsManager from "./TestimonialsManager.jsx";

const API =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.rjrinfinity.com/api";

const money = (v) =>
  `₹${Number(v || 0).toLocaleString("en-IN")}`;

const dateTime = (v) =>
  v ? new Date(v).toLocaleString("en-IN") : "—";

const STATUS_OPTIONS = [
  "PENDING_PAYMENT",
  "PAYMENT_FAILED",
  "PAID",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

/* =========================================================
   ADMIN LOGIN
========================================================= */

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const r = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const d = await r.json();

      if (!r.ok || !d.success) {
        throw new Error(
          d.error || "Login failed."
        );
      }

      localStorage.setItem(
        "griphill_admin_token",
        d.token
      );

      onLogin(d.token);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-card admin-login-card">
        <p className="eyebrow">
          GRIP HILL / ADMIN
        </p>

        <h1>Commerce control.</h1>

        <p className="admin-subtitle">
          Manage sales, orders, payments,
          deliveries, inventory and customer
          enquiries from one place.
        </p>

        <form
          className="checkout-form"
          onSubmit={submit}
        >
          <label>
            Username or email

            <input
              value={form.usernameOrEmail}
              onChange={(e) =>
                setForm({
                  ...form,
                  usernameOrEmail:
                    e.target.value,
                })
              }
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button
            className="button button-dark full-width"
            disabled={loading}
          >
            {loading
              ? "Signing in…"
              : "Sign in"}

            <LogIn size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function Stat({
  label,
  value,
  note,
  icon: Icon,
}) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon">
        <Icon size={17} />
      </div>

      <span>{label}</span>

      <strong>{value}</strong>

      {note && <small>{note}</small>}
    </div>
  );
}

/* =========================================================
   MAIN ADMIN DASHBOARD
========================================================= */

export default function AdminOrders() {
  const [token, setToken] = useState(
    () =>
      localStorage.getItem(
        "griphill_admin_token"
      ) || ""
  );

  const [data, setData] = useState(null);

  const [tab, setTab] =
    useState("overview");

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [query, setQuery] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [paymentFilter, setPaymentFilter] =
    useState("");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = () => {
    localStorage.removeItem(
      "griphill_admin_token"
    );

    setToken("");
    setData(null);
  };

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  const load = async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const r = await fetch(
        `${API}/griphill/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const d = await r.json();

      if (r.status === 401) {
        logout();

        throw new Error(
          "Admin session expired. Please sign in again."
        );
      }

      if (!r.ok || !d.success) {
        throw new Error(
          d.error ||
            "Unable to load dashboard."
        );
      }

      setData(d);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     AUTO REFRESH
  ======================================================= */

  useEffect(() => {
    load();

    const id = setInterval(
      load,
      20000
    );

    return () =>
      clearInterval(id);
  }, [token]);

  /* =======================================================
     FILTER ORDERS
  ======================================================= */

  const filteredOrders = useMemo(() => {
    const orders = data?.orders || [];

    return orders.filter(
      (o) =>
        (
          !query ||
          `${o.order_number} ${o.customer_name} ${o.customer_email} ${o.customer_phone}`
            .toLowerCase()
            .includes(
              query.toLowerCase()
            )
        ) &&
        (
          !statusFilter ||
          o.status === statusFilter
        ) &&
        (
          !paymentFilter ||
          o.payment_status ===
            paymentFilter
        )
    );
  }, [
    data,
    query,
    statusFilter,
    paymentFilter,
  ]);

  /* =======================================================
     UPDATE ORDER STATUS
  ======================================================= */

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      const r = await fetch(
        `${API}/griphill/admin/orders/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const d = await r.json();

      if (!r.ok || !d.success) {
        throw new Error(
          d.error ||
            "Status update failed."
        );
      }

      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  /* =======================================================
     UPDATE TRACKING
  ======================================================= */

  const updateTracking = async (
    order
  ) => {
    const tracking = window.prompt(
      "Tracking number",
      order.tracking_number || ""
    );

    if (tracking === null) return;

    const courier = window.prompt(
      "Courier name",
      order.courier_name || ""
    );

    if (courier === null) return;

    const estimated = window.prompt(
      "Estimated delivery date (YYYY-MM-DD)",
      order.estimated_delivery_date
        ? String(
            order.estimated_delivery_date
          ).slice(0, 10)
        : ""
    );

    if (estimated === null) return;

    try {
      const r = await fetch(
        `${API}/griphill/admin/orders/${order.id}/tracking`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            trackingNumber: tracking,
            courierName: courier,
            estimatedDeliveryDate:
              estimated,
          }),
        }
      );

      const d = await r.json();

      if (!r.ok || !d.success) {
        throw new Error(
          d.error ||
            "Tracking update failed."
        );
      }

      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  /* =======================================================
     UPDATE PRODUCT STOCK
  ======================================================= */

  const updateProduct = async (
    product
  ) => {
    const stock = window.prompt(
      `Stock quantity for ${product.name}`,
      String(
        product.stock_quantity ?? 0
      )
    );

    if (stock === null) return;

    try {
      const r = await fetch(
        `${API}/griphill/admin/products/${product.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stockQuantity:
              Number(stock),
            inventoryManaged: true,
          }),
        }
      );

      const d = await r.json();

      if (!r.ok || !d.success) {
        throw new Error(
          d.error ||
            "Inventory update failed."
        );
      }

      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  /* =======================================================
     LOGIN SCREEN
  ======================================================= */

  if (!token) {
    return (
      <AdminLogin
        onLogin={setToken}
      />
    );
  }

  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (!data && loading) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p className="eyebrow">
            GRIP HILL / ADMIN
          </p>

          <h1>
            Loading commerce data…
          </h1>
        </div>
      </div>
    );
  }

  const summary =
    data?.summary || {};

  /* =======================================================
     DASHBOARD
  ======================================================= */

  return (
    <div className="admin-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="admin-header">
        <div>
          <p className="eyebrow">
            GRIP HILL / LIVE COMMERCE
          </p>

          <h1>
            Commerce control.
          </h1>

          <p className="admin-subtitle">
            Sales, payments, fulfilment and
            customer support.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            className="button button-dark"
            onClick={load}
          >
            <RefreshCw size={15} />

            {loading
              ? "Refreshing…"
              : "Refresh"}
          </button>

          <button
            className="admin-logout"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="form-error admin-alert">
          {error}

          <button
            onClick={() =>
              setError("")
            }
          >
            <XCircle size={15} />
          </button>
        </div>
      )}

      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="admin-stats">
        <Stat
          label="Paid sales"
          value={money(
            summary.paid_amount
          )}
          note={`${summary.successful_payments || 0} successful payments`}
          icon={BarChart3}
        />

        <Stat
          label="Today's sales"
          value={money(
            data?.today?.amount
          )}
          note={`${data?.today?.orders || 0} paid orders today`}
          icon={CreditCard}
        />

        <Stat
          label="Orders"
          value={
            summary.orders || 0
          }
          note={`${summary.pending_payments || 0} awaiting payment`}
          icon={Package}
        />

        <Stat
          label="Deliveries"
          value={
            summary.active_deliveries ||
            0
          }
          note={`${summary.delivered_orders || 0} delivered`}
          icon={Truck}
        />
      </div>

      {/* =====================================================
          NAVIGATION TABS
      ====================================================== */}

      <div className="admin-tabs">
        {[
          [
            "overview",
            "Overview",
          ],

          [
            "orders",
            "Orders",
          ],

          [
            "payments",
            "Payments",
          ],

          [
            "deliveries",
            "Deliveries",
          ],

          [
            "inventory",
            "Inventory",
          ],

          [
            "testimonials",
            "Testimonials",
          ],

          [
            "contacts",
            "Write to us",
          ],
        ].map(
          ([key, label]) => (
            <button
              key={key}
              className={
                tab === key
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTab(key)
              }
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* =====================================================
          OVERVIEW
      ====================================================== */}

      {tab === "overview" && (
        <div className="admin-overview-grid">

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <p className="eyebrow">
                  SALES
                </p>

                <h2>
                  Performance
                </h2>
              </div>
            </div>

            <div className="overview-metrics">

              <div>
                <span>
                  This month
                </span>

                <strong>
                  {money(
                    data?.month?.amount
                  )}
                </strong>

                <small>
                  {data?.month
                    ?.orders || 0}{" "}
                  paid orders
                </small>
              </div>

              <div>
                <span>
                  Average order
                </span>

                <strong>
                  {money(
                    summary.average_order_value
                  )}
                </strong>

                <small>
                  Across captured payments
                </small>
              </div>

              <div>
                <span>
                  Failed payments
                </span>

                <strong>
                  {summary.failed_payments ||
                    0}
                </strong>

                <small>
                  Review in Payments
                </small>
              </div>

              <div>
                <span>
                  Cancelled
                </span>

                <strong>
                  {summary.cancelled_orders ||
                    0}
                </strong>

                <small>
                  Order status
                </small>
              </div>

            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <p className="eyebrow">
                  STATUS
                </p>

                <h2>
                  Order pipeline
                </h2>
              </div>
            </div>

            <div className="status-bars">
              {(data?.statuses ||
                []).map((s) => (
                <div
                  key={s.status}
                >
                  <div>
                    <span>
                      {s.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>

                    <strong>
                      {s.count}
                    </strong>
                  </div>

                  <i
                    style={{
                      width: `${Math.min(
                        100,
                        (s.count /
                          Math.max(
                            1,
                            summary.orders
                          )) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel admin-wide">

            <div className="admin-panel-head">
              <div>
                <p className="eyebrow">
                  RECENT ORDERS
                </p>

                <h2>
                  Latest activity
                </h2>
              </div>

              <button
                className="text-link"
                onClick={() =>
                  setTab("orders")
                }
              >
                View all

                <ChevronDown
                  size={15}
                />
              </button>
            </div>

            <OrderTable
              orders={(
                data?.orders || []
              ).slice(0, 8)}
              onStatus={
                updateStatus
              }
              onTracking={
                updateTracking
              }
              onSelect={
                setSelectedOrder
              }
            />

          </section>
        </div>
      )}

      {/* =====================================================
          ORDERS
      ====================================================== */}

      {tab === "orders" && (
        <section className="admin-panel">

          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">
                ORDER MANAGEMENT
              </p>

              <h2>
                All orders
              </h2>
            </div>

            <span className="admin-count">
              {filteredOrders.length}{" "}
              shown
            </span>
          </div>

          <div className="admin-filters">

            <label>
              <Search size={15} />

              <input
                value={query}
                onChange={(e) =>
                  setQuery(
                    e.target.value
                  )
                }
                placeholder="Search order, customer, phone…"
              />
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="">
                All statuses
              </option>

              {STATUS_OPTIONS.map(
                (s) => (
                  <option
                    key={s}
                  >
                    {s}
                  </option>
                )
              )}
            </select>

            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(
                  e.target.value
                )
              }
            >
              <option value="">
                All payments
              </option>

              <option>
                CREATED
              </option>

              <option>
                CAPTURED
              </option>

              <option>
                FAILED
              </option>

              <option>
                REFUNDED
              </option>
            </select>

          </div>

          <OrderTable
            orders={
              filteredOrders
            }
            onStatus={
              updateStatus
            }
            onTracking={
              updateTracking
            }
            onSelect={
              setSelectedOrder
            }
          />

        </section>
      )}

      {/* =====================================================
          PAYMENTS
      ====================================================== */}

      {tab === "payments" && (
        <section className="admin-panel">

          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">
                RAZORPAY
              </p>

              <h2>
                Payments
              </h2>
            </div>
          </div>

          <div className="admin-table-scroll">
            <table className="admin-data-table">

              <thead>
                <tr>
                  <th>
                    Payment
                  </th>

                  <th>
                    Order
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Method
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {(data?.payments ||
                  []).map((p) => (
                  <tr key={p.id}>

                    <td>
                      <strong>
                        {
                          p.razorpay_payment_id ||
                          "—"
                        }
                      </strong>

                      <small>
                        {
                          p.razorpay_order_id ||
                          "—"
                        }
                      </small>
                    </td>

                    <td>
                      {p.order_number}
                    </td>

                    <td>
                      {p.customer_name}

                      <small>
                        {p.email}
                      </small>
                    </td>

                    <td>
                      {money(p.amount)}
                    </td>

                    <td>
                      {p.method ||
                        "—"}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${String(
                          p.status
                        ).toLowerCase()}`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td>
                      {dateTime(
                        p.created_at
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </section>
      )}

      {/* =====================================================
          DELIVERIES
      ====================================================== */}

      {tab === "deliveries" && (
        <section className="admin-panel">

          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">
                FULFILMENT
              </p>

              <h2>
                Deliveries
              </h2>
            </div>
          </div>

          <div className="admin-table-scroll">

            <table className="admin-data-table">

              <thead>
                <tr>
                  <th>
                    Order
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Courier
                  </th>

                  <th>
                    Tracking
                  </th>

                  <th>
                    ETA
                  </th>

                  <th>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {(data?.deliveries ||
                  []).map((o) => (
                  <tr key={o.id}>

                    <td>
                      <strong>
                        {o.order_number}
                      </strong>

                      <small>
                        {dateTime(
                          o.created_at
                        )}
                      </small>
                    </td>

                    <td>
                      {o.customer_name}

                      <small>
                        {o.customer_phone}
                      </small>
                    </td>

                    <td>
                      <span className="status-pill">
                        {
                          o.delivery_status ||
                          o.status
                        }
                      </span>
                    </td>

                    <td>
                      {o.courier_name ||
                        "—"}
                    </td>

                    <td>
                      {o.tracking_number ||
                        "—"}
                    </td>

                    <td>
                      {o.estimated_delivery_date
                        ? String(
                            o.estimated_delivery_date
                          ).slice(0, 10)
                        : "—"}
                    </td>

                    <td>
                      <button
                        className="mini-button"
                        onClick={() =>
                          updateTracking(o)
                        }
                      >
                        <Truck
                          size={13}
                        />

                        Update
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </section>
      )}

      {/* =====================================================
          INVENTORY
      ====================================================== */}

      {tab === "inventory" && (
        <section className="admin-panel">

          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">
                CATALOGUE
              </p>

              <h2>
                Inventory
              </h2>
            </div>
          </div>

          <div className="admin-table-scroll">

            <table className="admin-data-table">

              <thead>
                <tr>
                  <th>
                    Product
                  </th>

                  <th>
                    SKU
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    MRP
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Inventory mode
                  </th>

                  <th>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {(data?.products ||
                  []).map((p) => (
                  <tr key={p.id}>

                    <td>
                      <div className="admin-product">

                        <img
                          src={`${p.image_url}`}
                          alt=""
                        />

                        <strong>
                          {p.name}
                        </strong>

                      </div>
                    </td>

                    <td>
                      {p.sku}
                    </td>

                    <td>
                      {money(p.price)}
                    </td>

                    <td>
                      {money(p.mrp)}
                    </td>

                    <td>
                      <strong>
                        {p.stock_quantity}
                      </strong>
                    </td>

                    <td>
                      {p.inventory_managed
                        ? "Managed"
                        : "Open sale"}
                    </td>

                    <td>
                      <button
                        className="mini-button"
                        onClick={() =>
                          updateProduct(p)
                        }
                      >
                        Update stock
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </section>
      )}

      {/* =====================================================
          TESTIMONIALS
      ====================================================== */}

      {tab === "testimonials" && (
        <section className="admin-panel">

          <TestimonialsManager />

        </section>
      )}

      {/* =====================================================
          WRITE TO US
      ====================================================== */}

      {tab === "contacts" && (
        <section className="admin-panel">

          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">
                CUSTOMER SUPPORT
              </p>

              <h2>
                Write to us
              </h2>
            </div>
          </div>

          <div className="admin-table-scroll">

            <table className="admin-data-table">

              <thead>
                <tr>
                  <th>
                    Reference
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Subject
                  </th>

                  <th>
                    Order
                  </th>

                  <th>
                    Message
                  </th>

                  <th>
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {(data?.contacts ||
                  []).map((c) => (
                  <tr key={c.id}>

                    <td>
                      <strong>
                        {
                          c.reference_number
                        }
                      </strong>
                    </td>

                    <td>
                      {c.name}

                      <small>
                        {c.email}
                        <br />
                        {c.phone}
                      </small>
                    </td>

                    <td>
                      {c.subject}
                    </td>

                    <td>
                      {c.order_number ||
                        "—"}
                    </td>

                    <td className="contact-message">
                      {c.message}
                    </td>

                    <td>
                      {dateTime(
                        c.created_at
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </section>
      )}

      {/* =====================================================
          LIVE STATUS
      ====================================================== */}

      <p className="admin-live">
        <CheckCircle2 size={14} />

        Live dashboard refreshes every
        20 seconds. Razorpay webhooks
        remain the payment source of
        truth.
      </p>

      {/* =====================================================
          ORDER DETAIL
      ====================================================== */}

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
        />
      )}

    </div>
  );
}

/* =========================================================
   ORDER TABLE
========================================================= */

function OrderTable({
  orders,
  onStatus,
  onTracking,
  onSelect,
}) {
  return (
    <div className="admin-table-scroll">

      <table className="admin-data-table">

        <thead>
          <tr>
            <th>
              Order
            </th>

            <th>
              Customer
            </th>

            <th>
              Items
            </th>

            <th>
              Amount
            </th>

            <th>
              Payment
            </th>

            <th>
              Status
            </th>

            <th>
              Delivery
            </th>

            <th />
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>

              <td>
                <button
                  className="admin-order-link"
                  onClick={() =>
                    onSelect(o)
                  }
                >
                  <strong>
                    {o.order_number}
                  </strong>
                </button>

                <small>
                  {dateTime(
                    o.created_at
                  )}
                </small>
              </td>

              <td>
                {o.customer_name}

                <small>
                  {o.customer_email}
                  <br />
                  {o.customer_phone}
                </small>
              </td>

              <td>
                {o.items
                  ?.map(
                    (i) =>
                      `${i.product_name || i.name} × ${i.quantity}`
                  )
                  .join(", ") ||
                  "—"}
              </td>

              <td>
                <strong>
                  {money(
                    o.total_amount
                  )}
                </strong>
              </td>

              <td>
                <span
                  className={`status-pill ${String(
                    o.payment_status
                  ).toLowerCase()}`}
                >
                  {o.payment_status}
                </span>
              </td>

              <td>
                <select
                  value={o.status}
                  onChange={(e) =>
                    onStatus(
                      o.id,
                      e.target.value
                    )
                  }
                >
                  {STATUS_OPTIONS.map(
                    (s) => (
                      <option
                        key={s}
                      >
                        {s}
                      </option>
                    )
                  )}
                </select>
              </td>

              <td>
                <small>
                  {o.courier_name ||
                    "Not assigned"}
                </small>

                <br />

                <strong>
                  {o.tracking_number ||
                    "—"}
                </strong>
              </td>

              <td>
                <button
                  className="mini-button"
                  onClick={() =>
                    onTracking(o)
                  }
                >
                  <Truck
                    size={13}
                  />

                  Track
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

      {!orders.length && (
        <div className="admin-empty">

          <Package size={25} />

          <p>
            No orders match the
            current filters.
          </p>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   ORDER DETAIL
========================================================= */

function OrderDetail({
  order,
  onClose,
}) {
  return (
    <div
      className="admin-detail-backdrop"
      onClick={onClose}
    >
      <div
        className="admin-detail"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <button
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>

        <p className="eyebrow">
          ORDER DETAIL
        </p>

        <h2>
          {order.order_number}
        </h2>

        <div className="detail-customer">

          <div>
            <span>
              Customer
            </span>

            <strong>
              {order.customer_name}
            </strong>

            <small>
              {order.customer_email}
              <br />
              {order.customer_phone}
            </small>
          </div>

          <div>
            <span>
              Payment
            </span>

            <strong>
              {order.payment_status}
            </strong>

            <small>
              {order.razorpay_payment_id ||
                "Pending gateway ID"}
            </small>
          </div>

          <div>
            <span>
              Delivery
            </span>

            <strong>
              {order.status}
            </strong>

            <small>
              {order.courier_name ||
                "Courier not assigned"}{" "}
              ·{" "}
              {order.tracking_number ||
                "No tracking number"}
            </small>
          </div>

        </div>

        <div className="detail-address">
          <MapPinText
            address={order}
          />
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   ADDRESS
========================================================= */

function MapPinText({
  address,
}) {
  return (
    <p>

      <MapPin
        size={14}
        style={{
          verticalAlign:
            "middle",
          marginRight: 6,
        }}
      />

      <strong>
        Shipping address
      </strong>

      <br />

      {address.address_line1}

      {address.address_line2 && (
        <>
          <br />
          {address.address_line2}
        </>
      )}

      <br />

      {address.city},{" "}
      {address.state} —{" "}
      {address.pincode}

      <br />

      {address.country}

    </p>
  );
}