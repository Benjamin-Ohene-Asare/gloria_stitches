import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiScissors,
  FiUser,
  FiPackage,
  FiCalendar,
  FiCreditCard,
  FiUpload,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import "./OrderPage.css";

const API_BASE_URL = "http://127.0.0.1:8000";

/* ── STEP DEFINITIONS ── */
const STEPS = [
  { id: 1, label: "Personal Info", icon: <FiUser /> },
  { id: 2, label: "Style & Fabric", icon: <FiScissors /> },
  { id: 3, label: "Measurements", icon: <FiPackage /> },
  { id: 4, label: "Delivery", icon: <FiCalendar /> },
  { id: 5, label: "Payment", icon: <FiCreditCard /> },
];

const FABRICS = ["Ankara", "Kente", "Aso-Oke", "Lace", "Brocade", "Adire", "Other"];
const COLORS = ["Black", "White", "Navy Blue", "Burgundy", "Gold", "Green", "Red", "Custom"];
const GENDERS = ["Women", "Men"];
const URGENCY = [
  { value: "standard", label: "Standard", days: "7–10 days", badge: "" },
  { value: "express", label: "Express", days: "3–5 days", badge: "+20% fee" },
  { value: "urgent", label: "Urgent", days: "1–2 days", badge: "+50% fee" },
];
const PAYMENTS = ["Mobile Money (MoMo)", "Bank Transfer", "Cash on Delivery", "Pay on Pick-up"];

/* ── INITIAL FORM STATE ── */
const INIT = {
  fullName: "",
  phone: "",
  whatsapp: "",
  location: "",
  city: "",

  gender: "",
  style: "",
  styleId: "",
  fabric: "",
  color: "",
  colorNote: "",
  refPhoto: null,

  selectedImage: "",
  selectedName: "",
  selectedCode: "",
  selectedTag: "",

  shoulder: "",
  sleeve: "",

  bust: "",
  waist: "",
  hips: "",
  dressLength: "",
  neckF: "",

  chest: "",
  waistM: "",
  trouser: "",
  thigh: "",
  neckM: "",

  urgency: "standard",
  deliveryDate: "",
  notes: "",

  depositAmount: "",
  paymentMethod: "",
  receiptFile: null,
};

export default function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};
  const selectedDress = state?.image ? state : null;
  const isCustom = Boolean(state?.isCustom);

  const prefilledForm = {
    ...INIT,
    gender: selectedDress?.gender || "",
    style: selectedDress
      ? `${selectedDress.name} (${selectedDress.code})`
      : isCustom
      ? "Custom / Other"
      : "",
    fabric: selectedDress?.fabric || "",
    selectedImage: selectedDress?.image || "",
    selectedName: selectedDress?.name || "",
    selectedCode: selectedDress?.code || "",
    selectedTag: selectedDress?.tag || "",
  };

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(prefilledForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [receiptName, setReceiptName] = useState("");
  const [photoName, setPhotoName] = useState("");

  const [styles, setStyles] = useState([]);
  const [stylesLoading, setStylesLoading] = useState(false);
  const [stylesError, setStylesError] = useState("");

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setStylesLoading(true);
        setStylesError("");

        const response = await fetch(`${API_BASE_URL}/api/styles/`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load styles.");
        }

        setStyles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch styles:", error);
        setStyles([]);
        setStylesError("Unable to load available styles right now.");
      } finally {
        setStylesLoading(false);
      }
    };

    fetchStyles();
  }, []);

  const normalizedStyles = useMemo(() => {
    return styles.map((style) => ({
      id: style.id,
      title: style.title,
      code: style.code,
      image: style.image,
      category: style.category,
      fabric: style.fabric,
      type: style.type,
      badge: style.badge,
      description: style.description,
      gender: style.category === "men" ? "Men" : "Women",
      label: `${style.title} (${style.code})`,
    }));
  }, [styles]);

  const styleOptions = useMemo(() => {
    const wantedCategory = form.gender === "Men" ? "men" : "women";

    if (!form.gender) return [];

    const backendStyles = normalizedStyles.filter(
      (style) => style.category === wantedCategory
    );

    return [...backendStyles, { id: "custom", label: "Custom / Other", isCustom: true }];
  }, [form.gender, normalizedStyles]);

  const validate = () => {
    const e = {};

    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = "Full name is required";
      if (!form.phone.trim()) e.phone = "Phone number is required";
      if (!form.location.trim()) e.location = "Location / address is required";
      if (!form.city.trim()) e.city = "City is required";
    }

    if (step === 2) {
      if (!form.gender) e.gender = "Please select a gender";
      if (!form.style) e.style = "Please select a style";
      if (!form.fabric) e.fabric = "Please select a fabric";
      if (!form.color) e.color = "Please select a colour";

      const styleIsCustom = form.style === "Custom / Other" || isCustom;
      if (styleIsCustom && !form.refPhoto) {
        e.refPhoto = "Please upload a reference image for your custom style";
      }
    }

    if (step === 3) {
      if (!form.shoulder) e.shoulder = "Required";
      if (!form.sleeve) e.sleeve = "Required";

      if (form.gender === "Women") {
        if (!form.bust) e.bust = "Required";
        if (!form.waist) e.waist = "Required";
        if (!form.hips) e.hips = "Required";
        if (!form.dressLength) e.dressLength = "Required";
      }

      if (form.gender === "Men") {
        if (!form.chest) e.chest = "Required";
        if (!form.waistM) e.waistM = "Required";
        if (!form.trouser) e.trouser = "Required";
      }
    }

    if (step === 4) {
      if (!form.urgency) e.urgency = "Please select urgency";
      if (!form.deliveryDate) e.deliveryDate = "Please pick a preferred date";
    }

    if (step === 5) {
      if (!form.depositAmount) e.depositAmount = "Enter deposit amount";
      if (!form.paymentMethod) e.paymentMethod = "Select a payment method";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate()) setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);

 const submit = async () => {
  if (!validate()) return;

  try {
    const payload = new FormData();

    // basic info
    payload.append("full_name", form.fullName);
    payload.append("phone", form.phone);
    payload.append("whatsapp", form.whatsapp);
    payload.append("location", form.location);
    payload.append("city", form.city);

    // style
    payload.append("gender", form.gender);
    payload.append("style_name", form.style);
    payload.append("style_code", form.selectedCode || "");
    payload.append("style_id_from_catalog", form.styleId || "");
    payload.append(
      "is_custom",
      form.style === "Custom / Other" || isCustom ? "true" : "false"
    );

    payload.append("fabric", form.fabric);
    payload.append("color", form.color);
    payload.append("color_note", form.colorNote);

    payload.append("selected_image_url", form.selectedImage);
    payload.append("selected_tag", form.selectedTag);

    // measurements
    payload.append("shoulder", form.shoulder);
    payload.append("sleeve", form.sleeve);

    payload.append("bust", form.bust);
    payload.append("waist", form.waist);
    payload.append("hips", form.hips);
    payload.append("dress_length", form.dressLength);
    payload.append("neck_f", form.neckF);

    payload.append("chest", form.chest);
    payload.append("waist_m", form.waistM);
    payload.append("trouser", form.trouser);
    payload.append("thigh", form.thigh);
    payload.append("neck_m", form.neckM);

    // delivery
    payload.append("urgency", form.urgency);
    payload.append("delivery_date", form.deliveryDate);
    payload.append("notes", form.notes);

    // payment
    payload.append("deposit_amount", form.depositAmount);
    payload.append("payment_method", form.paymentMethod);

    // files
    if (form.refPhoto) {
      payload.append("ref_photo", form.refPhoto);
    }

    if (form.receiptFile) {
      payload.append("receipt_file", form.receiptFile);
    }

 const token =
  localStorage.getItem("access") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("token");

console.log("ORDER TOKEN:", token);
if (!token) {
  alert("Please login before placing an order.");
  return;
}

const response = await fetch(
  `${API_BASE_URL}/api/orders/create/`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  }
);

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      alert("❌ Failed to submit order");
      return;
    }

    console.log("ORDER SUCCESS:", data);

    setSubmitted(true);

  } catch (error) {
    console.error("Order error:", error);
    alert("❌ Something went wrong");
  }
};

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const Field = ({ label, error, children, hint }) => (
    <div className={`op-field ${error ? "op-field--error" : ""}`}>
      <label className="op-label">{label}</label>
      {hint && <p className="op-hint">{hint}</p>}
      {children}
      {error && (
        <span className="op-error">
          <FiAlertCircle /> {error}
        </span>
      )}
    </div>
  );

  const Input = ({ field, placeholder, type = "text" }) => (
    <input
      className="op-input"
      type={type}
      placeholder={placeholder}
      value={form[field]}
      onChange={(e) => set(field, e.target.value)}
    />
  );

  if (submitted) {
    return (
      <div className="op op--success">
        <div className="op-success-card">
          <div className="op-success-icon">
            <FiCheckCircle />
          </div>
          <h2>Order Received!</h2>
          <p>
            Thank you, <strong>{form.fullName}</strong>. Your style order has been submitted.
          </p>

          {form.selectedImage && (
            <div className="op-selected-preview">
              <img
                src={form.selectedImage}
                alt={form.selectedName}
                style={{
                  width: "140px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  margin: "0 auto 12px",
                  display: "block",
                }}
              />
            </div>
          )}

          <div className="op-success-summary">
            <div>
              <span>Style</span>
              <strong>{form.style || "—"}</strong>
            </div>
            <div>
              <span>Fabric</span>
              <strong>{form.fabric || "—"}</strong>
            </div>
            <div>
              <span>Urgency</span>
              <strong>{URGENCY.find((u) => u.value === form.urgency)?.label}</strong>
            </div>
            <div>
              <span>Deposit</span>
              <strong>GH₵ {form.depositAmount}</strong>
            </div>
            <div>
              <span>Payment via</span>
              <strong>{form.paymentMethod}</strong>
            </div>
          </div>

          <p className="op-success-note">
            We'll contact you on <strong>{form.whatsapp || form.phone}</strong> within 24 hours to confirm.
          </p>

          <button className="op-btn-primary" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="op">
      <header className="op-header">
        <div className="op-header-inner">
          <button className="op-back" onClick={() => (step === 1 ? navigate(-1) : back())}>
            <FiArrowLeft /> {step === 1 ? "Back" : "Previous"}
          </button>

          <div className="op-brand">
            <FiScissors />
            <span>Glora Stitches</span>
          </div>

          <p className="op-step-label">
            Step {step} of {STEPS.length}
          </p>
        </div>

        <div className="op-progress-track">
          <div className="op-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="op-steps">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={`op-step-dot ${step === s.id ? "op-step-dot--active" : ""} ${
              step > s.id ? "op-step-dot--done" : ""
            }`}
          >
            <div className="op-step-circle">{step > s.id ? <FiCheck /> : s.icon}</div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <main className="op-main">
        <div className="op-card">
          {selectedDress && (
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                padding: "20px 24px",
                borderBottom: "1px solid rgba(59,26,46,.14)",
                background: "#fffaf5",
              }}
            >
              <img
                src={selectedDress.image}
                alt={selectedDress.name}
                style={{
                  width: "90px",
                  height: "110px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
              <div>
                <p style={{ fontSize: ".78rem", color: "#8a7a82", marginBottom: "6px" }}>
                  Selected Style
                </p>
                <h3 style={{ margin: 0, fontSize: "1rem", color: "#3b1a2e" }}>
                  {selectedDress.name}
                </h3>
                <p style={{ margin: "6px 0 0", fontSize: ".88rem", color: "#5a2c47" }}>
                  {selectedDress.code} · {selectedDress.fabric}
                </p>
              </div>
            </div>
          )}

          {isCustom && !selectedDress && (
            <div className="op-warn" style={{ margin: "20px 24px 0" }}>
              <FiUpload /> You're requesting a custom style. Upload a reference image in Step 2.
            </div>
          )}

          {step === 1 && (
            <div className="op-section">
              <div className="op-section-head">
                <div className="op-section-icon">
                  <FiUser />
                </div>
                <div>
                  <h2>Personal Information</h2>
                  <p>Let us know who we're tailoring for</p>
                </div>
              </div>

              <div className="op-grid-2">
                <Field label="Full Name *" error={errors.fullName}>
                  <Input field="fullName" placeholder="e.g. Abena Mensah" />
                </Field>
                <Field label="Phone Number *" error={errors.phone}>
                  <Input field="phone" placeholder="+233 XX XXX XXXX" type="tel" />
                </Field>
              </div>

              <Field label="WhatsApp Number" hint="If different from phone — we'll send updates here">
                <Input field="whatsapp" placeholder="+233 XX XXX XXXX" type="tel" />
              </Field>

              <div className="op-grid-2">
                <Field label="Location / Address *" error={errors.location}>
                  <Input field="location" placeholder="Street, area or landmark" />
                </Field>
                <Field label="City *" error={errors.city}>
                  <Input field="city" placeholder="e.g. Accra, Kumasi" />
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="op-section">
              <div className="op-section-head">
                <div className="op-section-icon">
                  <FiScissors />
                </div>
                <div>
                  <h2>Style & Fabric</h2>
                  <p>Choose your look and material</p>
                </div>
              </div>

              <Field label="Gender *" error={errors.gender}>
                <div className="op-toggle">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`op-toggle-btn ${form.gender === g ? "op-toggle-btn--active" : ""}`}
                      onClick={() => {
                        set("gender", g);
                        set("style", "");
                        set("styleId", "");
                        set("selectedImage", "");
                        set("selectedName", "");
                        set("selectedCode", "");
                        set("selectedTag", "");
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Style *" error={errors.style}>
                {!form.gender ? (
                  <p className="op-select-hint">Select a gender first to see styles</p>
                ) : stylesLoading ? (
                  <p className="op-select-hint">Loading available styles...</p>
                ) : stylesError ? (
                  <p className="op-select-hint">{stylesError}</p>
                ) : (
                  <div className="op-style-grid">
                    {styleOptions.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        className={`op-style-chip ${form.style === style.label ? "op-style-chip--active" : ""}`}
                        onClick={() => {
                          if (style.isCustom) {
                            set("style", "Custom / Other");
                            set("styleId", "");
                            set("selectedImage", "");
                            set("selectedName", "");
                            set("selectedCode", "");
                            set("selectedTag", "");
                            return;
                          }

                          set("style", style.label);
                          set("styleId", style.id);
                          set("fabric", style.fabric || form.fabric);
                          set("selectedImage", style.image || "");
                          set("selectedName", style.title || "");
                          set("selectedCode", style.code || "");
                          set("selectedTag", style.badge || "");
                        }}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                )}
              </Field>

              <div className="op-grid-2">
                <Field label="Fabric *" error={errors.fabric}>
                  <div className="op-chips-wrap">
                    {FABRICS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        className={`op-chip ${form.fabric === f ? "op-chip--active" : ""}`}
                        onClick={() => set("fabric", f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Colour *" error={errors.color}>
                  <div className="op-chips-wrap">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`op-chip ${form.color === c ? "op-chip--active" : ""}`}
                        onClick={() => set("color", c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              {form.color === "Custom" && (
                <Field label="Describe your colour">
                  <Input field="colorNote" placeholder="e.g. deep forest green with gold trim" />
                </Field>
              )}

              <Field
                label="Reference Photo"
                hint="Upload an inspiration image (required for custom styles)"
                error={errors.refPhoto}
              >
                <label className="op-upload">
                  <FiUpload />
                  <span>{photoName || "Click to upload image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (f) {
                        set("refPhoto", f);
                        setPhotoName(f.name);
                      }
                    }}
                  />
                </label>
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="op-section">
              <div className="op-section-head">
                <div className="op-section-icon">
                  <FiPackage />
                </div>
                <div>
                  <h2>Body Measurements</h2>
                  <p>All measurements in inches — use a tape measure for accuracy</p>
                </div>
              </div>

              <div className="op-measure-banner">
                <span>📏</span>
                <p>Measure over light clothing. Stand straight and relaxed. Pull the tape snug but not tight.</p>
              </div>

              <p className="op-group-label">Shared Measurements</p>
              <div className="op-grid-3">
                <Field label="Shoulder Width *" error={errors.shoulder}>
                  <div className="op-input-unit">
                    <Input field="shoulder" placeholder="e.g. 15" type="number" />
                    <span>in</span>
                  </div>
                </Field>

                <Field label="Sleeve Length *" error={errors.sleeve}>
                  <div className="op-input-unit">
                    <Input field="sleeve" placeholder="e.g. 24" type="number" />
                    <span>in</span>
                  </div>
                </Field>
              </div>

              {form.gender === "Women" && (
                <>
                  <p className="op-group-label">Women's Measurements</p>
                  <div className="op-grid-3">
                    <Field label="Bust *" error={errors.bust}>
                      <div className="op-input-unit">
                        <Input field="bust" placeholder="e.g. 38" type="number" />
                        <span>in</span>
                      </div>
                    </Field>
                    <Field label="Waist *" error={errors.waist}>
                      <div className="op-input-unit">
                        <Input field="waist" placeholder="e.g. 30" type="number" />
                        <span>in</span>
                      </div>
                    </Field>
                    <Field label="Hips *" error={errors.hips}>
                      <div className="op-input-unit">
                        <Input field="hips" placeholder="e.g. 40" type="number" />
                        <span>in</span>
                      </div>
                    </Field>
                    <Field label="Dress Length *" error={errors.dressLength}>
                      <div className="op-input-unit">
                        <Input field="dressLength" placeholder="e.g. 58" type="number" />
                        <span>in</span>
                      </div>
                    </Field>
                    <Field label="Neck Size">
                      <div className="op-input-unit">
                        <Input field="neckF" placeholder="e.g. 14" type="number" />
                        <span>in</span>
                      </div>
                    </Field>
                  </div>
                </>
              )}

              {form.gender === "Men" && (
                <>
                  <p className="op-group-label">Men's Measurements</p>
                  <div className="op-grid-3">
                    <Field label="Chest *" error={errors.chest}>
                      <div className="op-input-unit">
                        <Input field="chest" placeholder="e.g. 42" type="number" />
                        <span>in</span>
                      </div>
                    </Field>
                    <Field label="Waist *" error={errors.waistM}>
                      <div className="op-input-unit">
                        <Input field="waistM" placeholder="e.g. 34" type="number" />
                        <span>in</span>
                      </div>
                    </Field>
                    <Field label="Trouser Length *" error={errors.trouser}>
                      <div className="op-input-unit">
                        <Input field="trouser" placeholder="e.g. 42" type="number" />
                        <span>in</span>
                      </div>
                    </Field>
                    <Field label="Thigh">
                      <div className="op-input-unit">
                        <Input field="thigh" placeholder="e.g. 24" type="number" />
                        <span>in</span>
                      </div>
                    </Field>
                    <Field label="Neck Size">
                      <div className="op-input-unit">
                        <Input field="neckM" placeholder="e.g. 16" type="number" />
                        <span>in</span>
                      </div>
                    </Field>
                  </div>
                </>
              )}

              {!form.gender && (
                <div className="op-warn">
                  <FiAlertCircle /> Go back to Step 2 and select your gender first.
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="op-section">
              <div className="op-section-head">
                <div className="op-section-icon">
                  <FiCalendar />
                </div>
                <div>
                  <h2>Delivery Details</h2>
                  <p>When do you need your outfit ready?</p>
                </div>
              </div>

              <Field label="Urgency *" error={errors.urgency}>
                <div className="op-urgency-grid">
                  {URGENCY.map((u) => (
                    <button
                      key={u.value}
                      type="button"
                      className={`op-urgency-card ${form.urgency === u.value ? "op-urgency-card--active" : ""}`}
                      onClick={() => set("urgency", u.value)}
                    >
                      <strong>{u.label}</strong>
                      <span>{u.days}</span>
                      {u.badge && <em>{u.badge}</em>}
                      {form.urgency === u.value && (
                        <div className="op-urgency-check">
                          <FiCheck />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </Field>

              <Field
                label="Preferred Delivery Date *"
                error={errors.deliveryDate}
                hint="We'll confirm if this date is achievable based on your urgency"
              >
                <Input field="deliveryDate" placeholder="" type="date" />
              </Field>

              <Field label="Special Instructions">
                <textarea
                  className="op-textarea"
                  placeholder="Any special requests, design details, event type, etc."
                  rows={4}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </Field>
            </div>
          )}

          {step === 5 && (
            <div className="op-section">
              <div className="op-section-head">
                <div className="op-section-icon">
                  <FiCreditCard />
                </div>
                <div>
                  <h2>Payment & Deposit</h2>
                  <p>A deposit is required to begin tailoring</p>
                </div>
              </div>

              <div className="op-payment-banner">
                <div>
                  <strong>Deposit Policy</strong>
                  <p>A minimum 50% deposit is required before work begins. Balance is paid on collection.</p>
                </div>
              </div>

              <div className="op-grid-2">
                <Field label="Deposit Amount (GH₵) *" error={errors.depositAmount}>
                  <div className="op-input-unit op-input-unit--prefix">
                    <span>GH₵</span>
                    <Input field="depositAmount" placeholder="e.g. 150" type="number" />
                  </div>
                </Field>
              </div>

              <Field label="Payment Method *" error={errors.paymentMethod}>
                <div className="op-payment-grid">
                  {PAYMENTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`op-payment-card ${form.paymentMethod === p ? "op-payment-card--active" : ""}`}
                      onClick={() => set("paymentMethod", p)}
                    >
                      {form.paymentMethod === p && (
                        <div className="op-urgency-check">
                          <FiCheck />
                        </div>
                      )}
                      {p}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Upload Payment Receipt" hint="Screenshot or photo of your MoMo / bank transfer confirmation">
                <label className="op-upload">
                  <FiUpload />
                  <span>{receiptName || "Click to upload receipt"}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (f) {
                        set("receiptFile", f);
                        setReceiptName(f.name);
                      }
                    }}
                  />
                </label>
              </Field>

              <div className="op-summary">
                <h4>Order Summary</h4>
                <div className="op-summary-rows">
                  <div><span>Name</span><strong>{form.fullName || "—"}</strong></div>
                  <div><span>Phone</span><strong>{form.phone || "—"}</strong></div>
                  <div><span>Style</span><strong>{form.style || "—"}</strong></div>
                  <div><span>Fabric</span><strong>{form.fabric || "—"}</strong></div>
                  <div><span>Colour</span><strong>{form.color || "—"}</strong></div>
                  <div><span>Urgency</span><strong>{URGENCY.find((u) => u.value === form.urgency)?.label}</strong></div>
                  <div><span>Delivery</span><strong>{form.deliveryDate || "—"}</strong></div>
                </div>
              </div>
            </div>
          )}

          <div className="op-nav">
            {step > 1 && (
              <button className="op-btn-ghost" onClick={back}>
                <FiArrowLeft /> Previous
              </button>
            )}

            {step < STEPS.length ? (
              <button className="op-btn-primary" onClick={next}>
                Continue <FiArrowRight />
              </button>
            ) : (
              <button className="op-btn-submit" onClick={submit}>
                <FiCheck /> Submit Order
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="op-footer">
        <p>© 2025 Glora Stitches · Secure Order Form</p>
      </footer>
    </div>
  );
}