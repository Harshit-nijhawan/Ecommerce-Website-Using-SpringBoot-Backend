import React, { useState } from "react";
import { Link } from "react-router-dom"; // Use Link for navigation if needed

const Login = ({ toggleAuthView }) => {
  const [credentials, setCredentials] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Attempt:", credentials);
    // Placeholder for API call:
    // axios.post('/auth/login', credentials).then(...)
    alert("Login logic placeholder: Check console for credentials.");
  };

  return (
    <div className="auth-form-container">
      <h2 className="text-center" style={{ color: "var(--para-clr)" }}>
        Log In
      </h2>
      <form onSubmit={handleSubmit} className="row g-3 pt-3">
        <div className="col-12">
          <label className="form-label">
            <h6>Username/Email</h6>
          </label>
          <input
            type="text"
            className="form-control"
            name="usernameOrEmail"
            value={credentials.usernameOrEmail}
            onChange={handleChange}
            required
            placeholder="Enter username or email"
          />
        </div>
        <div className="col-12">
          <label className="form-label">
            <h6>Password</h6>
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
          />
        </div>
        <div className="col-12 pt-3">
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </div>
      </form>
      <p className="text-center mt-3" style={{ color: "var(--para-clr)" }}>
        Don't have an account?{" "}
        <button
          className="btn-link"
          onClick={() => toggleAuthView("signup")}
          style={{ 
            color: "var(--link_color)", 
            backgroundColor: "transparent", 
            border: "none", 
            padding: 0,
            textDecoration: "underline"
          }}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;