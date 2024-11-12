import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTableComponent from "../../components/DataTable";
import {
  deleteUserManagementData,
  fetchUserManagementData,
} from "../../redux/slice/UserManagementSlice";
import icon from "../../Assets/Profile/profileicon/Icon.png";
import Loader from "../../components/Common/Loader";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import InfoModal from "../../components/Common/InfoModal";
import { toast } from "react-toastify";
import DeleteConFirmationModal from "../../components/Common/DeleteConFirmationModal";
import UpdateUserStatusModal from "../../components/Common/UpdateUserStatusModal";
import Swal from "sweetalert2";
import { inviteViaEmail } from "../../redux/slice/CreateNewUserSlice";

function Users() {
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
  // const clickRowHandler = (row) => {
  //   setUserInfo(row);
  //   setUserListModal(true);
  // };
  const clickRowHandler = (row) => {
    // Redirect to the "update-user" page with the respective ID
    navigate(`/update-user/${row._id}`);
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
    navigate("/users");
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
        if (row.assigned_role === "rm_superadmin") {
          return "Super Admin";
        } else if (row.assigned_role === "admin") {
          return "Admin";
        } else if (row.assigned_role === "approver") {
          return "Approver";
        } else if (row.assigned_role === "approver") {
          return "Approver";
        } else if (row.assigned_role === "user") {
          return "User";
        } else if (row.assigned_role === "salesrepresentative") {
          return "Sales Executive";
        } else if (row.assigned_role === "rm_admin") {
          return "Admin";
        } else {
          return row.assigned_role; // Return the original role if it doesn't match any condition
        }
      },
      sortable: true,
    },

    // {
    //   name: "Action",
    //   selector: (row) => (
    //     <div className="d-flex d-none">
    //       <NavLink
    //         className={"btn btn-sm btn-info me-2"}
    //         to={`/update-user/${row._id}`}
    //       >
    //         <FaEdit/>
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
    {
      name: "Invite",
      selector: (row) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleInvite(row)}
        >
          Invite
        </button>
      ),
      button: true, // Indicate that this column contains buttons
      ignoreRowClick: true, // Prevent row selection when clicking this button
      allowOverflow: true, // Allow content to overflow into next cells
      buttonContentClasses: "btn btn-sm btn-primary", // Button classes
      width: "100px", // Width of the column
    },
  ];

  const handleInvite = (row) => {
    Swal.fire({
      title: "Send Invitation?",
      text: `Send an invitation link to ${row.email}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Send Email",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleOkButtonClick(row.email);
      }
    });
  };
  const handleOkButtonClick = async (email) => {
    const response = await dispatch(inviteViaEmail({ email }));
    if (response.payload.status === 200) {
      Swal.fire(
        "Email Sent",
        "Confirmation email has been sent successfully!",
        "success"
      );
    } else {
      Swal.fire(
        "Failed to Send Email",
        "An error occurred while sending the email",
        "error"
      );
    }
  };

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
              {/* <h6 className="cursor mt-1" onClick={() => statushandler()}>
                Disable/Enable{" "}
              </h6> */}
            </div>
          )}
        </div>
      )}
      <DataTableComponent
        search={true}
        searchBy={["email", "first_name", "job_title"]}
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
export default Users;
