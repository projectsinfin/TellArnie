import React from "react";
import { Modal } from "react-bootstrap";
import DistributorInformationPopup from "../../DistributorInformation";

const DistributorModal = ({ show, hide, heading, icon }) => {
  return (
    <Modal show={show} onHide={() => hide(false)} size="lg">
      <Modal.Header closeButton>
        <div className="d-flex align-items-center">
          {icon}
          <Modal.Title className="ms-1">{heading}</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        <DistributorInformationPopup hide={hide} />
      </Modal.Body>
    </Modal>
  );
};

export default DistributorModal;
