import React, { useEffect, useState } from "react";
import CardWithMap from "../../components/CardWithMap";
import CardWithChart from "../../components/CardWithChart";
import CardWithLineChart from "../../components/CardWithLineChart";
import CardWithBarChart from "../../components/CardWithBarChart";
import CardWithTable from "../../components/CardWithTable";
import ReactApexChart from "react-apexcharts";
import HorizontalMonthSlider from "../../components/Common/Carousel/Carousel";
import Loader from "../../components/Common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchdashboardListingData } from "../../redux/slice/DashboardListingSlice";
import CardWithChartComp from "../../components/CardWithChartComp";
import { FaArrowUp } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa6";

function Dashboard() {
  const dispatch = useDispatch();
  const { status, DashboardListingData } = useSelector(
    (state) => state.DASHBOARDLISTING
  );

  const [dataFetched, setDataFetched] = useState(false);
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
  // console.log(radial, "safetykit dummy data");

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
                  color: percentageChange > 0 ? "#00FF00" : percentageChange < 0 ? "#FF0000" : "grey",

                },
              },
            },
          },
        },
      }));
    }
  }, [DashboardListingData]);

  // useEffect(() => {
  //   setRadial({
  //     ...radial,
  //     series: [
  //       Math.round(
  //         DashboardListingData?.data?.SafetyKitCount[1].reliancePercentage
  //       ),
  //     ],
  //     options: {
  //       ...radial.options,
  //       labels: [
  //         `${DashboardListingData?.data?.SafetyKitCount[1].percentageChange}%`,
  //       ],
  //       plotOptions: {
  //         ...radial?.options?.plotOptions,
  //         radialBar: {
  //           ...radial?.options?.plotOptions?.radialBar,
  //           dataLabels: {
  //             ...radial?.options?.plotOptions?.radialBar?.dataLabels,
  //             name: {
  //               show: true,
  //               color:
  //                 DashboardListingData?.data?.SafetyKitCount[1]
  //                   .percentageChange > 0
  //                   ? "#00FF00"
  //                   : "#FF0000",
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchdashboardListingData());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (DashboardListingData && DashboardListingData.status === 200) {
      setDataFetched(true);
    }
  }, [DashboardListingData]);

  if (!dataFetched) {
    return <Loader />;
  }

  return (
    <div className="">
      <div className="row dashbaord_top_row">
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-6">
              <CardWithChart
                title={"Registered Users"}
                count={DashboardListingData?.data?.totalUserCount}
              />
            </div>
            <div className="col-md-6">
              <CardWithChartComp
                title={"Registered Companies"}
                count={DashboardListingData?.data?.companyData}
              />
            </div>
            <div className="col-md-12 mt-4">
              <CardWithLineChart
                count={DashboardListingData?.data?.registeredKitData}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4 overflow-hidden report-chart-sec">
          <CardWithMap />
        </div>
      </div>
      <div className="row mt-4 dashboard-chart">
        <div className="col-md-4">
          <div className="bg-white h-100" style={{ borderRadius: "16px" }}>
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
                  color:"black"
                }}
              >
                Us vs Competitors
              </span>
              {/* <div className="icon_setup_style">
                {Number(
                  radial.options.labels[0]
                    .toString()
                    .slice(0, radial.options.labels[0].length - 1)
                ) > 0 ? (
                  <FaArrowUp color="green" />
                ) : (
                  <FaArrowDown color="red" />
                )}
              </div> */}
              {/* <div className="icon_setup_style">
                {radial.options.labels &&
                radial.options.labels.length > 0 &&
                Number(
                  radial.options.labels[0]
                    .toString()
                    .slice(0, radial.options.labels[0].length - 1)
                ) > 0 ? (
                  <FaArrowUp color="green" />
                ) : (
                  <FaArrowDown color="red" />
                )}
              </div> */}
              {radial.options.labels && radial.options.labels.length > 0 && (
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
        <div className="col-md-8">
          <CardWithBarChart count={DashboardListingData?.data?.incidentData} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 mt-4 dashbaord_table">
          <CardWithTable />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
