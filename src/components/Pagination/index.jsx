import React from "react";
import "./pagination.style.css"; // Import your CSS file for styling
import { Button } from "react-bootstrap";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";

const CustomPagination = ({
  totalItems,
  itemsPerPage,
  currentPage = 1,
  onPageChange,
  onFirstPage,
  onLastPage,
}) => {
  // Ensure totalItems and itemsPerPage are valid numbers
  totalItems = totalItems || 0;
  itemsPerPage = itemsPerPage || 1;

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagesToShow = 5; // Number of page numbers to show

  // Ensure currentPage is within valid range
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  // Calculate start and end page numbers to display
  let startPage = Math.max(1, validCurrentPage - Math.floor(pagesToShow / 2));
  let endPage = Math.min(startPage + pagesToShow - 1, totalPages);

  // Adjust startPage and endPage if current page is close to the beginning or end
  if (endPage - startPage + 1 < pagesToShow) {
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }

  const rangeText = `${Math.min((validCurrentPage - 1) * itemsPerPage + 1, totalItems)}-${Math.min(validCurrentPage * itemsPerPage, totalItems)} of ${totalItems}`;

  // Render pagination only if there are more than 1 page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="custom-pagination">
      <Button
        variant="light"
        onClick={onFirstPage}
        disabled={validCurrentPage === 1}
      >
                <FaArrowLeftLong />

        First
      </Button>
      <Button
        variant="light"
        onClick={() => onPageChange(validCurrentPage - 1)}
        disabled={validCurrentPage === 1}
      > 
      
        <FaArrowLeftLong />
        Previous
      </Button>
      <div className="page-indicator">
        {[...Array(endPage - startPage + 1)].map((_, index) => {
          const pageNumber = startPage + index;
          return (
            <span
              key={pageNumber}
              className={pageNumber === validCurrentPage ? "page-number selected" : "page-number"}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </span>
          );
        })}
      </div>
      <Button
        variant="light"
        onClick={() => onPageChange(validCurrentPage + 1)}
        disabled={validCurrentPage === totalPages}
      > Next
        <FaArrowRightLong />
      </Button>
      <Button
        variant="light"
        onClick={onLastPage}
        disabled={validCurrentPage === totalPages}
      >       

        Last
        <FaArrowRightLong />

      </Button>
    </div>
  );
};

export default CustomPagination;
