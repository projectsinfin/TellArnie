import { Container, Row, Col, Form } from "react-bootstrap";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-number-input/style.css";
import CustomButton from "../../../components/Common/Button/Button";
import { FaBan, FaTrash } from "react-icons/fa";
import "./CreateUser.css";
import { useEffect, useRef, useState } from "react";
import {
  StatusCode,
  asignRoles,
  userPermissions,
} from "../../../services/helper";
import {
  createNewUser,
  fetchLocation,
  inviteViaEmail,
} from "../../../redux/slice/CreateNewUserSlice";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../../../components/Common/ButtonLoader";
import ValidationSchema from "../../../components/Common/ValidationScema";
import { NavLink, useNavigate } from "react-router-dom";
import image from "../../../Assets/Profile/Icon.svg";
import EmailExistsPopup from "../../../components/Common/EmailPopup/EmailPopup";
import Swal from "sweetalert2";

function CreateUser() {
  const initialValues = {
    first_name: "",
    last_name: "",
    location_id: "fdsf",
    contact_number: "",
    country_code: "44",
    employee_id: "",
    job_title: "",
    assigned_role: "",
    permissions: [],
    email: "",
    profile_pic: null,
  };
  const whitelogoref = useRef();
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [disableTyping, setDisableTyping] = useState(true);
  const { status } = useSelector((state) => state.CREATEUSERANDLOCATION);
  const [showEmailExistsPopup, setShowEmailExistsPopup] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { FetchLocationData } = useSelector(
    (state) => state.CREATEUSERANDLOCATION
  );
  const {
    values,
    errors,
    handleBlur,
    handleChange,
    touched,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: ValidationSchema.createnewuser,
    // onSubmit: async (values) => {
    //   // console.log(values, "values for create user");
    //   // const res = await dispatch(createNewUser(values));
    //   // if (res.payload?.status) {
    //   //   navigate("/users");
    //   // }
    //   const payload = {
    //     ...values
    //   }
    //   const res = await dispatch(
    //     createNewUser({
    //       payload,
    //       cb: () => {
    //         // Customized alert message using SweetAlert
    //         Swal.fire({
    //           // icon: 'error',
    //           title: 'This E-mail already exists',
    //           text: 'Send an invitation link on this email !',
    //           confirmButtonText: 'Send Email'
    //         }).then((result) => {
    //           if (result.isConfirmed) {
    //             handleOkButtonClick();
    //           }
    //         });
    //       }
   
    //     }
      
    //   )
      
   
    //   );
    //   // console.log(res,"responseeeeeeeeeeeeeeeeeeeeeee")
    //   // if (res.payload?.status === 401 && res.payload?.message) {
    //   //   setShowEmailExistsPopup(true);
    //   // }
    // },
    onSubmit: async (values) => {
      const payload = {
        ...values
      };

      const res = await dispatch(
        createNewUser({
          payload,
          cb: () => {
            Swal.fire({
              title: 'This E-mail already exists',
              text: 'Send an invitation link on this email !',
              confirmButtonText: 'Send Email'
            }).then((result) => {
              if (result.isConfirmed) {
                handleOkButtonClick();
              }
            });
          }
        })
      );

      if (res.payload?.status === 200) {
        navigate('/users'); // Navigate to /users when status is 200
      }
    },
  });

 
 
const handleOkButtonClick = async () => {
    // Call the inviteViaEmail function from your Redux slice
    const response = await dispatch(inviteViaEmail({ email: values.email }));
    if (response.payload.status === 200) {
      Swal.fire('Email Sent', 'Confirmation email has been sent successfully!', 'success');
    } else {
      Swal.fire('Failed to Send Email', 'An error occurred while sending the email', 'error');
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setCompanyLogoPreview(URL.createObjectURL(file));
    setValues({ ...values, profile_pic: file });
  };

  const handlePermissionChange = (event) => {
    const permissionId = event.target.id;
    const isChecked = event.target.checked;
    if (isChecked) {
      setValues({
        ...values,
        permissions: [...values.permissions, permissionId],
      });
    } else {
      setValues({
        ...values,
        permissions: values.permissions.filter((id) => id !== permissionId),
      });
    }
  };
  function handleSendEmail() {}

  // useEffect(() => {
  //   if (values.assigned_role === "rm_superadmin") {
  //     setValues({
  //       ...values,
  //       permissions: userPermissions.map((curElm) => curElm.id),
  //     });
  //   }
  // }, [values.assigned_role]);
  useEffect(() => {
    dispatch(fetchLocation());
  }, []);

  console.log(userPermissions, "userpermissions");
  return (
    <div className="create-user">
      <Form onSubmit={handleSubmit}>
        <Container>
          <Row className="align-items-c">
            <Col>
              <h3
                className="listing mt-3"
                style={{ textAlign: "center", paddingBottom: "20px" }}
              >
                Create New User
              </h3>
            </Col>
          </Row>
        </Container>
        <Container>
          <div className="borderspacer border-top py-3 mt-3"></div>
        </Container>
        <Container>
          <Row>
            <Col md={4}>
              {/* <div className="divider" /> */}
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
                    src={companyLogoPreview ? companyLogoPreview : image}
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
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={values.first_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="First Name"
                    />
                  </Form.Group>
                  {errors.first_name && touched.first_name ? (
                    <p className="text-danger">{errors.first_name} </p>
                  ) : null}
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Last Name"
                    />
                  </Form.Group>
                  {errors.last_name && touched.last_name ? (
                    <p className="text-danger">{errors.last_name} </p>
                  ) : null}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicBusinessEmail"
                  >
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Business Email"
                    />
                  </Form.Group>
                  {errors.email && touched.email ? (
                    <p className="text-danger">{errors.email} </p>
                  ) : null}
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="formBasicLocation_id">
                    {/* add input instead of select option according to client */}

                    {/*  <Form.Control
                      type="text"
                      name="location_id"
                      value={values.location_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Location"
                  />*/}
                    <Form.Select
                      aria-label="Default select example"
                      name="location_id"
                      onChange={handleChange}
                      value={values.location_id}
                    >
                      <option>Office Location</option>
                      {FetchLocationData &&
                        FetchLocationData?.locations?.map((curElm) => (
                          <option value={curElm._id} key={curElm._id}>
                            {curElm.location_name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                  {errors.location_id && touched.location_id ? (
                    <p className="text-danger">{errors.location_id} </p>
                  ) : null}
                </Col>
              </Row>

              <Row>
                <Col className="d-flex phone_input justify-content-between">
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicCountry_code"
                  >
                    <div className="phoneinput">
                      <PhoneInput
                        name="country_code"
                        placeholder="Phone Number"
                        disableTyping={disableTyping}
                        inputProps={{
                          readOnly: true,
                        }}
                        value={values.country_code}
                        onChange={(value) =>
                          handleChange({
                            target: { name: "country_code", value },
                          })
                        }
                      />
                    </div>
                  </Form.Group>
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
                      placeholder="Number "
                    />
                  </Form.Group>
                  {errors.contact_number && touched.contact_number ? (
                    <p className="text-danger">{errors.contact_number} </p>
                  ) : null}
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicJob_title">
                    <Form.Control
                      type="text"
                      name="job_title"
                      value={values.job_title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Job Title"
                    />
                  </Form.Group>
                  {errors.job_title && touched.job_title ? (
                    <p className="text-danger">{errors.job_title} </p>
                  ) : null}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmployee_id">
                    <Form.Control
                      type="text"
                      name="employee_id"
                      value={values.employee_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Employee ID(optional)"
                    />
                  </Form.Group>
                  {errors.employee_id && touched.employee_id ? (
                    <p className="text-danger">{errors.employee_id} </p>
                  ) : null}
                </Col>
                <Col>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicAssigned_role"
                  >
                    <Form.Select
                      aria-label="Default select example"
                      name="assigned_role"
                      onChange={handleChange}
                      value={values.assigned_role}
                    >
                      <option>Assign Role</option>
                      {asignRoles.map((curElm, index) => (
                        <option value={curElm.value} key={index}>
                          {curElm.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  {errors.assigned_role && touched.assigned_role ? (
                    <p className="text-danger">{errors.assigned_role} </p>
                  ) : null}
                </Col>
              </Row>
              {/* <Row>
              
                <Col></Col>
              </Row> */}
            </Col>
          </Row>
        </Container>

        <Container>
          <div className="borderspacer border-top py-3 mt-3"></div>
        </Container>

        <Container>
          <Row>
            <Col>
              <h3
                style={{
                  styleName: "Category Head",
                  fontFamily: "Open Sans",
                  fontSize: "20px",
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

          <div className="permisioncard">
            <Row>
              {userPermissions &&
                userPermissions.map((curElm) => (
                  <Col key={curElm.id} className={curElm.column}>
                    <Form.Group name="permissions">
                      <Form.Check
                        type={curElm.type}
                        id={curElm.id}
                        label={curElm.label}
                        onChange={handlePermissionChange}
                        // checked={values.permissions.includes(curElm.id)}
                      />
                    </Form.Group>
                  </Col>
                ))}
              {errors.permissions && touched.permissions ? (
                <p className="text-danger">{errors.permissions} </p>
              ) : null}
            </Row>
          </div>
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
                <NavLink className="nav-link" to="/users">
                  <CustomButton
                    // variant="danger"
                    className="btn-dark"
                  >
                    Cancel
                  </CustomButton>
                </NavLink>
                <button type="submit" className="btn btn-primary">
                  {status === StatusCode.LOADING ? (
                    <ButtonLoader />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </Form>
      {/* {showEmailExistsPrompt && (
        <div className="email-exists-prompt">
          <p>Email already exists</p>
          <button onClick={() => setShowEmailExistsPrompt(false)}>OK</button>
        </div>
      )} */}
      {showEmailExistsPopup && (
  <EmailExistsPopup onSendEmail={handleSendEmail} />
)}

    </div>
  );
}

export default CreateUser;
