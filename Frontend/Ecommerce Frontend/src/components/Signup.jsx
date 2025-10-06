import React, { useState } from "react";
import { Link } from "react-router-dom"; // Use Link for navigation if needed

const Signup = ({ toggleAuthView }) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    console.log("Signup Attempt:", user);
    // Placeholder for API call:
    // axios.post('/auth/register', user).then(...)
    alert("Signup logic placeholder: Check console for user data.");
  };

  return (
    <div className="auth-form-container">
      <h2 className="text-center" style={{ color: "var(--para-clr)" }}>
        Sign Up
      </h2>
      <form onSubmit={handleSubmit} className="row g-3 pt-3">
        <div className="col-12">
          <label className="form-label">
            <h6>Username</h6>
          </label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            placeholder="Choose a username"
          />
        </div>
        <div className="col-12">
          <label className="form-label">
            <h6>Email</h6>
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
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
            value={user.password}
            onChange={handleChange}
            required
            placeholder="Enter a password"
          />
        </div>
        <div className="col-12">
          <label className="form-label">
            <h6>Confirm Password</h6>
          </label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
        </div>
        <div className="col-12 pt-3">
          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </div>
      </form>
      <p className="text-center mt-3" style={{ color: "var(--para-clr)" }}>
        Already have an account?{" "}
        <button
          className="btn-link"
          onClick={() => toggleAuthView("login")}
          style={{ 
            color: "var(--link_color)", 
            backgroundColor: "transparent", 
            border: "none", 
            padding: 0,
            textDecoration: "underline"
          }}
        >
          Log In
        </button>
      </p>
    </div>
  );
};

export default Signup;