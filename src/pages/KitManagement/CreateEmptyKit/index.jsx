import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup
import {
  registerEmptyKit,
  setPdfData,
} from "../../../redux/slice/KitManagementSlice";
import ButtonLoader from "../../../components/Common/ButtonLoader";
import { StatusCode } from "../../../services/helper";
import { NavLink, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { fetchProductsManagementData } from "../../../redux/slice/ProductManagementSlice";
import { fetchDistributorManagementData } from "../../../redux/slice/DistributionRegistrationSlice";
import Loader from "../../../components/Common/Loader";

// Define your validation schema
const validationSchema = Yup.object({
  quantity: Yup.number()
    .positive("Quantity must be a positive number")
    .integer("Quantity must be an integer")
    .required("Quantity is required"),
});

const CreateEmptyKit = () => {
  const initialValues = { quantity: "" };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [place, setPlace] = useState(false);
  const ProductManagementData = useSelector((state) => state.PRODUCTMANAGEMENT);
  const { BatchKitsData } = useSelector((state) => state.BATCHKITS);
  const [filteredProductNames, setFilteredProductNames] = useState(
    ProductManagementData?.ProductManagementData
  );
  const [productsData, setProductsData] = useState(
    BatchKitsData?.data?.relatedProducts || []
  );
  const { status } = useSelector((state) => state.KITMANAGEMENT);

  const [excelLoading, setExcelLoading] = useState(false); // New state for Excel loading

  const {
    values,
    setValues,
    errors,
    handleBlur,
    handleChange,
    touched,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema, 
    onSubmit: async (values) => {
      const res = await dispatch(registerEmptyKit(values));
      if (res?.payload?.status === 200) {
        dispatch(setPdfData(res?.payload?.data));
        navigate("/kitpdf");
      }
    },
  });

  useEffect(() => {
    dispatch(fetchProductsManagementData());
    dispatch(fetchDistributorManagementData());
  }, [dispatch]);

  useEffect(() => {
    if (values.product_code) {
      const filteredProducts =
        ProductManagementData?.ProductManagementData?.filter(
          (product) =>
            product.product_code &&
            product.product_code
              .toLowerCase()
              .includes(values.product_code.toLowerCase())
        );
      setFilteredProductNames(filteredProducts);
    } else {
      setFilteredProductNames([]);
      setValues({ ...values, product_name: "" });
    }
  }, [values.product_code, ProductManagementData, setValues]);

  useEffect(() => {
    if (BatchKitsData?.data?.relatedProducts) {
      const currentDate = new Date().getTime();
      let minExpiryDate = null;
      const initialProducts = BatchKitsData.data.relatedProducts.map(
        (product) => ({
          ...product,
          item_not_expire: true,
        })
      );
      setProductsData(initialProducts);

      filteredProductNames.forEach((product) => {
        const expiryTime = new Date(product.expiry_date).getTime();
        if (!minExpiryDate || expiryTime < minExpiryDate) {
          if (expiryTime > currentDate) {
            minExpiryDate = expiryTime;
          }
        }
      });

      if (minExpiryDate) {
        const minExpiryDateObj = new Date(minExpiryDate);
        const formattedMinExpiryDate = minExpiryDateObj
          .toISOString()
          .split("T")[0];
        setValues({ ...values, expiry_date: formattedMinExpiryDate });
      }
    }
  }, [BatchKitsData, filteredProductNames, setValues, values]);

  const onChangeToNumber = (value) => {
    if (typeof value === "number") return value;
    const numericValue = parseFloat(value);
    return !isNaN(numericValue) && isFinite(numericValue)
      ? numericValue
      : value;
  };

  const handleBatchCreate = async (type) => {
    if (Object.keys(errors).length > 0) {
      console.log(errors, "errors");
      return;
    }
    const selectedProduct = { quantity: parseInt(values.quantity, 10) };

    if (type === "excel") {
      setExcelLoading(true); // Start loading
    }

    try {
      const res = await dispatch(registerEmptyKit(selectedProduct));
      if (res?.payload?.status === 200) {
        dispatch(setPdfData(res?.payload?.data));

        if (type === "excel") {
          // Generate Excel file
          const worksheetData = res.payload.data.map((item) => ({
            QR_link: item.qr_link,
            // Add other fields if needed
          }));

          const worksheet = XLSX.utils.json_to_sheet(worksheetData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Kit Data");

          const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });
          const data = new Blob([excelBuffer], {
            type: "application/octet-stream",
          });
          const url = window.URL.createObjectURL(data);
          const link = document.createElement("a");
          link.href = url;
          link.download = "kit_data.xlsx";
          link.click();
          window.URL.revokeObjectURL(url);
        } else {
          navigate("/kitpdf");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      if (type === "excel") {
        setExcelLoading(false); // Stop loading
      }
    }
  };

  return (
    <>
      <div className="createkit">
        <h3 className="text-center border-bottom pb-4 pt-2">
          Create Empty Kits
        </h3>
        <div className="kitformData">
          <Form onSubmit={handleSubmit}>
            <div className="row mt-4">
              <div className="col-3">
                <Form.Group className="mb-3" controlId="formBasicQuantity">
                  <Form.Control
                    type="text"
                    name="quantity"
                    onChange={handleChange}
                    value={onChangeToNumber(values.quantity)}
                    onBlur={handleBlur}
                    placeholder="Batch Quantity"
                  />
                </Form.Group>
                {errors.quantity && touched.quantity ? (
                  <p className="text-danger">{errors.quantity}</p>
                ) : null}
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-12 text-end">
                <NavLink to="/kit" className="btn btn-dark me-3" type="button">
                  Cancel
                </NavLink>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => handleBatchCreate("pdf")} // Pass "pdf" type
                >
                  {status === StatusCode.LOADING ? (
                    <ButtonLoader />
                  ) : (
                    "Export as PDF"
                  )}
                </button>
                <button
                  className="btn btn-primary ms-3"
                  type="button"
                  onClick={() => handleBatchCreate("excel")} // Pass "excel" type
                >
                  {excelLoading ? <ButtonLoader /> : "Export as Excel"}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CreateEmptyKit;
