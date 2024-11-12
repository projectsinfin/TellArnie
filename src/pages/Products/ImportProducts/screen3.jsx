import React from 'react';
import './style.css'; // Make sure to import your CSS file
import { NavLink } from 'react-router-dom';

function ImportDuplicates() {
  return (
    <div className="upload_wrapper">
      <div className="upload_container">
        <div className="upload_head">
          <h3>Batch Import [Section]</h3>
        </div>
      </div>
      <div className="file_status border-bottom">
        <h5>[##] Duplicate Records Found</h5>
      </div>

      <div className="radio_btn_conatiner">
        <div className="radio_row">
          <input type="radio" id="ignore" name="records" defaultChecked />
          <label htmlFor="ignore">Ignore duplicate records</label>
        </div>
        <div className="radio_row">
          <input type="radio" id="update" name="records" />
          <label htmlFor="update">Update fields in duplicate records</label>
        </div>
      </div>

      <div className="upload_bottom justify-content-end">
        <div className="btn_group">
          {/* Uncomment the Cancel button if needed */}
          {/* <button className="cancel_btn">Cancel</button> */}
          <button className="next_btn">    
             <NavLink to="/summary" className="btn btn-primary">
      Next
    </NavLink></button>
        </div>
      </div>
    </div>
  );
}

export default ImportDuplicates;
