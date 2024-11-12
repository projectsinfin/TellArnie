import React, { useState } from "react";
import "./Resource.css";
import image1 from "../../Assets/images/Image.png";
import image2 from "../../Assets/images/Image2.png";
import image3 from "../../Assets/images/Image3.png";
import image4 from "../../Assets/images/Image4.png";
import image5 from "../../Assets/images/Image5.png";
import image6 from "../../Assets/images/Image6.png";
import image7 from "../../Assets/images/Image7.png";
import image8 from "../../Assets/images/Image8.png";
import image9 from "../../Assets/images/Image9.png";
import image10 from "../../Assets/images/Image10.png";
import image11 from "../../Assets/images/Image11.png";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  DropdownButton,
  Dropdown,
  Form,
} from "react-bootstrap";
import { FaFileExport, FaFileImport, FaPlus } from "react-icons/fa";
import tableData from "../../data";
import CustomPagination from "../../components/Common/Pagination";

function Resource() {
  const imageUrls = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
    image11,
  ];
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    altText: "",
    title: "",
    caption: "",
    description: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  const totalPages = Math.ceil(imageUrls.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = imageUrls.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const onNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="resources">
      <div>
        <Row className="justify-content-between gap-2 resources_block flex-nowrap d-none">
          <Col md={8} className="card p-3 border-0 box-shadow">
            <Row className="align-items-center border-bottom justify-content-between pb-3 mb-3">
              <Col md={3}>
                <div className=" mb-3">
                  <h3 className="listing pb-0 mb-0">Media Files</h3>
                </div>
              </Col>
              <Col className="col-md-7 select_wrapper">
                <label htmlFor="">Filter Media</label>
                <select>
                  <option disabled selected value="">
                    All dates
                  </option>
                  <option>27/02/2024</option>
                  <option>27/02/2024</option>
                  <option>27/02/2024</option>
                  <option>27/02/2024</option>
                  <option>27/02/2024</option>
                </select>
              </Col>
            </Row>
            <div className="row">
              {imageUrls.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`col-md-3 p-2 ${
                    imageUrl === selectedImage ? "active-image" : ""
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    className="w-100"
                    onClick={() => handleImageClick(imageUrl)}
                  />
                </div>
              ))}
            </div>
            <CustomPagination
              pages={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
              onNextPage={onNextPage}
              onPreviousPage={onPreviousPage}
            />
          </Col>
          {selectedImage && (
            <Col md={4} className="card p-3 border-0  box-shadow">
              <h3 className="listing">Selected media</h3>
              <div className="row align-items-center pb-3 border-bottom mb-3">
                <div className="col-md-6">
                  <img
                    src={selectedImage}
                    className="img-fluid"
                    alt="Selected Media"
                  />
                </div>
                <div className="col-md-6 pe-0">
                  <div className="img_details ">
                    <h5 className="name_img">name of file.jpg</h5>
                    <span className="date_created">Date created</span>
                    <span className="size">size KB</span>
                    <span className="dimension">dimensions in pixels</span>
                    <span className="delete">Delete permanently</span>
                  </div>
                </div>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="altText">
                  <Form.Label>Alt Text</Form.Label>
                  <Form.Control
                    type="text"
                    name="altText"
                    placeholder="Alt Text"
                    value={formData.altText}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="caption">
                  <Form.Label>Caption</Form.Label>
                  <Form.Control
                    type="text"
                    name="caption"
                    placeholder="Caption"
                    value={formData.caption}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
}

export default Resource;