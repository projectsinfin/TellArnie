import React from "react";
import "./pagination.style.css"; // Import your CSS file for styling
import { Button } from "react-bootstrap";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";

const CustomPagination = ({
  pages = 8,
  currentPage = 2,
  onPageChange,
  onPreviousPage,
  onNextPage,
}) => {
  const totalPages = pages;
  const visiblePages = 5;
  const leftEllipsis = currentPage - visiblePages > 1;
  const rightEllipsis = currentPage + visiblePages < totalPages;

  return (
    <div className="custom-pagination">
      <Button
        variant="light"
        onClick={onPreviousPage}
        disabled={currentPage === 1}
      >
        <FaArrowLeftLong /> Previous
      </Button>
      <div className="page-indicator">
        {[...Array(pages)].map((_, index) => {
          if (
            (index < visiblePages && index < currentPage + visiblePages) ||
            (index >= totalPages - visiblePages &&
              index > currentPage - visiblePages) ||
            index === 0 ||
            index === totalPages - 1 ||
            index === currentPage - 1 ||
            index === currentPage ||
            index === currentPage + 1 ||
            (index === currentPage + 2 && rightEllipsis) ||
            (index === currentPage - 2 && leftEllipsis)
          ) {
            return (
              <span
                key={index}
                className={
                  currentPage === index + 1
                    ? "page-number selected"
                    : "page-number"
                }
                onClick={() => onPageChange(index + 1)} // Handle click event for page number
              >
                {index + 1}
              </span>
            );
          }
          return null;
        })}
        {rightEllipsis && <span>...</span>}
      </div>
      <Button
        variant="light"
        onClick={onNextPage}
        disabled={currentPage === pages}
      >
        Next <FaArrowRightLong />
      </Button>
    </div>
  );
};

export default CustomPagination;