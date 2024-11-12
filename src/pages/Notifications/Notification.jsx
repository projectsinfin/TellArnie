import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import "./Notification.css";
import tableData from "../../data";
import profilePic from "../../Assets/Profile/Icon.png";
import CustomPagination from "../../components/Common/Pagination";
import DataTableComponent from "../../components/DataTable";

export const notificationcolumns = [
  {
    name: "",
    selector: (row) => (
      <div className="product-wrapper">
        <img src={profilePic} alt={row.product} className="product-image" />{" "}
        <div className="notification-info">
          <span className="notification-text">{row.notification}</span>
          <p className="text-muted">{row.notificationTime}</p>
        </div>
      </div>
    ),
  },
];
function Notifications() {
  return (
    <div className="notification">
      <DataTableComponent
        title={"Notifications(3 unread )"}
        columns={notificationcolumns}
        data={tableData}
        selectedRows
      />
    </div>
  );
}

export default Notifications;
