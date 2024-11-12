import React from "react";
import { Form } from "react-bootstrap";
import { IoClose } from "react-icons/io5";

const Screen2 = ({
  selectedFiles,
  inputref,
  handleInputChange,
  setSelectedFiles,
  progress,
}) => {
  return (
    <div className="screentwo">
      <h4 className="text-center">Upload Supporting Files</h4>
      <div className="browsefile d-flex mt-4">
        <Form.Control
          type="text"
          disabled
          placeholder={
            selectedFiles?.name ? selectedFiles?.name : "Choose files to upload"
          }
          className="custominput"
        />
        <button
          className="btn btn-primary customradius"
          disabled={selectedFiles}
          onClick={() => inputref.current.click()}
        >
          Browse Files
        </button>
        <input
          type="file"
          onChange={handleInputChange}
          ref={inputref}
          className="d-none"
        />
      </div>
      <hr />
      <div className="progressbarwrapper">
        <div className="progresswrapper d-flex align-items-center mt-4">
          <div style={{ width: "97%" }}>
            <div className="d-flex justify-content-between align-items-center pb-2">
              <div className="aboutfile">
                {progress === 100 && (
                  <div className="inner">
                    <span>{selectedFiles?.name} </span>
                    <span className="text_gray mt-1">
                      ({selectedFiles?.size} bytes)
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
    </div>
  );
};

export default Screen2;
