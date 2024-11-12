import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../Assets/Logo/logo.png";
import "./Sidebar.css";
import { distributormenus, menus } from "../../utils/menu.routes";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthUser } from "../../redux/slice/AuthSlice";
import Signout from "../../Assets/svgs/SignOut.svg";
import swal from "sweetalert";
import _ from "lodash";

function Sidebar({ isActive, removeSideBarActive }) {
  const { role } = useSelector((state) => state.AUTH);
  const {
    LoginData: {
      data: { permissions },
    },
  } = useSelector((state) => state.LOGIN);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeClass = (activeFor) => {
    return activeFor.some(route => 
      location.pathname === route || location.pathname.startsWith(route + '/') 
    ) ? "active-menu" : "";
  };

  const logoutHandler = () => {
    swal({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancel",
          value: false,
          visible: true,
          closeModal: true,
          className: "swal-button--red",
        },
        confirm: {
          text: "OK",
          value: true,
          visible: true,
          closeModal: true,
          className: "swal-button--green",
        },
      },
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        dispatch(clearAuthUser());
        navigate("/login");
      }
    });
  };

  // console.log(permissions, "permissions");

  const renderSidebarWithRole = (role) => {
    const dashboardMenu = menus?.slice(0, 1);
    const businessMenu = _.filter(menus?.slice(1, 6), (item) =>
      _.some(item.permission, (permission) => permissions.includes(permission))
    );
    const utilMenu = _.filter(menus?.slice(6), (item) =>
      _.some(item.permission, (permission) => permissions.includes(permission))
    );
  
    const distributorDashboardMenu = distributormenus?.slice(0, 1);
    const distributorBusinessMenu = _.filter(distributormenus?.slice(1, 4), (item) =>
      _.some(item.permission, (permission) => permissions.includes(permission))
    );
    const distributorUtilMenu = _.filter(distributormenus?.slice(4), (item) =>
      _.some(item.permission, (permission) => permissions.includes(permission))
    );
  
  
    if (
      role === "rm_superadmin" ||
      role === "rm_admin" ||
      role === "approver" ||
      role === "user" ||
      role === "salesrepresentative"
    ) {
      return (
        <div className="adminmenu">
          <ul className="nav-links">
            {dashboardMenu.map((menu, i) => {
              return (
                <li key={i}>
                  <Link
                    className={activeClass(menu.activeFor)}
                    to={menu.link}
                    businessprofile
                    onClick={removeSideBarActive}
                  >
                    {menu.icon}
                    {menu.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="divider"></div>
          <div className="custom-div">
            <p className="sub-heading">BUSINESS SERVICES</p>
            <ul className="nav-links">
              {businessMenu.map((menu, i) => {
                return (
                  <li key={i}>
                    <Link
                      className={`${activeClass(menu.activeFor)}`}
                      to={menu.link}
                      onClick={removeSideBarActive}
                    >
                      {menu.icon}
                      {menu.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
  
          <div className="custom-div">
            <p className="sub-heading">UTILITIES</p>
            <ul className="nav-links">
              {utilMenu.map((menu, i) => {
                return (
                  <li key={i}>
                    <Link
                      className={`${activeClass(menu.activeFor)}`}
                      to={menu.link}
                      onClick={removeSideBarActive}
                    >
                      {menu.icon}
                      {menu.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    } else if (
      role === "distributor_superadmin" ||
      role === "distributor_user"
    ) {
      return (
        <div className="distributormenu">
          <ul className="nav-links">
            {distributorDashboardMenu.map((menu, i) => {
              return (
                <li key={i}>
                  <Link
                    className={activeClass(menu.activeFor)}
                    to={menu.link}
                    onClick={removeSideBarActive}
                  >
                    {menu.icon}
                    {menu.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="divider"></div>
          <div className="custom-div">
            <p className="sub-heading">BUSINESS SERVICES</p>
            <ul className="nav-links">
              {distributorBusinessMenu.map((menu, i) => {
                return (
                  <li key={i}>
                    <Link
                      className={`${activeClass(menu.activeFor)}`}
                      to={menu.link}
                      onClick={removeSideBarActive}
                    >
                      {menu.icon}
                      {menu.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
  
          <div className="custom-div">
            <p className="sub-heading">UTILITIES</p>
            <ul className="nav-links">
              {distributorUtilMenu.map((menu, i) => {
                return (
                  <li key={i}>
                    <Link
                      className={`${activeClass(menu.activeFor)}`}
                      to={menu.link}
                      onClick={removeSideBarActive}
                    >
                      {menu.icon}
                      {menu.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className={isActive ? "sidebar active" : "sidebar"}>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navigation">
        {renderSidebarWithRole(role)}
        <div
          className="logout d-flex align-items-center"
          onClick={logoutHandler}
        >
          <img src={Signout} alt="Signout icon" />
          Logout
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
