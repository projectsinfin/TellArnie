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
import "./index.css";
import profilePic from "../../../Assets/Profile/Icon.png";
import DataTableComponent from "../../../components/DataTable";
import tableData from "../../../data";

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
function DistributorNotification() {
  return (
    <div className="notification">
      <h4>Notifications</h4>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="notify_info border rounded p-4">
            <h5>Title : Dummy title</h5>
            <h5>Location : Rajasthan</h5>
          </div>
        </div>
        <div className="col-md-4">
          <div className="notify_info border rounded p-4">
            <h5>Title : Dummy title2</h5>
            <h5>Location : Haryana</h5>
          </div>
        </div>
        <div className="col-md-4">
          <div className="notify_info border rounded p-4">
            <h5>Title : Dummy title3</h5>
            <h5>Location : Punjab</h5>
          </div>
        </div>
      </div>
      <div className="d-none">
        <DataTableComponent
          title={"Notifications(3 unread )"}
          columns={notificationcolumns}
          data={tableData}
          selectedRows
        />
      </div>
    </div>
  );
}

export default DistributorNotification;
