import React from "react";
import { Modal } from "react-bootstrap";
import ImportCsvFiles from "../../../pages/ImportCsvFiles";

const CustomImportFileModal = ({
  show,
  hide,
  heading,
  icon,
  mapArray,
  csvtitle,
}) => {
  return (
    <Modal show={show} onHide={() => hide(false)} size="lg">
      <Modal.Header closeButton>
        <div className="d-flex align-items-center">
          {icon}
          <Modal.Title className="ms-1">{heading}</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        <ImportCsvFiles
          csvtitle={csvtitle}
          title={heading}
          mapArray={mapArray}
          hide={hide}
        />
      </Modal.Body>
    </Modal>
  );
};

export default CustomImportFileModal;
