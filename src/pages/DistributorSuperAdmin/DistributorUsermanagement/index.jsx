import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// import icon from "../../Assets/Profile/profileicon/Icon.png";
import icon from "../../../Assets/Profile/profileicon/Icon.png";

import { useNavigate } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import { toast } from "react-toastify";
import DataTableComponent from "../../../components/DataTable";
import {
  deleteUserManagementData,
  fetchUserManagementData,
} from "../../../redux/slice/UserManagementSlice";
import InfoModal from "../../../components/Common/InfoModal";
import Loader from "../../../components/Common/Loader";
import UpdateUserStatusModal from "../../../components/Common/UpdateUserStatusModal";
import DeleteConFirmationModal from "../../../components/Common/DeleteConFirmationModal";

function DistributorUsermanagement() {
  const [userListModal, setUserListModal] = useState(false);
  const [deleteconfirm, setDeleteConfirm] = useState(false);
  const [connfirmUpdateModal, setConfirmUpdateModal] = useState(false);
  const [modalConfirmTitle, setModalConfirmTitle] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [showDropCon, setShowDropCon] = useState(false);
  const [downDrop, setDownDrop] = useState(false);
  const [customClass, setCustomClass] = useState("");
  const [removeId, setRemoveId] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, UserManagementData } = useSelector(
    (state) => state.USERMANAGEMENT
  );

  const userStatusUpdateHandler = async (id) => {
    toast.success("User Status Updated Successfully");
    setConfirmUpdateModal(false);
    setDeleteConfirm(false);
  };
  const clickRowHandler = (row) => {
    setUserInfo(row);
    navigate(`/distributor/update-distibutor-user/${row._id}`, { state: row });
  };
  const onSelectedCheckboxChange = (check) => {
    const selectedid = check?.selectedRows.map((curElm) => curElm._id);
    setRemoveId(selectedid);
    setShowDropCon(true);
  };
  const downIconHandler = () => {
    setDownDrop(!downDrop);
  };
  const removeUserHandler = async () => {
    const res = await dispatch(deleteUserManagementData({ userIds: removeId }));
    navigate("/distributor/usermanagement");
    setDeleteConfirm(false);
  };

  const deletehandler = () => {
    setDeleteConfirm(true);
    setModalConfirmTitle("Are you sure you want to delete this user ?");
    setDownDrop(false);
    setShowDropCon(false);
  };

  const statushandler = () => {
    setConfirmUpdateModal(true);
    setModalConfirmTitle("Are you sure you want to update this user ?");
    setDownDrop(false);
    setShowDropCon(false);
  };

  const handleCustmClassForUnderLine = (num) => {
    setCustomClass(num);
  };
  useEffect(() => {
    dispatch(fetchUserManagementData());
  }, [dispatch]);
  const usercolumns = [
    {
      name: "",
      selector: (row) => (
        <img
          src={row.profile_pic ? row.profile_pic : icon}
          alt={row.lastName}
          className="products-image"
        />
      ),
      width: "80px",
    },

    {
      name: (
        <span
          className={customClass === "1" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("1")}
        >
          {" "}
          Last Name
        </span>
      ),
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      name: (
        <span
          className={customClass === "2" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("2")}
        >
          {" "}
          First Name
        </span>
      ),
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: (
        <span
          className={customClass === "3" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("3")}
        >
          Job Title
        </span>
      ),
      selector: (row) => row.job_title,
      sortable: true,
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
      selector: (row) => row.location_name,
      sortable: true,
    },
    // {
    //   name: (
    //     <span
    //       className={customClass === "5" ? "cutomspan_stylefor_sorting" : ""}
    //       onClick={() => handleCustmClassForUnderLine("5")}
    //     >
    //       {" "}
    //       Area
    //     </span>
    //   ),
    //   // selector: (row) => row.company_name,
    //   sortable: true,
    // },
    // {
    //   name: (
    //     <span
    //       className={customClass === "6" ? "cutomspan_stylefor_sorting" : ""}
    //       onClick={() => handleCustmClassForUnderLine("6")}
    //     >
    //       Role
    //     </span>
    //   ),
    //   selector: (row) => row.assigned_role,
    //   sortable: true,
    // },
    {
      name: (
        <span
          className={customClass === "6" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("6")}
        >
          Role
        </span>
      ),
      selector: (row) => {
        if (row.assigned_role === "distributor_superadmin") {
          return "Super Admin";
        } else if (row.assigned_role === "salesrepresentative") {
          return "Sales Executive";
        } else {
          return row.assigned_role;
        }
      },
      sortable: true,
    }
    
     
    // {
    //   name: "Action",
    //   selector: (row) => (
    //     <div className="d-flex d-none">
    //       <NavLink
    //         className={"btn btn-sm btn-info me-2"}
    //         to={`/update-user/${row._id}`}
    //       >
    //         <FaEdit />
    //       </NavLink>
    //       <button
    //         className={"btn btn-sm btn-danger"}
    //         onClick={() => removeUserHandler(row._id)}
    //       >
    //         <FaRegTrashAlt />
    //       </button>
    //     </div>
    //   ),
    // },
  ];
  if (status === "loading") {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  const userData = UserManagementData || [];

  return (
    <div className=" position-relative">
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
              <h6 className="cursor mt-1" onClick={() => statushandler()}>
                Disable/Enable{" "}
              </h6>
            </div>
          )}
        </div>
      )}
      <DataTableComponent
        title={"User Management"}
        columns={usercolumns}
        data={userData}
        selectedRows
        clickedrow={clickRowHandler}
        checkboxchange={onSelectedCheckboxChange}
      />
      {userListModal && (
        <InfoModal
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
          eventhandler={removeUserHandler}
          hide={() => setDeleteConfirm(false)}
        />
      )}

      {connfirmUpdateModal && (
        <UpdateUserStatusModal
          show={connfirmUpdateModal}
          title={modalConfirmTitle}
          eventhandler={userStatusUpdateHandler}
          hide={() => setConfirmUpdateModal(false)}
        />
      )}
    </div>
  );
}
export default DistributorUsermanagement;
// export default DistributorUsermanagement;
