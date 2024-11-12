import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import notificationImage from "../../../Assets/images/Background.png";
import msgIcon from "../../../Assets/images/message_ic.png";
import CustomButton from "../../../components/Common/Button/Button";
import DateTimePicker from "../../../components/Common/DatePicker/DatePicker";
import "./EditNotification.css";
import { FiCalendar } from "react-icons/fi";
import { roles } from "../../../utils/helperFunction";
import {
  RegisterEditNotification,
  getMessageDetails,
  updateMsgNotification,
} from "../../../redux/slice/MessageCentreSlice";
import { useLocation, useNavigate } from "react-router-dom";

function EditNotification() {
  const [content, setContent] = useState();
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { status } = useSelector((state) => state.MESSAGECENTRE);
  const { access_token, role } = useSelector((state) => state.AUTH);
  // console.log(role, "role");
  const {
    superAdmin,
    admin,
    approver,
    user,
    salesUser,
    distributior,
    distributor_user,
  } = roles;

  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    send_message_to: [],
    location: "United Kingdom",
    industry: "",
  });

  const [publishDetails, setPublishDetails] = useState({
    status: "",
    revisions: 1,
    publish_on: new Date(),
    category: "",
  });
  const location = useLocation();

  useEffect(() => {
    console.log(location);
    if (location.state) {
      const data = {
        id: location.state.notification_id,
        type: location.state.type,
      };
      dispatch(getMessageDetails(data)).then(({ payload }) => {
        if (payload.status === 200) {
          const { data } = payload;
          console.log(data, "data");
          setNotificationData((prev) => {
            return {
              ...prev,
              title: data?.title ?? "",
              message: data?.message ?? "",
              send_message_to: data?.send_message_to ?? "",
              location: data?.location ?? "",
              industry: data?.industry ?? "",
            };
          });
          setPublishDetails((prev) => {
            return {
              ...prev,
              status: data?.status ?? "",
              revision: data?.revision ?? "",
              publish_on: data?.publish_on ?? "",
              category: data?.category?.toLowerCase() ?? "",
            };
          });
        }
      });
    }
  }, [location]);

  const handleSave = () => {
    console.log("saving");
    const validationErrors = {};

    // Validate title
    if (!notificationData.title.trim()) {
      validationErrors.title = "*Title is required";
    }

    // Validate message
    if (!notificationData.message.trim()) {
      validationErrors.message = "*Message is required";
    }

    // Validate send_message_to
    if (notificationData.send_message_to.length === 0) {
      validationErrors.send_message_to =
        "*Please select at least one recipient";
    }

    // Validate location
    if (!notificationData.location) {
      validationErrors.location = "*Location is required";
    }

    // Validate industry
    if (!notificationData.industry) {
      validationErrors.industry = "*Industry is required";
    }

    // Validate status
    if (!publishDetails.status) {
      validationErrors.status = "*Status is required";
    }

    // Validate publish_on
    if (
      !(
        publishDetails.publish_on instanceof Date &&
        !isNaN(publishDetails.publish_on)
      )
    ) {
      validationErrors.publish_on = "*Publish date is required";
    }

    // Validate category
    if (!publishDetails.category) {
      validationErrors.category = "*Category is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(
      RegisterEditNotification({ ...notificationData, ...publishDetails })
    )
      .then((response) => {
        if (response.payload && response.payload.status === 200) {
          navigate("/messaging"); // Redirect to "/messaging" after successful save
        } else {
          console.error("Failed to update article:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating article:", error);
      });
  };

  const onCancelHandler = () => {navigate(-1)};

  const handleChange = (newContent) => {
    setNotificationData((prevData) => ({
      ...prevData,
      content: newContent,
    }));
  };

  const handlePublishDetailsChange = (fieldName, value, format) => {
    // Format the date if format is provided
    const formattedValue = format ? formatDate(value, format) : value;
    console.log(formattedValue, "formattedValue");

    setPublishDetails((prevDetails) => ({
      ...prevDetails,
      [fieldName]: formattedValue,
    }));
  };

  // Function to format the date
  const formatDate = (date, format) => {
    return new Intl.DateTimeFormat("en-US", format).format(date);
  };

  const handleTitleChange = (e) => {
    setNotificationData((prevData) => ({
      ...prevData,
      title: e.target.value,
    }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddClick = () => {
    // Logic to handle adding the search term
    console.log("Search term:", searchTerm);
    // You can implement your logic here to add the search term
    // For example, you can send it to an API endpoint or store it in state
  };
  const industries = [
    "Agriculture, forestry & fishing",
    "Mining & quarrying",
    "Manufacturing",
    "Electricity, gas, steam & air conditioning supply",
    "Water supply, sewerage, waste & remediation activities",
    "Construction",
    "Wholesale & retail trade; repair of motor vehicles and motorcycles",
    "Transport & storage",
    "Accommodation & food service activities",
    "Information & communication",
    "Financial & insurance activities",
    "Real estate activities",
    "Professional scientific & technical activities",
    "Administrative & support service activities",
    "Public admin & defence; compulsory social security",
    "Education",
    "Human health & social work activities",
    "Arts, entertainment & recreation",
    "Other service activities",
    "Private households",
  ];
  const checkboxes = [
    { value: "general_users", label: "General Users" },
    { value: "user_admin", label: "User Admin" },
    { value: "user_super_admin", label: "User Super Admin" },
    { value: "general_distributors", label: "General Distributors" },
    { value: "distributor_admin", label: "Distributor Admin" },
    { value: "distributor_super_admin", label: "Distributor Super Admin" },
    { value: "rm_admin", label: "Reliance Medical Admin" },
    { value: "rm_super_admin", label: "Reliance Medical Super Admin" },
  ];

  useEffect(() => {
    // Simulated data source with location mappings
    const locationData = [
      { id: 1, name: "United Kingdom" },
      // { id: 2, name: "Country 2" },
      // Add more location entries as needed
    ];
    setLocations(locationData);
  }, []);
  const handleMessageChange = (e) => {
    setNotificationData((prevData) => ({
      ...prevData,
      message: e.target.value,
    }));
  };
  const handleCheckboxChange = (label) => {
    // Toggle checkbox state
    const updatedCheckboxState = [...notificationData.send_message_to];
    if (updatedCheckboxState.includes(label)) {
      updatedCheckboxState.splice(updatedCheckboxState.indexOf(label), 1);
    } else {
      updatedCheckboxState.push(label);
    }
    // Update notificationData state
    setNotificationData((prevData) => ({
      ...prevData,
      send_message_to: updatedCheckboxState,
    }));
  };
  const handleLocationChange = (e) => {
    setNotificationData((prevData) => ({
      ...prevData,
      location: e.target.value,
    }));
  };

  const handleIndustryChange = (e) => {
    setNotificationData((prevData) => ({
      ...prevData,
      industry: e.target.value,
    }));
  };

  const onUpdateHandler = () => {
    console.log("on Update notification handler work");
    const data = {
      title: notificationData.title,
      message: notificationData.message,
      send_message_to: notificationData.send_message_to,
      location: notificationData.location,
      industry: notificationData.industry,
      status: publishDetails.status,
      revisions: publishDetails.revisions,
      publish_on: publishDetails.publish_on,
      category: publishDetails.category,
      id: location.state.notification_id,
    };
    dispatch(updateMsgNotification(data)).then(({ payload }) => {
      if (payload.status === 200) {
        navigate(-1);
      }
    });
  };

  const categoryOptions = [
    { label: "How To Video", value: "how to video" },
    { label: "Product Update", value: "product update" },
    {
      label: "Legislation and Compliance",
      value: "legislation and compliance",
    },
    { label: "News Update", value: "news update" },
    { label: "Product Launches", value: "product launches" },
    { label: "Training", value: "training" },
    { label: "user Define", value: "user define" },
  ];
  const statusOptions = [];

  return (
    <div>
      <Row>
        <Col md={3}>
          <div className="notification-card" style={{}}>
            {/* Image representing the phone screen */}
            <div className="phone_card">
              <img
                src={notificationImage}
                className="img-fluid"
                alt={notificationData.title}
              />
              <div className="notification_msg">
                <div className="head_msg">
                  <div className="left_1">
                    <img src={msgIcon} alt="" /> <span>TELL ARNIE</span>
                  </div>
                  <div className="right_1">
                    <span>now</span>
                  </div>
                </div>
                <h5>{notificationData.title}</h5>{" "}
                {/* Display notification title */}
                <p>{notificationData.message}</p>{" "}
                {/* Display notification message */}
              </div>
            </div>
          </div>
        </Col>

        <Col md={5}>
          <div className="notification-card card border-0 p-3">
            <h3 className="listing border-bottom">
              {location?.state ? "Edit" : "Create"} Notification
            </h3>
            <div className="title-box mb-2">
              <div className="d-flex justify-content-between pb-2">
                <p className="mb-0">Title</p>
                <span>{notificationData.title.length}/100</span>
              </div>
              <input
                className="input_style"
                type="text"
                placeholder="Title"
                maxLength={100}
                value={notificationData.title}
                onChange={handleTitleChange}
              />
              {errors.title && <p className="text-danger">{errors.title}</p>}
            </div>

            <div className="message-box mb-2">
              <div className="d-flex justify-content-between pb-2">
                <p className="mb-0">Message</p>
                <span>{notificationData.message.length}/100</span>
              </div>
              <textarea
                className="textarea_style"
                cols={3}
                placeholder="Message"
                maxLength={100}
                value={notificationData.message}
                onChange={handleMessageChange}
              ></textarea>
              {errors.message && (
                <p className="text-danger">{errors.message}</p>
              )}
            </div>
            <div className="checkboxes border-top border-bottom py-3 my-3">
              <Form.Group as={Row}>
                <h4>Send Message To:</h4>
                {checkboxes.map((checkbox, index) => (
                  <Col md={4} key={index}>
                    <Form.Check
                      type="checkbox"
                      label={checkbox.label}
                      checked={notificationData.send_message_to.includes(
                        checkbox.value
                      )}
                      onChange={() => handleCheckboxChange(checkbox.value)}
                    />
                  </Col>
                ))}
              </Form.Group>
              {errors.send_message_to && (
                <p className="text-danger">{errors.send_message_to}</p>
              )}
            </div>

            <div className="select_wrapper mb-3 mt-3">
              {/* Location select */}
              <label htmlFor="">Location(s):</label>
              <select
                value={notificationData.location}
                onChange={handleLocationChange}
              >
                <option>Choose Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.location && (
              <p className="text-danger">{errors.location}</p>
            )}

            <div className="select_wrapper mb-3 mt-4">
              {/* Industry select */}
              <label htmlFor="">Industry(s)</label>
              <select
                value={notificationData.industry}
                onChange={handleIndustryChange}
              >
                <option>Choose Industry</option>
                {industries.map((industry, index) => (
                  <option key={index} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            {errors.industry && (
              <p className="text-danger">{errors.industry}</p>
            )}
          </div>
        </Col>
        <Col md={4}>
          <div className="notification-card card border-0  p-3">
            <h3 className="listing border-bottom">Publish Details</h3>
            <div className="select_wrapper mb-3">
              <label>Status:</label>
              <select
                value={publishDetails.status}
                onChange={(e) =>
                  handlePublishDetailsChange("status", e.target.value)
                }
              >
                <option value="" disabled selected>
                  Choose Draft{" "}
                </option>
                <option>Draft</option>
                {role !== superAdmin && <option>Sent for Approval</option>}
                <option>Approved</option>
                <option>Scheduled</option>
              </select>
            </div>
            {errors.status && <p className="text-danger">{errors.status}</p>}

            <div className="revision mb-3">
              <p>Revisions: {publishDetails.revisions}</p>
            </div>
            {/* <div className="date_wrapper mb-3 border-bottom pb-3">
              <label htmlFor="">Publish on: </label>
              <DateTimePicker
                value={publishDetails.publish_on}
                onChange={(date) =>
                  handlePublishDetailsChange("publish_on", date)
                }
                format="yyyy-MM-dd HH:mm:ss" // Set your desired time format
              />
              <span className="mb-1 span_calandar">
                <FiCalendar />
              </span>
            </div> */}
            {publishDetails.status === "Scheduled" && (
              <div className="date_wrapper mb-3 border-bottom pb-3">
                <label htmlFor="">Publish on: </label>
                <DateTimePicker
                  value={publishDetails.publish_on}
                  onChange={(date) =>
                    handlePublishDetailsChange("publish_on", date)
                  }
                  format="yyyy-MM-dd HH:mm:ss"
                />
                <span className="mb-1 span_calandar">
                  <FiCalendar />
                </span>
              </div>
            )}
            {errors.publish_on && (
              <p className="text-danger">{errors.publish_on}</p>
            )}
            <div className="select_wrapper mb-3 border-bottom pb-3">
              <label htmlFor="">Category:</label>
              <select
                value={publishDetails.category}
                onChange={(e) =>
                  handlePublishDetailsChange("category", e.target.value)
                }
              >
                <option value="" disabled selected>
                  Choose Category
                </option>
                {categoryOptions.map(({ label, value }, index) => (
                  <option key={index} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="text-danger">{errors.category}</p>
            )}

            {/* <div className="select_wrapper my-3">
              <b>
                Restrict notifications to users who have registered the
                following products
              </b>
            </div>
            <div className="search_btn_add mb-3 border-bottom pb-3">
              <Form inline>
                <FormControl
                  type="text"
                  placeholder="Search"
                  className="mr-sm-2"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <CustomButton variant="primary" onClick={handleAddClick}>
                  Add
                </CustomButton>
              </Form>
            </div>
            <div className="span_styles">
              <span>Product Name</span>
              <span>LOT Number</span>
            </div>
            <div className="span_styles pt-1 border-bottom pb-3">
              <span>LOT Number</span>
              <span>A Diffrent Product</span>
            </div> */}
            <div className="btn_groups mt-2">
              <CustomButton
                // variant="danger"
                onClick={onCancelHandler}
                className="btn-dark"
              >
                Cancel
              </CustomButton>{" "}
              <CustomButton
                onClick={location.state ? onUpdateHandler : handleSave}
              >
                {location.state ? "Update" : "Save"} Changes
              </CustomButton>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default EditNotification;
