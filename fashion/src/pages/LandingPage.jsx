import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiScissors,
  FiMenu,
  FiX,
  FiPlus,
  FiHeart,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import "./LandingPage.css";

/* Hero image */
import heroImg from "../assets/hero.png";

/* Female images */
import female1 from "../assets/female (1).jpg";
import female2 from "../assets/female (2).jpg";
import female3 from "../assets/female (3).jpg";
import female4 from "../assets/female4 (1).jpg";
import female5 from "../assets/female4 (3).jpg";

/* Male images */
import male1 from "../assets/male (1).jpg";
import male2 from "../assets/male (2).jpg";
import male3 from "../assets/male (3).jpg";
import male4 from "../assets/male (4).jpg";
import male5 from "../assets/male (5).jpg";

const femaleStyles = [
  { id: 1, name: "Kente Occasion Dress", code: "GS-F101", image: female1 },
  { id: 2, name: "Elegant African Gown", code: "GS-F102", image: female2 },
  { id: 3, name: "Modern Lace Look", code: "GS-F103", image: female3 },
  { id: 4, name: "Reception Style Fit", code: "GS-F104", image: female4 },
  { id: 5, name: "Classic Event Wear", code: "GS-F105", image: female5 },
];

const maleStyles = [
  { id: 1, name: "Senator Native Set", code: "GS-M101", image: male1 },
  { id: 2, name: "Kaftan Style", code: "GS-M102", image: male2 },
  { id: 3, name: "Traditional Occasion Fit", code: "GS-M103", image: male3 },
  { id: 4, name: "Modern Agbada Look", code: "GS-M104", image: male4 },
  { id: 5, name: "Premium Native Design", code: "GS-M105", image: male5 },
];

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const syncAuthState = () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          localStorage.getItem("token") ||
          localStorage.getItem("access");

        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setLoggedInUser(parsedUser);
        } else {
          setLoggedInUser(null);
        }
      } catch (error) {
        console.error("Failed to read auth state:", error);
        setLoggedInUser(null);
      }
    };

    syncAuthState();

    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setLoggedInUser(null);
    closeMenu();
    navigate("/login");
  };

  const handleDashboardNavigation = () => {
    closeMenu();

    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    if (loggedInUser.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/account");
    }
  };

  return (
    <div className="lp">
      <header className="lp-header">
        <div className="lp-header-inner">
          <div className="lp-brand">
            <span className="lp-brand-icon">
              <FiScissors />
            </span>
            <div>
              <h2 className="lp-brand-name">Glora Stitches</h2>
              <p className="lp-brand-sub">African Fashion</p>
            </div>
          </div>

          <nav className={`lp-nav ${menuOpen ? "lp-nav--open" : ""}`}>
            <a href="#hero" onClick={closeMenu}>
              Home
            </a>
            <a href="#about" onClick={closeMenu}>
              About
            </a>
            <a href="#women" onClick={closeMenu}>
              Women
            </a>
            <a href="#men" onClick={closeMenu}>
              Men
            </a>
          </nav>

          <div className="lp-header-actions">
            {loggedInUser ? (
              <>
                <button
                  className="btn-outline"
                  onClick={handleDashboardNavigation}
                >
                  <FiUser />
                  {loggedInUser.role === "admin"
                    ? "Admin Dashboard"
                    : "My Account"}
                </button>

                <button className="btn-gold" onClick={handleLogout}>
                  Logout <FiLogOut />
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-outline"
                  onClick={() => {
                    closeMenu();
                    navigate("/login");
                  }}
                >
                  Login
                </button>

                <button
                  className="btn-gold"
                  onClick={() => {
                    closeMenu();
                    navigate("/signup");
                  }}
                >
                  Sign Up <FiArrowRight />
                </button>
              </>
            )}
          </div>

          <button
            className="lp-burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      <section className="lp-hero" id="hero">
        <div className="lp-hero-bg">
          <img src={heroImg} alt="Glora Stitches hero" />
          <div className="lp-hero-overlay" />
        </div>

        <div className="lp-hero-content">
          <span className="lp-eyebrow">New Collection 2025</span>
          <h1 className="lp-hero-title">
            African fashion,
            <br />
            <em>tailored for you.</em>
          </h1>
          <p className="lp-hero-body">
            Elegant native wear for men and women — rooted in culture, built for confidence.
          </p>
          <div className="lp-hero-btns">
            <button className="btn-gold-lg" onClick={() => navigate("/women")}>
              Explore Styles <FiArrowRight />
            </button>
            <button className="btn-ghost-lg" onClick={() => navigate("/order")}>
              Book an Order
            </button>
          </div>
        </div>

        <div className="lp-hero-stats">
          <div className="lp-stat">
            <span>200+</span>
            <p>Styles available</p>
          </div>
          <div className="lp-stat-divider" />
          <div className="lp-stat">
            <span>100%</span>
            <p>Custom tailoring</p>
          </div>
          <div className="lp-stat-divider" />
          <div className="lp-stat">
            <span>Men & Women</span>
            <p>Collections</p>
          </div>
        </div>
      </section>

      <section className="lp-about" id="about">
        <div className="lp-about-text">
          <span className="lp-eyebrow lp-eyebrow--dark">About Us</span>
          <h2 className="lp-section-title">Fashion rooted in African identity</h2>
          <p className="lp-section-body">
            Glora Stitches blends African culture with modern tailoring excellence.
            From elegant women's event wear to refined men's native looks, every
            piece is designed with beauty, structure, and cultural pride.
          </p>
          <ul className="lp-about-list">
            <li>
              <span />
              Personal fit — every outfit designed around you
            </li>
            <li>
              <span />
              Structured ordering — clear, not just WhatsApp photos
            </li>
            <li>
              <span />
              Elegant African identity in every stitch
            </li>
          </ul>
          <button className="btn-navy">
            Learn More <FiArrowUpRight />
          </button>
        </div>

        <div className="lp-about-mosaic">
          <div className="lp-mosaic-tall">
            <img src={female2} alt="Women's style" />
            <div className="lp-mosaic-overlay">
              <p>Women's Collection</p>
            </div>
          </div>
          <div className="lp-mosaic-stack">
            <div className="lp-mosaic-small">
              <img src={male1} alt="Men's style" />
              <div className="lp-mosaic-overlay">
                <p>Men's Collection</p>
              </div>
            </div>
            <div className="lp-mosaic-small">
              <img src={female4} alt="Event wear" />
              <div className="lp-mosaic-overlay">
                <p>Event Wear</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-catalogue" id="women">
        <div className="lp-catalogue-head">
          <div>
            <span className="lp-eyebrow lp-eyebrow--dark">Women's Collection</span>
            <h2 className="lp-section-title">Elegant female styles</h2>
          </div>
          <button className="btn-outline-navy" onClick={() => navigate("/women")}>
            View All <FiArrowRight />
          </button>
        </div>

        <div className="lp-bento lp-bento--women">
          <div className="lp-bento-card lp-bento-card--large">
            <img src={femaleStyles[0].image} alt={femaleStyles[0].name} />
            <div className="lp-card-overlay">
              <span className="lp-card-badge">Women</span>
              <h3>{femaleStyles[0].name}</h3>
              <div className="lp-card-footer">
                <p>{femaleStyles[0].code}</p>
                <button className="lp-card-btn">
                  Select <FiArrowUpRight />
                </button>
              </div>
            </div>
          </div>

          <div className="lp-bento-card lp-bento-card--tall">
            <img src={femaleStyles[1].image} alt={femaleStyles[1].name} />
            <div className="lp-card-overlay">
              <span className="lp-card-badge">Women</span>
              <h3>{femaleStyles[1].name}</h3>
              <div className="lp-card-footer">
                <p>{femaleStyles[1].code}</p>
                <button className="lp-card-btn">
                  Select <FiArrowUpRight />
                </button>
              </div>
            </div>
          </div>

          {femaleStyles.slice(2).map((s) => (
            <div className="lp-bento-card" key={s.id}>
              <img src={s.image} alt={s.name} />
              <div className="lp-card-overlay">
                <span className="lp-card-badge">Women</span>
                <h3>{s.name}</h3>
                <div className="lp-card-footer">
                  <p>{s.code}</p>
                  <button className="lp-card-btn">
                    Select <FiArrowUpRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-catalogue lp-catalogue--alt" id="men">
        <div className="lp-catalogue-head">
          <div>
            <span className="lp-eyebrow lp-eyebrow--dark">Men's Collection</span>
            <h2 className="lp-section-title">Refined male styles</h2>
          </div>
          <button className="btn-outline-navy" onClick={() => navigate("/men")}>
            View All <FiArrowRight />
          </button>
        </div>

        <div className="lp-bento lp-bento--men">
          <div className="lp-bento-card lp-bento-card--large lp-bento-card--last">
            <img src={maleStyles[0].image} alt={maleStyles[0].name} />
            <div className="lp-card-overlay">
              <span className="lp-card-badge lp-card-badge--men">Men</span>
              <h3>{maleStyles[0].name}</h3>
              <div className="lp-card-footer">
                <p>{maleStyles[0].code}</p>
                <button className="lp-card-btn">
                  Select <FiArrowUpRight />
                </button>
              </div>
            </div>
          </div>

          <div className="lp-bento-card lp-bento-card--tall">
            <img src={maleStyles[1].image} alt={maleStyles[1].name} />
            <div className="lp-card-overlay">
              <span className="lp-card-badge lp-card-badge--men">Men</span>
              <h3>{maleStyles[1].name}</h3>
              <div className="lp-card-footer">
                <p>{maleStyles[1].code}</p>
                <button className="lp-card-btn">
                  Select <FiArrowUpRight />
                </button>
              </div>
            </div>
          </div>

          {maleStyles.slice(2).map((s) => (
            <div className="lp-bento-card" key={s.id}>
              <img src={s.image} alt={s.name} />
              <div className="lp-card-overlay">
                <span className="lp-card-badge lp-card-badge--men">Men</span>
                <h3>{s.name}</h3>
                <div className="lp-card-footer">
                  <p>{s.code}</p>
                  <button className="lp-card-btn">
                    Select <FiArrowUpRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

     <section className="lp-cta">
  <div className="lp-cta-bg">
    <img src={female3} alt="Custom style" />
    <div className="lp-cta-overlay" />
  </div>

  <div className="lp-cta-content">
    <span className="lp-eyebrow">Custom Request</span>
    <h2>Don't see your style here?</h2>
    <p>
      Send your design idea and we'll create a custom look just for you.
    </p>

    <div className="lp-cta-btns">
      <button
        className="btn-gold-lg"
        onClick={() =>
          navigate("/order", {
            state: { isCustom: true },
          })
        }
      >
        <FiPlus /> Add Style
      </button>

      <button
        className="btn-ghost-lg"
        onClick={() =>
          navigate("/order", {
            state: { isCustom: true },
          })
        }
      >
        <FiHeart /> Request Custom
      </button>
    </div>
  </div>
</section>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <span className="lp-brand-icon">
              <FiScissors />
            </span>
            <div>
              <h3>Glora Stitches</h3>
              <p>Modern African fashion — men & women</p>
            </div>
          </div>
          <nav className="lp-footer-nav">
            <a href="#hero">Home</a>
            <a href="#about">About</a>
            <a href="#women">Women</a>
            <a href="#men">Men</a>
          </nav>
          <p className="lp-footer-copy">© 2025 Glora Stitches</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;