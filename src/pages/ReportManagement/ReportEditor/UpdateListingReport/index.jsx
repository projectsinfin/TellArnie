import React, { useEffect, useState } from "react";
// import "./index.css";
import { Col, Form, Row } from "react-bootstrap";
import { MdLocationDisabled } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { PiUsersFill } from "react-icons/pi";
import { FaMedkit } from "react-icons/fa";
import { FaBan, FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { IoIosCloseCircleOutline } from "react-icons/io";

import { FaArrowUp } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa6";
import { createNewReport } from "../../../../redux/slice/CreateReportSlice";
import { fetchReportsData } from "../../../../redux/slice/AddtoReportSlice";
import CardWithLineChart from "../../../../components/CardWithLineChart";
import CardWithMap from "../../../../components/CardWithMap";
import ReactApexChart from "react-apexcharts";
import HorizontalMonthSlider from "../../../../components/Common/Carousel/Carousel";
import ButtonLoader from "../../../../components/Common/ButtonLoader";
import ValidationSchema from "../../../../components/Common/ValidationScema";
import CardWithBarChart from "../../../../components/CardWithBarChart";
import { StatusCode } from "../../../../services/helper";
import CardWithChartComp from "../../../../components/CardWithChart";
import {
  fetchReportListDataById,
  updateReportListDetails,
} from "../../../../redux/slice/ReportsSlice";
import moment from "moment/moment";
import { dateFormmater } from "../../../../utils/helperFunction";
const UpdateReportEditor = () => {
  const initialValues = {
    report_name: "",
    // group_member: null,
    start_on: "",
    frequency_units: "",
    how_often: "",
    send_to_group: [],
    send_to_user: [],
  };
  const { id } = useParams();

  const { status, AddReportData } = useSelector((state) => state.REPORTSDATA);
  // const { AddReportData } = useSelector((state) => state.REPORTSLISTING);
  const [search, setSearch] = useState("");
  const [finalname, setFinalName] = useState({});
  const [nameData, setNameData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [managebutton, setManageButton] = useState();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { DashboardListingData } = useSelector(
    (state) => state.DASHBOARDLISTING
  );
  const [radial, setRadial] = useState({
    series: [],
    options: {
      chart: {
        height: 350,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 15,
            size: "70%",
          },
          startAngle: -90,
          endAngle: 90,
          dataLabels: {
            name: {
              show: true,
              color: "",
            },
            value: {
              show: true,
              color: "#333",
              fontSize: "30px",
              fontWeight: "bold",
            },
          },
        },
      },
      labels: [],
      stroke: {
        lineCap: "round",
      },
    },
  });
  const [months, setMonths] = useState([
    {
      id: 1,
      month: "Jan",
      value: 0,
      percentageChange: 0,
    },
    {
      id: 2,
      month: "Feb",
      value: 0,
      percentageChange: 0,
    },
    {
      id: 3,
      month: "Mar",
      value: 0,
      percentageChange: 0,
    },
    {
      id: 4,
      month: "Apr",
      value: 100,
      percentageChange: 0,
    },
    {
      id: 5,
      month: "May",
      value: 0,
      percentageChange: 0,
    },
    {
      id: 6,
      month: "Jun",
      value: 0,
      percentageChange: 0,
    },
    {
      id: 7,
      month: "July",
      value: 0,
      percentageChange: 0,
    },
    {
      id: 8,
      month: "Aug",
      value: 0,
      percentageChange: 0,
    },
    {
      id: 9,
      month: "Sep",
      value: 0,
      percentageChange: 0,
    },
    {
      id: 10,
      month: "Oct",
      value: 0,
      percentageChange: 0,
    },
    {
      id: 11,
      month: "Nov",
      value: 0,
      percentageChange: 0,
    },
    {
      id: 12,
      month: "Dec",
      value: 0,
      percentageChange: 0,
    },
  ]);

  const {
    values,
    handleBlur,
    handleChange,
    setValues,
    errors,
    touched,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: ValidationSchema.createnewreport,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Submitting form with values:", values);
      try {
        const res = await dispatch(
          updateReportListDetails({ ...values, id: id })
        );
        console.log("API response:", res);
        if (res.payload?.status === 200) {
          console.log("Report created successfully");
          navigate("/reports");
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here (e.g., display error messages to the user)
      } finally {
        setSubmitting(false); // Reset the submitting state
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchReportListDataById(id));
        const reportData = response.payload.data;
        console.log(reportData, "reportData");
        if (
          reportData &&
          reportData.report_name &&
          reportData.start_on &&
          reportData.frequency_units &&
          reportData.how_often &&
          reportData.send_to_group &&
          reportData.send_to_user
        ) {
          setValues({
            report_name: reportData.report_name,
            start_on: reportData.start_on,
            frequency_units: reportData.frequency_units,
            how_often: reportData.how_often,
            send_to_group: reportData.send_to_group,
            send_to_user: reportData.send_to_user,
          });
          setNameData(reportData.send_to_user);
        } else {
          console.error("Error: Incomplete report data received");
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };
    fetchData();
  }, [dispatch, id, setValues]);

  useEffect(() => {
    let data = [...months];

    DashboardListingData?.data?.SafetyKitCount?.forEach((el) => {
      data.splice(el.month - 1, 1, {
        ...data[el.month - 1],
        value: Math.round(el.reliancePercentage),
        percentageChange: el.percentageChange,
      });
    });
    setMonths(data);
  }, [DashboardListingData?.data?.companyRegistrationData]);
  useEffect(() => {
    if (DashboardListingData?.data?.SafetyKitCount?.[0]) {
      const percentageChange =
        DashboardListingData.data.SafetyKitCount[0].percentageChange;
      const reliancePercentage =
        DashboardListingData.data.SafetyKitCount[0].reliancePercentage;

      setRadial((prevState) => ({
        ...prevState,
        series: [Math.round(reliancePercentage)],
        options: {
          ...prevState.options,
          labels: [`${percentageChange.toFixed()}%`],
          plotOptions: {
            ...prevState.options.plotOptions,
            radialBar: {
              ...prevState.options.plotOptions.radialBar,
              dataLabels: {
                ...prevState.options.plotOptions.radialBar.dataLabels,
                name: {
                  show: true,
                  // color: percentageChange > 0 ? "#00FF00" : "#FF0000",
                  color:
                    percentageChange > 0
                      ? "#00FF00"
                      : percentageChange < 0
                      ? "#FF0000"
                      : "grey",
                },
              },
            },
          },
        },
      }));
    }
  }, [DashboardListingData]);

  // const addGroupHandler = (data) => {
  //   if (Object.keys(data).length === 0) {
  //     return;
  //   }
  //   const paydata = {
  //     user_id: data._id,
  //     full_name: data.first_name + data.last_name,
  //     assigned_role: data.assigned_role,
  //   };
  //   setNameData((prev) => [...prev, paydata]);
  //   setSearch("");
  //   setFinalName({});
  //   setValues({
  //     ...values,
  //     send_to_user: [...nameData, paydata],
  //   });
  // };

  // const getNameDataFromList = (data) => {
  //   setSearch(data.first_name + data.last_name) ;
  //   setFinalName(data);
  // };
  // const getNameDataFromList = (data, type) => {
  //   if (type === "user") {
  //     setSearch(data.first_name + data.last_name);
  //     setFinalName(data);
  //     setValues({
  //       ...values,
  //       send_to_user: [data],
  //     });
  //   } else if (type === "group") {
  //     setSearch(data.group_name); // Set search to group name
  //     setFinalName(data);
  //     setValues({
  //       ...values,
  //       send_to_group: [data],
  //     });
  //   }
  // };
  const addToReport = () => {
    if (selectedUser) {
      addGroupHandler(selectedUser, "user");
    } else if (selectedGroup) {
      addGroupHandler(selectedGroup, "group");
    }
    setSelectedUser(null);
    setSelectedGroup(null);
  };
  const getNameDataFromList = (data, type) => {
    if (type === "user") {
      const selectedUser = {
        user_id: data._id,
        full_name: `${data.first_name} ${data.last_name}`,
      };
      setValues((prevValues) => ({
        ...prevValues,
        send_to_user: [...prevValues.send_to_user, selectedUser],
      }));
      setNameData((prev) => [...prev, selectedUser]); // Update the nameData state
      setSearch(`${data.first_name} ${data.last_name}`); // Update the search field with the selected user's full name
    } else if (type === "group") {
      // If it's a group, add it to the send_to_group array
      const selectedGroup = {
        group_id: data._id,
        group_name: data.group_name,
      };
      setValues((prevValues) => ({
        ...prevValues,
        send_to_group: [...prevValues.send_to_group, selectedGroup],
      }));
      setNameData((prev) => [...prev, selectedGroup]);
      setSearch(data.group_name);
    }
  };

  const addGroupHandler = (data, type, search) => {
    if (!data || Object.keys(data).length === 0) {
      return;
    }

    let newData = null;

    if (type === "user") {
      newData = {
        user_id: data.user_id,
        full_name: data.full_name,
        search: search, // Include the search data
      };
    } else if (type === "group") {
      newData = {
        group_id: data.group_id,
        group_name: data.group_name,
        search: search, // Include the search data
      };
    }

    // Add the new data to the respective array based on the type
    if (type === "user") {
      setValues((prevValues) => ({
        ...prevValues,
        send_to_user: [...prevValues.send_to_user, newData],
      }));
    } else if (type === "group") {
      setValues((prevValues) => ({
        ...prevValues,
        send_to_group: [...prevValues.send_to_group, newData],
      }));
    }

    // Update the nameData state to include the new data
    setNameData((prev) => [...prev, newData]);
    setSearch(""); // Clear search after adding to report
    setFinalName({});
  };

  const removeGroup = (groupId, isUser) => {
    const filterName = nameData?.filter((curElm) => {
      if (isUser) {
        return curElm.user_id !== groupId;
      } else {
        return curElm.group_id !== groupId;
      }
    });

    setNameData(filterName);

    if (isUser) {
      setValues((prevValues) => ({
        ...prevValues,
        send_to_user: filterName,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        send_to_group: filterName,
      }));
    }
  };

  const frequencyOptions = Array.from(
    { length: 12 },
    (_, index) => index + 1
  ).map((number) => (
    <option key={number} value={number}>
      {number}
    </option>
  ));

  return (
    <div className="reporteditor">
      <h3 className="text-center border-bottom pb-4 pt-2">
        {" "}
        UpdateReport Editor
      </h3>
      <Form onSubmit={handleSubmit}>
        <div className="row pt-3">
          <div className="col-md-5">
            <div className="reportname">
              {/* <Form.Group className="mb-3" controlId="formReportName">
              <Form.Control type="text" placeholder="Report Name" />
            </Form.Group> */}
              <Form.Group className="mb-3" controlId="formReportName">
                <Form.Control
                  type="text"
                  name="report_name"
                  value={values.report_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Report Name"
                />
              </Form.Group>
              {errors.report_name && touched.report_name ? (
                <p className="text-danger">{errors.report_name} </p>
              ) : null}
            </div>

            <div className="reportdate">
              <Form.Group className="mb-3" controlId="formBasicDate">
                <h6>Start on</h6>
                <Form.Control
                  type="date"
                  name="start_on"
                  value={dateFormmater(values.start_on)}
                  onChange={handleChange} // Handle change for date input
                />
              </Form.Group>
              {errors.start_on && touched.start_on ? (
                <p className="text-danger">{errors.start_on} </p>
              ) : null}
            </div>
            <div className="frequency">
              <h6>Frequency</h6>
              <Row>
                <Col>
                  <Form.Group controlId="exampleForm.ControlFrequencyUnits">
                    {/* <Form.Label></Form.Label> */}
                    <Form.Select
                      aria-label="Choose Units"
                      name="frequency_units"
                      value={values.frequency_units}
                      onChange={handleChange}
                    >
                      <option>Choose Units</option>
                      {frequencyOptions}
                    </Form.Select>
                  </Form.Group>
                  {errors.frequency_units && touched.frequency_units ? (
                    <p className="text-danger">{errors.frequency_units} </p>
                  ) : null}
                </Col>
                <Col>
                  {/* <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlHoeOfen"
                >
                  <Form.Control type="text" placeholder="How Often" />
                </Form.Group> */}

                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlHowOften"
                  >
                    <Form.Control
                      type="text"
                      name="how_often"
                      value={values.how_often}
                      onChange={handleChange}
                      placeholder="How Often"
                      // disabled // If it's not editable
                    />
                  </Form.Group>
                  {errors.how_often && touched.how_often ? (
                    <p className="text-danger">{errors.how_often} </p>
                  ) : null}
                </Col>
              </Row>
            </div>
            <div className="sendreport">
              <h6>Send Report To</h6>
              <Row>
                <Col>
                  {/* <Form.Group className="mb-3" controlId="formReportSearch">
                  <Form.Control type="search" placeholder="Search" />
                </Form.Group> */}
                  <Form.Group className="mb-3" controlId="formReportSearch">
                    <Form.Control
                      type="text"
                      name="groupname"
                      autoComplete="off"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <button
                    className="btn btn-primary w-100"
                    type="button"
                    onClick={addToReport}
                  >
                    Add to Report
                  </button>
                </Col>
              </Row>
            </div>
            <div className="name_listing">
              <ul>
                {AddReportData && search && (
                  <>
                    {/* Render the Users */}
                    {AddReportData?.data?.Users.filter((user) =>
                      user.first_name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    ).map((user) => (
                      <div key={user._id}>
                        <p onClick={() => getNameDataFromList(user, "user")}>
                          {user.first_name} {user.last_name}
                        </p>
                      </div>
                    ))}

                    {/* Render the Groups */}
                    {AddReportData?.data?.report_group_list
                      .filter((group) =>
                        group.group_name
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      )
                      .map((group) => (
                        <div key={group._id}>
                          <p
                            onClick={() => getNameDataFromList(group, "group")}
                          >
                            {group.group_name}
                          </p>
                        </div>
                      ))}
                  </>
                )}
              </ul>
            </div>
            <hr />
            <div className="buttongroup">
              <div className="mb-4">
                <div className="row pb-3">
                  <h4>In this Group</h4>

                  {/* Combine user data and group data */}
                  {/* Combine user data and group data */}
                  {console.log(nameData, "nameData")}
                  {nameData.map((curElm, index) => (
                    <div className="col-4 mb-3 position-relative" key={index}>
                      <button
                        className={`w-100 border btn ${
                          managebutton === index + 1
                            ? "border-primary text-primary"
                            : "text-black-50"
                        }`}
                        type="button"
                        onClick={() => setManageButton(index + 1)}
                      >
                        {/* Display full name if it exists, otherwise display group name */}
                        {curElm.full_name
                          ? curElm.full_name
                          : curElm.group_name}
                      </button>
                      {managebutton === index + 1 && (
                        <span
                          className={`closebuttonspan ${
                            managebutton === index + 1 ? "text-primary" : ""
                          }`}
                        >
                          <IoIosCloseCircleOutline
                            className="cursor"
                            onClick={() =>
                              removeGroup(
                                curElm.user_id || curElm.group_id,
                                !!curElm.user_id
                              )
                            }
                            size={25}
                          />
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Display error message if send_to_user field has an error */}
                  {errors.send_to_user && touched.send_to_user && (
                    <p className="text-danger">{errors.send_to_user}</p>
                  )}
                  {/* Display error message if send_to_group field has an error */}
                  {errors.send_to_group && touched.send_to_group && (
                    <p className="text-danger">{errors.send_to_group}</p>
                  )}
                </div>
                {/* <button className="btn me-2 border">Name of Group</button>
                <button className="btn border">Name of Group</button>
              </div> */}
                {/* <div> */}
                {/* <button className="btn me-2 border">Full Name of Person</button>
                <button className="btn border">Full Name of Person</button> */}
              </div>
            </div>
          </div>
          <div className="col-md-7 report_widget">
            <div className="fw-bold">
              <Form.Check
                label="Choose the Report Widget Name"
                name="group1"
                type={"checkbox"}
              />
            </div>
            <hr />
            <div className="row">
              <div className="col-1">
                <Form.Check name="group1" type={"checkbox"} />
              </div>
              <div className="col-7">
                <div className="border d-flex">
                  <span className="mt-3 ps-2">
                    <PiUsersFill size={25} />
                  </span>
                  <CardWithChartComp
                    title="Registered User"
                    count={DashboardListingData?.data?.totalUserCount}
                  />
                </div>
              </div>
              <div className="col-4">
                <h6>Users registered over the last six months.</h6>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-1">
                <Form.Check name="group1" type={"checkbox"} />
              </div>
              <div className="col-7">
                <div className="border d-flex">
                  <span className="mt-3 ps-2">
                    <FaMedkit size={25} />
                  </span>
                  <CardWithChartComp
                    title={"Registered Companies"}
                    count={DashboardListingData?.data?.companyData}
                  />
                </div>
              </div>

              <div className="col-4">
                <h6>View of Registered Companies.</h6>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-1">
                <Form.Check name="group1" type={"checkbox"} />
              </div>
              <div className="col-7">
                <div className="border d-flex">
                  <span className="mt-3 ps-2">
                    <FaMedkit size={25} />
                  </span>
                  <CardWithLineChart
                    count={DashboardListingData?.data?.registeredKitData}
                  />
                </div>
              </div>

              <div className="col-4">
                <h6>Annual View of Kits Registered over time.</h6>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-1">
                <Form.Check name="group1" type={"checkbox"} />
              </div>
              <div className="col-7">
                <div className="border d-flex">
                  <span className="mt-3 ps-2">
                    <FaMedkit size={25} />
                  </span>
                  <CardWithMap />
                </div>
              </div>

              <div className="col-4">
                <h6>View of Reported Incidents.</h6>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-1">
                <Form.Check name="group1" type={"checkbox"} />
              </div>
              <div className="col-7">
                <div className="border d-flex">
                  <span className="mt-3 ps-2">
                    <FaMedkit size={25} />
                  </span>
                  <div
                    className="bg-white h-100"
                    style={{ borderRadius: "16px" }}
                  >
                    <h4 className="text-center bold pt-3 fw-bold">
                      Safety Kits Installed
                    </h4>
                    <div className="position-relative">
                      <ReactApexChart
                        options={radial.options}
                        series={radial.series}
                        type="radialBar"
                        height={350}
                      />
                      <span
                        className="saftykitstyle"
                        style={{
                          position: "absolute",
                          top: "200px",
                          left: "144px",
                          // color: "lightgray",
                          color: "black",
                        }}
                      >
                        Us vs Competitors
                      </span>
                      {radial.options.labels &&
                        radial.options.labels.length > 0 && (
                          <div className="icon_setup_style">
                            {Number(
                              radial.options.labels[0]
                                .toString()
                                .slice(0, radial.options.labels[0].length - 1)
                            ) !== 0 &&
                              (Number(
                                radial.options.labels[0]
                                  .toString()
                                  .slice(0, radial.options.labels[0].length - 1)
                              ) > 0 ? (
                                <FaArrowUp color="green" />
                              ) : (
                                <FaArrowDown color="red" />
                              ))}
                          </div>
                        )}
                    </div>
                    <div className="mt-3">
                      <HorizontalMonthSlider
                        months={months}
                        setradialBardata={setRadial}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-4">
                <h6>Annual View of Safety Kits Installed.</h6>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-1">
                <Form.Check name="group1" type={"checkbox"} />
              </div>
              <div className="col-7">
                <div className="border d-flex">
                  <span className="mt-3 ps-2">
                    <FaMedkit size={25} />
                  </span>
                  <CardWithBarChart
                    count={DashboardListingData?.data?.incidentData}
                  />
                </div>
              </div>

              <div className="col-4">
                <h6>Annual View of Number of Incidents.</h6>
              </div>
            </div>
            <hr />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex d-none">
              <button className=" usermgmt-button" disabled>
                <FaBan /> Disable
              </button>
              <button className="  usermgmt-button">
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
          <div className="col-md-6 text-end">
            {/* <button className="btn btn-dark"> Cancel</button>
          <button className="btn btn-primary ms-4 w-50">Save Changes</button> */}
            {/* <div className="text-end"> */}
            <NavLink className="btn btn-dark me-4" to="/reports" type="button">
              Cancel
            </NavLink>
            <button
              className="btn-primary btn customsavebuttonwidth"
              type="submit"
            >
              {AddReportData === StatusCode.LOADING ? (
                <ButtonLoader />
              ) : (
                "Update Changes"
              )}
            </button>

            {/* </div> */}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UpdateReportEditor;
