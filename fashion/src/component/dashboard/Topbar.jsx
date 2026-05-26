import React from "react";
import "./Topbar.css";

const Topbar = () => {
  return (
    <div className="dashboard-topbar">
      <div className="dashboard-topbar-left">
        <h1>Digital Fashion Order Management Dashboard</h1>
        <p>
          Manage customers, styles, measurements, and orders from one central
          system.
        </p>
      </div>

      <div className="dashboard-topbar-right">
        <input
          type="text"
          placeholder="Search customers, styles, orders..."
          className="dashboard-search-input"
        />
        <button className="dashboard-action-btn">New Order</button>
      </div>
    </div>
  );
};

export default Topbar;