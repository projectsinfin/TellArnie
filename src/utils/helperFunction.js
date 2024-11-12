// ***  function for the validation of the user email   ***///

import moment from "moment";

//@@param value
export const permissions = {
  all: "All",
  products: "Manage Products",
  users: "Manage Company Users",
  business: "Manage Business Profile",
  distributors: "Manage Distributors",
  resource: "Manage Resource Center",
  notifications: "Receive Update Notifications",
  dist_superadmin: "All Distributor",
};

export const roles = {
  superAdmin: "rm_superadmin",
  admin: "rm_admin",
  approver: "approver",
  user: "user",
  salesUser: "salesrepresentative",
  distributior: "distributor_superadmin",
  distributor_user: "distributor_user",
};

export function validateEmail(value) {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return true;
  } else {
    return false;
  }
}

// ***  function for the validation onChange user only type number   ***///
//@@param value
export function onChangeToNumber(value) {
  return value.replace(/\D/g, "");
}

export const formatDateWithMonth = (date) => {
  const inputDateString = date;
  const dateObject = new Date(inputDateString);

  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = dateObject.toLocaleDateString("en-GB", options);
  return formattedDate;
};

export const dateFormmater = (date) => {
  return moment(date).format("YYYY-MM-DD");
};
