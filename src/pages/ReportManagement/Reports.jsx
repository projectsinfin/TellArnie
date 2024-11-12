import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FaCaretDown, FaEdit, FaTrash } from "react-icons/fa";
import DataTableComponent from "../../components/DataTable";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReportGroupData,
  fetchReportsListingData,
} from "../../redux/slice/ReportsListingSlice";
import Loader from "../../components/Common/Loader";
import "./Reports.css";
import {
  deleteReportListData,
  fetchReportsListData,
} from "../../redux/slice/ReportsSlice";
import { useNavigate } from "react-router-dom";
import DeleteConFirmationModal from "../../components/Common/DeleteConFirmationModal";
import UpdateUserStatusModal from "../../components/Common/UpdateUserStatusModal";

function Reports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [connfirmUpdateModal, setConfirmUpdateModal] = useState(false);
  const [removeId, setRemoveId] = useState(null);
  // const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteconfirm, setDeleteConfirm] = useState(false);

  const [modalConfirmTitle, setModalConfirmTitle] = useState("");
  const [showDropCon, setShowDropCon] = useState(false);
  const [downDrop, setDownDrop] = useState(false);

  const { status, data: ReportsManagementData } = useSelector(
    (state) => state.REPORTSLISTING
  );
  const { status2, fetchReportListingData } = useSelector(
    (state) => state.REPORTSLISTINGDATA
  );

  useEffect(() => {
    dispatch(fetchReportsListingData());
    dispatch(fetchReportsListData());
  }, [dispatch]);

  const deletehandler = () => {
    setDeleteConfirm(true);
    setModalConfirmTitle("Are you sure you want to delete this report?");
    setDownDrop(false);
    setShowDropCon(false);
  };
  const removeGroupHandler = async () => {
    const res = await dispatch(deleteReportListData({ reportIds: removeId }));
    navigate("/reports");
    setDeleteConfirm(false);
  };

  const onSelectedCheckboxChange = (check) => {
    const selectedid = check?.selectedRows.map((curElm) => curElm._id);
    setRemoveId(selectedid);
    setShowDropCon(true);
  };
  const clickRowHandler = (row) => {
    navigate(`/edit_report_listing/${row._id}`);
};

  
  const deleteReportGroupHandler = async (groupId) => {
    try {
        // Set the loader state to 'loading'
        dispatch(fetchReportsListingData());

        await dispatch(deleteReportGroupData(groupId));

        navigate("/reports");
    } catch (error) {
        // Handle error
    }
};

  const reportsColumns = [
    {
      name: "Report Name",
      selector: (row) => row.report_name,
    },
    {
      name: "Frequency",
      selector: (row) => `${row.frequency_units} x ${row.how_often}`,
    },
    {
      name: "Recipients",
      selector: (row) => row.recipients,
    },
    {
      name: "Last Sent",
      selector: (row) => {
        const date = new Date(row.start_on);
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        return `${day} ${months[monthIndex]} ${year}`;
      },
      sortable: true,
    },
  ];
  const downIconHandler = () => {
    setDownDrop(!downDrop);
  };
  const editReportGroup = (groupId) => {
    navigate(`/edit_report_group/${groupId}`);
  };
  const userData = fetchReportListingData || [];

  return (
    <div className="reports">
      {status === "loading" && <Loader />}
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
      <Row>
        <Col md={8} className="reports_table">
          <DataTableComponent
            columns={reportsColumns}
            data={userData}
            title="Reports"
            selectedRows
            clickedrow={clickRowHandler}
            checkboxchange={onSelectedCheckboxChange}
          />
        </Col>

        <Col md={4}>
          <Card style={{ border: "none" }}>
            <h3 className="listing text-center border-bottom py-4">
              Report Groups
            </h3>
            {status === "loading" && <p>Loading...</p>}
            {status === "error" && <p>Error fetching data.</p>}
            {status === "idle" &&
              Array.isArray(ReportsManagementData) &&
              ReportsManagementData.length > 0 && (
                <div>
                  {ReportsManagementData?.map((group) => (
                    <div className="title-box mb-2" key={group._id}>
                      <div className="d-flex justify-content-between px-3 pb-2">
                        <p className="mb-0">{group.group_name}</p>
                      </div>
                      <div className="person-box">
                        <b>Directors</b>
                        <p className="mt-3 border-top border-bottom py-3">
                          {group.group_member?.map((member) => (
                            <span key={member._id}>{member.full_name}, </span>
                          ))}
                        </p>
                        <div className="d-flex mt-2 edit_delete">
                          {/* <span>
                            <FaEdit />
                            Edit
                          </span> */}
                            <span onClick={() => editReportGroup(group._id)}>
                            <FaEdit /> Edit
                          </span>
                          <button
                            onClick={() => deleteReportGroupHandler(group._id)} // Call deleteReportGroupHandler with groupId
                            className="btn-delete btn btn-danger px-4 py-2 ms-2"
                          >
                            Delete
                          </button>
                          {/* <span variant="danger">
                                                    <FaTrash />
                                                    Delete
                                                </span> */}
                        </div>
                      </div>
                      <p className="mt-4 px-3">Sales Reps</p>
                    </div>
                  ))}
                </div>
              )}
          </Card>
        </Col>
      </Row>

      {/* {deleteconfirm && (
        <DeleteConFirmationModal
          show={deleteconfirm}
          title={modalConfirmTitle}
          eventhandler={removeGroupHandler}
          hide={() => setDeleteConfirm(false)}
        />
      )} */}
      {deleteconfirm && (
        <DeleteConFirmationModal
          show={deleteconfirm}
          title={modalConfirmTitle}
          eventhandler={removeGroupHandler} // For individual reports
          deleteReportGroupHandler={deleteReportGroupHandler} // For report groups
          hide={() => setDeleteConfirm(false)}
        />
      )}
   
    </div>
  );
}

export default Reports;
