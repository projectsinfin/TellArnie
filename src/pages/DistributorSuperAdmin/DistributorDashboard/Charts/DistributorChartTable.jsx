import { Badge, Card, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import icon from "../../../../Assets/dashboard/image 1.png"
import { useDispatch, useSelector } from "react-redux";
import DataTableComponent from "../../../../components/DataTable";
import { fetchdistributordashboardData } from "../../../../redux/slice/DistributorDashboardSlice";

const ChartTable = () => {
  const { DistributorDashboardData } = useSelector(
    (state) => state.DISTRUBUTORDASHBOARD
  );
  const [showDropCon, setShowDropCon] = useState(false);
  const [downDrop, setDownDrop] = useState(false);
  const [customClass, setCustomClass] = useState("");

  useEffect(() => {
    dispatch(fetchdistributordashboardData());
  }, []);
  const dispatch = useDispatch();
  let columnStyle = {
    fontSize: 16,
    color: "#16161D",
    fontWeight: "400px",
  };
  const columns = [
    {
      name: (
        <span
          className={customClass === "1" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("1")}
        >
          Distributor
        </span>
      ),
      selector: (row) => row.distributor_email,
      style: columnStyle,
      sortable: true,
      width: "300px",
    },
    {
      name: (
        <span
          className={customClass === "2" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("2")}
        >
          Client Business Name
        </span>
      ),
      // cell: (row) => (
      //   <div style={{ display: "flex", alignItems: "center" }}>
      //     <img src={icon} alt="Business Icon" style={{ marginRight: 10 }} />
      //     {row.company_name}
      //   </div>
      // ),
      selector: (row) => row.company_name,
      style: columnStyle,
      sortable: true,
      width: "250px",
    },
    {
      name: (
        <span
          className={customClass === "3" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("3")}
        >
          Kit Status
        </span>
      ),
      selector: (row) => row.expiryCount,
      cell: (row) => (
        <div>
          <Badge className="m-1" style={{ borderRadius: 50 }} bg="success">
            {/* {row.kitStatus} */}
            {row.compliantCount}
          </Badge>

          <Badge className="m-1" style={{ borderRadius: 50 }} bg="warning">
            {row.expiryCount}
          </Badge>
          <Badge className="m-1" style={{ borderRadius: 50 }} bg="danger">
            {row.nonCompliantCount}
          </Badge>
        </div>
      ),
      style: columnStyle,
      width: "200px",
      sortable: true,
    },
    {
      name: (
        <span
          className={customClass === "4" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("4")}
        >
          Users
        </span>
      ),
      selector: (row) => row.userCount,
      // selector: (row) => 47,

      style: columnStyle,
      sortable: true,
      width: "80px",
    },
    {
      name: (
        <span
          className={customClass === "5" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("5")}
        >
          First Aiders
        </span>
      ),
      selector: (row) => row.RfaExpired,
      cell: (row) => (
        <div>
          <Badge className="m-1" style={{ borderRadius: 50 }} bg="success">
            {row.RfaCount}
          </Badge>

          <Badge className="m-1" style={{ borderRadius: 50 }} bg="warning">
            {row.RfaSoon}
          </Badge>
          <Badge className="m-1" style={{ borderRadius: 50 }} bg="danger">
            {row.RfaExpired}
          </Badge>
        </div>
      ),
      style: columnStyle,
      width: "200px",
      sortable: true,
    },
    {
      name: (
        <span
          className={customClass === "6" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("6")}
        >
          Last Registration
        </span>
      ),
      selector: (row) => {
        const date = new Date(row.account_creation);
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
      // selector: (row) => row.account_creation,
      style: columnStyle,
      width: "200px",
    },
    {
      name: "Risk Assessment",
      selector: (row) => (
        <Badge
          className="m-1"
          style={{ borderRadius: 20, padding: 10 }}
          bg={"Complete" === "Pending" ? "warning" : "success"}
        >
          {/* {row.riskAssessment}
           */}
          {"Complete"}
        </Badge>
      ),
      style: columnStyle,
      checked: false,
      width: "250px",
    },
  ];

  const userData = DistributorDashboardData?.data?.company || [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = userData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userData?.slice(indexOfFirstItem, indexOfLastItem);
  const onPageChange = (pageNumber) => setCurrentPage(pageNumber);
  const onNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const onPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleCustmClassForUnderLine = (num) => {
    setCustomClass(num);
  };

  const downIconHandler = () => {
    setDownDrop(!downDrop);
  };

  const deletehandler = () => {
    if (window.confirm("Are you sure want to delete this user?")) {
      toast.success("User Deleted Successfully");
      setDownDrop(false);
      setShowDropCon(false);
    }
  };

  const statushandler = () => {
    if (window.confirm("Are you sure want to update status of this user?")) {
      toast.success("Status Updated Successfully");
      setDownDrop(false);
      setShowDropCon(false);
    }
  };
  const onSelectedCheckboxChange = (check) => {
    setShowDropCon(true);
  };

  return (
    <Card style={{ border: "none", borderRadius: "16px" }}>
      <div style={{ padding: 8 }}>
        {/* <h3
          style={{ fontWeight: "700", fontSize: "24px" }}
          className="px-2 mt-4 mb-0 pt-0"
        >
          Registered Company Details
        </h3> */}
        <div className="position-relative">
          {userData && userData.length > 0 && showDropCon && (
            <div className="dropdown_icon_style">
              {/* <div onClick={() => downIconHandler()}>
                <FaCaretDown size={23} />
              </div> */}
              {downDrop && (
                <div className="eventboxdatausereventlisting">
                  <h6 className="cursor" onClick={() => deletehandler()}>
                    Delete{" "}
                  </h6>
                  <h6 className="cursor mb-0" onClick={() => statushandler()}>
                    Disable/Enable{" "}
                  </h6>
                </div>
              )}
            </div>
          )}
          <DataTableComponent
            title={"Registered Company Details"}
            columns={columns}
            data={userData}
            // selectedRows
            // checkboxchange={onSelectedCheckboxChange}
          />
        </div>
      </div>
    </Card>
  );
};

export default ChartTable;
