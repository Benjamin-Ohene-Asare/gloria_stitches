import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiScissors,
  FiSearch,
  FiFilter,
  FiHeart,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import "./WomenPage.css";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function WomenPage() {
  const navigate = useNavigate();

  const [allStyles, setAllStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFabric, setActiveFabric] = useState("All Fabrics");
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const response = await fetch(`${API_BASE_URL}/api/styles/?category=women`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load women's styles.");
        }

        setAllStyles(data);
      } catch (error) {
        console.error("Fetch women styles error:", error);
        setFetchError("Unable to load styles right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, []);

  const categories = useMemo(() => {
    const dynamicCategories = [...new Set(allStyles.map((s) => s.type).filter(Boolean))];
    return ["All", ...dynamicCategories];
  }, [allStyles]);

  const fabrics = useMemo(() => {
    const dynamicFabrics = [...new Set(allStyles.map((s) => s.fabric).filter(Boolean))];
    return ["All Fabrics", ...dynamicFabrics];
  }, [allStyles]);

  const toggleLike = (id, e) => {
    e.stopPropagation();
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtered = allStyles.filter((style) => {
    const matchCategory =
      activeCategory === "All" || style.type === activeCategory;

    const matchFabric =
      activeFabric === "All Fabrics" || style.fabric === activeFabric;

    const matchSearch =
      style.title?.toLowerCase().includes(search.toLowerCase()) ||
      style.code?.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchFabric && matchSearch;
  });

  const clearAll = () => {
    setActiveCategory("All");
    setActiveFabric("All Fabrics");
    setSearch("");
  };

  return (
    <div className="wp">
      <header className="wp-header">
        <div className="wp-header-inner">
          <button className="wp-back" onClick={() => navigate("/")}>
            <FiArrowLeft /> Back
          </button>
          <div className="wp-brand">
            <FiScissors />
            <span>Glora Stitches</span>
          </div>
          <p className="wp-header-label">Women's Collection</p>
        </div>
      </header>

      <section className="wp-banner">
        <div className="wp-banner-content">
          <span className="wp-eyebrow">Women's Collection</span>
          <h1>
            Dressed in
            <br />
            <em>African elegance</em>
          </h1>
          <p>{allStyles.length} exclusive styles — made to order</p>
        </div>
        <div className="wp-banner-decor">
          <div className="wp-decor-ring wp-decor-ring--1" />
          <div className="wp-decor-ring wp-decor-ring--2" />
          <div className="wp-decor-ring wp-decor-ring--3" />
        </div>
      </section>

      <div className="wp-toolbar">
        <div className="wp-search-wrap">
          <FiSearch className="wp-search-icon" />
          <input
            className="wp-search"
            placeholder="Search styles or codes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="wp-search-clear" onClick={() => setSearch("")}>
              <FiX />
            </button>
          )}
        </div>

        <button
          className={`wp-filter-btn ${filterOpen ? "wp-filter-btn--active" : ""}`}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FiFilter /> Filters{" "}
          <FiChevronDown className={filterOpen ? "rotated" : ""} />
        </button>
      </div>

      {filterOpen && (
        <div className="wp-filters">
          <div className="wp-filter-group">
            <p className="wp-filter-label">Category</p>
            <div className="wp-chips">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`wp-chip ${
                    activeCategory === category ? "wp-chip--active" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="wp-filter-group">
            <p className="wp-filter-label">Fabric</p>
            <div className="wp-chips">
              {fabrics.map((fabric) => (
                <button
                  key={fabric}
                  className={`wp-chip ${
                    activeFabric === fabric ? "wp-chip--active" : ""
                  }`}
                  onClick={() => setActiveFabric(fabric)}
                >
                  {fabric}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="wp-results-bar">
        <p className="wp-results-count">
          Showing <strong>{filtered.length}</strong> style
          {filtered.length !== 1 ? "s" : ""}
        </p>

        {(activeCategory !== "All" ||
          activeFabric !== "All Fabrics" ||
          search) && (
          <button className="wp-clear-all" onClick={clearAll}>
            Clear all <FiX />
          </button>
        )}
      </div>

      <main className="wp-grid-wrap">
        {loading ? (
          <div className="wp-empty">
            <FiScissors />
            <p>Loading styles...</p>
          </div>
        ) : fetchError ? (
          <div className="wp-empty">
            <FiScissors />
            <p>{fetchError}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="wp-empty">
            <FiScissors />
            <p>No styles match your filters.</p>
            <button onClick={clearAll}>Reset filters</button>
          </div>
        ) : (
          <div className="wp-grid">
            {filtered.map((style, i) => (
              <div
                className="wp-card"
                key={style.id}
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => setSelected(style)}
              >
                <div className="wp-card-img-wrap">
                  <img src={style.image} alt={style.title} />
                  <button
                    className={`wp-like ${
                      liked.includes(style.id) ? "wp-like--active" : ""
                    }`}
                    onClick={(e) => toggleLike(style.id, e)}
                    aria-label="Like"
                  >
                    <FiHeart />
                  </button>
                  {style.badge && <span className="wp-tag">{style.badge}</span>}
                </div>

                <div className="wp-card-body">
                  <div className="wp-card-meta">
                    <span className="wp-card-fabric">{style.fabric}</span>
                    <span className="wp-card-category">{style.type}</span>
                  </div>
                  <h3 className="wp-card-name">{style.title}</h3>
                  <div className="wp-card-footer">
                    <p className="wp-card-code">{style.code}</p>
                    <button type="button" className="wp-card-select">
                      Select <FiArrowUpRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selected && (
        <div className="wp-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="wp-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="wp-modal-close"
              onClick={() => setSelected(null)}
            >
              <FiX />
            </button>

            <div className="wp-modal-img">
              <img src={selected.image} alt={selected.title} />
              {selected.badge && <span className="wp-tag">{selected.badge}</span>}
            </div>

            <div className="wp-modal-info">
              <span className="wp-eyebrow">
                {selected.type} · {selected.fabric}
              </span>
              <h2>{selected.title}</h2>
              <p className="wp-modal-code">Style code: {selected.code}</p>
              <p className="wp-modal-desc">
                {selected.description ||
                  `A beautifully crafted piece from the Glora Stitches women's collection. Made with premium ${selected.fabric} fabric, tailored to your exact measurements.`}
              </p>

              <div className="wp-modal-actions">
                <button
                  className="btn-gold-lg"
                  onClick={() =>
                    navigate("/order", {
                      state: {
                        ...selected,
                        name: selected.title,
                        tag: selected.badge,
                      },
                    })
                  }
                >
                  Order This Style
                </button>

                <button
                  className={`wp-modal-like ${
                    liked.includes(selected.id) ? "wp-like--active" : ""
                  }`}
                  onClick={(e) => toggleLike(selected.id, e)}
                >
                  <FiHeart /> {liked.includes(selected.id) ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="wp-footer">
        <p>© 2025 Glora Stitches · African Fashion</p>
      </footer>
    </div>
  );
}