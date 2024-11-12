import React from "react";
import { Form } from "react-bootstrap";
import { IoCloudUploadOutline } from "react-icons/io5";

const Screen1 = ({
  dragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  inputref,
  handleInputChange,
  selectedFiles,
}) => {
  return (
    <div className="screenone">
      <h6 className="text-center">Upload Supporting Files</h6>
      <div className="browsefile d-flex mt-4">
        <Form.Control
          type="text"
          disabled
          placeholder={
            selectedFiles ? selectedFiles?.name : "Choose files to upload"
          }
          className="custominput"
        />
        <button
          className="btn btn-primary customradius"
          type="button"
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
    </div>
  );
};

export default Screen1;
