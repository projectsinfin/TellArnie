import React, { useState } from "react";
import "./index.css";
import { Button } from "react-bootstrap";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import QuantityCard from "../common/quantityCard";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDateWithMonth } from "../../../../utils/helperFunction";
import { quickincidentdata } from "../../../../redux/slice/QuickReportSlice";
import { StatusCode } from "../../../../services/helper";
import ButtonLoader from "../../../../components/Common/ButtonLoader";


const OnlineQuickPageThree = () => {
  const { form_Data, quickAddItemFormData, status, quichReportData } =
    useSelector((state) => state.QUICKREPORT);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantityArray, setQuantityArray] = useState(
    quickAddItemFormData.formDataArray
  );
  const postApiData = (e) => {
    e.preventDefault();
    const newData = quickAddItemFormData?.formDataArray.map(
      ({ item, quantity, personOfTreatment }) => ({
        full_name: form_Data.firstName.value + form_Data.lastName.value,
        used_quantity: Number(quantity.value),
        title: personOfTreatment.value,
        product_id: quickAddItemFormData?.productId,
      })

  
    );
    const payload = {
      first_name: form_Data.firstName.value,
      last_name: form_Data.lastName.value,
      country_code: form_Data.phoneNumberCode.value,
      contact_number: form_Data.phoneNumber.value,
      email: form_Data.email.value,
      category_of_incident: form_Data.category.value,
      classification: form_Data.classification.value,
      incident_date: form_Data.date.value,
      incident_time: form_Data.time.value,
      description: form_Data.summary.value,
      item_used: newData,
      kit_id: quichReportData?.kit_data?._id,
      company_id: quichReportData?.kit_data?.company_id,
    };
    dispatch(quickincidentdata(payload));
    navigate("/success-incident-page");

  };
  return (
    <div className="quickthreepage open-sans-font">
      <h5
        className="quickheading mb-3  text-center"
        style={{ fontSize: "18px", fontWeight: "700" }}
      >
        Summary of Incident Report
      </h5>
      <div className="summaryinfocontainer mt-5">
        <div className="incidentmadeinfo">
          <h5
            className="fw-bold open-sans-font "
            style={{ fontSize: "14px", fontWeight: "700" }}
          >
            Incident Report is made by
          </h5>
          <hr />
          <div className="d-flex">
            <h5 className="me-2">Name:</h5>{" "}
            <span className="text-capitalize fw-bold me-2">
              {form_Data.firstName.value}{" "}
            </span>
            <span> {form_Data.lastName.value}</span>
          </div>
          <div className="d-flex">
            <h5 className="me-2">Contact Number: </h5>{" "}
            <span>
              {form_Data.phoneNumberCode.value} {form_Data.phoneNumber.value}
            </span>
          </div>
          <div className="d-flex">
            <h5 className="me-2">Email: </h5>{" "}
            <span> {form_Data.email.value} </span>
          </div>
        </div>

        <div className="incidentmadeinfo mt-4">
          <h5
            className="fw-bold"
            style={{ fontSize: "14px", fontWeight: "700" }}
          >
            Type of Incident
          </h5>
          <hr />
          <div className="d-flex">
            <h5 className="me-2">Category: </h5>{" "}
            <span>{form_Data.category.value}</span>
          </div>
          <div className="d-flex">
            <h5 className="me-2">Classification: </h5>{" "}
            <span> {form_Data?.classification?.value}</span>
          </div>
          <div className="d-flex">
            <h5 className="me-2">Date: </h5>{" "}
            <span> {form_Data.date.value} </span>
          </div>
          <div className="d-flex">
            <h5 className="me-2">Time: </h5>{" "}
            <span> {form_Data.time.value} </span>
          </div>
        </div>

        <div className="incidentmadeinfo mt-4">
          <h5
            className="fw-bold"
            style={{ fontSize: "14px", fontWeight: "700" }}
          >
            Summary of Incident
          </h5>
          <hr />
          <p>{form_Data.summary.value} </p>
        </div>
        <div className="incidentmadeinfo mt-4">
          <h5
            className="fw-bold"
            style={{ fontSize: "14px", fontWeight: "700" }}
          >
            Kit and Location Details{" "}
          </h5>
          <hr />
          <h5 className="d-none quickheading mb-3 letter_spacing fw-bold">
            Reliance Medical A648762821 <br /> Medium Workplace First Aid Kit
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
                <span className="fw-bold">Product Code</span>{" "}
                <span className="value_span">
                  {" "}
                  {quichReportData?.kit_data?.product_code}
                </span>
              </Button>
            </div>
            <div className="col-md-4">
              <Button type="submit" className="customcontinuebutton">
                <span className="fw-bold"> Expiry Date</span>{" "}
                <span className="value_span">
                  {formatDateWithMonth(quichReportData?.kit_data?.expiry_date)}
                </span>
              </Button>
            </div>

            <div className="col-md-4">
              <Button type="submit" className="customcontinuebutton">
                <span className="fw-bold"> Installed Location</span>{" "}
                <span className="value_span">
                  {quichReportData?.kit_data?.location_name
                    ? quichReportData?.kit_data?.location_name
                    : ""}
                </span>
              </Button>
            </div>
            <div className="col-md-4">
              <Button type="submit" className="customcontinuebutton">
                <span className="fw-bold"> Installed Area</span>{" "}
                <span className="value_span">
                  {quichReportData?.kit_data?.area
                    ? quichReportData?.kit_data?.area
                    : ""}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {quantityArray &&
          quantityArray?.map((itemData, index) => (
            <QuantityCard
              itemData={itemData}
              setData={setQuantityArray}
              index={index}
              attr={""}
              DataArr={quantityArray}
            />
          ))}
      </div>
      <div className="mt-2">
        <NavLink to="/quickreportworkplace" className={"nav-link d-inline"}>
          <Button variant="dark" className="fw-bold">
            Cancel
          </Button>
        </NavLink>
        <Button
          type="submit"
          onClick={(e) => postApiData(e)}
          className="button_custom text-black fw-bold ms-2"
        >
          {status === StatusCode.LOADING ? <ButtonLoader /> : "Complete"}
        </Button>
      </div>
    </div>
  );
};

export default OnlineQuickPageThree;
