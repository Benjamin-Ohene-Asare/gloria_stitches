import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/dashboard/Sidebar";
import ModalPop from "../dashboard/ModalPop";
import "./DashboardPage.css";
import "./OrdersPage.css";

const API_BASE_URL = "http://127.0.0.1:8000";

const OrdersPage = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const clearBadTokens = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
  };

  const getToken = () => {
    return (
      localStorage.getItem("access") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token")
    );
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setFetchError("");

      const token = getToken();

      if (!token) {
        clearBadTokens();
        setFetchError("Login expired. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        clearBadTokens();
        setFetchError("Login expired. Please login again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load orders.");
      }

      const orderList = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : [];

      const mappedOrders = orderList.map((order) => ({
        id: `ORD-${String(order.id).padStart(4, "0")}`,
        rawId: order.id,
        customer: order.full_name || "Unknown Customer",
        phone: order.phone || "—",
        whatsapp: order.whatsapp || "—",
        location: order.location || "—",
        city: order.city || "—",
        style: order.style_name || "Custom Style",
        code: order.style_code || "Custom",
        category: order.gender || "—",
        fabric: order.fabric || "—",
        color: order.color || "—",
        amount: `GH₵ ${Number(order.deposit_amount || 0).toFixed(2)}`,
        deposit: `GH₵ ${Number(order.deposit_amount || 0).toFixed(2)}`,
        status: formatStatus(order.status),
        dueDate: formatDate(order.delivery_date),
        urgency: formatStatus(order.urgency),
        paymentMethod: order.payment_method || "—",
        notes: order.notes || "—",
        image: order.selected_image_url || order.ref_photo || "",
        receiptFile: order.receipt_file || "",
        isCustom: order.is_custom || false,
        adminNote: order.admin_note || "",
        measurements: {
          shoulder: order.shoulder ? `${order.shoulder} in` : "—",
          sleeve: order.sleeve ? `${order.sleeve} in` : "—",
          bust: order.bust ? `${order.bust} in` : "—",
          waist: order.waist ? `${order.waist} in` : "—",
          hips: order.hips ? `${order.hips} in` : "—",
          dressLength: order.dress_length ? `${order.dress_length} in` : "—",
          neckF: order.neck_f ? `${order.neck_f} in` : "—",
          chest: order.chest ? `${order.chest} in` : "—",
          waistM: order.waist_m ? `${order.waist_m} in` : "—",
          trouser: order.trouser ? `${order.trouser} in` : "—",
          thigh: order.thigh ? `${order.thigh} in` : "—",
          neckM: order.neck_m ? `${order.neck_m} in` : "—",
        },
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Fetch orders error:", error);
      setFetchError(error.message || "Unable to load orders right now.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return orders.filter((order) => {
      return (
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.style.toLowerCase().includes(term) ||
        order.code.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term) ||
        order.category.toLowerCase().includes(term)
      );
    });
  }, [orders, searchTerm]);

  const pendingCount = orders.filter((order) => order.status === "Pending").length;

  const inProgressCount = orders.filter(
    (order) => order.status === "In Progress"
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered" || order.status === "Completed"
  ).length;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="orders-page-header">
          <div>
            <h1>Orders</h1>
            <p>Track and manage customer orders from placement to delivery.</p>
          </div>

          <button className="orders-add-btn" type="button">
            Create Order
          </button>
        </div>

        <div className="orders-toolbar">
          <input
            type="text"
            placeholder="Search by order ID, customer, style, code, or status"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="orders-search-input"
          />
        </div>

        <div className="orders-summary-grid">
          <div className="orders-summary-card">
            <h3>Total Orders</h3>
            <h2>{orders.length}</h2>
          </div>

          <div className="orders-summary-card">
            <h3>Pending Orders</h3>
            <h2>{pendingCount}</h2>
          </div>

          <div className="orders-summary-card">
            <h3>In Progress</h3>
            <h2>{inProgressCount}</h2>
          </div>

          <div className="orders-summary-card">
            <h3>Delivered</h3>
            <h2>{deliveredCount}</h2>
          </div>
        </div>

        <div className="orders-table-card">
          <div className="orders-table-header">
            <h2>Order Records</h2>
            <p>{filteredOrders.length} order(s) found</p>
          </div>

          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Style</th>
                  <th>Code</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="orders-empty-state">
                      Loading orders...
                    </td>
                  </tr>
                ) : fetchError ? (
                  <tr>
                    <td colSpan="9" className="orders-empty-state">
                      {fetchError}
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.rawId}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.style}</td>
                      <td>{order.code}</td>
                      <td>{order.category}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span
                          className={`order-status-badge ${order.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{order.dueDate}</td>
                      <td>
                        <button
                          className="orders-view-btn"
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsModalOpen(true);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="orders-empty-state">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <ModalPop
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </div>
  );
};

function formatStatus(value) {
  if (!value) return "Pending";

  const normalized = String(value).replace(/_/g, " ").toLowerCase();

  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
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

export default OrdersPage;