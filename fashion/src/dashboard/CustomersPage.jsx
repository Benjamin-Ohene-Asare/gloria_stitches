import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../component/dashboard/Sidebar";
import "./DashboardPage.css";
import "./CustomersPage.css";

const API_BASE_URL = "http://127.0.0.1:8000";

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchCustomersFromOrders = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const token =
          localStorage.getItem("access") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("token");

        if (!token) {
          throw new Error("You must be logged in to load customers.");
        }

        const response = await fetch(`${API_BASE_URL}/api/orders/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load customer records.");
        }

        const orders = Array.isArray(data) ? data : data.results || [];

        const grouped = new Map();

        orders.forEach((order) => {
          const phoneKey = (order.phone || "").trim();
          const nameKey = (order.full_name || "").trim().toLowerCase();
          const key = phoneKey || nameKey;

          if (!key) return;

          const existing = grouped.get(key);

          const orderDate = order.created_at || order.delivery_date || null;

          const formattedGender =
            order.gender === "Women"
              ? "Female"
              : order.gender === "Men"
              ? "Male"
              : order.gender || "—";

          if (!existing) {
            grouped.set(key, {
              id: key,
              name: order.full_name || "Unknown Customer",
              phone: order.phone || "—",
              gender: formattedGender,
              totalOrders: 1,
              lastOrderRaw: orderDate,
              lastOrder: formatDate(orderDate),
              status: "New",
            });

            return;
          }

          existing.totalOrders += 1;

          if (isLaterDate(orderDate, existing.lastOrderRaw)) {
            existing.lastOrderRaw = orderDate;
            existing.lastOrder = formatDate(orderDate);
          }

          if (!existing.gender || existing.gender === "—") {
            existing.gender = formattedGender;
          }
        });

        const derivedCustomers = Array.from(grouped.values()).map(
          (customer) => ({
            ...customer,
            status:
              customer.totalOrders >= 5
                ? "VIP"
                : customer.totalOrders >= 2
                ? "Active"
                : "New",
          })
        );

        derivedCustomers.sort((a, b) => {
          const aTime = a.lastOrderRaw
            ? new Date(a.lastOrderRaw).getTime()
            : 0;

          const bTime = b.lastOrderRaw
            ? new Date(b.lastOrderRaw).getTime()
            : 0;

          return bTime - aTime;
        });

        setCustomers(derivedCustomers);
      } catch (error) {
        console.error("Fetch customers error:", error);
        setFetchError(error.message || "Unable to load customers right now.");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomersFromOrders();
  }, []);

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(term) ||
        customer.phone.includes(searchTerm) ||
        customer.gender.toLowerCase().includes(term) ||
        customer.status.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, customers]);

  const activeCount = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const vipCount = customers.filter(
    (customer) => customer.status === "VIP"
  ).length;

  const newCount = customers.filter(
    (customer) => customer.status === "New"
  ).length;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="customers-page-header">
          <div>
            <h1>Customers</h1>
            <p>Manage and track all customer records from one place.</p>
          </div>

          <button className="customers-add-btn" type="button">
            Add Customer
          </button>
        </div>

        <div className="customers-toolbar">
          <input
            type="text"
            placeholder="Search by name, phone, gender, or status"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="customers-search-input"
          />
        </div>

        <div className="customers-summary-grid">
          <div className="customers-summary-card">
            <h3>Total Customers</h3>
            <h2>{customers.length}</h2>
          </div>

          <div className="customers-summary-card">
            <h3>Active Customers</h3>
            <h2>{activeCount}</h2>
          </div>

          <div className="customers-summary-card">
            <h3>VIP Customers</h3>
            <h2>{vipCount}</h2>
          </div>

          <div className="customers-summary-card">
            <h3>New Customers</h3>
            <h2>{newCount}</h2>
          </div>
        </div>

        <div className="customers-table-card">
          <div className="customers-table-header">
            <h2>Customer Records</h2>
            <p>{filteredCustomers.length} customer(s) found</p>
          </div>

          <div className="customers-table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Total Orders</th>
                  <th>Last Order</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="customers-empty-state">
                      Loading customers...
                    </td>
                  </tr>
                ) : fetchError ? (
                  <tr>
                    <td colSpan="7" className="customers-empty-state">
                      {fetchError}
                    </td>
                  </tr>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.gender}</td>
                      <td>{customer.totalOrders}</td>
                      <td>{customer.lastOrder}</td>
                      <td>
                        <span
                          className={`customer-status-badge ${customer.status.toLowerCase()}`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td>
                        <button className="customers-view-btn" type="button">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="customers-empty-state">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

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

function isLaterDate(a, b) {
  if (!a && !b) return false;
  if (a && !b) return true;
  if (!a) return false;

  const aTime = new Date(a).getTime();
  const bTime = b ? new Date(b).getTime() : 0;

  if (Number.isNaN(aTime)) return false;
  if (Number.isNaN(bTime)) return true;

  return aTime > bTime;
}

export default CustomersPage;