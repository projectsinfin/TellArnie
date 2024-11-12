import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./index.css";
import { Col, Row } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import {
  onChangeToNumber,
  validateEmail,
} from "../../../../utils/helperFunction";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategory_classfication_data,
  setFormDataQuickReport,
} from "../../../../redux/slice/QuickReportSlice";
import { NavLink, useNavigate } from "react-router-dom";
const OnlineQuickPageOne = () => {
  const dispatch = useDispatch();
  const [category_classficationdata, setCategory_classficationdata] = useState({
    category: [],
    classfication: [],
  });
  const navigate = useNavigate();
  const { category_classfication_data, form_Data } = useSelector(
    (state) => state.QUICKREPORT
  );
  // main state for the form data
  const [formData, setFormData] = useState(form_Data);

  //onchange function to manipulate the state of the form data on change of input field
  //@@parm is event

  const onChange = (event) => {
    const { name, value } = event.target;
    if (name === "category") {
      const filterarray = category_classfication_data?.data?.Incidents.find(
        (curElm) => curElm.name === value
      );
      setCategory_classficationdata({
        ...category_classficationdata,
        classfication: filterarray?.description,
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]: { value: value, warning: !value ? true : false },
    }));
  };

  // validate the form on submit
  const validateForm = (event) => {
    event.preventDefault();
    let data = { ...formData };
    data = {
      ...data,
      firstName: { ...data.firstName, warning: !data.firstName.value },
      lastName: { ...data.lastName, warning: !data.lastName.value },
      phoneNumberCode: {
        ...data.phoneNumberCode,
        warning: !data.phoneNumberCode.value,
      },
      phoneNumber: { ...data.phoneNumber, warning: !data.phoneNumber.value },
      category: {
        ...data.category,
        warning:
          !data.category.value ||
          data.category.value === "Category of Incident",
      },
      email: { ...data.email, warning: validateEmail(data.email.value) },
      classification: {
        ...data.classification,
        warning:
          !data.classification.value ||
          data.classification.value === "Classification",
      },
      date: { ...data.date, warning: !data.date.value },
      time: { ...data.time, warning: !data.time.value },
    };
    setFormData({ ...data });
    if (
      !data.firstName.warning &&
      !data.lastName.warning &&
      !data.email.warning &&
      !data.category.warning &&
      !data.classification.warning &&
      !data.time.warning &&
      !data.date.warning
    ) {
      dispatch(setFormDataQuickReport(data)); // dispatch the data of form in the redux store to get them in summary route

      navigate("/quickreportworkplace");
    }
  };

  useEffect(() => {
    // get the data from the backend classfication category
    dispatch(fetchCategory_classfication_data());
  }, []);

  //manipulate the backend data as per the frontend
  useEffect(() => {
    const data = {
      category: category_classfication_data?.data?.Incidents?.map(
        (itemIncdients) => {
          return itemIncdients.name;
        }
      ),
      classfication:
        category_classfication_data?.data?.Incidents[0]?.description?.map(
          (element) => {
            return element;
          }
        ),
    };
    setCategory_classficationdata(data);
    setFormData(form_Data);
  }, [category_classfication_data?.data?.Incidents, form_Data]);
  return (
    <div className="quickonepage">
      <div className="form_container">
        <Form>
          <div className="provideinformation">
            <h5
              className="quickheading  open-sans-font fw-bold"
              style={{ fontWeight: "700", fontSize: "14px", margin: "20px 0" }}
            >
              Please Provide your information
            </h5>
            <div className="innerformdata">
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label className="d-none"></Form.Label>
                    <Form.Control
                      name={"firstName"}
                      value={formData.firstName.value}
                      type="text"
                      placeholder="First name"
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
                      name={"lastName"}
                      value={formData.lastName.value}
                      type="text"
                      placeholder="Last name"
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
                        name={"phoneNumber"}
                        country={"gb"}
                        value={formData.phoneNumberCode.value}
                        onChange={(value) => {
                          setFormData((prev) => ({
                            ...prev,
                            phoneNumberCode: { value: value, warning: false },
                          }));
                        }}
                      />
                      {formData.phoneNumberCode.warning ? (
                        <span className="text-danger form_input_validation_error">
                          Enter phone code
                        </span>
                      ) : null}
                    </div>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label className="d-none"></Form.Label>
                    <Form.Control
                      onChange={onChange}
                      value={onChangeToNumber(formData.phoneNumber.value)}
                      name={"phoneNumber"}
                      type="text"
                      placeholder="Phone number"
                    />
                    {formData.phoneNumberCode.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter phone number
                      </span>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="d-none"></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Email"
                      value={formData.email.value}
                      name={"email"}
                      onChange={onChange}
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
          </div>
          <div className="providesummaryincident mt-3">
            <h5
              className="quickheading open-sans-font fw-bold"
              style={{ fontWeight: "700", fontSize: "14px", margin: "20px 0" }}
            >
              Please Provide a summary of indecent
            </h5>

            <div className="innerformdata">
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Select
                      aria-label="Default select example"
                      name={"category"}
                      value={formData.category.value}
                      onChange={onChange}
                    >
                      <option>Category of Incident</option>
                      {category_classficationdata?.category?.map(
                        (categoryItem) => (
                          <option value={categoryItem}>{categoryItem}</option>
                        )
                      )}
                    </Form.Select>
                    {formData.category.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter category
                      </span>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Select
                      name="classification"
                      aria-label="Default select example"
                      value={formData.classification.value}
                      onChange={onChange}
                    >
                      <option>Classification</option>
                      {category_classficationdata?.classfication?.map(
                        (descriptionItem) => (
                          <option value={descriptionItem}>
                            {descriptionItem}
                          </option>
                        )
                      )}
                    </Form.Select>
                    {formData.classification.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter classification
                      </span>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      name="date"
                      type="date"
                      value={formData.date.value}
                      onChange={onChange}
                    />
                    {formData.date.warning ? (
                      <span className="text-danger">Enter date</span>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      name="time"
                      type="time"
                      value={formData.time.value}
                      onChange={onChange}
                    />
                    {formData.time.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter time
                      </span>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      as="textarea"
                      placeholder="Brief Summary"
                      style={{ height: "150px" }}
                      value={formData.summary.value}
                      name={"summary"}
                      onChange={onChange}
                    />{" "}
                    {formData.summary.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter summary
                      </span>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>
          <NavLink className="nav-link d-inline" to="/standardwithquickreport">
            <Button variant="dark" type="button">
              Cancel
            </Button>
          </NavLink>
          <Button
            onClick={(e) => validateForm(e)}
            variant="primary"
            type="button"
            className="customcontinueonebutton fw-bold text-black ms-2"
          >
            Continue
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default OnlineQuickPageOne;
