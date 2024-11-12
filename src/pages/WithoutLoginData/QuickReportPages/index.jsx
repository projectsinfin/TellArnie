import React, { useEffect, useState } from "react";
import QuickOnlineHeader from "./QuickOnlineHeader";
import "./index.css";
const QuickReportPagesLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth <= 768);
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  return (
    <div className="quicklayoutwrapper">
      <div className="header">
        <div
          className="container"
          style={{ backgroundColor: "#047835", paddingBottom: "35px" }}
        >
          <QuickOnlineHeader />
        </div>
      </div>
      <div
        className="maincontent container"
        style={{
          borderRadius: "20px 20px 0px 0px",
          marginTop: "-15px",
          background: "#fff",
          position: "relative",
          zIndex: "1",
        }}
      >
        {/* {isMobile ? ( */}
          <div className="mobileaccess"> {children}</div>
        {/* ) : (
          <h3 className="vh-50 justify-content-center d-flex align-items-center">
              You can access this page on mobile device only!
          </h3>
        )}  */}
      </div>
    </div>
  );
};

export default QuickReportPagesLayout;
