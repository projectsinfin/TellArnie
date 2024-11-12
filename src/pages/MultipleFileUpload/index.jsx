import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { IoClose, IoCloudUploadOutline } from "react-icons/io5";
import "./index.css";
import { toast } from "react-toastify";
const MultipleFileUpload = ({ hide }) => {
  const [progress, setProgress] = useState(0);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputref = useRef();
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
  const handleInputChange = (e) => {
    const files = e.target.files;
    const csvFiles = Array.from(files).filter((file) =>
      file.name.endsWith(".png")
    );

    if (csvFiles.length === 0) {
      // Display toast message for no CSV file selected
      toast.error("Please select only png files.");
      return;
    }
    barWidthHandler();
    setSelectedFiles([...selectedFiles, ...csvFiles]);
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
    const csvFiles = Array.from(files).filter((file) =>
      file.name.endsWith(".png")
    );

    if (csvFiles.length === 0) {
      toast.error("Please drop only CSV files.");
      return;
    }

    setSelectedFiles([...selectedFiles, ...csvFiles]);
  };

  const removeFileHandler = (selectfile) => {
    if (window.confirm("Are you sure to remove this file"))
      setSelectedFiles(
        selectedFiles.filter((curElm, index) => index !== selectfile)
      );
  };
  console.log(selectedFiles, "sele");
  return (
    <div className="multifile">
      <h4 className="text-center">Upload Supporting Files</h4>
      <div className="browsefile d-flex mt-4">
        <Form.Control
          type="text"
          disabled
          placeholder={
            selectedFiles.length > 0
              ? selectedFiles.length + " file selected"
              : "Choose files to upload"
          }
          className="custominput"
        />
        <button
          className="btn btn-primary customradius"
          type="button"
          onClick={() => inputref.current.click()}
        >
          Browse Files
        </button>
        <input
          type="file"
          onChange={handleInputChange}
          ref={inputref}
          className="d-none"
          multiple
        />
      </div>

      <hr />
      <div className="filerender">
        {selectedFiles.length > 1 &&
          selectedFiles.map((curElm, index) => (
            <div className="progressbarwrapper mt-3" key={index}>
              <div className="progresswrapper d-flex align-items-center mt-4">
                <div style={{ width: "97%" }}>
                  <div className="d-flex justify-content-between align-items-center pb-2">
                    <div className="aboutfile">
                      <div className="inner">
                        <span>{curElm.name} </span>
                        <span className="text_gray mt-1">({curElm.size})</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="text_gray cursor"
                  onClick={() => removeFileHandler(index)}
                >
                  <IoClose size={25} />
                </div>
              </div>
            </div>
          ))}
      </div>
      <div
        className={`dropcontainer ${dragging ? "bg-success text-white" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="inner">
          <IoCloudUploadOutline className="text_gray" size={50} />
          <h3 className="text_gray mt-2">
            {dragging ? "Dropping..." : "Drag and drop here"}
          </h3>
        </div>
      </div>
      {selectedFiles.length === 1 && (
        <div className="progressbarwrapper">
          <div className="progresswrapper d-flex align-items-center mt-4">
            <div style={{ width: "97%" }}>
              <div className="d-flex justify-content-between align-items-center pb-2">
                <div className="aboutfile">
                  {progress === 100 && (
                    <div className="inner">
                      <span>{selectedFiles[0]?.name} </span>
                      <span className="text_gray mt-1">
                        ({selectedFiles[0]?.size} bytes)
                      </span>
                    </div>
                  )}
                </div>
                <h6 className="m-0">{progress} %</h6>
              </div>

              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
            <div
              className="text_gray cursor"
              // onClick={() => removeFileHandler(index)}
            >
              <IoClose size={25} />
            </div>
          </div>
        </div>
      )}
      <div className="buttons text-end mt-3">
        <button
          className="btn btn-dark cancelbutton me-4"
          onClick={() => hide(false)}
        >
          Cancel
        </button>
        <button className="btn btn-primary nextbutton">Next</button>
      </div>
    </div>
  );
};

export default MultipleFileUpload;
