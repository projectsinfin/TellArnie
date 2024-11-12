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
import "./Distributor.css";
import tableData from "../../data";
import products from "../../Assets/images/product.png";
import CustomPagination from "../../components/Common/Pagination";
import DataTableComponent from "../../components/DataTable";
import { columns } from "../Products/Products";
import { useDispatch, useSelector } from "react-redux";

import icon from "../../Assets/Profile/profileicon/Icon.png";
import { deleteDistributorManagementData, fetchDistributorManagementData } from "../../redux/slice/DistributionRegistrationSlice";
import Loader from "../../components/Common/Loader";
import { FaCaretDown } from "react-icons/fa6";
import { toast } from "react-toastify";
import DeleteConFirmationModal from "../../components/Common/DeleteConFirmationModal";
import { useNavigate } from "react-router-dom";

function Distributor() {
  const [deleteconfirm, setDeleteConfirm] = useState(false);
  const [modalConfirmTitle, setModalConfirmTitle] = useState("");
  const [showDropCon, setShowDropCon] = useState(false);
  const [downDrop, setDownDrop] = useState(false);
  const [removeId, setRemoveId] = useState([]);
  const [customClass, setCustomClass] = useState("");
  const dispatch = useDispatch();
  const navigate =useNavigate();
  const { status, DistributorRegisaterData } = useSelector(
    (state) => state.DISTRIBUTORMANAGEMENT
  );
  useEffect(() => {
    dispatch(fetchDistributorManagementData());
  }, [dispatch]);


  const clickRowHandler = (row) => {
    // Redirect to the "update-user" page with the respective ID
    navigate(`/update-distributor/${row._id}`, { state: row });
    // navigate(`/update-distributor`);
  };
const removeDistributorHandler = async () => {
  const res = await dispatch(deleteDistributorManagementData({ distributorIds: removeId }));
  navigate("/distributors");
  setDeleteConfirm(false);
};
const onSelectedCheckboxChange = (check) => {
  const selectedid = check?.selectedRows.map((curElm) => curElm._id);
  setRemoveId(selectedid);
  setShowDropCon(true);
};
  const distColumns = [
    {
      name: "",
      selector: (row) => (
        <div className="products-wrapper">
          <img
            src={icon}
            alt={row.distributor_name}
            className="products-image"
          />
        </div>
      ),
      width: "80px",
    },
    {
      name: (
        <span
          className={customClass === "1" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("1")}
        >
          Company Name
        </span>
      ),
      selector: (row) => row.distributor_name,
      sortable: true,
    },
    {
      name: (
        <span
          className={customClass === "2" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("2")}
        >
          Country
        </span>
      ),
      selector: (row) => row.country,
      sortable: true,
    },

    {
      name: (
        <span
          className={customClass === "3" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("3")}
        >
          County
        </span>
      ),
      selector: (row) => row.county,
      sortable: true,
    },
    {
      name: (
        <span
          className={customClass === "4" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("4")}
        >
          Super Admin
        </span>
      ),
      selector: (row) => {
        if (row.role === "distributor_superadmin") {
          return "Super Admin";
        } else {
          // If not distributor_superadmin, return an empty string or some default value
          return ""; // or return some default value
        }
      },
      sortable: true,
    }
    
    // {
    //   name: (
    //     <span
    //       className={customClass === "5" ? "cutomspan_stylefor_sorting" : ""}
    //       onClick={() => handleCustmClassForUnderLine("5")}
    //     >
    //       Approver
    //     </span>
    //   ),
    //   selector: (row) => row.alternate_distributor_name,
    //   sortable: true,
    // },
  ];
  if (status === "loading") {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const userData = DistributorRegisaterData || [];

  console.log(userData, "USERDATA");
  const handleCustmClassForUnderLine = (num) => {
    setCustomClass(num);
  };

  const downIconHandler = () => {
    setDownDrop(!downDrop);
  };

  const deletehandler = () => {
    setDeleteConfirm(true);
    setModalConfirmTitle("Are you sure you want to delete this distributor?");
    setDownDrop(false);
    setShowDropCon(false);
  };

  // const removeDistributorHandler = async (id) => {
  //   toast.success("Distributor Deleted Successfully");
  //   setDeleteConfirm(false);
  // };


  return (
    <div className="product-management2 position-relative">
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
        title={"Distributor Management"}
        columns={distColumns}
        data={userData}
        selectedRows
        clickedrow={clickRowHandler}

        checkboxchange={onSelectedCheckboxChange}
      />
      {deleteconfirm && (
        <DeleteConFirmationModal
          show={deleteconfirm}
          title={modalConfirmTitle}
          eventhandler={removeDistributorHandler}
          hide={() => setDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

export default Distributor;
