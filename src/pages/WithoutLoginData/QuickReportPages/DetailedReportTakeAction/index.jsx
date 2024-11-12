import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./index.css";
import { CiCircleMinus } from "react-icons/ci";
import { Col, Row } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setdetailReportActionData } from "../../../../redux/slice/DetailReportSummarySlice";
const DetailedReportTakeAction = () => {
  const [category_classficationdata, setCategory_classficationdata] = useState({
    category: [],
    classfication: [],
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { detailReportActionData } = useSelector((state) => state.DetailReport);
  const { category_classfication_data } = useSelector(
    (state) => state.QUICKREPORT
  );

  console.log(category_classfication_data, "take action");
  // main state
  const [formData, setFormData] = useState(detailReportActionData);
  // form data onchanege function
  const onChange = (event) => {
    const { name, value } = event.target;
    if (name === "injuryClassification") {
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

  // validateform
  const validateForm = (event) => {
    event.preventDefault();
    let data = { ...formData };
    data = {
      ...data,
      personOfTreatment: {
        ...data.personOfTreatment,
        warning: !data.personOfTreatment.value,
      },
      injuryClassification: {
        ...data.injuryClassification,
        warning: !data.injuryClassification.value,
      },
      injuryType: { ...data.injuryType, warning: !data.injuryType.value },
    };
    setFormData({ ...data });
    if (
      !data.personOfTreatment.warning &&
      !data.injuryClassification.warning &&
      !data.injuryType.warning
    ) {
      let dataArr = [...formData.formArr];
      dataArr.push(data);

      setFormData((prev) => ({
        ...prev,
        formArr: dataArr,
        personOfTreatment: { value: "", warning: false },
        injuryClassification: { value: "", warning: false },
        injuryType: { value: "", warning: false },
        injuryDetail: { value: "", warning: false },
        incidentOutcome: { value: "", warning: false },
        otherDetail: { value: "", warning: false },
      }));
    }
  };

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
    <div className="detailedreporttakeAction open-sans-font">
      <div className="form_container">
        <Form>
          <div className="providesummaryincident mt-3">
            <h5
              className="quickheading mb-3  fw-bold"
              style={{ fontSize: "14px" }}
            >
              Who was injured and action take
            </h5>

            <div className="innerformdata">
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicItem">
                    <Form.Control
                      as="textarea"
                      placeholder="Preson of treatment"
                      style={{ height: "150px" }}
                      value={formData.personOfTreatment.value}
                      name={"personOfTreatment"}
                      onChange={onChange}
                    />{" "}
                    {formData.personOfTreatment.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter the text
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
                      value={formData.injuryClassification.value}
                      name={"injuryClassification"}
                      onChange={onChange}
                    >
                      <option>Injury Classification</option>
                      {category_classficationdata?.category?.map(
                        (categoryItem) => (
                          <option value={categoryItem}>{categoryItem}</option>
                        )
                      )}
                    </Form.Select>
                    {formData.injuryClassification.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter the Classification
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
                      value={formData.injuryType.value}
                      name={"injuryType"}
                      onChange={onChange}
                    >
                      <option>Injury type</option>
                      {category_classficationdata?.classfication?.map(
                        (descriptionItem) => (
                          <option value={descriptionItem}>
                            {descriptionItem}
                          </option>
                        )
                      )}
                    </Form.Select>
                    {formData.injuryType.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter the Injury type
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
                      placeholder="Injury detail"
                      value={formData.injuryDetail.value}
                      name={"injuryDetail"}
                      onChange={onChange}
                    />
                    {formData.injuryDetail.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter the injuryDetail
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
                      value={formData.incidentOutcome.value}
                      name={"incidentOutcome"}
                      onChange={onChange}
                      placeholder="Incident Outcome"
                    />

                    {formData.incidentOutcome.warning ? (
                      <span className="text-danger form_input_validation_error">
                        Enter the incidentOutcome
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
                      placeholder="If Other, provide details"
                      value={formData.otherDetail.value}
                      name={"otherDetail"}
                      onChange={onChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="dark"
                    className="w-100 p-3 fw-bold letter_spacing"
                    onClick={validateForm}
                  >
                    Add Person
                  </Button>
                </Col>
              </Row>
              {formData?.formArr?.length > 0 &&
                formData?.formArr?.map((fromArrItem, index) => (
                  <div className="mt-3">
                    {index === 0 ? (
                      <h6>Persons involved in incident </h6>
                    ) : null}
                    <div className="incidenttabledata">
                      {index === 0 ? (
                        <div
                          className="incidenthead d-flex justify-content-between p-2"
                          style={{ backgroundColor: "#047835" }}
                        >
                          <h6
                            className="text-white mb-0"
                            style={{ width: "30%" }}
                          >
                            Full Name
                          </h6>
                          <h6
                            className="text-white mb-0"
                            style={{ width: "70%" }}
                          >
                            Injury Type
                          </h6>
                          <span></span>
                        </div>
                      ) : null}
                      <div className="d-flex justify-content-between table_person mt-2">
                        <span className="ms-1" style={{ width: "30%" }}>
                          {fromArrItem?.personOfTreatment?.value}
                        </span>
                        <span style={{ width: "50%" }}>
                          {fromArrItem?.injuryType?.value}
                        </span>
                        <span style={{ width: "20%" }}>
                          <CiCircleMinus
                            onClick={() => {
                              let data = [...formData?.formArr];
                              data.splice(index, 1);
                              setFormData((prev) => ({
                                ...prev,
                                formArr: data,
                              }));
                            }}
                            size={36}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="mt-5">
            <NavLink to="/detailedreportsummary" className="nav-link d-inline">
              <Button variant="dark" type="submit">
                Cancel
              </Button>
            </NavLink>
            <Button
              variant="primary"
              type="submit"
              className="customcontinueonebutton ms-2"
              disabled={formData.formArr.length === 0 ? true : false}
              onClick={() => {
                dispatch(setdetailReportActionData(formData));
                navigate("/detailedreporforfilleditem");
              }}
            >
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default DetailedReportTakeAction;
