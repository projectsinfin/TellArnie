import React, { useState } from "react";
import "./index.css";
import { Button, Col, Form, Row } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import { NavLink, useNavigate } from "react-router-dom";
import {
  formatDateWithMonth,
  onChangeToNumber,
  validateEmail,
} from "../../../../utils/helperFunction";
import { useDispatch, useSelector } from "react-redux";
import { setdetailFromInfoFormData } from "../../../../redux/slice/DetailReportSummarySlice";
const DetailedReportPageOne = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { detailFromInfoFormData } = useSelector((state) => state.DetailReport);
  // main state for the form data
  const [formData, setFormData] = useState(detailFromInfoFormData);
  const { quichReportData } = useSelector((state) => state.QUICKREPORT);
  //onchange function to set the input data
  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: { value: value, warning: !value ? true : false },
    }));
  };

  // to valdite the data of form on the click of the complete button
  const validateFormData = (e) => {
    e.preventDefault();
    let data = { ...formData };
    data = {
      ...data,
      firstName: { ...data.firstName, warning: !data.firstName.value },
      lastName: { ...data.lastName, warning: !data.lastName.value },
      phoneNumberCode: {
        ...data.phoneNumberCode,
        warning: !data.phoneNumberCode.value,
      },
      // phoneNumber: { ...data.phoneNumber, warning: !data.phoneNumber.value },
      email: { ...data.email, warning: validateEmail(data.email.value) },
    };
    setFormData({ ...data });
    if (
      !data.firstName.warning &&
      !data.lastName.warning &&
      !data.email.warning &&
      !data.phoneNumberCode.warning
    ) {
      dispatch(setdetailFromInfoFormData(formData));
      navigate("/detailedreportsummary");
    }
  };

  return (
    <div className="detailedReportPageOne open-sans-font">
      <h5 className="quickheading mb-3 fw-bold">
        <span> {quichReportData?.kit_data?.brand}</span>
        <span className="ms-2">{quichReportData?.kit_data?.model_number}</span>
        <div> {quichReportData?.kit_data?.product_name}</div>{" "}
      </h5>
      <div className="button_info">
        <div className="row btns_row">
          <div className="col-md-4">
            <Button type="submit" className="customcontinuebutton">
              <span className="fw-bold"> LOT Number</span>{" "}
              <span className="value_span">
                {quichReportData?.kit_data?.lot_number}
              </span>
            </Button>
          </div>
          <div className="col-md-4">
            <Button type="submit" className="customcontinuebutton">
              <span className="fw-bold"> Product Code</span>{" "}
              <span className="value_span">
                {quichReportData?.kit_data?.prouct_code}
              </span>
            </Button>
          </div>
          <div className="col-md-4">
            <Button type="submit" className="customcontinuebutton">
              <span className="fw-bold"> Expiry Date</span>{" "}
              <span className="value_span">
                {" "}
                {quichReportData?.kit_data?.expiry_date &&
                  formatDateWithMonth(quichReportData?.kit_data?.expiry_date)}
              </span>{" "}
            </Button>
          </div>

          <div className="col-md-4">
            <Button type="submit" className="customcontinuebutton">
              <span className="fw-bold"> Installed Location</span>{" "}
              <span className="value_span">
                {quichReportData?.kit_data?.location_name &&
                  quichReportData?.kit_data?.location_name}
              </span>
            </Button>
          </div>
          <div className="col-md-4">
            <Button type="submit" className="customcontinuebutton">
              <span className="fw-bold"> Installed Area</span>{" "}
              <span className="value_span">
                {quichReportData?.kit_data?.area &&
                  quichReportData?.kit_data?.area}
              </span>
            </Button>
          </div>
        </div>

        <hr />
        <div className="item_info mt-5">
          <h5 className="fw-bold mb-4">Please provide your information </h5>
          <div className="innerformdata">
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label className="d-none"></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First name"
                    name="firstName"
                    value={formData.firstName.value}
                    onChange={onChange}
                  />
                  {formData.firstName.warning ? (
                    <span className="text-danger form_input_validation_error">
                      Enter first name
                    </span>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasic1Name">
                  <Form.Label className="d-none"></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last name"
                    name="lastName"
                    value={formData.lastName.value}
                    onChange={onChange}
                  />
                  {formData.lastName.warning ? (
                    <span className="text-danger form_input_validation_error">
                      Enter last name
                    </span>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicCountrycode">
                  <Form.Label className="d-none"></Form.Label>
                  <div className="phone_inputcountrycode">
                    <PhoneInput
                      country={"gb"}
                      name="phoneNumberCode"
                      value={formData.phoneNumberCode.value}
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          phoneNumberCode: { value: value, warning: false },
                        }));
                      }}
                    />
                  </div>
                  {/*formData.phoneNumberCode.warning ? (
                    <span className="text-danger form_input_validation_error">
                      Enter phone code
                    </span>
                  ) : null*/}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label className="d-none"></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone"
                    name="phoneNumber"
                    value={onChangeToNumber(formData.phoneNumber.value)}
                    maxLength={14}
                    onChange={onChange}
                  />
                  {/*formData.phoneNumber.warning ? (
                    <span className="text-danger form_input_validation_error">
                      Enter phone number
                    </span>
                  ) : null*/}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="d-none"></Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    onChange={onChange}
                    name="email"
                    value={formData.email.value}
                  />
                  {formData.email.warning ? (
                    <span className="text-danger form_input_validation_error">
                      Enter valid email
                    </span>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="mt-5 ">
            <NavLink
              className={"navlink d-inline"}
              to="/standardwithquickreport"
            >
              <Button variant="dark" type="button">
                Cancel
              </Button>
            </NavLink>
            <NavLink
              to="/detailedreportsummary"
              className={"nav-link d-inline"}
            >
              <Button
                variant="primary"
                type="button"
                className="button_custom ms-2 fw-bold  text-black"
                onClick={validateFormData}
              >
                Continue
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedReportPageOne;
