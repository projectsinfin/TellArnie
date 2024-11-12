import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import _ from "lodash";
import { roles } from "../../../utils/helperFunction";
const ProtectedRoute = ({ permission, children }) => {
  const { access_token, role } = useSelector((state) => state.AUTH);
  const {
    LoginData: {
      data: { permissions },
    },
  // } = useSelector((state) => state.LOGIN)||{};
} = useSelector((state) => state.LOGIN)|| [];

  const {
    superAdmin,
    admin,
    approver,
    user,
    salesUser,
    distributior,
    distributor_user,
  } = roles;

  const isAllowed = _.some(permission, (permission) =>
    permissions.includes(permission)
  );

  // console.log(isAllowed, "isAllowed");
  if (!access_token) {
    return <Navigate to="/login" />;
  }
  if (isAllowed) {
    return children;
  } else if (!isAllowed && role !== distributior && role !== distributor_user) {
    return <Navigate to="/" />;
  } else {
    return <Navigate to="/distributor" />;
  }
};

export default ProtectedRoute;