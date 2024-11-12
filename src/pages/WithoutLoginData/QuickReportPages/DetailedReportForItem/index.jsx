import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./index.css";
import { Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
const DetailedReportForItem = () => {
  return (
    <div className="detailedreportforItem">
      <div className="form_container">
        <Form>
          <div className="providesummaryincident mt-3">
            <h5 className="quickheading mb-3 letter_spacing fw-bold">
              Items used per person
            </h5>

            <div className="innerformdata">
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Select
                      aria-label="Default select example"
                      className="customselectbox"
                    >
                      <option>Item used</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Select
                      aria-label="Default select example"
                      className="customselectbox"
                    >
                      <option>Quantity</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Select
                      aria-label="Default select example"
                      className="customselectbox"
                    >
                      <option>Used by </option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Button
                    variant="dark"
                    className="w-100 p-3 fw-bold letter_spacing"
                  >
                    Add Item
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
          <div className="mt-5">
            <NavLink to="/detailedreportaction" className="nav-link d-inline">
              <Button variant="dark" type="button">
                Cancel
              </Button>
            </NavLink>
            <NavLink
              to="/detailedreporforfilleditem"
              className="nav-link d-inline"
            >
              <Button
                variant="primary"
                type="button"
                className="customcontinueonebutton ms-2"
              >
                Continue
              </Button>
            </NavLink>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default DetailedReportForItem;
