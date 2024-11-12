import React from "react";
import boximage from "../../../../Assets/Logo/Medical-Report 1.png";
import "./index.css";
import { NavLink } from "react-router-dom";

const StandardWithQuickReport = () => {
  return (
    <div className="standardwithquickreport">
      <h2
        className="quickheading mb-3 letter_spacing fw-bold text-center"
        style={{ marginTop: "30px", fontSize: "36px" }}
      >
        Incident Report
      </h2>
      <h6
        className=" text-center open-sans-font"
        style={{
          marginTop: "34px",
          fontSize: "34px",
          fontSize: "13px",
          fontWeight: "700",
        }}
      >
        What kind of report would you like to make?
      </h6>
      <div className="navigationcontroller" style={{ marginTop: "50px" }}>
        <NavLink to="/detailedreportinfo" className={"nav-link"}>
          <div className="inner_box">
            <div className="image">
              <img src={boximage} alt="boximage" />{" "}
            </div>
            <div className="text_data">
              <h4 className="fw-bold open-sans-font">Standard Report</h4>
              <h6 className="open-sans-font">Covers most incidents</h6>
            </div>
          </div>
        </NavLink>
      </div>

      <div className="navigationcontroller" style={{ marginTop: "58px" }}>
        <NavLink to="/quickreportinfo" className={"nav-link"}>
          <div className="inner_box">
            <div className="image">
              <img src={boximage} alt="boximage" />
            </div>
            <div className="text_data">
              <h4 className="fw-bold open-sans-font">Quick Report</h4>
              <h6 className="open-sans-font">
                Covers minor incidents such <br /> using bandaids, sanitiser,
                etc.
              </h6>
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default StandardWithQuickReport;
