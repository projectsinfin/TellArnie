import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import "react-phone-input-2/lib/style.css";
import RouterData from "./router";
import { roles } from "./utils/helperFunction";
import { useSelector } from "react-redux";

function App() {
  const publicRoutes = RouterData.filter((item) => item.type === "public");
  const privateRoutes = RouterData.filter((item) => item.type === "private");
  // console.log(privateRoutes,"privateRoutes")
  const location = useLocation();
  const { access_token } = useSelector((state) => state.AUTH);

  // useEffect(() => {
  //   if (location.pathname === "/" && !access_token) {
  //     const element = document.createElement("a");
  //     // element.href = "https://tellarnie.com/";
  //     element.href = "/login";

  //     element.click();
  //   }
  // }, []);

  const { superAdmin, admin, approver, user, salesUser } = roles;

  return (
    <Routes>
      {publicRoutes.map((curElm, index) => (
        <Route key={index} path={curElm.path} element={curElm.element} />
      ))}

      
      {privateRoutes.map((curElm, index) => (
        <Route key={index} path={curElm.path} element={curElm.element} />
      ))}
    </Routes>
  );
}
export default App;
