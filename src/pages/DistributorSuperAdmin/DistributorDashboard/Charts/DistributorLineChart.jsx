// import React, { useEffect, useState } from "react";
// import { Card } from "react-bootstrap";
// import ReactApexChart from "react-apexcharts";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchdashboardListingData } from "../redux/slice/DashboardListingSlice";

// const CardWithLineChart = ({ count }) => {
//   const { DashboardListingData } = useSelector(
//     (state) => state.DASHBOARDLISTING
//   );
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchdashboardListingData());
//   }, [dispatch]);

//   const monthNames = [
//     "",
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   // Initialize chart data state
//   const [chartData, setChartData] = useState({
//     series: [
//       {
//         name: "Total Registered Kits",
//         data: [],
//       },
//     ],
//     options: {
//       chart: {
//         type: "line",
//         height: 350,
//         toolbar: {
//           show: false,
//         },
//       },
//       stroke: {
//         curve: "smooth",
//         width: 2,
//         colors: ["#006AFF"],
//       },
//       dataLabels: {
//         enabled: false,
//       },
//       xaxis: {
//         categories: monthNames.slice(1),
//       },
//       yaxis: {
//         tickAmount: 5,
//         min: 0,
//         max: 1000,
//       },
//     },
//   });

//   useEffect(() => {
//     if (DashboardListingData?.data?.registeredKitchart) {
//       const monthlyCounts = Array(12).fill(0);

//       DashboardListingData.data.registeredKitchart.forEach((data) => {
//         const monthIndex = data._id - 1;
//         monthlyCounts[monthIndex] = data.count;
//       });

//       setChartData((prevData) => ({
//         ...prevData,
//         series: [
//           {
//             name: "Total Registered Kits",
//             data: monthlyCounts,
//           },
//         ],
//       }));
//     }
//   }, [DashboardListingData]);

//   return (
//     <Card
//       className="p-3"
//       style={{ border: "none", height: "429px", borderRadius: "16px" }}
//     >
//       <div className="d-flex justify-content-between align-items-center">
//         <h5 style={{ fontFamily: "Inter", fontSize: "24px", fontWeight: 700 }}>
//           Registered Kits
//         </h5>
//       </div>
//       <h2>{count > 0 ? count : "No Registered Kit Found"}</h2>
//       <div id="chart">
//         <ReactApexChart
//           options={chartData.options}
//           series={chartData.series}
//           type="line"
//           height={300}
//         />
//         <div id="html-dist" />
//       </div>
//     </Card>
//   );
// };

// export default CardWithLineChart;

import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";

const DistributorLineChart = () => {
  const { DistributorDashboardData } = useSelector(
    (state) => state.DISTRUBUTORDASHBOARD
  );

  const [data, setData] = useState({
    series: [
      {
        name: "Total Kits",
        data: [10],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
  });
  useEffect(() => {
    let data = DistributorDashboardData?.data?.registeredKitchart?.map(
      (item) => item.count
    );
    data.unshift(0, 0, 0);
    data.push(0, 0, 0, 0, 0, 0, 0);
    setData((prev) => ({
      ...prev,
      series: [
        {
          name: "Registered Kits",
          data: data,
        },
      ],
    }));
  }, [DistributorDashboardData]);
  return (
    <Card className="p-3" style={{ border: "none" }}>
      <Card.Title style={{ fontSize: 24, fontWeight: "700" }}>
        Registered Kits
        <div id="chart">
          <ReactApexChart
            // options={data.options}
            options={12}

            // series={data.series}
            series={10}

            type="area"
            height={350}
          />
          <div id="html-dist" />
        </div>
      </Card.Title>
    </Card>
  );
};
export default DistributorLineChart;
