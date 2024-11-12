import React from "react";
import { Spinner } from "react-bootstrap";

const ButtonLoader = () => {
  return (
    <Spinner animation="border" role="status" className="spinner_border">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export default ButtonLoader;
