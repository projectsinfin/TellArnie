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
import "./MessageCentre.css";
import tableData from "../../data";
import { useDispatch, useSelector } from "react-redux";

import DataTableComponent from "../../components/DataTable";
import { columns } from "../Products/Products";
import Loader from "../../components/Common/Loader";
import {
  deleteMessageCenterData,
  fetchMessageCentreData,
} from "../../redux/slice/MessageCentreSlice";
import { FaCaretDown } from "react-icons/fa6";
import { toast } from "react-toastify";
import DeleteConFirmationModal from "../../components/Common/DeleteConFirmationModal";
import { useNavigate } from "react-router-dom";

function MessageCentre() {
  const dispatch = useDispatch();
  const [deleteconfirm, setDeleteConfirm] = useState(false);
  const [modalConfirmTitle, setModalConfirmTitle] = useState("");
  const [customClass, setCustomClass] = useState("");
  const [showDropCon, setShowDropCon] = useState(false);
  const [downDrop, setDownDrop] = useState(false);
  const [removeId, setRemoveId] = useState([]);

  const { status, MessageCentreData } = useSelector(
    (state) => state.MESSAGECENTRE
  );

  const navigate = useNavigate();
  console.log(MessageCentreData, "MessageCentreData");

  const handleCustmClassForUnderLine = (num) => {
    setCustomClass(num);
  };

  const downIconHandler = () => {
    setDownDrop(!downDrop);
  };

  const deletehandler = () => {
    setDeleteConfirm(true);
    setModalConfirmTitle("Are you sure you want to delete this Message ?");
    setDownDrop(false);
    setShowDropCon(false);
  };

  const removeMessageHandler = async () => {
    const data = { deleteMessageIds: removeId };
    const res = await dispatch(deleteMessageCenterData(data));
    navigate("/messaging");
    setDeleteConfirm(false);
  };
  const onSelectedCheckboxChange = (data) => {
    console.log(data, "data");
    const selectedids = data?.selectedRows.map((curElm) => {
      if (curElm.type === "Article") {
        return {
          article_id: curElm.article_id,
          type: curElm.type,
        };
      } else {
        return {
          notification_id: curElm.notification_id,
          type: curElm.type,
        };
      }
    });
    setRemoveId(selectedids);
    setShowDropCon(true);
  };
  useEffect(() => {
    dispatch(fetchMessageCentreData());
  }, [dispatch]);
  const Messagecolumns = [
    {
      name: (
        <span
          className={customClass === "1" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("1")}
        >
          {" "}
          Subject
        </span>
      ),
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: (
        <span
          className={customClass === "2" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("2")}
        >
          Category
        </span>
      ),
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: (
        <span
          className={customClass === "3" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("3")}
        >
          {" "}
          Type
        </span>
      ),
      selector: (row) => row.type,
      sortable: true,
    },

    {
      name: (
        <span
          className={customClass === "4" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("4")}
        >
          Scheduled
        </span>
      ),
      selector: (row) => new Date(row.publish_on).toLocaleDateString(),
      sortable: true,
    },

    {
      name: (
        <span
          className={customClass === "5" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("5")}
        >
          Status
        </span>
      ),
      selector: (row) => row.status,
      sortable: true,
    },
  ];
  if (status === "loading") {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const userData = MessageCentreData || [];
  console.log(userData, "show data here ");

  const onRowClickHandler = (values) => {
    if (values.type === "Article") {
      navigate("/editarticle", {
        state: {
          ...values,
        },
      });
    } else {
      navigate("/edit-notification", {
        state: {
          ...values,
        },
      });
    }
  };
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
            </div>
          )}
        </div>
      )}
      <DataTableComponent
        title={"Message Center"}
        columns={Messagecolumns}
        data={userData}
        selectedRows
        checkboxchange={onSelectedCheckboxChange}
        clickedrow={onRowClickHandler}
      />
      {deleteconfirm && (
        <DeleteConFirmationModal
          show={deleteconfirm}
          title={modalConfirmTitle}
          eventhandler={removeMessageHandler}
          hide={() => setDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

export default MessageCentre;
