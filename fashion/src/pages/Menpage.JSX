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
import "./MenPage.css";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function MenPage() {
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

        const response = await fetch(`${API_BASE_URL}/api/styles/?category=men`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load men's styles.");
        }

        setAllStyles(data);
      } catch (error) {
        console.error("Fetch men styles error:", error);
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

  const handleOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selected) return;

    navigate("/order", {
      state: {
        ...selected,
        name: selected.title,
        tag: selected.badge,
        gender: "Men",
      },
    });
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

  const hasFilters =
    activeCategory !== "All" || activeFabric !== "All Fabrics" || search;

  return (
    <div className="mp">
      <header className="mp-header">
        <div className="mp-header-inner">
          <button className="mp-back" onClick={() => navigate("/")}>
            <FiArrowLeft /> Back
          </button>
          <div className="mp-brand">
            <FiScissors />
            <span>Glora Stitches</span>
          </div>
          <p className="mp-header-label">Men's Collection</p>
        </div>
      </header>

      <section className="mp-banner">
        <div className="mp-banner-content">
          <span className="mp-eyebrow">Men's Collection</span>
          <h1>
            Strength dressed
            <br />
            <em>in tradition.</em>
          </h1>
          <p>{allStyles.length} refined styles — tailored to your stature</p>
        </div>

        <div className="mp-banner-decor">
          <div className="mp-decor-box mp-decor-box--1" />
          <div className="mp-decor-box mp-decor-box--2" />
          <div className="mp-decor-box mp-decor-box--3" />
        </div>
      </section>

      <div className="mp-toolbar">
        <div className="mp-search-wrap">
          <FiSearch className="mp-search-icon" />
          <input
            className="mp-search"
            placeholder="Search styles or codes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="mp-search-clear" onClick={() => setSearch("")}>
              <FiX />
            </button>
          )}
        </div>

        <button
          className={`mp-filter-btn ${filterOpen ? "mp-filter-btn--active" : ""}`}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FiFilter /> Filters
          <FiChevronDown className={filterOpen ? "rotated" : ""} />
        </button>
      </div>

      {filterOpen && (
        <div className="mp-filters">
          <div className="mp-filter-group">
            <p className="mp-filter-label">Style</p>
            <div className="mp-chips">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`mp-chip ${
                    activeCategory === category ? "mp-chip--active" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mp-filter-group">
            <p className="mp-filter-label">Fabric</p>
            <div className="mp-chips">
              {fabrics.map((fabric) => (
                <button
                  key={fabric}
                  className={`mp-chip ${
                    activeFabric === fabric ? "mp-chip--active" : ""
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

      <div className="mp-results-bar">
        <p className="mp-results-count">
          Showing <strong>{filtered.length}</strong> style
          {filtered.length !== 1 ? "s" : ""}
        </p>
        {hasFilters && (
          <button className="mp-clear-all" onClick={clearAll}>
            Clear all <FiX />
          </button>
        )}
      </div>

      <main className="mp-grid-wrap">
        {loading ? (
          <div className="mp-empty">
            <FiScissors />
            <p>Loading styles...</p>
          </div>
        ) : fetchError ? (
          <div className="mp-empty">
            <FiScissors />
            <p>{fetchError}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mp-empty">
            <FiScissors />
            <p>No styles match your filters.</p>
            <button onClick={clearAll}>Reset filters</button>
          </div>
        ) : (
          <div className="mp-grid">
            {filtered.map((style, i) => (
              <div
                className="mp-card"
                key={style.id}
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => setSelected(style)}
              >
                <div className="mp-card-img-wrap">
                  <img src={style.image} alt={style.title} />
                  <button
                    className={`mp-like ${
                      liked.includes(style.id) ? "mp-like--active" : ""
                    }`}
                    onClick={(e) => toggleLike(style.id, e)}
                    aria-label="Save"
                  >
                    <FiHeart />
                  </button>
                  {style.badge && <span className="mp-tag">{style.badge}</span>}
                </div>

                <div className="mp-card-body">
                  <div className="mp-card-meta">
                    <span className="mp-card-fabric">{style.fabric}</span>
                    <span className="mp-card-category">{style.type}</span>
                  </div>
                  <h3 className="mp-card-name">{style.title}</h3>
                  <div className="mp-card-footer">
                    <p className="mp-card-code">{style.code}</p>
                    <button type="button" className="mp-card-select">
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
        <div className="mp-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="mp-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="mp-modal-close"
              onClick={() => setSelected(null)}
            >
              <FiX />
            </button>

            <div className="mp-modal-img">
              <img src={selected.image} alt={selected.title} />
              {selected.badge && <span className="mp-tag">{selected.badge}</span>}
            </div>

            <div className="mp-modal-info">
              <span className="mp-eyebrow">
                {selected.type} · {selected.fabric}
              </span>
              <h2>{selected.title}</h2>
              <p className="mp-modal-code">Style code: {selected.code}</p>
              <p className="mp-modal-desc">
                {selected.description ||
                  `A distinguished piece from the Glora Stitches men's collection. Crafted with premium ${selected.fabric} fabric and tailored precisely to your measurements for a commanding, confident look.`}
              </p>

              <div className="mp-modal-actions">
                <button
                  type="button"
                  className="mp-btn-primary"
                  onClick={handleOrder}
                >
                  Order This Style
                </button>

                <button
                  type="button"
                  className={`mp-modal-like ${
                    liked.includes(selected.id) ? "mp-like--active" : ""
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

      <footer className="mp-footer">
        <p>© 2025 Glora Stitches · African Fashion</p>
      </footer>
    </div>
  );
}