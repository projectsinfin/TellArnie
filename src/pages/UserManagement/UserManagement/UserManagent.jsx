import React, { useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  DropdownButton,
  Dropdown,
  Form,
} from "react-bootstrap";
import profilepic from "../../../Assets/Profile/profile.png";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-number-input/style.css";
import CustomButton from "../../../components/Common/Button/Button";
import { FaBan, FaDiaspora, FaStopCircle, FaTrash } from "react-icons/fa";
import { FaCircleStop } from "react-icons/fa6";
import "./UserManagement.css";
import image from "../../../Assets/Profile/Icon.svg";

function UserManagement() {
  const [content, setContent] = useState();
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);

  const [checkboxStates, setCheckboxStates] = useState({
    text1: false,
    text2: false,
    text3: false,
  });

  const handleSave = () => {
    console.log("Content saved:", content);
  };

  const onCancelHandler = () => {
    // Logic to handle cancel action
    console.log("Edit cancelled");
  };

  const handleCheckboxChange = (fieldName) => {
    setCheckboxStates({
      ...checkboxStates,
      [fieldName]: !checkboxStates[fieldName],
    });
  };
  const roleOptions = [
    {
      label: "Super Admin",
      value: "superadmin",
    },
    {
      label: "Admin",
      value: "admin",
    },
    // {
    //   label: "Approver",
    //   value: "approver",
    // },
    {
      label: "User",
      value: "user",
    },
    // {
    //   label: "Sales Executive",
    //   value: "salesexecutive",
    // },
  ];
  const initialValues = {
    firstName: "",
    lastName: "",
    businessEmail: "",
    officeLocation: "",
    countryCode: "",
    employeeId: "",
    jobTitle: "",
    assignRole: "",
  };
  const phonenumberRegex =
    /^[+]?[0-9]{1,3}?[-.\\s]?[(]?[0-9]{1,4}[)]?[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,9}$/;

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("*First Name is required"),
    lastName: Yup.string().required("*Last Name is required"),
    businessEmail: Yup.string()
      .email("*Invalid email format")
      .required("*Business Email is required"),
    officeLocation: Yup.string().required("*Office Location is required"),
    country_code: Yup.string().required("*Country Code is required"),
    phone: Yup.string()
      .matches(phonenumberRegex, "*Enter a valid Phone Number")
      .required("*Enter a valid Phone Number"),

    employeeId: Yup.string().required("*Employee ID is required"),
    jobTitle: Yup.string().required("*Job Title is required"),
    assignRole: Yup.string().required("*Role is required"),
  });
  const whitelogoref = useRef();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setCompanyLogoPreview(URL.createObjectURL(file));
    // setValues({ ...values, profile_pic: file });
  };

  return (
    <div className="create-user">
      <Container>
        <Row className="align-items-c">
          <Col>
            <h3
              className="listing"
              style={{ textAlign: "center", paddingBottom: "20px" }}
            >
              User Management
            </h3>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col md={4}>
            <div className="logodata">
              <div className="logo">
                <Form.Group className="mb-3" controlId="formBasicProfile_pic">
                  <Form.Control
                    ref={whitelogoref}
                    type="file"
                    name="profile_pic"
                    className="d-none"
                    onChange={handleLogoChange}
                  />
                </Form.Group>
                <img
                  src={
                    companyLogoPreview ? companyLogoPreview : image
                    // "https://img.freepik.com/free-vector/ampersand-3d-icon_23-2147501139.jpg?t=st=1710323642~exp=1710327242~hmac=bf70d869f6175d92ffc60310956a301dca1a3bc45f3ed2da6ffcaa9af100f8f9&w=740"
                  }
                  alt="profile_pic logo"
                  className="custom_image"
                />
              </div>
              <div className="text-center pt-2">
                <button
                  className="border-0 background-transparent"
                  type="button"
                  onClick={() => whitelogoref.current.click()}
                >
                  Edit
                </button>
              </div>
            </div>
          </Col>

          <Col md={8}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({
                setFieldValue,
                values,
                isSubmitting,
                errors,
                touched,
                handleChange,
                handleSubmit,
                handleBlur,
              }) => (
                <Form className="form_style">
                  <Row>
                    <Col>
                      <div className="form-group">
                        <Field
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                        />
                        <span style={{ color: "red", fontSize: "small" }}>
                          {errors.firstName &&
                            touched.firstName &&
                            errors.firstName}
                        </span>
                      </div>
                    </Col>

                    <Col>
                      <div className="form-group">
                        <Field
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                        />
                        <span style={{ color: "red", fontSize: "small" }}>
                          {errors.lastName &&
                            touched.lastName &&
                            errors.lastName}
                        </span>{" "}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="form-group">
                        <Field
                          type="email"
                          name="businessEmail"
                          placeholder=" Business Email"
                        />
                        <span style={{ color: "red", fontSize: "small" }}>
                          {errors.businessEmail &&
                            touched.businessEmail &&
                            errors.businessEmail}
                        </span>{" "}
                      </div>
                    </Col>

                    <Col>
                      <div className="form-group">
                        <Field
                          type="text"
                          name="officeLocation"
                          placeholder=" Office Location"
                        />
                        <span style={{ color: "red", fontSize: "small" }}>
                          {errors.officeLocation &&
                            touched.officeLocation &&
                            errors.officeLocation}
                        </span>{" "}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCountry_code"
                      >
                        <div className="phoneinput">
                          <PhoneInput
                            name="country_code"
                            country={"gb"}
                            placeholder="Phone Number"
                            value={values.country_code}
                            onChange={(value) =>
                              handleChange({
                                target: { name: "country_code", value },
                              })
                            }
                          />
                        </div>
                      </Form.Group>
                      {errors.country_code && touched.country_code ? (
                        <p className="text-danger">{errors.country_code} </p>
                      ) : null}

<Col>
                      <Form.Group className="mb-3" controlId="formBasicNumber">
                        <Form.Control
                          onKeyPress={(e) => {
                            if (
                              e.key === "e" ||
                              e.key === "E" ||
                              isNaN(Number(e.key))
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === " ") {
                              e.preventDefault();
                            }
                          }}
                          type="text"
                          pattern="[0-9]*"
                          name="contact_number"
                          value={values.contact_number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Number"
                        />
                      </Form.Group>
                      {errors.contact_number && touched.contact_number ? (
                        <p className="text-danger">{errors.contact_number} </p>
                      ) : null}
                    </Col>
                    </Col>
                    <Col>
                      <div className="form-group">
                        <Field
                          type="text"
                          name="jobTitle"
                          placeholder="Job Title"
                        />
                        <span style={{ color: "red", fontSize: "small" }}>
                          {errors.jobTitle &&
                            touched.jobTitle &&
                            errors.jobTitle}
                        </span>{" "}
                      </div>
                    </Col>
                  
                  </Row>
                  <Row>
                 
                    <Col>
                      <div className="form-group">
                        <Field
                          type="text"
                          name="employeeId"
                          placeholder=" Employee ID(optional)"
                        />
                        <span style={{ color: "red", fontSize: "small" }}>
                          {errors.employeeId &&
                            touched.employeeId &&
                            errors.employeeId}
                        </span>{" "}
                      </div>
                    </Col>
                    <Col>
                      <div className="">
                        <Field
                          placeholder="Assign Role" // Placeholder added here
                          type="dropdown"
                          name="assignRole"
                          as="select"
                          className=""
                        >
                          {/* <option value="" disabled selected hidden>Assign Role</option> Default option */}
                          {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                        <span style={{ color: "red", fontSize: "small" }}>
                          {errors.assignRole &&
                            touched.assignRole &&
                            errors.assignRole}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    
                    <Col></Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col>
            <h3
              style={{
                fontSize: "12px",
                fontWeight: "700",
                lineHeight: "15px",
                letterSpacing: "-0.011em",
                textAlign: "left",
              }}
              className="listing"
            >
              Permissions
            </h3>
          </Col>
        </Row>

        <Form>
          <Row>
            <Col>
              <Form.Check
                type="switch"
                id="ManageProducts"
                label="Manage Products"
                checked={checkboxStates.text3}
                onChange={() => handleCheckboxChange("text3")}
              />
            </Col>
            <Col>
              <Form.Check
                type="switch"
                id="checkbox3"
                label="Manage Company Users "
                checked={checkboxStates.text3}
                onChange={() => handleCheckboxChange("text3")}
              />
            </Col>
            <Col>
              <Form.Check
                type="switch"
                id="checkbox3"
                label="Manage Business Profile"
                checked={checkboxStates.text3}
                onChange={() => handleCheckboxChange("text3")}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Check
                type="switch"
                id="ManageProducts"
                label="Manage Products"
                checked={checkboxStates.text3}
                onChange={() => handleCheckboxChange("text3")}
              />
            </Col>
            <Col>
              <Form.Check
                type="switch"
                id="checkbox3"
                label="Manage Company Users "
                checked={checkboxStates.text3}
                onChange={() => handleCheckboxChange("text3")}
              />
            </Col>
            <Col>
              <Form.Check
                type="switch"
                id="checkbox3"
                label="Manage Business Profile"
                checked={checkboxStates.text3}
                onChange={() => handleCheckboxChange("text3")}
              />
            </Col>
          </Row>
        </Form>
      </Container>
      <Container>
        <Row className="justify-content-end py-5">
          <Col md={6}>
            <div className="disable_delete_action d-none">
              <button className=" usermgmt-button" disabled>
                <FaBan /> Disable
              </button>
              <button className="  usermgmt-button">
                <FaTrash />
                Delete
              </button>
            </div>
          </Col>
          <Col md={6}>
            <div className="btn_groups ms-md-5 ps-md-5">
              <CustomButton
                // variant="danger"
                onClick={onCancelHandler}
                className="btn-dark"
              >
                Cancel
              </CustomButton>{" "}
              <CustomButton onClick={handleSave}>Save Changes</CustomButton>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UserManagement;
