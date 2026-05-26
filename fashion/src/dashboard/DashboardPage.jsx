import React from "react";
import Sidebar from "../component/dashboard/Sidebar";
import Topbar from "../component/dashboard/Topbar";
import StatCard from "../component/dashboard/StatCard";
import "./DashboardPage.css";

const DashboardPage = () => {
  const recentOrders = [
    {
      id: "ORD-1001",
      customer: "Akosua Mensah",
      styleCode: "ST-204",
      measurement: "Complete",
      status: "In Progress",
      delivery: "28 Apr 2026",
    },
    {
      id: "ORD-1002",
      customer: "Daniel Kofi",
      styleCode: "ST-115",
      measurement: "Pending",
      status: "Awaiting Measurement",
      delivery: "30 Apr 2026",
    },
    {
      id: "ORD-1003",
      customer: "Mabel Serwaa",
      styleCode: "ST-301",
      measurement: "Complete",
      status: "Ready",
      delivery: "25 Apr 2026",
    },
    {
      id: "ORD-1004",
      customer: "Sandra Agyeman",
      styleCode: "ST-188",
      measurement: "Complete",
      status: "Delivered",
      delivery: "22 Apr 2026",
    },
  ];

  const recentCustomers = [
    "Akosua Mensah",
    "Daniel Kofi",
    "Mabel Serwaa",
    "Sandra Agyeman",
  ];

  const popularStyles = [
    "ST-204 | Women Occasion Dress",
    "ST-115 | Men Kaftan Set",
    "ST-301 | Lace Gown",
    "ST-188 | Custom Two-Piece",
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <Topbar />

        <section className="dashboard-stats-grid">
          <StatCard
            title="Total Customers"
            value="248"
            note="Centralized customer records"
          />
          <StatCard
            title="Total Orders"
            value="126"
            note="All orders linked to styles"
          />
          <StatCard
            title="Orders In Progress"
            value="34"
            note="Currently in production"
          />
          <StatCard
            title="Ready for Delivery"
            value="12"
            note="Orders ready for pickup"
          />
          <StatCard
            title="Completed Orders"
            value="80"
            note="Successfully delivered"
          />
          <StatCard
            title="Pending Measurements"
            value="9"
            note="Measurements not yet recorded"
          />
        </section>

        <section className="dashboard-content-grid">
          <div className="dashboard-panel dashboard-large-panel">
            <div className="panel-header">
              <h2>Recent Orders</h2>
              <p>Track customer orders from placement to delivery.</p>
            </div>

            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Style Code</th>
                    <th>Measurement</th>
                    <th>Status</th>
                    <th>Delivery Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.styleCode}</td>
                      <td>{order.measurement}</td>
                      <td>
                        <span
                          className={`status-badge ${order.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{order.delivery}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-side-column">
            <div className="dashboard-panel">
              <div className="panel-header">
                <h2>Quick Actions</h2>
                <p>Fast shortcuts for daily work.</p>
              </div>

              <div className="quick-actions-grid">
                <button>Add New Customer</button>
                <button>Create New Order</button>
                <button>Add New Style</button>
                <button>Record Measurement</button>
                <button>Update Status</button>
                <button>View Reports</button>
              </div>
            </div>

            <div className="dashboard-panel">
              <div className="panel-header">
                <h2>Order Status Summary</h2>
                <p>Overview of current workflow.</p>
              </div>

              <div className="summary-list">
                <div className="summary-item">
                  <span>Awaiting Measurement</span>
                  <strong>9</strong>
                </div>
                <div className="summary-item">
                  <span>In Progress</span>
                  <strong>34</strong>
                </div>
                <div className="summary-item">
                  <span>Ready</span>
                  <strong>12</strong>
                </div>
                <div className="summary-item">
                  <span>Delivered</span>
                  <strong>80</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-bottom-grid">
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2>Recent Customers</h2>
              <p>Recently added customer records.</p>
            </div>

            <div className="simple-list">
              {recentCustomers.map((customer) => (
                <div key={customer} className="simple-list-item">
                  <span>{customer}</span>
                  <button>View</button>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-header">
              <h2>Popular Styles Catalogue</h2>
              <p>Frequently selected fashion styles.</p>
            </div>

            <div className="simple-list">
              {popularStyles.map((style) => (
                <div key={style} className="simple-list-item">
                  <span>{style}</span>
                  <button>Open</button>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-header">
              <h2>System Benefits Focus</h2>
              <p>Core goals of the platform.</p>
            </div>

            <div className="benefits-box">
              <p>Centralized customer and order records</p>
              <p>Better style selection reference using codes</p>
              <p>Reduced production errors</p>
              <p>Improved tracking from placement to delivery</p>
              <p>More reliable business record management</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;