import React, { useState } from "react";
import Sidebar from "../component/dashboard/Sidebar";
import "./DashboardPage.css";
import "./PostStylePage.css";

const PostStylePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    category: "women",
    fabric: "",
    type: "",
    badge: "New",
    image: null,
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imageName, setImageName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    setImageName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.image) {
      setErrorMessage("Please upload an image.");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
     const token =
  localStorage.getItem("access") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("token");

      if (!token) {
        setErrorMessage("You must be logged in as admin to post a style.");
        setLoading(false);
        return;
      }

      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("code", formData.code);
      payload.append("category", formData.category);
      payload.append("fabric", formData.fabric);
      payload.append("type", formData.type);
      payload.append("badge", formData.badge);
      payload.append("image", formData.image);
      payload.append("description", formData.description);

      const response = await fetch("http://127.0.0.1:8000/api/styles/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code && Array.isArray(data.code)) {
          setErrorMessage(data.code[0]);
        } else if (data.detail) {
          setErrorMessage(data.detail);
        } else {
          setErrorMessage("Failed to post style.");
        }
        return;
      }

      setSuccessMessage("Style posted successfully.");

      setFormData({
        title: "",
        code: "",
        category: "women",
        fabric: "",
        type: "",
        badge: "New",
        image: null,
        description: "",
      });

      setImageName("");
      setPreviewUrl("");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.error("Post style error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="post-style-header">
          <h1>Post New Style</h1>
          <p>Add men or women styles to the catalogue.</p>
        </div>

        <div className="post-style-card">
          <form className="post-style-form" onSubmit={handleSubmit}>
            <div className="post-style-grid">
              <div className="post-field">
                <label>Style Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter style title"
                  required
                />
              </div>

              <div className="post-field">
                <label>Style Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Enter style code"
                  required
                />
              </div>

              <div className="post-field">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                </select>
              </div>

              <div className="post-field">
                <label>Fabric</label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleChange}
                  placeholder="e.g Ankara, Kente, Lace"
                  required
                />
              </div>

              <div className="post-field">
                <label>Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g Gown, Kaftan, Senator"
                  required
                />
              </div>

              <div className="post-field">
                <label>Badge</label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                >
                  <option value="New">New</option>
                  <option value="Popular">Popular</option>
                  <option value="Bestseller">Bestseller</option>
                </select>
              </div>

              <div className="post-field post-field-full">
                <label>Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {imageName && (
                  <p className="post-image-name">Selected: {imageName}</p>
                )}
              </div>

              {previewUrl && (
                <div className="post-field post-field-full">
                  <label>Image Preview</label>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="post-style-preview"
                  />
                </div>
              )}

              <div className="post-field post-field-full">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter style description"
                  rows="5"
                  required
                />
              </div>
            </div>

            <button type="submit" className="post-style-btn" disabled={loading}>
              {loading ? "Posting..." : "Post Style"}
            </button>

            {successMessage && (
              <p className="post-success-message">{successMessage}</p>
            )}

            {errorMessage && (
              <p className="post-error-message">{errorMessage}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default PostStylePage;