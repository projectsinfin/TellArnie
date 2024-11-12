import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import { FaPlus } from "react-icons/fa";
import MapImage from "../../Assets/images/mapImage.png";
import "../BusinessProfile/style.css";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, Form } from "react-bootstrap";

import "react-phone-number-input/style.css";
import { fetchBusinessProfileData } from "../../redux/slice/BusinessProfileSlice";
import Loader from "../../components/Common/Loader";
import { fetchsuperadminapproverdata } from "../../redux/slice/CreateLocationSlice";
import {
  UpdateBusinessProfile,
  fetchUserProfileData,
} from "../../redux/slice/UserProfileSlice";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ValidationSchema from "../../components/Common/ValidationScema";
import { StatusCode } from "../../services/helper";
import ButtonLoader from "../../components/Common/ButtonLoader";
import Create from "../../Assets/icons/create.png";
import MapComponent from "../../components/Common/MapComponent/index";
import noimage from "../../Assets/no-img/no-image-icon.png";
import LocationPopup from "./LocationPopup/LocationPopup";

const BusinessProfile = () => {
  const { status, BusinessProfileData } = useSelector(
    (state) => state.BUSINESSPROFILE
  );
  const { BusinessprofileForm, formloadstatus } = useSelector(
    (state) => state.BUSINESSPROFILEFORM
  );

  const { ApproversSuperAdminsData } = useSelector(
    (state) => state.SUPERADMINAPPROVER
  );
  const dispatch = useDispatch();
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [disableTyping, setDisableTyping] = useState(true);
  const whitelogoref = useRef();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null); // State to manage the selected card index
  const [selectedSuperAdmin, setSelectedSuperAdmin] = useState(null); // State to store selected super admin

  const userData = BusinessProfileData?.locations || [];
  const company = BusinessProfileData?.company || [];
  const superAdmins = BusinessprofileForm?.superadmins || [];

  const companyEmail = company.distributor_email || "";
  const compNumber = company.distributor_email || "";
  const initialValues = {
    company_name: "",
    company_logo: null,
    country_code: "",
    contact_number: "",
    email: "",
    assigned_role: "",
    superadmin_id: "",
    superadmin_email: "",
  };

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
      console.log(values, "values");
      const payload = {
        company_name: values.company_name,
        country_code: values.country_code,
        contact_number: values.contact_number,
        email: values.email,
        assigned_role: values.assigned_role,
        company_logo: values.company_logo,
        superadmin_id: values.superadmin_id,
        superadmin_email: values.superadmin_email,
      };
      const res = dispatch(UpdateBusinessProfile(payload));
    },
  });

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
      superadmin_id: BusinessprofileForm?.business_profile?.superadmin_id || "",
      superadmin_email:
        BusinessprofileForm?.business_profile?.superadmin_email || "",
    });
  }, [BusinessprofileForm]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setCompanyLogoPreview(URL.createObjectURL(file));
    setValues({ ...values, company_logo: file });
  };

  useEffect(() => {
    dispatch(fetchBusinessProfileData());
    dispatch(fetchUserProfileData());
    dispatch(fetchsuperadminapproverdata());
  }, [dispatch]);

  if (status === "loading") {
    return <Loader />;
  }

  const handleSuperAdminSelect = (superadminId) => {
    const selectedSuperAdmin = superAdmins.find(
      (admin) => admin._id === superadminId
    );
    if (selectedSuperAdmin) {
      setSelectedSuperAdmin(selectedSuperAdmin);
      setValues({
        ...values,
        email: selectedSuperAdmin.email,
        superadmin_id: selectedSuperAdmin._id,
        superadmin_email: selectedSuperAdmin.email,
      });
    }
  };

  const handleCardClick = (locationData) => {
    setSelectedLocation({
      ...locationData,
      country_code: locationData?.telephone.split(" ")[0],
      telephone: locationData?.telephone.split(" ")[1],
    }); // Set selected location data
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLocation(null); // Reset selected location when modal is closed
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
                className="mb-3 col-5 col-md-6"
                controlId="formBasicBusinessName"
              >
                <div className="phn_input">
                  <div className="phoneinput">
                    <PhoneInput
                      name="country_code"
                      country={""}
                      disableTyping={disableTyping}
                      inputProps={{
                        readOnly: true,
                      }}
                      value={values.country_code}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: "country_code",
                            value: `+${value}`,
                          },
                        })
                      }
                    />
                  </div>
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
                </div>
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
              <div className="col-12">
                <Form.Group
                  className="mb-3"
                  controlId="formBasicAssignApprover"
                >
                  <Form.Select
                    aria-label="Default select example"
                    name="superadmin_id"
                    onChange={(e) => handleSuperAdminSelect(e.target.value)}
                    value={values.superadmin_id}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Super Admin</option>
                    {superAdmins.map((admin) => (
                      <option key={admin._id} value={admin._id}>
                        {`${admin.first_name} ${admin.last_name}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                {errors.superadmin_id && touched.superadmin_id ? (
                  <p className="text-danger">{errors.superadmin_id} </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <h4 className="text-center mt-3">
          <b>Company Locations</b>
        </h4>

        <div className="company-location-block row gx-5 mt-3">
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
                className="col-md-4 p-2 map_card"
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
                      />
                    </div>
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
              to="/createlocation"
              size="sm"
              className=" text-center nav-link rounded-circle d-flex align-items-center"
            >
              <img src={Create} alt="" />
              <span className="button-text ms-3">Create Location</span>
            </NavLink>
          </div>
          <div className="d-flex gap-3">
            {/* <Button variant="dark">Cancel</Button>
             */}
             <NavLink to="/users">
  <Button variant="dark">Cancel</Button>
</NavLink>
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

export default BusinessProfile;
