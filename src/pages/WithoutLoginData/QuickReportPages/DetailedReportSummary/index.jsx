import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./index.css";
import { Col, Row } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { IoScanSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setdetailReportSummaryFormData } from "../../../../redux/slice/DetailReportSummarySlice";
import { fetchCategory_classfication_data } from "../../../../redux/slice/QuickReportSlice";
import { usePic } from "../../../../components/Common/ImageContext";
const DetailedReportSummary = () => {
  const { theme, setTheme } = usePic();
  const inputref = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [category_classficationdata, setCategory_classficationdata] = useState({
    category: [],
    classfication: [],
  });
  const { detailReportSummaryFormData } = useSelector(
    (state) => state.DetailReport
  );
  const { category_classfication_data } = useSelector(
    (state) => state.QUICKREPORT
  );

  //main state of form
  const [formData, setFormData] = useState(detailReportSummaryFormData);
  //onchange function
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

  // validate form dataa
  const validateForm = () => {
    let data = { ...formData };
    data = {
      ...data,
      category: {
        ...data.category,
        warning:
          !data.category.value ||
          data.category.value === "Category of Incident",
      },
      classification: {
        ...data.classification,
        warning:
          !data.classification.value ||
          data.classification.value === "Classification",
      },
      date: { ...data.date, warning: !data.date.value },
      time: { ...data.time, warning: !data.time.value },
      areaOfIncident: {
        ...data.areaOfIncident,
        warning: !data.areaOfIncident.value,
      },
      locationOfIncident: {
        ...data.locationOfIncident,
        warning: !data.locationOfIncident.value,
      },
    };
    setFormData({ ...data });
    if (
      !data.category.warning &&
      !data.classification.warning &&
      !data.time.warning &&
      !data.date.warning &&
      !data.areaOfIncident.warning &&
      !data.locationOfIncident.warning
    ) {
      dispatch(setdetailReportSummaryFormData(formData));
      navigate("/detailedreportaction");
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
        category_classfication_data?.data?.Incidents[0]?.description.map(
          (element) => {
            return element;
          }
        ),
    };
    setCategory_classficationdata(data);
  }, [category_classfication_data?.data?.Incidents]);
  return (
    <div className="detailedReportSummary open-sans-font">
      <div className="form_container">
        <Form>
          <div className="providesummaryincident mt-3">
            <h5
              className="quickheading mb-3 fw-bold"
              style={{ fontSize: "14px", fontWeight: "700" }}
            >
              Please Provide a summary of indecent
            </h5>

            <div className="innerformdata">
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Select
                      aria-label="Default select example"
                      className="customselectbox"
                      value={formData.category.value}
                      name={"category"}
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
                      aria-label="Default select example"
                      className="customselectbox"
                      value={formData.classification.value}
                      name={"classification"}
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
                      type="text"
                      value={formData.locationOfIncident.value}
                      name="locationOfIncident"
                      onChange={onChange}
                      placeholder="Location"
                    />

                    {formData.locationOfIncident.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter locationOfIncident
                      </span>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="text"
                      value={formData.areaOfIncident.value}
                      name="areaOfIncident"
                      onChange={onChange}
                      placeholder="Area"
                    />

                    {formData.areaOfIncident.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter areaOfIncident
                      </span>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="date"
                      value={formData.date.value}
                      name="date"
                      onChange={onChange}
                    />
                    {formData.date.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter date
                      </span>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="time"
                      value={formData.time.value}
                      name="time"
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
                  <div className="position-relative">
                    <span
                      className="scannericon"
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        backgroundColor: "black",
                        color: "white",
                      }}
                    >
                      <IoScanSharp size={37} className="text-white" />
                    </span>
                    <input
                      type="file"
                      className="d-none"
                      ref={inputref}
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        setTheme([...theme, ...files]);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => inputref.current.click()}
                      className="customcontinueonebutton w-100 btn mb-3 fw-bold"
                    >
                      Add Photos
                    </button>
                  </div>
                  <div className="imageuploading">
                    <Row>
                      {theme.length > 0 &&
                        theme.map((selectItem, index) => (
                          <Col md={3} key={index}>
                            <div className="">
                              <img
                                style={{
                                  backgroundColor: "#D4D4D4",
                                  display: "inline-block",
                                  height: "150px",
                                  width: "100%",
                                }}
                                src={URL.createObjectURL(selectItem)}
                              />
                              <button
                                className="btn text-danger text-center w-100"
                                onClick={() => {
                                  let data = [...theme];
                                  data.splice(index, 1);
                                  setTheme([...data]);
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </Col>
                        ))}
                    </Row>
                  </div>
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
                      name="summary"
                      onChange={onChange}
                    />{" "}
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>
          <NavLink to="/detailedreportinfo" className="nav-link d-inline">
            <Button variant="dark" type="button">
              Cancel
            </Button>
          </NavLink>
          <Button
            variant="primary"
            type="button"
            className="customcontinueonebutton ms-2"
            onClick={validateForm}
          >
            Continue
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default DetailedReportSummary;
