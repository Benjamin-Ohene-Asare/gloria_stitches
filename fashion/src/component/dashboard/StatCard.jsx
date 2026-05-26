import React from "react";
import "./StatCard.css";

const StatCard = ({ title, value, note }) => {
  return (
    <div className="dashboard-stat-card">
      <h3>{title}</h3>
      <h2>{value}</h2>
      <p>{note}</p>
    </div>
  );
};

export default StatCard;