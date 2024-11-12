import React from "react";
import { Button, Modal } from "react-bootstrap";
import image from "../../../Assets/no-img/no-image-icon.png";


const KitInfoModal = ({ hide, show, listingData, title }) => {
  const {
    company_id,
    company_name,
    industry,
    kit_picture,
    area,
    model_number,
    product_code,
    product_name,
    location_name,
    status,
  } = listingData;

  const imageSrc = kit_picture ? kit_picture : image;

  return (
    <Modal show={show} onHide={hide}>
      <Modal.Header className="justify-content-center py-4">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5">
        <div className="d-flex align-items-center border-bottom py-3">
          <h6 className="mb-0" style={{ width: "30%" }}>
            Product:
          </h6>
          <span
            className="ms-3 d-block text_gray_2 text-capitalize"
            style={{ width: "70%" }}
          >
            {product_name}
          </span>
        </div>

      
        <div className="d-flex mt-2 align-items-center border-bottom py-3">
          <h6 className="mb-0" style={{ width: "30%" }}>
            Registered To:
          </h6>
          <span
            className="ms-3 text_gray_2 text-capitalize"
            style={{ width: "70%" }}
          >
            {company_name}
          </span>
        </div>

        <div className="d-flex mt-2 align-items-center border-bottom py-3">
          <h6 className="mb-0" style={{ width: "30%" }}>
            Industry:
          </h6>
          <span
            className="ms-3 text_gray_2 text-capitalize"
            style={{ width: "70%" }}
          >
            {industry}
          </span>
        </div>

        <div className="d-flex mt-2 align-items-center border-bottom py-3">
          <h6 className="mb-0" style={{ width: "30%" }}>
             Location:
          </h6>
          <span
            className="ms-3 text_gray_2 text-capitalize"
            style={{ width: "70%" }}
          >
            {location_name}
          </span>
        </div>

        <div className="d-flex mt-2 align-items-center border-bottom py-3">
          <h6 className="mb-0" style={{ width: "30%" }}>
            Area:
          </h6>
          <span
            className="ms-3 text_gray_2 text-capitalize"
            style={{ width: "70%" }}
          >
            {area}
          </span>
        </div>

        <div className="d-flex mt-2 align-items-center py-3">
          <h6 className="mb-0" style={{ width: "30%" }}>
            status:
          </h6>
          <span
            className="ms-3 text_gray_2 text-capitalize"
            style={{ width: "70%" }}
          >
            {status}
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

export default KitInfoModal;
