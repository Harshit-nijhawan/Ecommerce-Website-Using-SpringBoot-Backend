import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const AuthContainer = () => {
  const [currentView, setCurrentView] = useState("login");

  const toggleAuthView = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="auth-container">
      <div className="center-container-auth">
        {currentView === "login" ? (
          <Login toggleAuthView={toggleAuthView} />
        ) : (
          <Signup toggleAuthView={toggleAuthView} />
        )}
      </div>
    </div>
  );
};

export default AuthContainer;