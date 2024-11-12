import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./index.css";
import { Col, Row } from "react-bootstrap";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { NavLink, useNavigate } from "react-router-dom";
import { onChangeToNumber } from "../../../../utils/helperFunction";
import { toast } from "react-toastify";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBarCodeScaanerDetail,
  setdetailReportFilledItem,
} from "../../../../redux/slice/DetailReportSummarySlice";
import { StatusCode } from "../../../../services/helper";
import axios from "axios";
import { IoScanSharp } from "react-icons/io5";
const DetailedReportFilledItem = () => {
  const naviagte = useNavigate();
  const dispatch = useDispatch();
  const { getBarCodeData, status, detailReportFilledItem } = useSelector(
    (state) => state.DetailReport
  );
  const { quichReportData } = useSelector((state) => state.QUICKREPORT);
  console.log(getBarCodeData, quichReportData, "sh");
  const [itemDropDownArr, setItemDropDownArr] = useState(quichReportData);
  console.log("quichReportData", itemDropDownArr);
  // main state of form
  const [formData, setFormData] = useState(detailReportFilledItem);
  const [scannedCodes, setScannedCodes] = useState("");
  function onScanSuccess(result) {
    console.log("Scanned result:", result);
    // alert(JSON.stringify(result));
    setScannedCodes(JSON.stringify(result));
  }
  console.log("0-0dfsa", scannedCodes);
  function onScanFailure(error) {
    console.warn(`Code scan error: ${error}`);
  }

  useEffect(() => {
    if (scannedCodes !== "") {
      getBarcodeDetail();
    }
  }, [scannedCodes]);

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 250, height: 250, fps: 10 },
    });

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    return () => {
      html5QrcodeScanner.clear();
    };
  }, [onScanSuccess]);
  //onchange function to manipulate the state of the form data on change of input field
  //@@parm is event
  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: { value: value, warning: !value ? true : false },
    }));
  };
  // validate the form
  const validateForm = (event) => {
    event.preventDefault();
    let data = { ...formData };
    data = {
      ...data,
      item: { ...data.item, warning: !data.item.value },
      quantity: { ...data.quantity, warning: !data.quantity.value },
      usedBy: {
        ...data.usedBy,
        warning: !data.usedBy.value,
      },
    };
    setFormData({ ...data });
    if (!data.quantity.warning && !data.usedBy.warning) {
      const { item, quantity, usedBy } = data;
      console.log(item, quantity, usedBy);
      let formArray = [...data?.formDataArray];
      formArray.push({
        item: item,
        quantity: quantity,
        usedBy: usedBy,
      });
      // console.log("in")
      setFormData((prev) => ({
        item: { value: "", warning: false },
        quantity: { value: "", warning: false },
        usedBy: { value: "", warning: false },
        formDataArray: formArray,
      }));
    }
  };

  // after scan  we call api which give product list
  const getBarcodeDetail = async () => {
    // alert(JSON.stringify(scannedCodes));
    let value = JSON.parse(scannedCodes);
    await axios
      .get(`https://tellarnie.com/api/admin/product/${Number(value)}`)
      .then((res) => {
        if (res.data.is_product == false) {
          toast.error("Product not found");
        } else {
          // alert(JSON.stringify(res?.data?.data?.product[0]?.description));
          setFormData((prev) => ({
            ...prev,
            item: {
              ...prev.item,
              value: res?.data?.data?.product[0]?._id,
            },
          }));
          setItemDropDownArr(res?.data?.data);
        }
      })
      .catch((err) => alert(JSON.stringify(err)));
    setScannedCodes("");
    // if (res.payload.is_product === false) {
    //   toast.error(res?.payload?.message);
    // }
  };

  // validate whole form
  const validateWholeFormValue = (event) => {
    event.preventDefault();
    if (
      !formData.item.warning &&
      !formData.quantity.warning &&
      !formData.usedBy.warning &&
      formData?.formDataArray?.length != 0
    ) {
      dispatch(setdetailReportFilledItem(formData));
      naviagte("/detailedincidentreportsummary");
    }
  };
  return (
    <div className="detailedreportfilleditem">
      <div className="form_container">
        <Form>
          <p>{scannedCodes}</p>
          <div className="providesummaryincident mt-3">
            <h5 className="quickheading mb-3 letter_spacing fw-bold">
              Items used per person
            </h5>
            <div className="position-relative">
              <div id="reader"></div>
              <span
                className="scannericon"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  position: "absolute",
                  top: "13px",
                }}
              >
                <IoScanSharp size={42} className="text-white" />
              </span>
            </div>
            <div className="innerformdata">
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Select
                      aria-label="Default select example"
                      className="customselectbox"
                      value={formData.item.value}
                      name={"item"}
                      onChange={onChange}
                    >
                      <option>Item used</option>
                      {itemDropDownArr &&
                        itemDropDownArr?.product?.map((item, index) => (
                          <option value={item?._id}>{item?.description}</option>
                        ))}
                    </Form.Select>
                    {formData.item.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter item{" "}
                      </span>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicItem">
                    <Form.Label className="d-none"></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="quantity"
                      onChange={onChange}
                      name={"quantity"}
                      value={onChangeToNumber(formData.quantity.value)}
                    />
                    {formData.quantity.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter quantity
                      </span>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="text"
                      className="customselectbox"
                      value={formData.usedBy.value}
                      name={"usedBy"}
                      onChange={onChange}
                      placeholder="usedBy"
                    />

                    {formData.usedBy.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter value
                      </span>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Button
                    variant="dark"
                    className="w-100 p-3 fw-bold letter_spacing"
                    onClick={validateForm}
                  >
                    Add Another Item
                  </Button>
                </Col>
              </Row>

              <hr className="mt-5" />
              {formData?.formDataArray?.map((itemData, index) => (
                <div className="incidentmadeinfo mt-4">
                  <h5 className="fw-bold">Items used in Incident</h5>
                  <hr />
                  <div className="equipment_incident">
                    <span className="fw-bold">Used Items</span>
                    <span className="fw-bold">Quantity</span>
                  </div>
                  <div className="mt-3 d-flex justify-content-between p-2 align-items-center">
                    <div>
                      <h6>{itemData?.item?.value}</h6>{" "}
                      <h6> {itemData?.usedBy?.value}</h6>
                    </div>
                    <div>
                      <span>
                        <CiCircleMinus
                          size={36}
                          onClick={() => {
                            let data = [...formData?.formDataArray];
                            if (Number(data[index]?.quantity?.value) <= 1) {
                              return toast.error("Quantity not less than one");
                            }
                            data.splice(index, 1, {
                              ...data[index],
                              quantity: {
                                ...data[index].quantity,
                                value: Number(data[index]?.quantity?.value) - 1,
                              },
                            });
                            setFormData((prev) => ({
                              ...prev,
                              formDataArray: data,
                            }));
                          }}
                        />
                      </span>
                      <span className="ms-2 me-2">
                        {itemData?.quantity?.value}
                      </span>
                      <span>
                        <CiCirclePlus
                          size={36}
                          onClick={() => {
                            let data = [...formData?.formDataArray];
                            data.splice(index, 1, {
                              ...data[index],
                              quantity: {
                                ...data[index].quantity,
                                value: Number(data[index]?.quantity?.value) + 1,
                              },
                            });
                            setFormData((prev) => ({
                              ...prev,
                              formDataArray: data,
                            }));
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <NavLink to="/detailedreportaction" className={"nav-link d-inline"}>
              <Button variant="dark" type="submit">
                Cancel
              </Button>
            </NavLink>

            <Button
              variant="primary"
              type="submit"
              className="customcontinueonebutton ms-2 text-black fw-bold"
              onClick={(e) => validateWholeFormValue(e)}
              disabled={formData?.formDataArray?.length === 0 ? true : false}
            >
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default DetailedReportFilledItem;
