import React from 'react';
import './style.css'; // Make sure to import your CSS file
import { NavLink } from 'react-router-dom';

function ImportSummary() {
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

      <div className="records_container">
        <p>[##] records have been successfully imported.</p>
        <p>[##] records with duplicated EAN codes were skipped.</p>
        <p>[##] records were not created.</p>
      </div>

      <div className="upload_bottom justify-content-end">
        <div className="btn_group">
          {/* Uncomment the Cancel button if needed */}
          {/* <button className="cancel_btn">Cancel</button> */}
          <button className="next_btn">      <NavLink to="/products" className="btn btn-primary">
      Finish
    </NavLink></button>
        </div>
      </div>
    </div>
  );
}

export default ImportSummary;
