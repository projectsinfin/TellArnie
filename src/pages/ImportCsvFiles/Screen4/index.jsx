import React, { useState } from "react";

const Screen4 = ({ setFormData, formData }) => {
  const [radiocheck, setRadioChecked] = useState();

  const ignoreDupRecords = (val) => {
    setRadioChecked(val);
    setFormData({ ...formData, ignore_duplicate_record: true });
  };
  const updateDupRecords = (val) => {
    setRadioChecked(val);
    setFormData({ ...formData, ignore_duplicate_record: false });
  };
  return (
    <div className="screenfour">
      <h4 className="text-center">[##] Duplicate Records Found </h4>
      <hr />
      <div className="mt-3">
        <span
          className={radiocheck === 1 ? "customradio active" : "customradio"}
          onClick={() => ignoreDupRecords(1)}
        ></span>
        <span className="customradiolabel">Ignore duplicate records</span>
      </div>
      <div className="mt-3">
        <span
          className={radiocheck === 2 ? "customradio active" : "customradio"}
          onClick={() => updateDupRecords(2)}
        ></span>
        <span className="customradiolabel">
          Update fields in duplicate records
        </span>
      </div>
    </div>
  );
};

export default Screen4;
