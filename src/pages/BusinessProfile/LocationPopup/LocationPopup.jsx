import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { countryNames } from "../../../services/helper/CountryDataAction";
import axios from "axios";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import ButtonLoader from "../../../components/Common/ButtonLoader";
import {
  createLocation,
  fetchsuperadminapproverdata,
} from "../../../redux/slice/CreateLocationSlice";
import { StatusCode } from "../../../services/helper";
import {
  deleteLocationData,
  updateLocationData,
} from "../../../redux/slice/BusinessProfileSlice";
import DeleteConFirmationModal from "../../../components/Common/DeleteConFirmationModal";

const LocationPopup = ({ isOpen, onClose, selectedLocation }) => {
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [deleteconfirm, setDeleteConfirm] = useState(false);
  const [modalConfirmTitle, setModalConfirmTitle] = useState("");
  const [removeId, setRemoveId] = useState([]);
  const [disableTyping, setDisableTyping] = useState(true);

  //Redux state
  const { ApproversSuperAdminsData, status } = useSelector(
    (state) => state.SUPERADMINAPPROVER
  );

  //Redux functions
  const dispatch = useDispatch();

  //Router functions
  const navigate = useNavigate();

  //Formik initial state
  const initialValues = {
    location_name: "",
    street: "",
    city: "",
    county: "",
    country: "",
    zip_code: "",
    business_email: "",
    telephone: "",
    country_code: "",
    contact_number: "",
    assigned_admin_id: "",
    assigned_approver_id: "",
    longitude: "",
    latitude: "",
  };

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    touched,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: initialValues,
    // validationSchema: ValidationSchema.createlocation,
    onSubmit: async (values) => {
      const data = await getLatLongData(values.location_name);
      if (!data) {
        toast.error("Please enter a valid location");
        return;
      }

      const updatedValues = {
        ...values,
        longitude: data.lon,
        latitude: data.lat,
      };
      console.log(updatedValues, "updatedValues");
      dispatch(
        updateLocationData({ id: selectedLocation._id, data: updatedValues })
      );
      // navigate("/businessprofile");
      // },

      // console.log("Payload to be dispatched:", { id: selectedLocation._id, data: updatedValues });

      // try {
      //   const res = await dispatch(updateLocationData({ id: selectedLocation._id, data }));

      //   if (res && res.status === 200) {
      //     toast.success(res.data?.message);
      //     navigate("/businessprofile");
      //     console.log("Location data updated successfully.");
      //   } else {
      //     toast.error("Failed to update location data.");
      //   }
      // } catch (error) {
      //   toast.error("Failed to update location data.");
      //   console.error("Error updating location data:", error.message);
      // }
    },
  });

  //Lifecycle hooks

  useEffect(() => {
    dispatch(fetchsuperadminapproverdata());
  }, []);

  useEffect(() => {
    console.log(selectedLocation, "selectedLocation");
    if (selectedLocation) {
      setValues({
        location_name: selectedLocation?.location_name ?? "",
        street: selectedLocation?.street ?? "",
        city: selectedLocation?.city ?? "",
        country: selectedLocation?.country ?? "",
        county: selectedLocation?.county ?? "",
        zip_code: selectedLocation?.zip_code ?? "",
        country_code: selectedLocation?.country_code ?? "",
        telephone: selectedLocation?.telephone ?? "",
        contact_number: selectedLocation?.telephone ?? "",
        email: selectedLocation?.business_email ?? "",
        assigned_admin_name: selectedLocation?.assigned_admin_name ?? "",
        assigned_approver_name: selectedLocation?.assigned_approver_name ?? "",
        assigned_admin_id: selectedLocation?.assigned_admin_id ?? "",
        assigned_approver_id: selectedLocation?.assigned_approver_id ?? "",
      });
    }
  }, [selectedLocation]);

  //Methods

  const getAddressByPostalCode = async (value) => {
    try {
      const countryCode = "GB";
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${value}&countrycodes=${countryCode}&format=json&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const city = data[0].address.city || data[0].address.state;
        const country = data[0].address.country;
        const county = data[0].address.county;
        const street = data[0].address.state_district;

        const address = [
          { name: "city", value: city },
          { name: "country", value: country },
          { name: "street", value: street },
          { name: "zip_code", value: value },
        ];

        for (let i = 0; i < address.length; i++) {
          handleChange({
            target: address[i],
          });
        }
      } else {
        console.error("No location data found in response.");
      }
    } catch (error) {
      console.error("Error fetching location:", error.message);
    }
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "location_name") {
      fetchLocationSuggestions(value);
    }
    if (name === "zip_code") {
      getAddressByPostalCode(value);
    }
    handleChange(e);
    setValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onCountryCodeChange = (value) => {
    setFieldValue("contry_code", value);
  };

  const onSelectLocationHandler = (e, suggestion) => {
    setFieldValue("location_name", suggestion.name || "");
    setFieldValue("display_name", suggestion.display_name || "");
    setFieldValue("latitude", suggestion.lat || "");
    setFieldValue("longitude", suggestion.lon || "");

    setLocationSuggestions([]);
  };

  const removeUserHandler = async () => {
    if (removeId) {
      try {
        await dispatch(deleteLocationData(removeId));
        onClose();
      } catch (error) {
        console.error("Failed to delete location:", error);
      }
    }
  };
  const deletehandler = () => {
    if (selectedLocation?._id) {
      setRemoveId(selectedLocation._id);
      setDeleteConfirm(true);
      setModalConfirmTitle("Are you sure you want to delete this location?");
    }
  };

  const getLatLongData = async (locationName) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${locationName}`
      );

      if (response.data.length > 0) {
        return response.data[0];
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const fetchLocationSuggestions = async (input) => {
    if (input.trim() === "") {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
      );
      setLocationSuggestions(response.data);
    } catch (error) {
      setLocationSuggestions([]);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton className="justify-content-center py-4">
        <Modal.Title>Create A New Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="mt-2 mb-4 mt-4 fw-semibold">
          Enter your business information
        </h6>
        <div className="locationformdata">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Group className="mb-3" controlId="formBasicLocationName">
                  <Form.Control
                    type="text"
                    name="location_name"
                    value={values.location_name}
                    onChange={onChangeHandler}
                    onBlur={handleBlur}
                    placeholder="Location Name"
                    autoComplete="off"
                  />
                  {errors.location_name && touched.location_name && (
                    <p className="text-danger">{errors.location_name}</p>
                  )}
                  {locationSuggestions.length > 0 && (
                    <ul className="suggestion-list">
                      {locationSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={(e) =>
                            onSelectLocationHandler(e, suggestion)
                          }
                        >
                          {suggestion.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </Form.Group>
              </div>
              <div className="col-12">
                <Form.Group className="mb-3" controlId="formBasicStreetAdress">
                  <Form.Control
                    type="text"
                    name="street"
                    value={values.street}
                    onChange={onChangeHandler}
                    onBlur={handleBlur}
                    placeholder="Street Address"
                  />
                </Form.Group>
                {errors.street && touched.street ? (
                  <p className="text-danger">{errors.street} </p>
                ) : null}
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group className="mb-3" controlId="formBasicCity">
                  <Form.Control
                    type="text"
                    name="city"
                    value={values.city}
                    onChange={onChangeHandler}
                    onBlur={handleBlur}
                    placeholder="City"
                  />
                </Form.Group>
                {/* {errors.city && touched.city ? (
                  <p className="text-danger">{errors.city} </p>
                ) : null} */}
              </div>

              <div className="col-6">
                <Form.Group className="mb-3" controlId="formBasicCounty">
                  <Form.Control
                    type="text"
                    name="county"
                    value={values.county}
                    onChange={onChangeHandler}
                    onBlur={handleBlur}
                    placeholder="County"
                  />
                </Form.Group>
                {errors.county && touched.county ? (
                  <p className="text-danger">{errors.county} </p>
                ) : null}
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group className="mb-3" controlId="formBasicCountry">
                  <Form.Select
                    aria-label="Default select example"
                    name="country"
                    onChange={onChangeHandler}
                    value={values.country}
                    onBlur={handleBlur}
                  >
                    <option>Country</option>
                    {countryNames &&
                      countryNames.map((curElm, index) => (
                        <option value={curElm.label} key={index}>
                          {curElm.label}{" "}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
                {errors.country && touched.country ? (
                  <p className="text-danger">{errors.country} </p>
                ) : null}
              </div>

              <div className="col-6">
                <Form.Group className="mb-3" controlId="formBasicZipCode">
                  <Form.Control
                    type="text"
                    name="zip_code"
                    onChange={onChangeHandler}
                    placeholder="Post Code"
                    value={values.zip_code}
                  />
                </Form.Group>
                {errors.zip_code && touched.zip_code ? (
                  <p className="text-danger">{errors.zip_code} </p>
                ) : null}
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-12">
                <Form.Group className="mb-3" controlId="formBasicBusinessEmail">
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={onChangeHandler}
                    onBlur={handleBlur}
                    placeholder="Business Email"
                  />
                </Form.Group>
                {errors.business_email && touched.business_email ? (
                  <p className="text-danger">{errors.business_email} </p>
                ) : null}
              </div>
            </div>
            <div className="row">
              <Col className="d-flex input_2_custom">
                <Form.Group className="mb-4" controlId="formBasicCountryCode">
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
                      onChange={onCountryCodeChange}
                    />
                  </div>
                  {errors.country_code && touched.country_code ? (
                    <p className="text-danger mt-2">{errors.country_code}</p>
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
                    onChange={onChangeHandler}
                    onBlur={handleBlur}
                    placeholder="Number"
                  />
                  {errors.contact_number && touched.contact_number ? (
                    <p className="text-danger mt-2">{errors.contact_number}</p>
                  ) : null}
                </Form.Group>
              </Col>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Group
                  className="mb-3"
                  controlId="formBasicAssignSuperAdmin"
                >
                  <Form.Select
                    aria-label="Default select example"
                    className="text-capitalize"
                    name="assigned_admin_id"
                    onChange={onChangeHandler}
                    value={values.assigned_admin_id}
                    onBlur={handleBlur}
                  >
                    <option>Assigned Super Admin</option>
                    {ApproversSuperAdminsData &&
                      ApproversSuperAdminsData.Superadmins?.map((curElm) => (
                        <option value={curElm._id} key={curElm._id}>
                          {curElm.first_name} {curElm.last_name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
                {errors.assigned_admin_id && touched.assigned_admin_id ? (
                  <p className="text-danger">{errors.assigned_admin_id} </p>
                ) : null}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Group
                  className="mb-3"
                  controlId="formBasicAssignApprover"
                >
                  <Form.Select
                    aria-label="Default select example"
                    name="assigned_approver_id"
                    onChange={onChangeHandler}
                    value={values.assigned_approver_id}
                    onBlur={handleBlur}
                  >
                    <option>Assigned Approver</option>
                    {ApproversSuperAdminsData &&
                      ApproversSuperAdminsData.Approvers?.map((curElm) => (
                        <option value={curElm._id} key={curElm._id}>
                          {curElm.first_name} {curElm.last_name}{" "}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
                {errors.assigned_approver_id && touched.assigned_approver_id ? (
                  <p className="text-danger">{errors.assigned_approver_id} </p>
                ) : null}
              </div>
            </div>
            <hr />
            <div className="text-center">
              <button className="btn btn-primary px-4 py-2" type="submit">
                {status === StatusCode.LOADING ? (
                  <ButtonLoader />
                ) : (
                  "Save Changes"
                )}
              </button>

              <button
                onClick={deletehandler}
                className="btn-delete btn btn-danger px-4 py-2 ms-2"
              >
                Delete
              </button>
              {deleteconfirm && (
                <DeleteConFirmationModal
                  show={deleteconfirm}
                  title={modalConfirmTitle}
                  eventhandler={removeUserHandler}
                  hide={() => setDeleteConfirm(false)}
                />
              )}
            </div>
          </form>
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
        <NavLink className="btn btn-dark me-2" to="/businessprofile">
          Cancel
        </NavLink>
        <button className="btn btn-primary" type="submit">
          {status === StatusCode.LOADING ? (
            <ButtonLoader />
          ) : (
            "Save Changes"
          )}
        </button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default LocationPopup;
