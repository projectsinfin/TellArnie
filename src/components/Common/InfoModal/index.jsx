import React from "react";
import { Button, Modal } from "react-bootstrap";
import image from "../../../Assets/no-img/no-image-icon.png";


const InfoModal = ({ hide, show, listingData, title }) => {
  const {
    brand,
    kit_picture,
    kit_ref_id,
    model_number,
    product_code,
    product_name,
    quantity,
  } = listingData;

  const imageSrc = kit_picture ? kit_picture : image;

  return (
    <Modal className="row_modal" show={show} onHide={hide}>
      <Modal.Header className="justify-content-center py-4">
        <Modal.Title >{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5">
        <div className="d-flex align-items-center border-bottom py-3">
          <h6 className="mb-0" style={{ width: "30%" }}>
            Brand:
          </h6>
          <span
            className="ms-3 d-block text_gray_2 text-capitalize"
            style={{ width: "70%" }}
          >
            {brand}
          </span>
        </div>

        <div className="d-flex mt-2 border-bottom py-3">
          <h6 className="mb-0 pt-3" style={{ width: "30%" }}>Kit Picture:</h6>
          <div className="ms-3" style={{ width: "70%" }}>
            <img src={imageSrc} alt="Kit Picture" style={{ maxWidth: "130px" }} />
          </div>
        </div>
        <div className="d-flex mt-2 align-items-center border-bottom py-3">
          <h6 className="mb-0" style={{ width: "30%" }}>
            Kit Reference ID:
          </h6>
          <span
            className="ms-3 text_gray_2 text-capitalize"
            style={{ width: "70%" }}
          >
            {kit_ref_id}
          </span>
        </div>

        <div className="d-flex mt-2 align-items-center border-bottom py-3">
          <h6 className="mb-0" style={{ width: "30%" }}>
            Model Number:
          </h6>
          <span
            className="ms-3 text_gray_2 text-capitalize"
            style={{ width: "70%" }}
          >
            {model_number}
          </span>
        </div>

        <div className="d-flex mt-2 align-items-center border-bottom py-3">
          <h6 className="mb-0" style={{ width: "30%" }}>
            Product Code:
          </h6>
          <span
            className="ms-3 text_gray_2 text-capitalize"
            style={{ width: "70%" }}
          >
            {product_code}
          </span>
        </div>

        <div className="d-flex mt-2 align-items-center border-bottom py-3">
          <h6 className="mb-0" style={{ width: "30%" }}>
            Product Name:
          </h6>
          <span
            className="ms-3 text_gray_2 text-capitalize"
            style={{ width: "70%" }}
          >
            {product_name}
          </span>
        </div>

        <div className="d-flex mt-2 align-items-center  py-3">
          <h6 className="mb-0" style={{ width: "30%" }}>
            Quantity:
          </h6>
          <span
            className="ms-3 text_gray_2 text-capitalize"
            style={{ width: "70%" }}
          >
            {quantity}
          </span>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center py-3">
        <Button variant="secondary" className="btn btn-danger px-5" onClick={hide}>
          Close
        </Button>
        <Button variant="primary" className="d-none" onClick={hide}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
