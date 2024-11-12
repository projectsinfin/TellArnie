import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { FaFileExport, FaFileImport, FaPlus } from "react-icons/fa";
import "./Kits.css";
import tableData from "../../data";
import products from "../../Assets/images/product.png";
import CustomPagination from "../../components/Common/Pagination";
import DataTableComponent from "../../components/DataTable";
import {
  deleteKitManagementData,
  fetchKitssManagementData,
} from "../../redux/slice/KitManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Common/Loader";
import image from "../../Assets/no-img/no-image-icon.png";
import { toast } from "react-toastify";
import { FaCaretDown } from "react-icons/fa6";
import DeleteConFirmationModal from "../../components/Common/DeleteConFirmationModal";
import KitInfoModal from "../../components/Common/InfoModal/kitInfo";
import { useNavigate } from "react-router-dom";

function Kits() {
  const [userListModal, setUserListModal] = useState(false);
  const [connfirmUpdateModal, setConfirmUpdateModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [deleteconfirm, setDeleteConfirm] = useState(false);
  const [modalConfirmTitle, setModalConfirmTitle] = useState("");
  const [showDropCon, setShowDropCon] = useState(false);
  const [downDrop, setDownDrop] = useState(false);
  const [customClass, setCustomClass] = useState("");
  const [removeId, setRemoveId] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { status, KitManagementData } = useSelector(
    (state) => state.KITMANAGEMENT
  );
  console.log(KitManagementData, "KITMANAGEMENT");

  // const removeKitHandler = async (id) => {
  //   toast.success("Kit Deleted Successfully");
  //   setDeleteConfirm(false);
  // };
  const removeKitHandler = async () => {
    const res = await dispatch(deleteKitManagementData({ kitIds: removeId }));
    navigate("/kit");
    setDeleteConfirm(false);
  };
  const clickRowHandler = (row) => {
    setUserInfo(row);
    setUserListModal(true);
  };
  useEffect(() => {
    dispatch(fetchKitssManagementData());
  }, [dispatch]);
  const onSelectedCheckboxChange = (check) => {
    const selectedid = check?.selectedRows.map((curElm) => curElm._id);
    setRemoveId(selectedid);
    setShowDropCon(true);
  };
  const KitColumns = [
    // {
    //   name: "Product",
    //   selector: (row) => (
    //     <div className="products-wrapper">
    //       {
    //         <img
    //           src={
    //             image
    //           }
    //           alt={row.product_name}
    //           className="products-image"
    //         />
    //       }
    //       <span>{row.product_name}</span>
    //     </div>
    //   ),
    // },
    // {
    //   name: "",
    //   width: "80px",
    //   cell: (row) => (
    //     <div className="products-wrapper d-flex align-items-center">
    //       <img
    //         src={row.kit_picture}
    //         // alt={row.product_name}
    //         className="products-image"
    //         onError={(e) => {
    //           e.target.src = image;
    //         }}
    //       />
    //     </div>
    //   ),
    // },
    // {
    //   name: (
    //     <span
    //       className={customClass === "1" ? "cutomspan_stylefor_sorting" : ""}
    //       onClick={() => handleCustmClassForUnderLine("1")}
    //     >
    //       Product
    //     </span>
    //   ),
    //   width: "300px",
    //   selector: (row) => row.product_code + row.product_name,
    //   sortable: true,
    // },
    {
      name: (
        <span
          className={customClass === "1" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("1")}
        >
          Product
        </span>
      ),
      width: "25%",
      selector: (row) => {
        const productCode = row.product_code ?? "";
        return productCode + " " + row.product_name;
      },
      sortable: true,
    },

    {
      name: (
        <span
          className={customClass === "2" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("2")}
        >
          Registered To
        </span>
      ),
      selector: (row) => row.company_name,
      sortable: true,
      width: "10%",
    },
    {
      name: (
        <span
          className={customClass === "3" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("3")}
        >
          Industry
        </span>
      ),
      selector: (row) => row.industry,
      sortable: true,
      width: "20%",
    },
    {
      name: (
        <span
          className={customClass === "4" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("4")}
        >
          Location
        </span>
      ),
      width: "15%",
      selector: (row) => row.location_name,
      sortable: true,
    },
    {
      name: (
        <span
          className={customClass === "5" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("5")}
        >
          Area
        </span>
      ),
      width: "10%",

      selector: (row) => row.area,
      sortable: true,
    },
    // {
    //   name: "Status ",
    //   selector: (row) =>
    //     row.actions.map((action, index) => (
    //       <span key={index} className={`action ${action.type}`}>
    //         {action.name}
    //       </span>
    //     )),
    // },
    // actions: [{ name: "Complaint", type: "primary" }],

    {
      name: "Status",
      selector: (row) => {
        let statusContent = row.status;
        let statusColor = "";
        switch (row.status.toLowerCase()) {
          case "compliant":
            statusContent = "Compliant";
            statusColor = "green";
            break;
          case "near expiry":
            statusContent = "Expiring";
            statusColor = "yellow";
            break;
          default:
            statusContent = "update";
            statusColor = "red";
            break;
        }
        statusContent =
          statusContent.charAt(0).toUpperCase() + statusContent?.slice(1);
        return <span className={`status ${statusColor}`}>{statusContent}</span>;
      },
    },
  ];

  const handleCustmClassForUnderLine = (num) => {
    setCustomClass(num);
  };

  const downIconHandler = () => {
    setDownDrop(!downDrop);
  };

  const deletehandler = () => {
    setDeleteConfirm(true);
    setModalConfirmTitle("Are you sure you want to delete this kit ?");
    setDownDrop(false);
    setShowDropCon(false);
  };

  // const onSelectedCheckboxChange = (check) => {
  //   setShowDropCon(true);
  // };

  if (status === "loading") {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  const userData = KitManagementData || [];
  return (
    <div className="kit-management position-relative">
      {userData && userData.length > 0 && showDropCon && (
        <div className="dropdown_icon_style">
          <div onClick={() => downIconHandler()}>
            <FaCaretDown size={23} />
          </div>
          {downDrop && (
            <div className="eventboxdatausereventlisting">
              <h6 className="cursor" onClick={() => deletehandler()}>
                Delete{" "}
              </h6>
            </div>
          )}
        </div>
      )}
      <DataTableComponent
        search={true}
        searchBy={[
          "company_name",
          "industry",
          "product_code",
          "product_name",
          "location_name",
          "area",
        ]}
        title={"Registered Kit Management"}
        columns={KitColumns}
        data={userData}
        selectedRows
        clickedrow={clickRowHandler}
        checkboxchange={onSelectedCheckboxChange}
      />

      {userListModal && (
        <KitInfoModal
          hide={() => setUserListModal(false)}
          show={userListModal}
          title={"User Information"}
          listingData={userInfo}
        />
      )}
      {deleteconfirm && (
        <DeleteConFirmationModal
          show={deleteconfirm}
          title={modalConfirmTitle}
          eventhandler={removeKitHandler}
          hide={() => setDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

export default Kits;
