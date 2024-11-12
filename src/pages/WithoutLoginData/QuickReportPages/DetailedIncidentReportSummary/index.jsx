import React, { useRef, useState } from "react";
import "./index.css";
import { Button, Col, Row } from "react-bootstrap";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import image1 from "../../../../Assets/Logo/Rectangle1.png";
import image2 from "../../../../Assets/Logo/Rectangle2.png";
import image3 from "../../../../Assets/Logo/Rectangle3.png";
import image4 from "../../../../Assets/Logo/Rectangle4.png";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usePic } from "../../../../components/Common/ImageContext";
import { detailedincidentregister } from "../../../../redux/slice/DetailReportSummarySlice";
import { formatDateWithMonth } from "../../../../utils/helperFunction";
import { IoScanSharp } from "react-icons/io5";
import { StatusCode } from "../../../../services/helper";
import ButtonLoader from "../../../../components/Common/ButtonLoader";

const DetailedIncidentReportSummary = () => {
  const {
    detailFromInfoFormData,
    detailReportSummaryFormData,
    detailReportActionData,
    detailReportFilledItem,
    status,
  } = useSelector((state) => state.DetailReport);
  const [usedItemData, setUsedItemData] = useState(
    detailReportFilledItem?.formDataArray
  );

  // console.log(detailFromInfoFormData, "detailFromInfoFormData");
  // console.log(detailReportSummaryFormData, "detailReportSummaryFormData");
  // console.log(detailReportActionData, "detailReportActionData");
  // console.log(detailReportFilledItem, "detailReportFilledItem");

  const { quichReportData } = useSelector((state) => state.QUICKREPORT);

  const dispatch = useDispatch();
  const { theme, setTheme } = usePic();
  const inputref = useRef();

  const reportSubmitHandler = async (e) => {
    e.preventDefault();
    const item_used_data = detailReportFilledItem?.formDataArray.map(
      ({ item, quantity, usedBy }) => ({
        full_name:
          detailFromInfoFormData.firstName.value +
          detailFromInfoFormData.lastName.value,
        quantity: Number(quantity.value),
        title: usedBy?.value,
        product_id: item?.value,
      })
    );

    const insident_person_data = detailReportActionData?.formArr.map(
      ({
        incidentOutcome,
        injuryClassification,
        injuryDetail,
        injuryType,
        otherDetail,
      }) => ({
        full_name:
          detailFromInfoFormData.firstName.value +
          detailFromInfoFormData.lastName.value,
        injury_type: injuryType?.value,
        injury_classification: injuryClassification?.value,
        injury_details: injuryDetail?.value,
        outcome: incidentOutcome?.value,
        more_details: otherDetail?.value,
      })
    );

    // const insident_person = [
    //   {
    //     user_id: "65e062f2ee657dd69d0cedf2",
    //     full_name: "max richard",
    //     injury_type: "Burns",
    //     injury_classification:
    //       "Moderate: Second-degree burns that cover about 10% of the body",
    //     injury_details: "Sustained injury while trying to put out a cigareet",
    //     outcome: "Was taken to the hospital",
    //     more_details: "more details",
    //   },
    //   {
    //     user_id: "65e076e33e89cd4490402c97",
    //     full_name: "Vikram sood",
    //     injury_type: "Burns",
    //     injury_classification:
    //       "Moderate: Second-degree burns that cover about 10% of the body",
    //     injury_details: "Sustained injury while trying to put out a cigareet",
    //     outcome: "Was taken to the hospital",
    //     more_details: "test",
    //   },
    // ];
    const payload = {
      item_used: item_used_data,
      incident_date: detailReportSummaryFormData?.date?.value,
      incident_time: detailReportSummaryFormData?.time?.value,
      category_of_incident: detailReportSummaryFormData?.category?.value,
      classification: detailReportSummaryFormData?.classification?.value,
      description: detailReportSummaryFormData?.summary?.value,
      incident_person: insident_person_data,
      location_of_incident:
        detailReportSummaryFormData?.locationOfIncident?.value,
      area_of_incident: detailReportSummaryFormData?.areaOfIncident?.value,
      incident_picture: theme,
      more_details: detailReportActionData?.formArr[0].otherDetail.value,
      injury_details: detailReportActionData?.formArr[0].injuryDetail.value,
      kit_id: quichReportData?.kit_data?._id,
      company_id: quichReportData?.kit_data?.company_id,
    };

    console.log(payload, "payloaddataget");
    await dispatch(detailedincidentregister(payload));
    // toast.success("Detail incident report created successfully");
  };

  return (
    <div className="detailedincidentreportsummary open-sans-font">
      <h5
        className="quickheading mb-3 fw-bold text-center"
        style={{ fontSize: "18px" }}
      >
        Summary of Incident Report
      </h5>

      <div className="summaryinfocontainer mt-5">
        <div className="incidentmadeinfo">
          <h5 className="fw-bold" style={{ fontSize: "14px" }}>
            Incident Report is made by
          </h5>
          <hr />
          <div className="d-flex">
            <h5 className="me-2">Name: </h5>{" "}
            <span>
              {detailFromInfoFormData?.firstName?.value}
              {detailFromInfoFormData?.lastName?.value}
            </span>
          </div>
          <div className="d-flex">
            <h5 className="me-2">Contact Number: </h5>{" "}
            <span>
              {" "}
              {detailFromInfoFormData?.phoneNumberCode?.value}
              {detailFromInfoFormData?.phoneNumber?.value}{" "}
            </span>
          </div>
          <div className="d-flex">
            <h5 className="me-2">Email: </h5>{" "}
            <span> {detailFromInfoFormData?.email?.value} </span>
          </div>
        </div>

        <div className="incidentmadeinfo mt-4">
          <h5 className="fw-bold" style={{ fontSize: "14px" }}>
            Type of Incident
          </h5>
          <hr />
          <div className="d-flex">
            <h5 className="me-2">Category: </h5>{" "}
            <span>{detailReportSummaryFormData?.category?.value}</span>
          </div>
          <div className="d-flex">
            <h5 className="me-2">Classification: </h5>{" "}
            <span> {detailReportSummaryFormData?.classification?.value} </span>
          </div>
          <div className="d-flex">
            <h5 className="me-2">Date: </h5>{" "}
            <span> {detailReportSummaryFormData?.date?.value} </span>
          </div>
          <div className="d-flex">
            <h5 className="me-2">Time: </h5>{" "}
            <span> {detailReportSummaryFormData?.time?.value} </span>
          </div>
        </div>

        <div className="incidentmadeinfo mt-4">
          <h5 className="fw-bold" style={{ fontSize: "14px" }}>
            Summary of Incident
          </h5>
          <hr />
          <p>{detailReportSummaryFormData?.summary?.value}</p>
        </div>

        <div className="incidentmadeinfo mt-4">
          <h5 className="fw-bold" style={{ fontSize: "14px" }}>
            Photos of Incident
          </h5>
          <hr />
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
                  <IoScanSharp size={39} className="text-white" />
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
                  className="button_custom w-100 p-2 mb-3 fw-bold"
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
          </Row>{" "}
        </div>

        <div className="incidentmadeinfo mt-5">
          <h5 className="fw-bold" style={{ fontSize: "14px" }}>
            Kit and Location Details{" "}
          </h5>
          <hr />
          <h5 className="quickheading mb-3 letter_spacing fw-bold">
            <span> {quichReportData?.kit_data?.brand}</span>
            <span className="ms-2">
              {quichReportData?.kit_data?.model_number}
            </span>
            <div> {quichReportData?.kit_data?.product_name}</div>{" "}
          </h5>
          <div className="row btns_row">
            <div className="col-md-4">
              <Button type="submit" className="customcontinuebutton">
                <span className="fw-bold"> LOT Number</span>{" "}
                <span className="value_span">
                  {quichReportData?.kit_data?.lot_number}
                </span>
              </Button>
            </div>
            <div className="col-md-4">
              <Button type="submit" className="customcontinuebutton">
                <span className="fw-bold"> Batch Number</span>{" "}
                <span className="value_span">
                  {quichReportData?.kit_data?.batch_number}
                </span>
              </Button>
            </div>
            <div className="col-md-4">
              <Button type="submit" className="customcontinuebutton">
                <span className="fw-bold"> Expiry Date</span>{" "}
                <span className="value_span">
                  {quichReportData?.kit_data?.expiry_date &&
                    formatDateWithMonth(
                      quichReportData?.kit_data?.expiry_date
                    )}{" "}
                </span>
              </Button>
            </div>
            <div className="col-md-4">
              <Button type="submit" className="customcontinuebutton">
                <span className="fw-bold"> Installed Location</span>{" "}
                <span className="value_span">
                  {quichReportData?.kit_data?.location_name &&
                    quichReportData?.kit_data?.location_name}
                </span>
              </Button>
            </div>
            <div className="col-md-4">
              <Button type="submit" className="customcontinuebutton">
                <span className="fw-bold"> Installed Area</span>{" "}
                <span className="value_span">
                  {quichReportData?.kit_data?.area &&
                    quichReportData?.kit_data?.area}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {usedItemData?.map((itemData, index) => (
          <div className="incidentmadeinfo mt-4">
            <h5 className="fw-bold" style={{ fontSize: "14px" }}>
              Equipments Items used in Incident
            </h5>
            <hr />
            <div className="equipment_incident">
              <span className="fw-bold">Used Items</span>
              <span className="fw-bold">Quantity</span>
            </div>
            <div className="mt-3 d-flex justify-content-between p-2 align-items-center">
              <div>
                <h6>{itemData?.item?.value}</h6>{" "}
                <h6> {itemData?.usedBy?.value}</h6>
              </div>
              <div>
                <span>
                  <CiCircleMinus
                    size={36}
                    onClick={() => {
                      let data = [...usedItemData];
                      // if (Number(data[index]?.quantity?.value) <= 1) {
                      //   return toast.error("Quantity not less than one");
                      // }
                      data.splice(index, 1, {
                        ...data[index],
                        quantity: {
                          ...data[index].quantity,
                          value: Number(data[index]?.quantity?.value) - 1,
                        },
                      });
                      setUsedItemData([...data]);
                    }}
                  />
                </span>
                <span className="ms-2 me-2">{itemData?.quantity?.value}</span>
                <span>
                  <CiCirclePlus
                    size={36}
                    onClick={() => {
                      let data = [...usedItemData];
                      // if (Number(data[index]?.quantity?.value) <= 1) {
                      //   return toast.error("Quantity not less than one");
                      // }
                      data.splice(index, 1, {
                        ...data[index],
                        quantity: {
                          ...data[index].quantity,
                          value: Number(data[index]?.quantity?.value) + 1,
                        },
                      });
                      setUsedItemData([...data]);
                    }}
                  />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <NavLink className="nav-link d-inline" to="/detailedreporforfilleditem">
          <Button variant="dark" className="fw-bold">
            Cancel
          </Button>
        </NavLink>
        <Button
          type="submit"
          onClick={(e) => reportSubmitHandler(e)}
          className="button_custom text-black fw-bold ms-2"
        >
          {status === StatusCode.LOADING ? <ButtonLoader /> : "Complete"}
        </Button>
      </div>
    </div>
  );
};

export default DetailedIncidentReportSummary;
