import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Customers", path: "/dashboard/customers" },
    { name: "Orders", path: "/dashboard/orders" },
    { name: "Post Style", path: "/dashboard/post-style" },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-brand">
        <h2>FASHION</h2>
        <p>Order Management</p>
      </div>

      <nav className="dashboard-sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `dashboard-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;