import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiLogOut,
} from "react-icons/fi";
import "./MyAccount.css";

const API_BASE_URL = "http://127.0.0.1:8000";

const MyAccount = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");

      if (!savedUser || !token) {
        navigate("/login");
        return;
      }

      setCurrentUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("Failed to load current user:", error);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setFetchError("");

        const response = await fetch(`${API_BASE_URL}/api/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load your orders.");
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch account orders:", error);
        setFetchError("Unable to load your orders right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const myOrders = useMemo(() => {
    return orders;
  }, [orders]);

  const totalOrders = myOrders.length;

  const pendingOrders = myOrders.filter(
    (order) => formatStatus(order.status) === "Pending"
  ).length;

  const inProgressOrders = myOrders.filter(
    (order) => formatStatus(order.status) === "In Progress"
  ).length;

  const completedOrders = myOrders.filter((order) => {
    const status = formatStatus(order.status);
    return status === "Completed" || status === "Delivered" || status === "Ready";
  }).length;

  const latestOrder = useMemo(() => {
    if (!myOrders.length) return null;

    return [...myOrders].sort((a, b) => {
      const aTime = new Date(a.created_at || a.delivery_date).getTime();
      const bTime = new Date(b.created_at || b.delivery_date).getTime();
      return bTime - aTime;
    })[0];
  }, [myOrders]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="my-account-page">
      <header className="my-account-header">
        <div className="my-account-header-inner">
          <button
            type="button"
            className="my-account-back"
            onClick={() => navigate("/")}
          >
            <FiArrowLeft /> Back Home
          </button>

          <h1>My Account</h1>

          <button
            type="button"
            className="my-account-logout"
            onClick={handleLogout}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <main className="my-account-main">
        <section className="my-account-profile-card">
          <div className="my-account-profile-icon">
            <FiUser />
          </div>

          <div className="my-account-profile-info">
            <h2>{currentUser?.full_name || "Customer"}</h2>
            <p className="my-account-role-badge">Customer Account</p>

            <div className="my-account-profile-meta">
              <span>
                <FiMail /> {currentUser?.email || "No email"}
              </span>
              <span>
                <FiPhone /> {currentUser?.phone || "No phone"}
              </span>
              <span>
                <FiMapPin /> Glora Stitches
              </span>
            </div>
          </div>
        </section>

        <section className="my-account-summary-grid">
          <div className="my-account-summary-card">
            <div className="my-account-summary-icon">
              <FiPackage />
            </div>
            <div>
              <h3>Total Orders</h3>
              <h2>{totalOrders}</h2>
            </div>
          </div>

          <div className="my-account-summary-card">
            <div className="my-account-summary-icon">
              <FiClock />
            </div>
            <div>
              <h3>Pending</h3>
              <h2>{pendingOrders}</h2>
            </div>
          </div>

          <div className="my-account-summary-card">
            <div className="my-account-summary-icon">
              <FiPackage />
            </div>
            <div>
              <h3>In Progress</h3>
              <h2>{inProgressOrders}</h2>
            </div>
          </div>

          <div className="my-account-summary-card">
            <div className="my-account-summary-icon">
              <FiCheckCircle />
            </div>
            <div>
              <h3>Completed</h3>
              <h2>{completedOrders}</h2>
            </div>
          </div>
        </section>

        <section className="my-account-highlight-card">
          <div>
            <h2>Latest Order</h2>
            <p>Quick view of your most recent order.</p>
          </div>

          {latestOrder ? (
            <div className="my-account-highlight-content">
              <div className="my-account-highlight-image">
                {latestOrder.selected_image_url || latestOrder.ref_photo ? (
                  <img
                    src={latestOrder.selected_image_url || latestOrder.ref_photo}
                    alt={latestOrder.style_name}
                  />
                ) : (
                  <div className="my-account-no-image">No Image</div>
                )}
              </div>

              <div className="my-account-highlight-info">
                <h3>{latestOrder.style_name}</h3>
                <p>
                  Code: <strong>{latestOrder.style_code || "Custom"}</strong>
                </p>
                <p>
                  Fabric: <strong>{latestOrder.fabric}</strong>
                </p>
                <p>
                  Deposit:{" "}
                  <strong>
                    GH₵ {Number(latestOrder.deposit_amount || 0).toFixed(2)}
                  </strong>
                </p>
                <p>
                  Status:{" "}
                  <span
                    className={`my-account-status ${formatStatus(latestOrder.status)
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {formatStatus(latestOrder.status)}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="my-account-empty-card">
              You have not placed any orders yet.
            </div>
          )}
        </section>

        <section className="my-account-orders-card">
          <div className="my-account-orders-head">
            <div>
              <h2>My Orders</h2>
              <p>Track everything you have ordered.</p>
            </div>
          </div>

          <div className="my-account-orders-table-wrap">
            <table className="my-account-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Style</th>
                  <th>Code</th>
                  <th>Fabric</th>
                  <th>Deposit</th>
                  <th>Status</th>
                  <th>Delivery Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="my-account-empty">
                      Loading your orders...
                    </td>
                  </tr>
                ) : fetchError ? (
                  <tr>
                    <td colSpan="7" className="my-account-empty">
                      {fetchError}
                    </td>
                  </tr>
                ) : myOrders.length > 0 ? (
                  myOrders.map((order) => (
                    <tr key={order.id}>
                      <td>ORD-{String(order.id).padStart(4, "0")}</td>
                      <td>{order.style_name}</td>
                      <td>{order.style_code || "Custom"}</td>
                      <td>{order.fabric}</td>
                      <td>GH₵ {Number(order.deposit_amount || 0).toFixed(2)}</td>
                      <td>
                        <span
                          className={`my-account-status ${formatStatus(order.status)
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td>{formatDate(order.delivery_date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="my-account-empty">
                      You have not placed any orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

function formatStatus(value) {
  if (!value) return "Pending";

  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default MyAccount;