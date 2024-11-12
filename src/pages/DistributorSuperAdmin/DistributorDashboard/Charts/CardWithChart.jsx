import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import { FaUserGroup } from "react-icons/fa6";
import UserIcon from "../../../../Assets/svgs/Users.svg";

import { useDispatch, useSelector } from "react-redux";
import { fetchdashboardListingData } from "../../../../redux/slice/DashboardListingSlice";
import { fetchdistributordashboardData } from "../../../../redux/slice/DistributorDashboardSlice";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const CardWithChartComp = ({ title, count }) => {
  const dispatch = useDispatch();
  const { DistributorDashboardData } = useSelector(
    (state) => state.DISTRUBUTORDASHBOARD
  )
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // State to manage the chart options and series
  const [chartState, setChartState] = useState({
    series: [
      {
        name: title,
        data: [],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        type: "bar",
      },
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 5,
          dataLabels: {
            enabled: false,
            position: "bottom",
            show: false,
          },
          columnWidth: "11px",
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        formatter: (seriesName, opts) => {
          if (opts.seriesIndex) return "";
          return null;
        },
        markers: {
          width: [0, 0, 0, 0, 0, 0],
        },
      },
      xaxis: {
        categories: [],
        position: "bottom",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      colors: [
        "#99C3FF",
        "#99C3FF",
        "#99C3FF",
        "#99C3FF",
        "#99C3FF",
        "#006AFF",
      ],
    },
  });

  useEffect(() => {
    // Dispatch the action to fetch the dashboard listing data
    dispatch(fetchdashboardListingData());
  }, [dispatch]);

  useEffect(() => {
    if (DistributorDashboardData && DistributorDashboardData.data) {
      const data = DistributorDashboardData.data;

      if (data.userRegistrationData && data.userRegistrationData.length > 0) {
        // Get the current date and month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // 0-based index of current month

        // Define month names
        const monthNames = [
          "J",
          "F",
          "M",
          "A",
          "M",
          "J",
          "J",
          "A",
          "S",
          "O",
          "N",
          "D",
        ];

        // Determine the range of months to display
        let monthIndices = [];
        for (let i = 5; i >= 0; i--) {
          let monthIndex = (currentMonth - i + 12) % 12; // Calculate month index, accounting for negative values
          monthIndices.push(monthIndex);
        }

        // Define month names in desired order
        const displayedMonthNames = monthIndices.map(
          (index) => monthNames[index]
        );

        // Initialize counts array for the desired range of months
        const counts = new Array(monthIndices.length).fill(0);

        // Populate the counts array with data from companyRegistrationData
        data.userRegistrationData.forEach((item) => {
          const monthIndex = item._id - 1; // Convert month ID to 0-based index
          const monthPosition = monthIndices.indexOf(monthIndex);

          if (monthPosition !== -1) {
            counts[monthPosition] = item.count;
          }
        });

        // Define colors for each bar: blue for the current month and default color for the others
        const defaultColor = "#99C3FF";
        const currentMonthColor = "#006AFF"; // Blue color for the current month

        // Determine colors for each bar in the filtered range
        const colors = displayedMonthNames.map((_, index) =>
          index === displayedMonthNames.length - 1
            ? currentMonthColor
            : defaultColor
        );

        // Update the chart state
        setChartState((prevState) => ({
          ...prevState,
          series: [
            {
              name: title,
              data: counts,
            },
          ],
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: displayedMonthNames, // Use the filtered range of months as categories
            },
            colors: colors, // Use the colors array for bars
          },
        }));

        // Data is now loaded, set the state to true
        setIsDataLoaded(true);
      }
    }
  }, [DistributorDashboardData]);
  let a = String(DistributorDashboardData?.data?.userPercentCount);
  return (
    <Card className="dashboard_cards" style={{ border: "none" }}>
      <Card.Body>
        <Card.Title
          style={{ fontSize: 20, color: "#A8A8BD", fontWeight: "500" }}
        >
          <img src={UserIcon} /> {title}
        </Card.Title>
        <div className="d-flex justify-content-between align-items-end">
          <h2 style={{ fontSize: 32, fontWeight: "700" }} className="mb-0">
            {count}
          </h2>

          <div id="chart">
            {/* Conditionally render the chart only when data is loaded */}
            {isDataLoaded && (
              <ReactApexChart
                options={chartState.options}
                series={chartState.series}
                type="bar"
                height={150}
                width={200}
              />
            )}
          </div>
        </div>
        <h6
          className={
            DistributorDashboardData?.data?.userPercentCount > 0
              ? "text-success"
              : "text-danger"
          }
        >
          <span>
            {DistributorDashboardData?.data?.userPercentCount > 0
              ? DistributorDashboardData?.data?.userPercentCount.toFixed(2)
              : "" + Number(a.slice(1, a.length)).toFixed(2)}
          </span>
          <span>
            {DistributorDashboardData?.data?.userPercentCount > 0 ? (
              <FaArrowUp />
            ) : (
              <FaArrowDown />
            )}
          </span>
        </h6>
      </Card.Body>
    </Card>
  );
};
export default CardWithChartComp;
