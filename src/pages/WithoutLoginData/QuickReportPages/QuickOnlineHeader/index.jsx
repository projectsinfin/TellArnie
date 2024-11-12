import React from "react";
import Navbar from "react-bootstrap/Navbar";
import "./index.css";
import logo from "../../../../Assets/Logo/ARNIE LOGO White.png";
const QuickOnlineHeader = () => {
  return (
    <Navbar className="headerinner justify-content-center">
      <Navbar.Brand href="#home">
        <img
          alt="logo"
          src={logo}
          width="200"
          // height="89"
          className="d-inline-block align-top"
        />{" "}
      </Navbar.Brand>
    </Navbar>
  );
};

export default QuickOnlineHeader;
