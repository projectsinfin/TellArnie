import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsManagementData } from "../../../redux/slice/ProductManagementSlice";
import { fetchDistributorManagementData } from "../../../redux/slice/DistributionRegistrationSlice";
import { useFormik } from "formik";
import {
  registerBatchKit,
  setPdfData,
} from "../../../redux/slice/KitManagementSlice";
import ButtonLoader from "../../../components/Common/ButtonLoader";
import { StatusCode } from "../../../services/helper";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchBatchKitsData } from "../../../redux/slice/BatchKits";
import ValidationSchema from "../../../components/Common/ValidationScema";
import DropdownCalendar from "../../../components/Common/WheelDatepicker";
import * as XLSX from "xlsx";
import "./index.css";

const initialValues = {
  product_name: "",
  brand: "",
  kit_ref_id: "",
  product_code: "",
  lot_number: "",
  product_id: "",
  batch_number: "",
  kit_picture: "",
  van: "",
  expiry_date: null,
  distributor_id: "",
  quantity: "",
  formatedDate: "",
};
const CreateKit = () => {
  //Redux functions
  const ProductManagementData = useSelector((state) => state.PRODUCTMANAGEMENT);
  const { BatchKitsData } = useSelector((state) => state.BATCHKITS);
  const { status } = useSelector((state) => state.KITMANAGEMENT);
  const dispatch = useDispatch();

  //React state
  const [place, setPlace] = useState(false);
  const [filteredProductNames, setFilteredProductNames] = useState(
    ProductManagementData?.ProductManagementData
  );
  const [productsData, setProductsData] = useState(
    BatchKitsData?.data?.relatedProducts.map((product) => ({
      ...product,
      item_not_expire: true,
    }))
  );
  const [showProd, setShowProd] = useState(false);
  const [parentProduct, setParentProduct] = useState({});

  //Router functions
  const navigate = useNavigate();

  //Formik hook
  const {
    values,
    setValues,
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ValidationSchema.createkit,
    // onSubmit: async (values, action) => {
    //   const res = await dispatch(registerBatchKit(values));
    //   if (res?.payload?.status === 200) {
    //     dispatch(setPdfData(res?.payload?.data));
    //     navigate("/kitpdf");
    //   }
    // },
  });

  //Lifecycle hooks
  useEffect(() => {
    setProductsData(BatchKitsData?.data?.relatedProducts);
  }, [BatchKitsData]);

  useEffect(() => {
    dispatch(fetchProductsManagementData());
    dispatch(fetchDistributorManagementData());
  }, []);

  useEffect(() => {
    if (values.product_code) {
      setShowProd(false);
      const filteredProducts =
        ProductManagementData?.ProductManagementData?.filter(
          (product) =>
            product.product_code &&
            typeof product.product_code === "string" && // Check if product_code is a string
            typeof values.product_code === "string" && // Check if values.product_code is a string
            product.product_code
              .toLowerCase()
              .includes(values.product_code.toLocaleLowerCase())
        );
      setFilteredProductNames(filteredProducts);
    } else {
      setFilteredProductNames([]);
      // Clear the product name field when product code is empty
      setValues({
        ...values,
        product_name: "",
      });
    }
  }, [values.product_code, ProductManagementData]);

  useEffect(() => {
    if (BatchKitsData?.data?.relatedProducts) {
      const currentDate = new Date().getTime();
      let minExpiryDate = null;
      const initialProducts = BatchKitsData.data.relatedProducts.map(
        (product) => ({
          ...product,
          item_not_expire: true, // Always set to true initially
        })
      );
      setProductsData(initialProducts);

      // Set default expiry date logic
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
        setValues({
          ...values,
          expiry_date: formattedMinExpiryDate,
        });
      }
    }
  }, [BatchKitsData]);

  //methods
  const handleToggleChange = (index) => {
    const updatedProducts = [...productsData];
    updatedProducts[index] = {
      ...updatedProducts[index],
      item_not_expire: !updatedProducts[index].item_not_expire,
      expiry_date: updatedProducts[index].item_not_expire
        ? ""
        : values.expiry_date,
    };
    setProductsData(updatedProducts);

    let minExpiryDate = Infinity;

    updatedProducts.forEach((product) => {
      if (!product.item_not_expire && product.expiry_date) {
        const expiryTime = new Date(product.expiry_date).getTime();
        if (expiryTime < minExpiryDate) {
          minExpiryDate = expiryTime;
        }
      }
    });

    // Update values.expiry_date if the minimum expiry_date is earlier
    if (minExpiryDate !== Infinity) {
      const minExpiryDateString = new Date(minExpiryDate)
        .toISOString()
        .slice(0, 10); // Convert minimum expiry_date to string
      setValues({
        ...values,
        expiry_date: minExpiryDateString,
      });
    } else {
      // No valid expiry_date found, clear values.expiry_date
      setValues({
        ...values,
        expiry_date: "",
      });
    }
  };

  const handleProductNameClick = async (element) => {
    setShowProd(true);
    setFieldValue("product_code", element.product_code);
    setFieldValue("product_name", element.product_name); // Set product name in values object
    setParentProduct(element);
    setFilteredProductNames([]);

    await dispatch(fetchBatchKitsData(element.kit_ref_id));
  };

  const onChangeToNumber = (value) => {
    if (typeof value === "number") return value;
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && isFinite(numericValue)) {
      return numericValue;
    }
    return value;
  };
  const handleBatchCreate = async (type) => {
    if (Object.keys(errors).length > 0) {
      console.log(errors, "errors");
      return;
    }

    const selectedProduct = {
      products: productsData,
      product_code: parentProduct.product_code,
      lot_number: values.lot_number,
      expiry_date: values.expiry_date,
      kit_ref_id: parentProduct.kit_ref_id,
      _id: parentProduct._id,
      brand: parentProduct.brand,
      kit_picture: parentProduct.kit_picture,
      product_name: parentProduct.product_name,
      quantity: values.quantity,
    };

    try {
      const res = await dispatch(registerBatchKit(selectedProduct));
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

          // Generate buffer and download
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
          navigate("/kitpdf"); // Navigate to /kitpdf for PDF
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onExpiryChange = (val, index) => {
    const newDate = val;
    const updatedProducts = [...productsData];
    updatedProducts[index] = {
      ...updatedProducts[index],
      expiry_date: newDate,
      item_not_expire: !newDate,
    };

    // Update productsData state with the modified product
    setProductsData(updatedProducts);

    // Find the minimum expiry_date among all products that do expire
    let minExpiryDate = Infinity;

    updatedProducts.forEach((product) => {
      if (!product.item_not_expire && product.expiry_date) {
        const expiryTime = new Date(product.expiry_date).getTime();
        if (expiryTime < minExpiryDate) {
          minExpiryDate = expiryTime;
        }
      }
    });

    // Update values.expiry_date if the minimum expiry_date is earlier
    if (minExpiryDate !== Infinity) {
      const minExpiryDateObj = new Date(minExpiryDate);

      // Set the day to the last date of the month
      const lastDayOfMonth = new Date(
        minExpiryDateObj.getFullYear(),
        minExpiryDateObj.getMonth() + 1,
        0
      ).getDate();

      // Format the minimum expiry date as required
      const minExpiryDateString = `${lastDayOfMonth} ${minExpiryDateObj.toLocaleString(
        "en-US",
        { month: "short" }
      )}, ${minExpiryDateObj.getFullYear()}`;

      setValues({
        ...values,
        expiry_date: minExpiryDateString,
      });
    } else {
      // No valid expiry_date found, clear values.expiry_date
      setValues({
        ...values,
        expiry_date: "",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const options = { month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <>
      <div className="createkit">
        <h3 className="text-center border-bottom pb-4 pt-2">
          Batch Create Kits
        </h3>
        <h6 className="text-center mt-2 mb-5 mt-4">Enter Product Details</h6>
        <div className="kitformData">
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-9">
                <div className="row">
                  <Form.Group
                    className="mb-3 col-3"
                    controlId="formBasicProduct"
                  >
                    <Form.Control
                      type="text"
                      name="product_code"
                      className="cursor"
                      onChange={handleChange}
                      value={values.product_code}
                      placeholder="Product Code"
                      onBlur={handleBlur}
                      autoComplete="on"
                    />
                  </Form.Group>
                  {errors.product_code && touched.product_code ? (
                    <p className="text-danger">{errors.product_code} </p>
                  ) : null}
                  {values.product_code && (
                    <Form.Group
                      className="mb-3 col-9"
                      controlId="formBasicProduct"
                    >
                      <Form.Control
                        type="text"
                        name="product_name"
                        className="cursor"
                        onChange={handleChange}
                        value={values.product_name}
                        placeholder="Product Name"
                        onBlur={handleBlur}
                        autoComplete="on"
                      />
                    </Form.Group>
                  )}
                </div>
              </div>

              <div className="col-3">
                <Form.Group className="mb-3" controlId="formBasicLotNumber">
                  <Form.Control
                    type="text"
                    name="lot_number"
                    onChange={handleChange}
                    value={values.lot_number}
                    onBlur={handleBlur}
                    placeholder="Lot Number"
                  />
                </Form.Group>
                {errors.lot_number && touched.lot_number ? (
                  <p className="text-danger">{errors.lot_number} </p>
                ) : null}
              </div>
            </div>
            <div className="row">
              <div className="col-12 batch_table">
                <div style={{ maxHeight: "33vh", overflowY: "auto" }}>
                  <Table responsive>
                    <thead></thead>
                    <tbody>
                      {showProd
                        ? productsData &&
                          productsData?.map((curElm, index) => (
                            <tr key={index}>
                              <td>
                                {/* {curElm.product_code}-{curElm.product_name} */}
                                <td>
                                  {curElm.product_code}-{curElm.product_name}
                                </td>
                              </td>

                              <td>
                                <Form.Control
                                  type="number"
                                  value={curElm.quantity}
                                  onChange={(e) => {
                                    let newValue = parseInt(e.target.value);
                                    // Prevent setting negative or zero values
                                    newValue = newValue > 0 ? newValue : "";
                                    const updatedProducts = [...productsData];
                                    updatedProducts[index] = {
                                      ...updatedProducts[index],
                                      quantity: newValue,
                                    };
                                    setProductsData(updatedProducts);
                                  }}
                                  size="sm" // Set the size to small
                                  style={{ width: "70px" }}
                                />
                                {curElm.quantity <= 0 && (
                                  <Form.Control.Feedback type="invalid">
                                    Quantity must be greater than zero.
                                  </Form.Control.Feedback>
                                )}
                                {errors.quantity && touched.quantity ? (
                                  <p className="text-danger">
                                    {errors.quantity}{" "}
                                  </p>
                                ) : null}
                              </td>
                              <td>
                                <Form.Control
                                  className=""
                                  type="text"
                                  value={curElm.lot_number}
                                  placeholder="Lot Number"
                                  onChange={(e) => {
                                    let newValue = parseInt(e.target.value);
                                    // Prevent setting negative or zero values
                                    newValue = newValue > 0 ? newValue : "";
                                    const updatedProducts = [...productsData];
                                    updatedProducts[index] = {
                                      ...updatedProducts[index],
                                      lot_number: newValue,
                                    };
                                    setProductsData(updatedProducts);
                                  }}
                                />
                                {curElm.lot_number <= 0 && (
                                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                                )}
                                {errors.lot_number && touched.lot_number ? (
                                  <p className="text-danger">
                                    {errors.lot_number}{" "}
                                  </p>
                                ) : null}
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <Form.Check
                                  type="switch"
                                  id={`expiry-toggle-${index}`}
                                  label=""
                                  checked={curElm.item_not_expire}
                                  onChange={() => handleToggleChange(index)}
                                />
                              </td>
                              <td>
                                {!curElm.item_not_expire ? (
                                  // <YearMonthCalendar
                                  <DropdownCalendar
                                    value={curElm.expiry_date}
                                    onDateChange={(dateObj) => {
                                      const finaldate =
                                        dateObj.month + dateObj.year;
                                      onExpiryChange(finaldate, index);
                                    }}
                                  />
                                ) : (
                                  <span>Item doesn't expire</span>
                                )}
                                <Form.Control.Feedback type="invalid">
                                  {errors.expiry_date}
                                </Form.Control.Feedback>
                              </td>
                            </tr>
                          ))
                        : filteredProductNames?.map((curElm, index) => (
                            <tr key={index} className="filtered_row">
                              <td
                                onClick={() => handleProductNameClick(curElm)}
                              >
                                {curElm.product_code}-{curElm.product_name}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-9">
                <Form.Group className="mb-3" controlId="formBasicDate">
                  <Form.Control
                    onFocus={() => setPlace(true)}
                    type={place ? "date" : "text"}
                    name="expiry_date"
                    placeholder="Kit Expiry Date"
                    onChange={(e) => {
                      const { value } = e.target;
                      setFieldValue("expiry_date", value);
                      setPlace(false);
                      setFieldValue("formatedDate", formatDate(value));
                    }}
                    value={values.formatedDate || ""}
                    onBlur={() => {
                      setPlace(false);
                      handleBlur("expiry_date");
                    }}
                    className="cursor"
                  />
                </Form.Group>
              </div>
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
                  <p className="text-danger">{errors.quantity} </p>
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
                  type="submit"
                  onClick={() => handleBatchCreate("pdf")} // Pass "pdf" type
                >
                  {/* {status === StatusCode.LOADING ? (
                    <ButtonLoader />
                  ) : (
                    "Export as PDF"
                  )} */}
                  Export as PDF
                </button>
                <button
                  className="btn btn-primary ms-3"
                  type="button"
                  onClick={() => handleBatchCreate("excel")} // Pass "excel" type
                >
                  {status === StatusCode.PENDING ? (
                    <ButtonLoader />
                  ) : (
                    "Export as Excel"
                  )}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CreateKit;
