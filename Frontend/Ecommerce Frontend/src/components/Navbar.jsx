import React, { useEffect, useState, useContext } from "react";
import AppContext from "../Context/Context";
import Home from "./Home";
import axios from "../axios";

const Navbar = ({ onSelectCategory, onSearch }) => {
  const { isAdmin, toggleAdminMode } = useContext(AppContext);

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(`/products/search?keyword=${value}`);
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
        console.log(response.data);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              Eshop
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/">
                    Home
                  </a>
                </li>

                {/* ADMIN ROLE CHANGE */}
                {isAdmin && (
                  <li className="nav-item">
                    <a className="nav-link" href="/add_product">
                      Add Product
                    </a>
                  </li>
                )}
                {/* END ADMIN ROLE CHANGE */}

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Categories
                  </a>

                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>

              {/* ADMIN MODE TOGGLE */}
              <button
                className="theme-btn"
                onClick={toggleAdminMode}
                style={{
                  marginRight: "10px",
                  fontSize: "1rem",
                  padding: "0.5rem 1rem",
                }}
              >
                <i className="bi bi-person-fill" style={{ marginRight: "5px" }}></i>
                {isAdmin ? "Admin Mode (ON)" : "Admin Mode (OFF)"}
              </button>
              {/* END ADMIN MODE TOGGLE */}

              <button className="theme-btn" onClick={toggleTheme}>
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>

              {/* ✅ LOGIN + CART + SEARCH SECTION */}
              <div className="d-flex align-items-center cart">
                {/* NEW LOGIN/SIGNUP LINK */}
                <a
                  href="/login"
                  className="nav-link me-3"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <i
                    className="bi bi-person-fill"
                    style={{
                      fontSize: "1.3rem",
                      marginRight: "5px",
                      color: "var(--navbar_text)",
                    }}
                  ></i>
                  <span style={{ color: "var(--navbar_text)" }}>Login</span>
                </a>
                {/* END LOGIN/SIGNUP LINK */}

                {/* CART ICON */}
                <a href="/cart" className="nav-link text-dark">
                  <i
                    className="bi bi-cart me-2"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    Cart
                  </i>
                </a>

                {/* SEARCH BAR */}
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                {showSearchResults && (
                  <ul className="list-group">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li key={result.id} className="list-group-item">
                          <a
                            href={`/product/${result.id}`}
                            className="search-result-link"
                          >
                            <span>{result.name}</span>
                          </a>
                        </li>
                      ))
                    ) : (
                      noResults && (
                        <p className="no-results-message">
                          No Product with such Name
                        </p>
                      )
                    )}
                  </ul>
                )}
              </div>
              {/* ✅ END LOGIN + CART + SEARCH SECTION */}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
