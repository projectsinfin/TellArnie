import React from "react";
import { Modal } from "react-bootstrap";
import "./index.css";
const UpdateUserStatusModal = ({ hide, show, title, eventhandler }) => {
  return (
    <Modal show={show} onHide={hide} middle>
      <Modal.Body>
        <h5 className="text-center">{title}</h5>
        <div className="text-end">
          <button className="btn text-danger" onClick={hide}>
            Cancel
          </button>
          <button className="ms-3 btn" onClick={() => eventhandler()}>
            Yes
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateUserStatusModal;
