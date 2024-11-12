import React, { useEffect, useState } from "react";
import "./index.css";
import { Form } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";

import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import ValidationSchema from "../../../../components/Common/ValidationScema";
import ButtonLoader from "../../../../components/Common/ButtonLoader";
import { countryNames } from "../../../../services/helper/CountryDataAction";
import { StatusCode } from "../../../../services/helper";
import { createLocation, fetchsuperadminapproverdata } from "../../../../redux/slice/CreateLocationSlice";

const CreateDistributionLocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ApproversSuperAdminsData, status } = useSelector(
    (state) => state.SUPERADMINAPPROVER
  );

  const initialValues = {
    location_name: "",
    street: "",
    city: "",
    county: "",
    country: "",
    zip_code: "",
    business_email: "",
    country_code: "+44",
    contact_number: "",
    assigned_admin_id: "",
    assigned_approver_id: "",
    longitude: "",
    latitude: "",
  };

  // Define state variables and their corresponding updater functions
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [county, setCounty] = useState("");

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [allPostCode, setAllPostCode] = useState([]);
  const [locationData, setLocationData] = useState(null);
  const handlePostalCodeChange = async (postalCode) => {
    console.log("Fetching location for postal code:", postalCode);
    try {
      const countryCode = "GB"; // Country code for United Kingdom
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&countrycodes=${countryCode}&format=json&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data && data.length > 0) {
        const city = data[0].address.city || data[0].address.state; // Use state district if city is not available
        const country = data[0].address.country;
        const county = data[0].address.county;
        const street = data[0].address.state_district;

        setCity(city);
        setCountry(country);
        setCounty(county);
        setStreet(street);
        setLocationData(data[0]);

        handleChange({
          target: { name: "city", value: city },
        });
        handleChange({
          target: { name: "country", value: country },
        });
        handleChange({
          target: { name: "street", value: street },
        });
        handleChange({
          target: { name: "zip_code", value: postalCode },
        });

        // Clear latitude and longitude values when postal code changes
        setFieldValue("latitude", "");
        setFieldValue("longitude", "");
      } else {
        console.error("No location data found in response.");
      }
    } catch (error) {
      console.error("Error fetching location:", error.message);
    }
  };

  // const { values, errors, handleBlur, handleChange, touched, handleSubmit } =
  //   useFormik({
  //     initialValues: initialValues,
  //     validationSchema: ValidationSchema.createlocation,
  //     onSubmit: async (values) => {
  //       const data = await getLatLongData();
  //       if (data === undefined) {
  //         toast.error("Please enter correct location");
  //       } else {
  //         const body = { ...values, longitude: data.lon, latitude: data.lat };
  //         dispatch(createLocation(body));
  //         navigate("/businessprofile");
  //       }
  //     },
  //   });

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    touched,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: ValidationSchema.createlocation,
    onSubmit: async (values) => {
      const data = await getLatLongData(values.location_name);
      if (!data) {
        toast.error("Please enter a valid location");
        return;
      }

      // Update form values with latitude and longitude
      const updatedValues = {
        ...values,
        longitude: data.lon,
        latitude: data.lat,
      };
      dispatch(createLocation(updatedValues));
      navigate("/businessprofile");
    },
  });

  const getLatLongData = async (locationName) => {
    try {
      console.log(`Searching for location: ${locationName}`);

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${locationName}`
      );

      console.log("Response from API:", response);

      console.log("Response data:", response.data);

      if (response.data.length > 0) {
        console.log("First result:", response.data[0]);

        return response.data[0];
      } else {
        console.log("No results found for the given location name.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching latitude and longitude:", error);
      return null;
    }
  };

  const fetchLocationSuggestions = async (input) => {
    if (input.trim() === "") {
      setLocationSuggestions([]);
      console.log("Input is empty, clearing suggestions.");
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
      );

      console.log("Response from API:", response);

      console.log("Response data from location input:", response.data);

      setLocationSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setLocationSuggestions([]);
    }
  };

  useEffect(() => {
    dispatch(fetchsuperadminapproverdata());
  }, []);
  return (
    <div className="container">
      <div className="createlocation">
        <h3 className="text-center border-bottom py-3 fw-bold">
          Create A New Location
        </h3>
        <h6 className="text-center mt-2 mb-4 mt-4 fw-semibold">
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
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      handleChange(e);
                      fetchLocationSuggestions(inputValue);
                    }}
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
                          onClick={() => {
                            setFieldValue(
                              "location_name",
                              suggestion.name || ""
                            );
                            setFieldValue(
                              "display_name",
                              suggestion.display_name || ""
                            );
                            setFieldValue("latitude", suggestion.lat || "");
                            setFieldValue("longitude", suggestion.lon || "");

                            setLocationSuggestions([]);
                          }}
                        >
                          {suggestion.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </Form.Group>
                {selectedLocation && (
                  <div>
                    {/* <p>Street: { selectedLocation.address.path || selectedLocation.address.residential}</p> */}
                    <p>
                      City:{" "}
                      {selectedLocation.address.city ||
                        selectedLocation.address.town ||
                        selectedLocation.address.village}
                    </p>
                    <p>County: {selectedLocation.address.county}</p>
                    <p>Country: {selectedLocation.address.country}</p>
                    <p>ZIP Code: {selectedLocation.address.postcode}</p>
                    <p>Longitude: {selectedLocation.lon}</p>
                    <p>Latitude: {selectedLocation.lat}</p>
                  </div>
                )}
              </div>
              <div className="col-12">
                <Form.Group className="mb-3" controlId="formBasicStreetAdress">
                  <Form.Control
                    type="text"
                    name="street"
                    value={values.street}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="City"
                  />
                </Form.Group>
                {errors.city && touched.city ? (
                  <p className="text-danger">{errors.city} </p>
                ) : null}
              </div>

              <div className="col-6">
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
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group className="mb-3" controlId="formBasicCountry">
                  <Form.Select
                    aria-label="Default select example"
                    name="country"
                    onChange={handleChange}
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
                    onChange={(e) => handlePostalCodeChange(e.target.value)}
                    placeholder="Post Code"
                  />
                  {/* Display location data if available */}
                  {locationData && (
                    <div>
                      <p> {locationData.city}</p>
                      <p> {locationData.state_district}</p>
                      <p>{locationData.country}</p>
                    </div>
                  )}
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
                    name="business_email"
                    value={values.business_email}
                    onChange={handleChange}
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
              <div className="col-4">
                <Form.Group className="mb-3" controlId="formBasicCountryCode">
                  <div className="phoneInput">
                    {/* <PhoneInput
                    name="country_code"
                    className="w-100"
                    country={"gb"}
                    value={values.country_code}
                    onChange={(value) =>
                      handleChange({
                        target: { name: "country_code", value },
                      })
                    }
                  />{" "} */}
                    <PhoneInput
                      name="country_code"
                      className="w-100"
                      country={"gb"}
                      value={values.country_code}
                      onChange={(value) =>
                        handleChange({
                          target: { name: "country_code", value: "+" + value }, // Add "+" here
                        })
                      }
                    />
                  </div>
                </Form.Group>
                {/* {errors.country_code && touched.country_code ? (
                <p className="text-danger">{errors.country_code} </p>
              ) : null} */}
              </div>

              <div className="col-8">
                <Form.Group className="mb-3" controlId="formBasicContactNumber">
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
              </div>
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
            <div className="text-end">
              <NavLink className="btn btn-dark me-2" to="/distributor/businessprofile">
                Cancel
              </NavLink>
              <button className="btn btn-primary" type="submit">
                {status === StatusCode.LOADING ? (
                  <ButtonLoader />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDistributionLocation;