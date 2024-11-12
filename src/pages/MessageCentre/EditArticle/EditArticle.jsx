import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CmsEditor from "../../../components/Common/CmsEditor/CmsEditor";
import "./EditArticle.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import CustomButton from "../../../components/Common/Button/Button";
import DateTimePicker from "../../../components/Common/DatePicker/DatePicker";
import {
  RegisterEditArticle,
  getMessageDetails,
  updateMsgArticle,
} from "../../../redux/slice/MessageCentreSlice";
import { FiCalendar } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { roles } from "../../../utils/helperFunction";

function EditArticle() {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.MESSAGECENTRE);
  const navigate = useNavigate();
  const { access_token, role } = useSelector((state) => state.AUTH);
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  console.log(role, "role");
  const {
    superAdmin,
    admin,
    approver,
    user,
    salesUser,
    distributior,
    distributor_user,
  } = roles;

  const [articleData, setArticleData] = useState({
    title: "",
    sub_title: "",
    content: "",
    featured_image: null,
  });

  const [publishDetails, setPublishDetails] = useState({
    status: "",
    revision: 0,
    publish_on: new Date(),
    category: "",
    feature_article: "",
    send_notification: "",
  });

  const [errors, setErrors] = useState({});

  const location = useLocation();

  useEffect(() => {
    console.log(location, "location");
    if (location.state) {
      const data = {
        id: location.state.article_id,
        type: location.state.type,
      };
      dispatch(getMessageDetails(data)).then(({ payload }) => {
        if (payload.status === 200) {
          const { data } = payload;
          setArticleData((prev) => {
            return {
              ...prev,
              title: data?.title ?? "",
              sub_title: data?.sub_title ?? "",
              content: data?.content ?? "",
              featured_image: null,
            };
          });
          setPublishDetails((prev) => {
            return {
              ...prev,
              status: data?.status ?? "",
              revision: data?.revision ?? "",
              publish_on: data?.publish_on ?? "",
              category: data?.category ?? "",
              feature_article: data?.feature_article ?? "",
              send_notification: data?.send_notification ?? "",
            };
          });
          setImage(data?.featured_image ?? null);
        }
      });
    }
  }, [location]);

  const handleSave = () => {
    const validationErrors = {};
    if (!articleData.title.trim()) {
      validationErrors.title = "*Title is required";
    }
    if (!articleData.sub_title.trim()) {
      validationErrors.sub_title = "*Subtitle is required";
    }
    if (!articleData.content.trim()) {
      validationErrors.content = "*Content is required";
    }
    if (!publishDetails.status) {
      validationErrors.status = "*Status is required";
    }
    if (!publishDetails.publish_on) {
      validationErrors.publish_on = "*Publish date is required";
    }
    if (!publishDetails.category) {
      validationErrors.category = "*Category is required";
    }
    if (!publishDetails.feature_article) {
      validationErrors.feature_article = "*Feature article is required";
    }
    if (!publishDetails.send_notification) {
      validationErrors.send_notification =
        "*Notification permission is required";
    }
    if (publishDetails.feature_article === "Yes" && !selectedImage) {
      validationErrors.featured_image = "*Featured Image is required";
    }

    console.log(validationErrors, "validationErrors");

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const data = {
      ...articleData,
      featured_image: selectedImage,
      ...publishDetails,
    };
    console.log(data, "data");

    dispatch(RegisterEditArticle(data))
      .then((response) => {
        console.log("Response:", response);

        if (response.payload && response.payload.status === 200) {
          console.log(
            "Article updated successfully:",
            response.payload.data.message
          );
          console.log("Article ID:", response.payload.data.article_id);
          navigate("/messaging");
        } else {
          console.error(
            "Failed to update article:",
            response.payload.data.message
          );
        }
      })
      .catch((error) => {
        console.error("Error updating article:", error);
      });
  };

  const onCancelHandler = () => {navigate(-1)};

  const handleChange = (newContent) => {
    setArticleData((prevData) => ({
      ...prevData,
      content: newContent,
    }));

    if (newContent.trim() && errors.content) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        content: "",
      }));
    }
  };

  const handlePublishDetailsChange = (fieldName, value, format) => {
    const formattedValue = format ? formatDate(value, format) : value;

    setPublishDetails((prevDetails) => ({
      ...prevDetails,
      [fieldName]: formattedValue,
    }));
  };

  const formatDate = (date, format) => {
    return new Intl.DateTimeFormat("en-US", format).format(date);
  };

  const handleTitleChange = (e) => {
    const { value } = e.target;
    setArticleData((prevData) => ({
      ...prevData,
      title: value,
    }));

    if (value.trim() && errors.title) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: "",
      }));
    }
  };

  const handleSubTitleChange = (e) => {
    const { value } = e.target;
    setArticleData((prevData) => ({
      ...prevData,
      sub_title: value,
    }));

    if (value.trim() && errors.sub_title) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sub_title: "",
      }));
    }
  };
  // const handlefeatured_imageChange = (event) => {
  //   const file = event.target.files[0]; // Get the selected file

  //   // Check if file is selected
  //   if (file) {
  //     // Update the state with the selected image file
  //     setSelectedImage(file);

  //     // Clear any previous error message
  //     setErrors({});
  //   } else {
  //     // Handle case where no file is selected
  //     setErrors({ featured_image: "No image selected" });
  //   }
  // };
  const handlefeatured_imageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setErrors((prevErrors) => ({ ...prevErrors, featured_image: "" }));
    } else {
      setErrors({ featured_image: "No image selected" });
    }
  };
  
  const onUpdateHandler = () => {
    const formData = new FormData();
    
    formData.append('title', articleData.title);
    formData.append('sub_title', articleData.sub_title);
    formData.append('content', articleData.content);
    formData.append('status', publishDetails.status);
    formData.append('publish_on', publishDetails.publish_on);
    formData.append('category', publishDetails.category);
    formData.append('feature_article', publishDetails.feature_article);
    formData.append('send_notification', publishDetails.send_notification);
    formData.append('id', location.state.article_id);
    
    // Append the selected image if it's present
    if (selectedImage) {
      formData.append('featured_image', selectedImage);
    }
  
    dispatch(updateMsgArticle(formData)).then(({ payload }) => {
      if (payload.status === 200) {
        navigate(-1);
      }
    });
  };
  
  // const onUpdateHandler = () => {
  //   console.log("on Update artical handler work");
  //   const data = {
  //     title: articleData.title,
  //     sub_title: articleData.sub_title,
  //     content: articleData.content,
  //     status: publishDetails.status,
  //     publish_on: publishDetails.publish_on,
  //     category: publishDetails.category,
  //     feature_article: publishDetails.feature_article,
  //     send_notification: publishDetails.send_notification,
  //     id: location.state.article_id,
  //     featured_image: selectedImage,
  //   };
  //   dispatch(updateMsgArticle(data)).then(({ payload }) => {
  //     if (payload.status === 200) {
  //       navigate(-1);
  //     }
  //   });
  // };
  return (
    <div>
      <Row className="edit_article_row">
        <Col lg={8}>
          <div className="card p-3 border-0">
            <h3 className="listing">
              {location?.state ? "Edit" : "Create"} Article
            </h3>
            <input
              type="text"
              placeholder="Title"
              className="title_article"
              value={articleData.title}
              onChange={handleTitleChange}
            />
            {errors.title && <p className="text-danger">{errors.title}</p>}
            <input
              type="text"
              placeholder="Subtitle"
              className="title_article"
              value={articleData.sub_title}
              onChange={handleSubTitleChange}
            />
            {errors.sub_title && (
              <p className="text-danger">{errors.sub_title}</p>
            )}
            {/* Featured Image Uploader */}
            <div className="my-4">
              <label htmlFor="featured_image">Featured Image:</label>
              <input
                type="file"
                id="featured_image"
                accept="image/*"
                onChange={handlefeatured_imageChange}
              />
              {selectedImage && (
                <div>
                  <p>Selected Image:</p>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    style={{ maxWidth: "30%", maxHeight: "200px" }}
                  />
                </div>
              )}
              {image && !selectedImage && (
                <div>
                  <p>Selected Image:</p>
                  <img
                    src={image}
                    alt="Selected"
                    style={{ maxWidth: "30%", maxHeight: "200px" }}
                  />
                </div>
              )}
              {errors.featured_image && (
                <p className="text-danger">{errors.featured_image}</p>
              )}
            </div>
            <div className="text-editor">
              <CmsEditor
                content={articleData.content}
                handleChange={handleChange}
                handleSave={handleSave}
                onCancelHandler={onCancelHandler}
              />
              {errors.content && (
                <p className="text-danger">{errors.content}</p>
              )}
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="card p-3 border-0">
            <h3 className="listing border-bottom">Publish Details</h3>
            <div className="select_wrapper mb-3 mt-2">
              <label>Status:</label>
              <select
                value={publishDetails.status}
                onChange={(e) =>
                  handlePublishDetailsChange("status", e.target.value)
                }
                style={{ opacity: "0.6" }}
              >
                <option value="" disabled selected>
                  Choose Status
                </option>
                <option>Draft</option>
                {role !== superAdmin && <option>Sent for Approval</option>}
                <option>Approved</option>
                <option>Scheduled</option>
              </select>
            </div>
            {errors.status && <p className="text-danger">{errors.status}</p>}
            <div className="revision mb-3">
              <p>Revisions: {publishDetails.revision}</p>
            </div>
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
                style={{ opacity: "0.6" }}
              >
                <option value="" disabled selected>
                  Choose Category
                </option>
                <option>How To Video</option>
                <option>Product Update</option>
                <option>Legislation and Compliance</option>
                <option>News Update</option>
                <option>Product Launches</option>
                <option>Training</option>
                <option>user Defined</option>
              </select>
            </div>
            {errors.category && (
              <p className="text-danger">{errors.category}</p>
            )}
            <div className="select_wrapper mb-3">
              <label htmlFor="">Feature Article:</label>
              <select
                value={publishDetails.feature_article}
                onChange={(e) =>
                  handlePublishDetailsChange("feature_article", e.target.value)
                }
                style={{ opacity: "0.6" }}
              >
                <option value="" disabled selected>
                  Choose Article{" "}
                </option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            {errors.feature_article && (
              <p className="text-danger">{errors.feature_article}</p>
            )}
            <div className="select_wrapper mb-3 border-bottom pb-3">
              <label htmlFor="">Send Notification:</label>
              <select
                value={publishDetails.send_notification}
                onChange={(e) =>
                  handlePublishDetailsChange(
                    "send_notification",
                    e.target.value
                  )
                }
                style={{ opacity: "0.6" }}
              >
                <option value="" disabled selected>
                  Choose Notification{" "}
                </option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            {errors.send_notification && (
              <p className="text-danger">{errors.send_notification}</p>
            )}

            <div className="btn_groups">
              <CustomButton onClick={onCancelHandler} className="btn-dark">
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

export default EditArticle;