import React from "react";
import "./style.css";
import { NavLink } from "react-router-dom";

function UploadComponentData() {
  return (
    <div className="upload_wrapper">
      <div className="upload_container">
        <div className="upload_head">
          <h3>Batch Import [Section]</h3>
        </div>
      </div>
      <div className="file_status border-bottom">
        <h5>Map Header Columns</h5>
        <p>
          These columns were not automatically mapped. Select from unmapped
          categories or skip column import.
        </p>
      </div>

      <div className="imported_container">
        <div className="import_col_row">
          <div className="left_col">
            <span className="imported">Imported Column Name</span>
            <select>
              <option>EAN code</option>
              <option>EAN code</option>
              <option>EAN code</option>
              <option>EAN code</option>
            </select>
          </div>
          <div className="right_col">
            <span className="sample">Sample</span>
          </div>
        </div>
        <div className="import_col_row">
          <div className="left_col">
            <span className="imported">Imported Column Name</span>
            <select>
              <option>EAN code</option>
              <option>EAN code</option>
              <option>EAN code</option>
              <option>EAN code</option>
            </select>
          </div>
          <div className="right_col">
            <span className="sample">Sample</span>
          </div>
        </div>
        <div className="import_col_row">
          <div className="left_col">
            <span className="imported">Imported Column Name</span>
            <select className="disable">
              <option>Category</option>
              <option>EAN code</option>
              <option>EAN code</option>
              <option>EAN code</option>
            </select>
          </div>
          <div className="right_col">
            <span className="sample">Sample</span>
          </div>
        </div>
      </div>

      <div className="upload_bottom justify-content-end">
        <div className="btn_group">
          <button className="cancel_btn">Cancel</button>
          <button className="next_btn">
            <NavLink to="/duplicaterecords" className="btn btn-primary">
              Next
            </NavLink>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadComponentData;
