import dashboardIcon from "../Assets/svgs/Vector (1).svg";
import UserIcon from "../Assets/svgs/Users.svg";
import Products from "../Assets/svgs/Cube.svg";
import Kits from "../Assets/svgs/Group 11.svg";
import Business from "../Assets/svgs/Vector.svg";
import Distributors from "../Assets/svgs/Users.svg";
import Reports from "../Assets/svgs/ChartBar.svg";
import Resources from "../Assets/svgs/File.svg";
import Bell from "../Assets/svgs/Bell.svg";
import { permissions } from "./helperFunction";

const {
  all,
  products,
  users,
  business,
  distributors,
  resource,
  notifications,
  dist_superadmin,
} = permissions;

export const menus = [
  {
    permission: [all],
    title: "Dashboard",
    icon: <img src={dashboardIcon} />,
    link: "/",
    activeFor: ["/"],
  },
  {
    permission: [all, products],
    title: "Products",
    icon: <img src={Products} />,
    link: "/products",
    activeFor: ["/products"],
  },
  {
    permission: [all, "kit managemant"],
    title: "Kit Management",
    icon: <img src={Kits} />,
    link: "/kit",
    activeFor: ["/kit", "/createkit","/createemptykit"],
  },
  {
    permission: [all, users],
    title: "User Management",
    icon: <img src={UserIcon} />,
    link: "/users",
    activeFor: ["/users", "/create-users","/update-user"],
  },
  {
    permission: [all, business],
    title: "Business Profile",
    icon: <img src={Business} />,
    link: "/businessprofile",
    activeFor: ["/businessprofile", "/createlocation"],
  },
  {
    permission: [all],
    title: "Distributors",
    icon: <img src={Distributors} />,
    link: "/distributors",
    activeFor: ["/distributors", "/distributorinfo"],
  },
  {
    permission: [all],
    title: "Reports",
    icon: <img src={Reports} />,
    link: "/reports",
    activeFor: ["/reports", "/reporteditor", "/creategroupreport","/edit_report_group"],
  },
  {
    permission: [all, resource],
    title: "Resources",
    icon: <img src={Resources} />,
    link: "/resource",
    activeFor: ["/resource"],
  },
  {
    permission: [all],
    title: "Message Center",
    icon: <img src={Bell} />,
    link: "/messaging",
    activeFor: ["/messaging", "/editarticle", "/edit-notification"],
  },
  // {
  //   title: "Notifications",
  //   icon: <img src={Bell} />,
  //   link: "/notifications",
  // },
];

export const distributormenus = [
  {
    permission: [dist_superadmin],

    title: "Dashboard",
    icon: <img src={dashboardIcon} />,
    link: "/distributor",
    activeFor: ["/distributor"],
  },
  {
    permission: [dist_superadmin, products],

    title: "User Management",
    icon: <img src={Products} />,
    link: "/distributor/usermanagement",
    activeFor: ["/distributor/usermanagement", "/distributor/createuser"],
  },
  {
    permission: [dist_superadmin, Business],

    title: "Business Profile",
    icon: <img src={Business} />,
    link: "/distributor/businessprofile",
    activeFor: ["/distributor/businessprofile", "/distributor/createlocation"],
  },
  {
    permission: [dist_superadmin, distributors],

    title: "Clients",
    icon: <img src={UserIcon} />,
    link: "/distributor/clients",
    activeFor: ["/distributor/clients"],
  },
  {
    permission: [dist_superadmin, distributors],

    title: "QR Code",
    icon: <img src={UserIcon} />,
    link: "/distributor/distributor-QR",
    activeFor: ["/distributor/distributor-QR"],
  },
  {
    permission: [dist_superadmin, notifications],

    title: "Notification",
    icon: <img src={Bell} />,
    link: "/distributor/notifilcation",
    activeFor: ["/distributor/notifilcation"],
  },
];