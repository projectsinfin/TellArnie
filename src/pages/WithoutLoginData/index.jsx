import axios from "axios";
import React, { useEffect, useState } from "react";

import { ApiUrl } from "../../services/helper";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setSearchOperation } from "../../redux/slice/QuickReportSlice";
import image1 from "../../Assets/Logo/appstore.png";
import image2 from "../../Assets/Logo/googlePlay.png";
import QuickOnlineHeader from "./QuickReportPages/QuickOnlineHeader";

const WithOutLoginData = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { id } = useParams();
  const { quichReportData } = useSelector((state) => state.QUICKREPORT);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchData = async () => {
    setLoading(false);
    const res = await axios.get(`${ApiUrl}/admin/fetch_qr_image/${id}`);
    console.log(res.data, "res");
    if (res.status === 200) {
      dispatch(setSearchOperation(res.data));
      if (res.data?.kit_data === null || res.data?.kit_data?.company_id == "") {
        setLoading(true);
      } else if (res.data?.kit_data?.company_id !== "") {
        navigate("/standardwithquickreport");
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth <= 768);
  //   };
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  return (
    <>
      {" "}
      {loading === true ? (
        <div className="notfoundkitdatawrapper">
          <header
            className="notfoundheader px-2 pt-3"
            style={{ backgroundColor: "#047835", paddingBottom: "35px" }}
          >
            <QuickOnlineHeader />
          </header>

          <div
            className="vh-100 py-5 px-4 bg-white"
            style={{ borderRadius: "20px 20px 0px 0px", marginTop: "-15px" }}
          >
            {/* {isMobile ? ( */}
              <div>
                <h6
                  className="text-center open-sans-font mb-3"
                  style={{
                    marginTop: "100px",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  This First Aid Kit is not registered. Please download app to
                  register kit.
                </h6>
                <div className="text-center" style={{ marginTop: "77px" }}>
                  <div>
                    <img
                      src={image1}
                      alt="image1"
                      className=""
                      style={{ width: "230px", height: "55px" }}
                    />
                  </div>
                  <div className="mt-4">
                    <img
                      src={image2}
                      alt="image2"
                      style={{ width: "230px", height: "55px" }}
                      className=""
                    />
                  </div>
                </div>
              </div>
            {/* )
             : (
              <h3>You can access this page on mobile device only!</h3>
            )
            
            } */}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default WithOutLoginData;
