import React, { useEffect, useState } from "react";
import "./Products.css";
import DataTableComponent from "../../components/DataTable";
import { useDispatch, useSelector } from "react-redux";
import {
  deletepProductManagementData,
  fetchProductsManagementData,
} from "../../redux/slice/ProductManagementSlice";
import Loader from "../../components/Common/Loader";
import imageData from "../../data";
import CustomPagination from "../../components/Pagination";
import image from "../../Assets/no-img/no-image-icon.png";
import { FaCaretDown } from "react-icons/fa6";
import { toast } from "react-toastify";
import DeleteConFirmationModal from "../../components/Common/DeleteConFirmationModal";
import InfoModal from "../../components/Common/InfoModal";
import { useNavigate } from "react-router-dom";

function Products() {
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
  const { status, ProductManagementData } = useSelector(
    (state) => state.PRODUCTMANAGEMENT
  );
  const clickRowHandler = (row) => {
    setUserInfo(row);
    setUserListModal(true);
  };
  useEffect(() => {
    dispatch(fetchProductsManagementData());
  }, [dispatch]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const columns = [
    {
      name: "",
      width: "80px",
      cell: (row) => (
        <div className="products-wrapper d-flex align-items-center">
          <img
            src={row.kit_picture}
            // alt={row.description}
            className="products-image"
            onError={(e) => {
              e.target.src = image;
            }}
          />
        </div>
      ),
    },
    {
      name: (
        <span
          className={customClass === "1" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("1")}
        >
          Product Code
        </span>
      ),
      width: "150px",
      selector: (row) => row.model_number,
      sortable: true,
    },
    {
      name: (
        <span
          className={customClass === "2" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("2")}
        >
          Product
        </span>
      ),
      width: "250px", // Set width for the Product column

      // selector: (row) => row.brand,
      selector: (row) => row.product_name,
      sortable: true,
    },

    {
      name: (
        <span
          className={customClass === "3" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("3")}
        >
          Brand
        </span>
      ),
      // selector: (row) => row.brand,
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: (
        <span
          className={customClass === "4" ? "cutomspan_stylefor_sorting" : ""}
          onClick={() => handleCustmClassForUnderLine("4")}
        >
          Contents
        </span>
      ),
      width: "170px",
      selector: (row) => row.quantity,
      sortable: true,
    },
    // {
    //   name: "Barcode",
    //   selector: (row) => row.lot_number,
    // },
    // {
    //   name: "Barcode",
    //   // selector: (row) => row.lot_number,
    // },
    // {
    //   name: (
    //     <span
    //       className={customClass === "5" ? "cutomspan_stylefor_sorting" : ""}
    //       onClick={() => handleCustmClassForUnderLine("5")}
    //     >
    //       LOT Number
    //     </span>
    //   ),
    //   selector: (row) => row.lot_number,
    //   sortable: true,
    //   width: "200px",
    // },
    // {
    //   name: (
    //     <span
    //       className={customClass === "6" ? "cutomspan_stylefor_sorting" : ""}
    //       onClick={() => handleCustmClassForUnderLine("6")}
    //     >
    //       Batch
    //     </span>
    //   ),
    //   selector: (row) => row.batch_number,
    //   sortable: true,
    // },
    // {
    //   name: "Expiry Date",
    //   selector: (row) => {
    //     const date = new Date(row.expiry_date);
    //     const months = [
    //       "Jan",
    //       "Feb",
    //       "Mar",
    //       "Apr",
    //       "May",
    //       "Jun",
    //       "Jul",
    //       "Aug",
    //       "Sep",
    //       "Oct",
    //       "Nov",
    //       "Dec",
    //     ];
    //     const day = date.getDate();
    //     const monthIndex = date.getMonth();
    //     const year = date.getFullYear();
    //     return `${day} ${months[monthIndex]} ${year}`;
    //   },
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
  const userData = ProductManagementData || [];
  const totalItems = userData.length;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const displayedRange = `${startItem}-${endItem}`;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCustmClassForUnderLine = (num) => {
    setCustomClass(num);
  };

  const downIconHandler = () => {
    setDownDrop(!downDrop);
  };

  const deletehandler = () => {
    setDeleteConfirm(true);
    setModalConfirmTitle("Are you sure you want to delete this Product ?");
    setDownDrop(false);
    setShowDropCon(false);
  };
  // const removeProductHandler = async (id) => {
  const removeProductHandler = async () => {
    const res = await dispatch(
      deletepProductManagementData({ productIds: removeId })
    );
    navigate("/products");
    setDeleteConfirm(false);
  };
  // const onSelectedCheckboxChange = (check) => {
  //   setShowDropCon(check?.selectedCount > 0 ? true : false);
  // };
  const onSelectedCheckboxChange = (check) => {
    const selectedid = check?.selectedRows.map((curElm) => curElm._id);
    setRemoveId(selectedid);
    setShowDropCon(true);
  };
  return (
    <div className="product-management">
      <div className="position-relative">
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
          searchBy={["product_name","brand","model_number"]}
          title={`Product Management `}
          columns={columns}
          data={userData}
          clickedrow={clickRowHandler}
          selectedRows
          checkboxchange={onSelectedCheckboxChange}
        />
      </div>

      {userListModal && (
        <InfoModal
          hide={() => setUserListModal(false)}
          show={userListModal}
          title={"Product Management"}
          listingData={userInfo}
        />
      )}
      {deleteconfirm && (
        <DeleteConFirmationModal
          show={deleteconfirm}
          title={modalConfirmTitle}
          eventhandler={removeProductHandler}
          hide={() => setDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

export default Products;
