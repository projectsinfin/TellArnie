import React, { useState } from "react";
import "./index.css";
import { Button, Col, Form, Row } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import {
  formatDateWithMonth,
  onChangeToNumber,
} from "../../../../utils/helperFunction";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setFormDataQuickReportItemAdd } from "../../../../redux/slice/QuickReportSlice";
import QuantityCard from "../common/quantityCard";
const OnlineQuickPageTwo = () => {
  const navigate = useNavigate();
  const { quickAddItemFormData, quichReportData } = useSelector(
    (state) => state.QUICKREPORT
  );
  const dispatch = useDispatch();
  // main state of form
  const [formData, setFormData] = useState(quickAddItemFormData);
  //onchange function to manipulate the state of the form data on change of input field
  //@@parm is event
  const onChange = (event) => {
    const { name, value } = event.target;
    quichReportData?.products?.map((cur) => {
      if (cur.current_quantity < Number(value)) {
        toast.error("Quantity must be less then current quantity");
        return;
      }
    });
    if (name === "item") {
      const product = quichReportData?.products?.find(
        (curElm) => curElm.description === value
      );
      setFormData((prev) => ({
        ...prev,
        productId: product._id,
      }));
    }

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
      personOfTreatment: {
        ...data.personOfTreatment,
        warning: !data.personOfTreatment.value,
      },
    };
    setFormData({ ...data });
    if (
      !data.item.warning &&
      !data.quantity.warning &&
      !data.personOfTreatment.warning
    ) {
      const { item, quantity, personOfTreatment } = data;
      let formArr = [...data?.formDataArray];
      formArr.push({
        item: item,
        quantity: quantity,
        personOfTreatment: personOfTreatment,
      });
      setFormData((prev) => ({
        ...prev,
        item: { value: "", warning: false },
        quantity: { value: "", warning: false },
        personOfTreatment: { value: "", warning: false },
        formDataArray: formArr,
      }));
    }
  };

  // validate whole form
  const validateWholeFormValue = (event) => {
    event.preventDefault();
    // if (
    //   !formData.item.warning &&
    //   !formData.quantity.warning &&
    //   !formData.personOfTreatment.warning &&
    //   formData.formDataArray.length != 0
    // )
     {
      dispatch(setFormDataQuickReportItemAdd(formData));
      navigate("/quickreportsummary");
    }
  };

  return (
    <div className="quicktwopage">
      <h5 className="quickheading mb-3 letter_spacing fw-bold">
        <span> {quichReportData?.kit_data?.brand}</span>

        <span className="ms-2">{quichReportData?.kit_data?.model_number}</span>
        <div> {quichReportData?.kit_data?.product_name}</div>
      </h5>
      <div className="button_info">
        <div className="row btns_row">
          <div className="col-md-4">
            <Button type="submit" className="customcontinuebutton">
              <span className="fw-bold"> LOT Number</span>
              <span className="value_span">
                {" "}
                {quichReportData?.kit_data?.lot_number}
              </span>
            </Button>
          </div>
          <div className="col-md-4">
            <Button type="submit" className="customcontinuebutton">
              <span className="fw-bold"> Product Code</span>
              <span className="value_span">
                {quichReportData?.kit_data?.product_code}
              </span>
            </Button>
          </div>
          <div className="col-md-4">
            <Button type="submit" className="customcontinuebutton">
              <span className="fw-bold"> Expiry Date</span>
              <span className="value_span">
                {quichReportData?.kit_data?.expiry_date &&
                  formatDateWithMonth(quichReportData?.kit_data?.expiry_date)}
              </span>
            </Button>
          </div>

          <div className="col-md-4">
            <Button type="submit" className="customcontinuebutton">
              <span className="fw-bold"> Installed Location</span>
              <span className="value_span">
                {quichReportData?.kit_data?.location_name
                  ? quichReportData?.kit_data?.location_name
                  : "no location found"}
              </span>
            </Button>
          </div>
          <div className="col-md-4">
            <Button type="submit" className="customcontinuebutton">
              <span className="fw-bold"> Installed Area</span>
              <span className="value_span">
                {quichReportData?.kit_data?.area
                  ? quichReportData?.kit_data?.area
                  : "no area found"}
              </span>
            </Button>
          </div>
        </div>
        <hr />
        <div className="item_info mt-5">
          <h5 className="fw-bold mb-4">What items were used? </h5>

          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicItem">
                <Form.Select
                  aria-label="Default select example"
                  className="customselectbox"
                  value={formData.item.value}
                  name={"item"}
                  onChange={onChange}
                >
                  <option>Item</option>
                  {quichReportData &&
                    quichReportData?.products?.map((curElm, index) => (
                      <option value={curElm.description} key={curElm._id}>
                        {curElm.description}
                      </option>
                    ))}
                </Form.Select>
                {/* {formData.item.warning ? (
                  <span className="text-danger form_input_validation_error">
                    Enter item
                  </span>
                ) : null} */}
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
                {/* {formData.quantity?.warning ? (
                  <span className="text-danger form_input_validation_error">
                    Enter quantity
                  </span>
                ) : null} */}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicItem">
                <Form.Control
                  as="textarea"
                  placeholder="Person of treatment"
                  style={{ height: "150px" }}
                  value={formData.personOfTreatment.value}
                  name={"personOfTreatment"}
                  onChange={onChange}
                />
                {/* {formData.personOfTreatment.warning ? (
                  <span className="text-danger form_input_validation_error">
                    Enter the text
                  </span>
                ) : null} */}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Button
                variant="dark"
                className="w-100 p-3 fw-bold letter_spacing"
                onClick={(e) => {
                  validateForm(e);
                }}
              >
                Add to Used Items
              </Button>
            </Col>
          </Row>
          {/* {formData?.formDataArray?.length > 0 && */}
            {formData?.formDataArray?.map((dataitem, index) => (
              <>
                <QuantityCard
                  itemData={dataitem}
                  setData={setFormData}
                  index={index}
                  attr={"quickAdd"}
                  DataArr={formData?.formDataArray}
                />
              </>
            ))}
          <div className="mt-5 ">
            <NavLink className={"nav-link d-inline"} to="/quickreportinfo">
              <Button variant="dark" type="submit">
                Cancel
              </Button>
            </NavLink>

            <Button
              variant="primary"
              type="submit"
              className="button_custom fw-bold text-black ms-2"
              onClick={validateWholeFormValue}
              // disabled={formData?.formDataArray.length === 0 ? true : false}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineQuickPageTwo;
