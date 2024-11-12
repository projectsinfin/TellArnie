import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
const PublicRoute = ({ children }) => {
  const { access_token, role } = useSelector((state) => state.AUTH);
  const location = useLocation();


  if (access_token) {
    if (role === "rm_superadmin" || role === "rm_admin") {
      return <Navigate to="/" />;
    } else if (
      role === "distributor_superadmin" ||
      role === "distributor_user"
    ) {
      return <Navigate to="/distributor" />;
    }
  }
  return children;
};

export default PublicRoute;
