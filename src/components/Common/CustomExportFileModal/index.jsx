import React from "react";
import Modal from "react-bootstrap/Modal";
import ExportCsvFiles from "../../../pages/ExportCsvFiles";

const CustomExportModal = ({ hide, show, heading, icon, mapArray }) => {
  return (
    <Modal show={show} onHide={() => hide(false)} size="lg">
      <Modal.Header closeButton>
        <div className="d-flex align-items-center">
          {icon}
          <Modal.Title className="ms-1">{heading}</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        <ExportCsvFiles heading={heading} mapArray={mapArray} hide={hide} />
      </Modal.Body>
    </Modal>
  );
};

export default CustomExportModal;
