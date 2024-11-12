import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { MdLocationDisabled } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import PhoneInput from "react-phone-input-2";
import "./index.css";
import { Col, Row, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { StatusCode } from "../../../services/helper";
import ButtonLoader from "../../../components/Common/ButtonLoader";
import ValidationSchema from "../../../components/Common/ValidationScema";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Distribution from "../../../Assets/Profile/distributor.svg";
import {
  distributorregisteruser,
  getDistributorDetails,
  updateDistributorDetails,
} from "../../../redux/slice/DistributionRegistrationSlice";

const UpdateDistributor = ({ onClose }) => {
  const initialValues = {
    distributor_name: "",
    street: "",
    county: "",
    country: "",
    email: "",
    postal_code: "",
    country_code: "",
    contact_number: "",
    company_logo: null,
    company_white_logo: null,
    alternate_distributor_name: "",
    role: "Super Admin",
  };

  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [whiteCompanyLogoPreview, setWhiteCompanyLogoPreview] = useState(null);
  const [disableTyping, setDisableTyping] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status, DistributorRegisaterData } = useSelector(
    (state) => state.DISTRIBUTORMANAGEMENT
  );
  const whitelogoref = useRef();
  const secwhitelogoref = useRef();

  useEffect(() => {
    if (location.state) {
      const data = {
        id: location.state._id,
      };

      dispatch(getDistributorDetails(data)).then(({ payload }) => {
        const { data } = payload;
        if (payload.status === 200) {
          setValues((prev) => {
            return {
              ...prev,
              distributor_name: data?.distributor_name ?? "",
              street: data?.street ?? "",
              county: data?.county ?? "",
              country: data?.country ?? "",
              email: data?.email ?? "",
              postal_code: data?.postal_code ?? "",
              country_code: data?.country_code ?? "",
              contact_number: data?.contact_number ?? "",
              alternate_distributor_name:
                data?.alternate_distributor_name ?? "",
              company_logo: data?.company_logo ?? null,
              company_white_logo: data?.company_white_logo ?? null,
            };
          });
          setCompanyLogoPreview(data?.company_logo ?? null);
          setWhiteCompanyLogoPreview(data?.company_white_logo ?? null);
        }
      });
    }
  }, [location]);

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
    validationSchema: ValidationSchema.distributorinformation,
    onSubmit: async (values) => {
      if (!location.state) {
        // Ensure the role is set to "distributor_superadmin" in the payload
        const payload = { ...values, role: "distributor_superadmin" };
        const res = await dispatch(distributorregisteruser(payload));
        if (res.payload?.status) {
          navigate("/distributors");
        }
      } else {
        // Ensure the role is set to "distributor_superadmin" in the payload
        const payload = {
          ...values,
          distributor_id: location.state._id,
          role: "distributor_superadmin",
        };
        const res = await dispatch(updateDistributorDetails(payload));
        if (res.payload?.status) {
          navigate("/distributors");
        }
      }
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (e.target.name === "company_logo") {
      setCompanyLogoPreview(URL.createObjectURL(file));
      setValues({ ...values, company_logo: file });
    } else {
      setWhiteCompanyLogoPreview(URL.createObjectURL(file));
      setValues({ ...values, company_white_logo: file });
    }
  };
  // const userData = DistributorRegisaterData?.data?.distributors || [];

  return (
    <div className="distributorinfo-popup">
      <div className="popup-content">
        <h3 className="text-center border-bottom pb-4 pt-2">
          Update Distributor Information
        </h3>
        <div className="infoformdata pt-4 pb-2">
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-5">
                <div className="companylogodata">
                  <h6>Company Logo</h6>
                  <div className="companylogo">
                    <Form.Group
                      className="mb-3"
                      controlId="formBasiccompany_logo"
                    >
                      <Form.Control
                        ref={whitelogoref}
                        type="file"
                        name="company_logo"
                        className="d-none"
                        onChange={handleLogoChange}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                    <img
                      src={
                        companyLogoPreview ? companyLogoPreview : Distribution
                      }
                      alt="company logo"
                      className=""
                      style={{ height: "300px", width: "500px" }}
                    />
                  </div>
                  <div className="text-center pt-2">
                    <button
                      className="border-0 background-transparent"
                      type="button"
                      onClick={() => whitelogoref.current.click()}
                    >
                      EditCompany White Logo
                    </button>
                    {errors.company_logo && touched.company_logo ? (
                      <p className="text-danger">{errors.company_logo} </p>
                    ) : null}
                  </div>
                </div>
                <div className="companylogodata">
                  <h6>Company White Logo</h6>
                  <div className="companylogo">
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicCompany_white_logo"
                    >
                      <Form.Control
                        ref={secwhitelogoref}
                        type="file"
                        name={values.company_white_logo}
                        className="d-none"
                        onBlur={handleBlur}
                        onChange={handleLogoChange}
                      />
                    </Form.Group>
                    <img
                      src={
                        whiteCompanyLogoPreview
                          ? whiteCompanyLogoPreview
                          : Distribution
                      }
                      alt="white logo"
                      className=""
                      style={{ height: "300px", width: "500px" }}
                    />
                  </div>
                  <div className="text-center pt-2">
                    <button
                      className="border-0 background-transparent"
                      type="button"
                      onClick={() => secwhitelogoref.current.click()}
                    >
                      Edit
                    </button>
                    {errors.company_white_logo && touched.company_white_logo ? (
                      <p className="text-danger">
                        {errors.company_white_logo}{" "}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="col-md-7">
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="distributorName">
                      <Form.Control
                        type="text"
                        name="distributor_name"
                        value={values.distributor_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Distributor name"
                      />
                    </Form.Group>
                    {errors.distributor_name && touched.distributor_name ? (
                      <p className="text-danger">{errors.distributor_name} </p>
                    ) : null}

                    <Form.Group className="mb-3" controlId="formBasicStreet">
                      <Form.Control
                        type="text"
                        name="street"
                        value={values.street}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Street"
                      />
                    </Form.Group>
                    {errors.street && touched.street ? (
                      <p className="text-danger">{errors.street} </p>
                    ) : null}
                    <Form.Group className="mb-3" controlId="formBasicCounty">
                      <Form.Control
                        type="text"
                        name="county"
                        value={values.county}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="County"
                      />
                    </Form.Group>
                    {errors.county && touched.county ? (
                      <p className="text-danger">{errors.county} </p>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicCountry">
                      <Form.Control
                        type="text"
                        name="country"
                        value={values.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Country"
                      />
                    </Form.Group>
                    {errors.country && touched.country ? (
                      <p className="text-danger">{errors.country} </p>
                    ) : null}
                  </Col>

                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicPostal">
                      <Form.Control
                        type="text"
                        name="postal_code"
                        value={values.postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Postal Code"
                      />
                    </Form.Group>
                    {errors.postal_code && touched.postal_code ? (
                      <p className="text-danger">{errors.postal_code} </p>
                    ) : null}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicSuperAdmin"
                    >
                      <Form.Control
                        type="text"
                        name="role"
                        value={values.role || "distributor_superadmin"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Super Admin"
                      />
                    </Form.Group>
                    {errors.role && touched.role ? (
                      <p className="text-danger">{errors.role} </p>
                    ) : null}
                    <Form.Group
                      className="mb-4"
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
                </Row>

                <Row>
                  <Col className="d-flex input_2_custom">
                    <Form.Group
                      className="mb-4"
                      controlId="formBasicCountryCode"
                    >
                      <div className="phoneinput">
                        <PhoneInput
                          name="country_code"
                          disableTyping={disableTyping}
                          inputProps={{
                            readOnly: true,
                          }}
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
                      {errors.country_code && touched.country_code ? (
                        <p className="text-danger mt-2">
                          {errors.country_code}
                        </p>
                      ) : null}
                    </Form.Group>

                    <Form.Group
                      className="mb-4 flex-grow-1"
                      controlId="formBasicNumber"
                    >
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
                      {errors.contact_number && touched.contact_number ? (
                        <p className="text-danger mt-2">
                          {errors.contact_number}
                        </p>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>
            <hr />
            <div className="d-flex align-items-center">
              <h6 className="w-25">Alternative Distributor</h6>
              <Form.Group>
                <Form.Control
                  className="w-100"
                  type="text"
                  name="alternate_distributor_name"
                  value={values.alternate_distributor_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Distributor Name"
                />
              </Form.Group>
              {errors.alternate_distributor_name &&
              touched.alternate_distributor_name ? (
                <p className="text-danger">
                  {errors.alternate_distributor_name}{" "}
                </p>
              ) : null}
            </div>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex d-none">
                  <div className="me-5">
                    <MdLocationDisabled size={20} />
                    <span className="ms-1">Disable</span>
                  </div>
                  <div>
                    <GoTrash size={20} />
                    <span> Delete</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 text-end">
                <NavLink className={"nav-link d-inline"} to="/distributors">
                  <button className="btn btn-dark" type="button">
                    Cancel
                  </button>
                </NavLink>
                <button className="btn btn-primary ms-4 w-50" type="submit">
                  {status === StatusCode.LOADING ? (
                    <ButtonLoader />
                  ) : location.state ? (
                    "Update Changes"
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDistributor;
