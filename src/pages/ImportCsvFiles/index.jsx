import React, { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import Screen1 from "./Screen1";
import Screen2 from "./Screen2";
import Screen3 from "./Screen3";
import Screen4 from "./Screen4";
import Screen5 from "./Screen5";
import "./index.css";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import { useLocation } from "react-router-dom";
import { ApiEndPoint } from "../../services/helper";
import { useDispatch } from "react-redux";
import { createImportfile } from "../../redux/slice/ImportFileSlice";

const ImportCsvFiles = ({ title, mapArray, csvtitle, hide = () => {} }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const geturl = () => {
    if (pathname == "/products") {
      return ApiEndPoint.IMPORTPRODUCT;
    } else if (pathname === "/users") {
      return ApiEndPoint.IMPORTUSER;
    } else if (pathname === "/distributors") {
      return ApiEndPoint.IMPORTDISTRIBUTOR;
    }
  };

  const [formData, setFormData] = useState({
    product_picture: {},
    map_data: [],
    ignore_duplicate_record: "",
  });

  const [progress, setProgress] = useState(0);
  const [downloadCsv, setDownLoadCsv] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState("");
  const [headerRowArray, setHeaderRowArray] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [response, setResponse] = useState(null); // State to store the response

  const inputref = useRef();
  const handleSelectChange = (e) => {
    let data = [...formData?.map_data];
    const selectedIndex = Number(e.target.name);
    data.splice(selectedIndex, 1, {
      ...data[selectedIndex],
      value: e.target.value,
    });
    setFormData({
      ...formData,
      map_data: data,
    });
  };
  const barWidthHandler = () => {
    const totalProgressSteps = 10;
    const percentageInterval = 100 / totalProgressSteps;
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + percentageInterval;
      });
    }, 500);
  };

  const readCsvFileData = () => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(selectedFiles, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];
        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });
        setHeaderRowArray(results?.meta?.fields);
      },
    });
  };

  const handleInputChange = (e) => {
    const files = e.target.files[0];
    if (files.type === "text/csv") {
      setSelectedFiles(files);
      barWidthHandler();
      setFormData({
        ...formData,
        product_picture: files,
      });
    } else {
      toast.error("Please select only csv file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 1) {
      return toast.error("Please select only one file.");
    } else if (files.length === 1) {
      if (files[0].type === "text/csv") {
        barWidthHandler();
        setSelectedFiles(files[0]);
        setFormData({
          ...formData,
          product_picture: files[0],
        });
      } else {
        toast.error("Please select only csv file.");
      }
    }
  };

  // const handleSubmit = async () => {
  //   const body = {
  //     value: formData,
  //     url: geturl(),
  //   };
  //   dispatch(createImportfile(body));
  // };
  const handleSubmit = async () => {
    const body = {
      value: formData,
      url: geturl(),
    };
    const response = await dispatch(createImportfile(body));
    console.log(response, "response");
    if (response.payload && response.payload.status === 200) {
      setResponse(response.payload); // Set the response in state
      setStep(5);
    }
  };

  const rendersteps = () => {
    if (step === 1) {
      return (
        <Screen1
          dragging={dragging}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          inputref={inputref}
          handleInputChange={handleInputChange}
          selectedFiles={selectedFiles}
        />
      );
    } else if (step === 2) {
      return (
        <Screen2
          selectedFiles={selectedFiles}
          progress={progress}
          setSelectedFiles={setSelectedFiles}
          inputref={inputref}
          handleInputChange={handleInputChange}
        />
      );
    } else if (step === 3) {
      return (
        <Screen3
          rowArray={headerRowArray}
          mappedArray={mapArray}
          handleSelectChange={handleSelectChange}
          formData={formData}
          setFormData={setFormData}
        />
      );
    } else if (step === 4) {
      return <Screen4 setFormData={setFormData} formData={formData} />;
    } else if (step === 5) {
      return <Screen5 response={response} />;
    }
  };

  const nextStepHandler = () => {
    if (step < 5) {
      setStep(step + 1);
    }

    if (step === 2) {
      readCsvFileData();
    }
    if (step === 4) {
      handleSubmit();
    }
  };

  const prevStepHandler = () => {
    if (step > 1) {
      setStep(step - 1);
    }
    hide(false);
  };
  const filterheaderfromappedarray = mapArray?.map((curElm) => curElm.label);

  async function fetchCsvFromServer() {
    const response = await fetch("./people-100.csv");
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value);
    // Split CSV string into an array of lines
    const lines = csv.trim().split("\n");
    // Parse each line into an array of values
    const parsedCsv = lines.map((line) => line.split(","));
    let setHeader = [...parsedCsv];
    setHeader.splice(0, 1, filterheaderfromappedarray);
    setDownLoadCsv([setHeader[0]]);
  }

  useEffect(() => {
    fetchCsvFromServer();
  }, []);
  useEffect(() => {
    const filterData = mapArray.map((curElm) => {
      return {
        key: curElm.label,
        value: curElm.value,
      };
    });
    setFormData({
      ...formData,
      map_data: filterData?.slice(1),
    });
  }, []);
  console.log("formdatsa", formData);
  return (
    <div className="importcsvwrapper">
      <h2 className="text-center"> {title} Record</h2>
      <hr />
      <div className="renderstep">{rendersteps()}</div>
      <div className="bottomsection d-flex justify-content-between align-items-center mt-3">
        <div>
          {step === 1 && (
            <CSVLink
              data={downloadCsv}
              className="fw-bold cursor nav-link"
              filename={csvtitle}
            >
              Download template
            </CSVLink>
          )}
        </div>
        <div className="buttons">
          {step < 4 && (
            <button
              className="btn btn-dark cancelbutton me-4"
              onClick={() => prevStepHandler(step)}
            >
              Cancel
            </button>
          )}
          {step < 5 ? (
            <button
              className="btn btn-primary nextbutton"
              disabled={selectedFiles.length === 0}
              onClick={() => nextStepHandler(step)}
            >
              Next
            </button>
          ) : (
            <button className="btn btn-primary nextbutton">Finish</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportCsvFiles;
