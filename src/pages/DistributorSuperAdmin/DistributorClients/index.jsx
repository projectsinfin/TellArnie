import React, { useEffect, useState } from "react";

import "./index.css";

import icon from "../../../Assets/Profile/profileicon/Icon.png";
import DataTableComponent from "../../../components/DataTable";
import tableData from "../../../data";
import KitInfoModal from "../../../components/Common/InfoModal/kitInfo";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Common/Loader";
import { fetchDistributorClientData } from "../../../redux/slice/ClientsDistributorSlice";

function DistributorClients() {
  const { status, ClientDistributorData } = useSelector(
    (state) => state.DISTRIBUTORCLIENTMANAGEMENT
  );
  console.log(ClientDistributorData, "ClientDistributorData");
  const [userListModal, setUserListModal] = useState(false);
  const dispatch = useDispatch();

  const [downDrop, setDownDrop] = useState(false);
  const [customClass, setCustomClass] = useState("");
  const [removeId, setRemoveId] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [showDropCon, setShowDropCon] = useState(false);
  useEffect(() => {
    dispatch(fetchDistributorClientData());
  }, [dispatch]);
  const clickRowHandler = (row) => {
    setUserInfo(row);
    setUserListModal(true);
  };
  const onSelectedCheckboxChange = (check) => {
    const selectedid = check?.selectedRows.map((curElm) => curElm._id);
    setRemoveId(selectedid);
    setShowDropCon(true);
  };
  const distColumns = [
    {
      name: "Company Name",
      selector: (row) => (
        <div className="products-wrapper">
          <img
            src={icon}
            alt={row.company_name}
            className="products-image"
          />
          <span>{row.company_name}</span>
        </div>
      ),
    },
    {
      name: "Country",
      selector: (row) => row.country,
    },

    {
      name: "County",
      selector: (row) => row.county,
    },
    {
      name: "Super Admin",
      // name: "Role",

      selector: (row) => row.assigned_superadmin,
    },
    {
      name: "Approver",
      selector: (row) => row.assigned_approver,
    },
    // {
    //   name: "Alternate Distributor Name ",
    //   selector: (row) => row.alternate_distributor_name,
    // },
  ];
  if (status === "loading") {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  const userData = ClientDistributorData?.data?.Users?.[0] || [];

  return (
    <div className="kit-management position-relative ">
      <DataTableComponent
        title={"View Clients"}
        columns={distColumns}
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
    </div>
  );
}

export default DistributorClients;
