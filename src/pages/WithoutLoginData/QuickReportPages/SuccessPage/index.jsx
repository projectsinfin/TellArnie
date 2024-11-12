import React from "react";
import "./index.css";
import { NavLink } from "react-router-dom";

const SuccessIncidentPage = () => {
  return (
    <div className="success-container">
      <div className="success-message">
        <span className="success-icon">&#10003;</span> 
        <span className="success-text">INCIDENT REPORTED SUCCESSFULLY</span>
      </div>
    </div>
  );
};

export default SuccessIncidentPage;
