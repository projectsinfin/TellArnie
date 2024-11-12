import React, { useEffect } from "react";
import { Form } from "react-bootstrap";

const Screen3 = ({
  rowArray,
  mappedArray,
  handleSelectChange,
  formData,
  setFormData,
}) => {
  return (
    <div className="screenthree">
      <h4 className="text-center">Map Header Columns</h4>
      <p className="text-center mt-4">
        These columns were not automatically mapped. Select from unmapped <br />
        categories or skip column import.
      </p>
      <hr />
      <div className="rowheaderparent">
        {rowArray &&
          rowArray.map((cur, i) => (
            <div
              className="columnmapped mb-3 d-flex justify-content-between align-items-center"
              key={i}
            >
              <div className="d-flex align-items-center w-75">
                <div className="importedcolumn">{cur} </div>
                <div>
                  <Form.Select
                    aria-label="Default select example"
                    className="importedcolumnselect"
                    name={i}
                    onChange={handleSelectChange}
                  >
                    {mappedArray.map((curElm, j) => (
                      <option
                        key={j}
                        value={curElm.value}
                        selected={cur == curElm.label ? true : false}
                      >
                        {curElm.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
              <div className="w-25 text-end d-none">Sample</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Screen3;
