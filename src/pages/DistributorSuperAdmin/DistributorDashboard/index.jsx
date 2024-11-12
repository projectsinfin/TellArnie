import React, { useEffect, useState } from "react";

import { FaArrowUp } from "react-icons/fa";
import CardWithLineChart from "../../../components/CardWithLineChart";
import CardWithBarChart from "../../../components/CardWithBarChart";
import CardWithTable from "../../../components/CardWithTable";
import CardWithChartComp from "./Charts/CardWithChart";
import DistributorBarChart from "./Charts/DistributorBarChart";
import HorizontalMonthSlider from "../../../components/Common/Carousel/Carousel";
import "./stylenew.css";
import ChartTable from "./Charts/DistributorChartTable";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Common/Loader";
import { fetchdistributordashboardData } from "../../../redux/slice/DistributorDashboardSlice";
function DistributorDashboard() {
  const dispatch = useDispatch();
  const { status, DistributorDashboardData } = useSelector(
    (state) => state.DISTRUBUTORDASHBOARD
  );

  console.log(DistributorDashboardData, "DistributorDashboardData");

  const [dataFetched, setDataFetched] = useState(false);
  // const [radial] = useState({
  //   series: [64.87],
  //   colors: ["#006AFF"] ,
  //   options: {
  //     chart: {
  //       height: 350,
  //       type: "radialBar",
  //     },
  //     plotOptions: {
  //       radialBar: {
  //         hollow: {
  //           size: "64.87%",
  //           borderRadius: '50px'
  //         },
  //         startAngle: -90,
  //         endAngle: 90,
  //       },
  //     },
  //     labels: ["Us vs Competitors"],
  //     colors: ["#006AFF"] ,
  //     fill: {
  //       colors: ["#006AFF"], // Color of the radial bar
  //     },
  //     stroke: {
  //       lineCap: "round",
  //     },
  //   },
  // });
  const [radial] = useState({
    series: [64.87],
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
            // image: "./image.png",
            imageWidth: 24,
            imageHeight: 24,
            imageClipped: false,
          },
          startAngle: -90,
          endAngle: 90,
          dataLabels: {
            name: {
              show: true,
              color: "#42BD53",
            },
            value: {
              show: true,
              color: "#333",
              // offsetY: 70,
              fontSize: "30px",
              fontWeight: "bold",
            },
          },
        },
      },
      labels: ["4.65%"],
      stroke: {
        lineCap: "round",
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchdistributordashboardData());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (DistributorDashboardData && DistributorDashboardData.status === 200) {
      // console.log(DashboardListingData, "DashboardListingData");
      setDataFetched(true);
    }
  }, [DistributorDashboardData]);

  if (!dataFetched) {
    return <Loader />;
  }

  return (
    <div className="">
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4">
              <CardWithChartComp
                title={"Registered Users"}
                count={DistributorDashboardData?.data?.totalUserCount}
                // count={"4"}
                count2={"34%"}
              />
            </div>
            <div className="col-md-4">
              <CardWithChartComp
                title={"Registered Clients"}
                // count={"2"}
                count={DistributorDashboardData?.data?.companyData}
                count2={"34%"}
              />
            </div>
            <div className="col-md-4">
              <CardWithChartComp
                title={"Notifications"}
                count={"7"}
                // count={DistributorDashboardData?.data?.companyData}
                count2={"34%"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <CardWithLineChart
                count={DistributorDashboardData?.data?.registeredKitData}
              />
            </div>

            <div className="col-md-4 overflow-hidden report-chart-sec">
              {/* <CardWithMap /> */}
              <span>Quote Value Generated</span>
              <h4>
                $302,782{" "}
                <span style={{ color: "#42BD53", fontSize: "16px" }}>
                  3.24% <FaArrowUp />
                </span>
              </h4>

              <DistributorBarChart />
            </div>
          </div>
        </div>
        <div className="row mt-12 dashboard-chart">
          {/* <div className="col-md-4">
            <div className="bg-white rounded h-100">
              <h4 className="text-center bold pt-3 fw-bold">Top Performers</h4>

              <div className="container-dist">
                <div className="box-dist"></div>
                <span className="name-dist">Name</span>
                <span className="dollar-sign"> £</span>
              </div>
              <div className="container-dist">
                <div className="box-dist"></div>
                <span className="name-dist">Name</span>
                <span className="dollar-sign"> £ </span>
              </div>
              <div className="container-dist">
                <div className="box-dist"></div>
                <span className="name-dist">Name</span>
                <span className="dollar-sign"> £ </span>
              </div>
              <div className="mt-3 ">
                <HorizontalMonthSlider />
              </div>
            </div>
          </div> */}
          <div className="col-md-12">
            <CardWithBarChart
              count={DistributorDashboardData?.data?.incidentData}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 mt-4">
          <ChartTable />
        </div>
      </div>
    </div>
  );
}
export default DistributorDashboard;
