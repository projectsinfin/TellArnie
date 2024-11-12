import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MultiSelect } from "react-multi-select-component";
import "./index.css";
import {
  createexportDistributors,
  createexportfile,
  createexportKits,
  createexportUsers,
} from "../../redux/slice/ExportFileSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ApiEndPoint } from "../../services/helper";

const ExportCsvFiles = ({ heading, mapArray, hide }) => {
  const { status, ExportFileData } = useSelector((state) => state.EXPORTFILES);
  const { pathname } = useLocation();

  const [radiocheck, setRadioChecked] = useState(1);
  const [mappedArray, setMappedArray] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dispatch = useDispatch();
  const geturl = () => {
    if (pathname == "/products") {
      return ApiEndPoint.EXPORTFILES;
    } else if (pathname === "/users") {
      return ApiEndPoint.EXPORTUSERS;
    } else if (pathname === "/distributors") {
      return ApiEndPoint.EXPORTDIST;
    }
  };

  useEffect(() => {
    const newArray = mapArray;
    const mapArraywithlabel = newArray.map((curElm) => {
      return {
        label: curElm.label,
        value: curElm.value,
      };
    });
    setMappedArray(mapArraywithlabel);
  }, []);

  // const handleExport = () => {
  //   console.log("Export button clicked");

  //   let columnsToExport = [];

  //   if (radiocheck === 1) {
  //     columnsToExport = mappedArray.map((item) => item.value);
  //   } else {
  //     columnsToExport = selected.map((item) => item.value);
  //   }

  //   const payload = {
  //     is_all: radiocheck === 1 ? true : false,
  //     startDate,
  //     endDate,
  //     columns: columnsToExport,
  //   };

  //   console.log("Export payload:", payload);

  //   if (pathname === "/users") {
  //     // Filter out the "password" field from the columns array
  //     const filteredColumns = payload.columns.filter(col => col !== 'password');
  //     const payloadWithoutPassword = {
  //       ...payload,
  //       columns: filteredColumns,
  //     };
  //     dispatch(createexportUsers(payloadWithoutPassword));
  //   } else {
  //     dispatch(createexportfile(payload));
  //   }
  // };

  const handleExport = () => {
    console.log("Export button clicked");

    let columnsToExport = [];

    if (radiocheck === 1) {
      columnsToExport = mappedArray.map((item) => item.value);
    } else {
      columnsToExport = selected.map((item) => item.value);
    }

    const payload = {
      is_all: radiocheck === 1 ? true : false,
      startDate,
      endDate,
      columns: columnsToExport,
    };

    console.log("Export payload:", payload);

    if (pathname === "/users") {
      // Filter out the "password" field from the columns array
      const filteredColumns = payload.columns.filter(
        (col) => col !== "password"
      );
      const payloadWithoutPassword = {
        ...payload,
        columns: filteredColumns,
      };
      dispatch(createexportUsers(payloadWithoutPassword));
    } else if (pathname === "/distributors") {
      dispatch(createexportDistributors(payload));
    } else if (pathname === "/kit") {
      dispatch(createexportKits(payload));
    } else {
      dispatch(createexportfile(payload));
    }
  };

  return (
    <div className="exportcsv">
      <h2 className="text-center">{heading} Records </h2>
      <hr />
      <h6 className="text-center">
        Choose the records you will like to export
      </h6>
      <hr />
      <div className="mt-3">
        <span
          className={radiocheck === 1 ? "customradio active" : "customradio"}
          onClick={() => {
            setRadioChecked(1);
            setSelected([]);
          }}
        ></span>
        <span className="customradiolabel">All records in this database</span>
      </div>
      <div className="mt-3">
        <span
          className={radiocheck === 2 ? "customradio active" : "customradio"}
          onClick={() => setRadioChecked(2)}
        ></span>
        <span className="customradiolabel">Within a search criteria</span>
        <div
          className={
            radiocheck === 2 ? "position-relative" : "position-relative d-none"
          }
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="customexportsearch form-control"
          />
          <span className="search_icon">
            <FiSearch size={25} />
          </span>
        </div>
        <div className="multi_export_file my-5">
          <MultiSelect
            options={mappedArray || []}
            value={selected}
            onChange={setSelected}
            labelledBy="Select"
          />
        </div>
      </div>
      <hr className="mt-4" />

      <div className="exportbottom pt-5">
        <h5 className="mb-2">Record Creation date range</h5>
        <div className="d-flex pb-5">
          <div className="datefrom w-50 me-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control"
              placeholder="From"
            />
          </div>
          <div className="dateto w-50">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control"
              placeholder="To"
            />
          </div>
        </div>
        <div className="text-end mt-3 mb-2">
          <button
            className="btn btn-dark customexportcancelbutton"
            onClick={() => hide(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Exporting..." : "Export Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportCsvFiles;
