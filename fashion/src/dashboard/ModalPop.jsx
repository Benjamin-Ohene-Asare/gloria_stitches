import React from "react";
import { FiX } from "react-icons/fi";
import "./ModalPop.css";

const ModalPop = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="modalpop-overlay" onClick={onClose}>
      <div className="modalpop-card" onClick={(e) => e.stopPropagation()}>
        <button className="modalpop-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="modalpop-header">
          <div>
            <p className="modalpop-label">Order Details</p>
            <h2>{order.id}</h2>
          </div>
          <span
            className={`modalpop-status ${order.status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {order.status}
          </span>
        </div>

        <div className="modalpop-grid">
          <section className="modalpop-section">
            <h3>Customer Information</h3>
            <div className="modalpop-info-list">
              <div><span>Full Name</span><strong>{order.customer}</strong></div>
              <div><span>Phone</span><strong>{order.phone}</strong></div>
              <div><span>WhatsApp</span><strong>{order.whatsapp}</strong></div>
              <div><span>Location</span><strong>{order.location}</strong></div>
              <div><span>City</span><strong>{order.city}</strong></div>
              <div><span>Gender</span><strong>{order.category}</strong></div>
            </div>
          </section>

          <section className="modalpop-section">
            <h3>Style Information</h3>
            <div className="modalpop-style-box">
              <img src={order.image} alt={order.style} />
              <div className="modalpop-style-text">
                <h4>{order.style}</h4>
                <p>{order.code}</p>
                <p>Fabric: {order.fabric}</p>
                <p>Colour: {order.color}</p>
              </div>
            </div>
          </section>

          <section className="modalpop-section">
            <h3>Measurements</h3>
            <div className="modalpop-info-list">
              <div><span>Shoulder</span><strong>{order.measurements.shoulder}</strong></div>
              <div><span>Sleeve</span><strong>{order.measurements.sleeve}</strong></div>

              {order.category === "Women" ? (
                <>
                  <div><span>Bust</span><strong>{order.measurements.bust}</strong></div>
                  <div><span>Waist</span><strong>{order.measurements.waist}</strong></div>
                  <div><span>Hips</span><strong>{order.measurements.hips}</strong></div>
                  <div><span>Dress Length</span><strong>{order.measurements.dressLength}</strong></div>
                </>
              ) : (
                <>
                  <div><span>Chest</span><strong>{order.measurements.chest}</strong></div>
                  <div><span>Waist</span><strong>{order.measurements.waist}</strong></div>
                  <div><span>Trouser</span><strong>{order.measurements.trouser}</strong></div>
                  <div><span>Thigh</span><strong>{order.measurements.thigh}</strong></div>
                </>
              )}
            </div>
          </section>

          <section className="modalpop-section">
            <h3>Delivery & Payment</h3>
            <div className="modalpop-info-list">
              <div><span>Urgency</span><strong>{order.urgency}</strong></div>
              <div><span>Due Date</span><strong>{order.dueDate}</strong></div>
              <div><span>Amount</span><strong>{order.amount}</strong></div>
              <div><span>Deposit</span><strong>{order.deposit}</strong></div>
              <div><span>Payment Method</span><strong>{order.paymentMethod}</strong></div>
              <div><span>Notes</span><strong>{order.notes || "—"}</strong></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModalPop;