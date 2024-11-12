import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import Button from "react-bootstrap/Button";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";
import Create from "../../../Assets/icons/create.png";
import noimage from "../../../Assets/no-img/no-image-icon.png";
import { fetchBusinessProfileData } from "../../../redux/slice/BusinessProfileSlice";
import {
  fetchUserProfileData,
  UpdateBusinessProfile,
} from "../../../redux/slice/UserProfileSlice";
import Loader from "../../../components/Common/Loader";
import { fetchsuperadminapproverdata } from "../../../redux/slice/CreateLocationSlice";
import ValidationSchema from "../../../components/Common/ValidationScema";
import { StatusCode } from "../../../services/helper";
import ButtonLoader from "../../../components/Common/ButtonLoader";
import MapComponent from "../../../components/Common/MapComponent";
import LocationPopup from "../../BusinessProfile/LocationPopup/LocationPopup";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-phone-number-input/style.css";

const DistributorBusinessProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);

  //redux state
  const { status, BusinessProfileData } = useSelector(
    (state) => state.BUSINESSPROFILE
  );
  const { BusinessprofileForm, formloadstatus } = useSelector(
    (state) => state.BUSINESSPROFILEFORM
  );

  const { ApproversSuperAdminsData } = useSelector(
    (state) => state.SUPERADMINAPPROVER
  );

  //redux functions
  const dispatch = useDispatch();

  //ref
  const whitelogoref = useRef();

  const userData = BusinessProfileData?.locations || [];
  const company = BusinessProfileData?.company || [];
  const companyEmail = company.distributor_email || "";
  const compNumber = company.distributor_email || "";

  //formik initial state
  const initialValues = {
    company_name: "",
    company_logo: null,
    country_code: "",
    contact_number: "",
    business_email: "",
    assigned_role: "",
    number: "",
    businessEmail: "",
    assigned_role: "",
    approver: "approver",
    latitude: "",
    longitude: "",
  };

  //formik functions
  const {
    values,
    errors,
    handleBlur,
    handleChange,
    touched,
    setValues,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: ValidationSchema.updatebusinessprofileuser,
    onSubmit: async (values) => {
      const payload = {
        company_name: values.company_name,
        country_code: values.country_code,
        contact_number: values.contact_number,
        business_email: values.email,
        assigned_role: values.assigned_role,
        company_logo: values.company_logo,
      };
      const res = dispatch(UpdateBusinessProfile(payload));
    },
  });

  //lifycycle hooks
  useEffect(() => {
    setValues({
      ...values,
      company_name: BusinessprofileForm?.business_profile?.company_name || "",
      company_logo: BusinessprofileForm?.business_profile?.company_logo || "",
      country_code: BusinessprofileForm?.business_profile?.country_code || "",
      contact_number:
        BusinessprofileForm?.business_profile?.contact_number || "",
      email: BusinessprofileForm?.business_profile?.email || "",
      assigned_role: BusinessprofileForm?.business_profile?.assigned_role || "",
    });
  }, [BusinessprofileForm]);
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setCompanyLogoPreview(URL.createObjectURL(file));
    setValues({ ...values, company_logo: file });
  };
  useEffect(() => {
    dispatch(fetchBusinessProfileData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserProfileData());
  }, []);
  useEffect(() => {
    dispatch(fetchsuperadminapproverdata());
  }, [dispatch]);

  //methods

  if (status === "loading") {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const handleCardClick = (locationData) => {
    setSelectedLocation(locationData);
    setIsModalOpen(true);
  };

  return (
    <div className="p-3 business_block">
      <Form onSubmit={handleSubmit}>
        <div className="topdata">
          <h4 className="text-center">
            <b>Business Profile</b>
          </h4>

          <div className="divider" />
        </div>
        <div className="row middle">
          <div className="col-sm-3">
            <div className="companylogo text-center">
              <Form.Group className="" controlId="formBasiccompany_logo">
                <Form.Control
                  ref={whitelogoref}
                  type="file"
                  name="company_logo"
                  className="d-none"
                  onChange={handleLogoChange}
                  onBlur={handleBlur}
                />
              </Form.Group>
              <div className="border p-2 rounded" style={{ height: "200px" }}>
                <img
                  src={
                    values.company_logo === ""
                      ? noimage
                      : companyLogoPreview
                      ? companyLogoPreview
                      : values.company_logo
                  }
                  alt={values.company_logo === "" ? "noimage" : "company logo"}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
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

          <div className="col-sm-9">
            <div className="row">
              <Form.Group
                className="mb-3 col-12"
                controlId="formBasicBusinessName"
              >
                {/* <Form.Label>Business Name</Form.Label> */}
                <Form.Control
                  type="text"
                  name="company_name"
                  value={values.company_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Business Name"
                />
              </Form.Group>
            </div>

            <div className="row">
              <Form.Group
                className="mb-3 col-5 col-md-2"
                controlId="formBasicBusinessName"
              >
                <div className="phoneinput">
                  <PhoneInput
                    name="country_code"
                    country={""}
                    value={values.country_code}
                    onChange={(value) =>
                      handleChange({
                        target: { name: "country_code", value: `+${value}` },
                      })
                    }
                  />
                </div>
              </Form.Group>

              <Form.Group
                className="mb-3 col-7 col-md-4"
                controlId="formBasicPhone"
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
                  name="contact_number"
                  type="text"
                  pattern="[0-9]*"
                  value={values.contact_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Number"
                />
              </Form.Group>
              <Form.Group
                className="mb-3 col-12 col-md-6"
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
            </div>
            <hr />

            <div className="row">
              <Form.Group
                className="mb-3 col-6"
                controlId="formBasicAsignedSuperAdmin"
              >
                <Form.Label>Asigned Super Admin</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  name="assigned_role"
                  value={values.assigned_role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Super Admin"
                />
              </Form.Group>
              <Form.Group
                className="mb-3 col-6"
                controlId="formBasicAsignegApprover"
              >
                <Form.Label>Approver</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  name="approver"
                  value={values.approver}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Approver"
                />
              </Form.Group>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <h4 className="text-center mt-3">
          <b>Company Locations</b>
        </h4>

        <div className="row gx-5 mt-3">
          <Slider
            horizontal={true}
            dots={true}
            infinite={userData.length > 3}
            slidesToShow={3}
            slidesToScroll={1}
          >
            {userData.map((location, index) => (
              <div
                key={index}
                className="col-md-4 p-2 map_card cursor"
                onClick={() => handleCardClick(location)}
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="d-flex">
                      <div className="top_map_text">
                        <b className="smallText">
                          <small>Location Name</small>
                        </b>
                        <p>{location.location_name}</p>
                      </div>
                    </div>
                    <div className="d-flex top_map_text">
                      <div className="house_street_name">
                        <b className="smallText">
                          <small>House Number and Street Name</small>
                        </b>
                        <p>{location.street}</p>
                      </div>
                    </div>
                    <div className="d-flex top_map_text">
                      <div className="city_town">
                        <b className="smallText">
                          <small>City/Town</small>
                        </b>
                        <p>{location.city}</p>
                      </div>
                    </div>
                    <div className="d-flex top_map_text">
                      <div>
                        <b className="smallText">
                          <small>Country</small>
                        </b>

                        <p>{location.country}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ width: "100%" }}>
                      <MapComponent
                        latitude={location.latitude}
                        longitude={location.longitude}
                      />{" "}
                    </div>

                    {/* <Map /> */}
                    <div className="d-flex top_map_text">
                      <div>
                        <b className="smallText">
                          <small>Post Code</small>
                        </b>
                        <p>{location.zip_code}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="divider"></div>

                <div className="d-flex justify-content-between align-items-center border-top border-dark pt-2 map_bottom_text">
                  <div className="d-flex">
                    <div>
                      <b className="smallText">
                        <small>Email</small>
                      </b>
                      <p>{location.business_email}</p>
                    </div>
                  </div>
                  <div className="right_text">
                    <div>
                      <b className="smallText">
                        <small>Contact</small>
                      </b>
                      <p>{location.telephone}</p>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center map_bottom_text">
                  <div className="d-flex">
                    <div>
                      <b className="smallText">
                        <small>Assigned Super Admin</small>
                      </b>
                      <p>{location.assigned_admin_name}</p>
                    </div>
                  </div>
                  <div className="d-flex right_text">
                    <div>
                      <b className="smallText">
                        <small>Assigned Approver</small>
                      </b>
                      <p>{location.assigned_approver_name}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <LocationPopup
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedLocation={selectedLocation}
        />

        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap row-gap-3">
          <div className="d-flex align-items-center gap-2">
            <NavLink
              to="/distributor/createlocation"
              size="sm"
              className=" text-center nav-link rounded-circle d-flex align-items-center"
            >
              <img src={Create} alt="" />
              <span className="button-text ms-3">Create Location</span>
            </NavLink>
          </div>
          <div className="d-flex gap-3">
            <Button variant="dark">Cancel</Button>
            <Button variant="primary" type="submit">
              {formloadstatus === StatusCode.LOADING ? (
                <ButtonLoader />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default DistributorBusinessProfile;