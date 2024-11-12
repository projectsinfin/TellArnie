import React, { useState } from "react";
import { Card } from "react-bootstrap";
import DataTable from "react-data-table-component";
import CustomPagination from "./Pagination";
import { FaSearch } from "react-icons/fa";

const DataTableComponent = ({
  title,
  data,
  columns,
  selectedRows,
  clickedrow,
  checkboxchange,
  search,
  searchBy = [],
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const itemsPerPage = 20;

  console.log(columns, "columns");

  // Ensure data is an array
  if (!Array.isArray(data)) {
    data = [];
  }

  // Helper function to extract the text from React elements (if name is a React element)
  const getColumnName = (column) => {
    if (typeof column.name === "object" && column.name.props?.children) {
      return column.name.props.children.toLowerCase(); // Get the text content and convert to lowercase
    }
    return (column.name || "").toLowerCase(); // Fallback if it's not an object, convert to lowercase
  };

  // Ensure searchBy is an array of strings
  const filteredData = data.filter((item) => {
    return searchBy.some((key) => {
      // Iterate over each key in the searchBy array
      const cellValue = item[key] || ""; // Access the value based on column name
      return cellValue
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  let displayedRange = `${
    indexOfFirstItem + 1
  }-${indexOfLastItem} of ${totalItems}`;

  if (currentItems.length < itemsPerPage) {
    displayedRange = `${indexOfFirstItem + 1}-${
      indexOfFirstItem + currentItems.length
    } of ${totalItems}`;
  }

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <Card style={{ border: "none" }}>
      <div style={{ padding: "10px" }}>
        <div className="d-flex align-items-center justify-content-between datatableSearch">
          <h3 className="px-2 card_title">
            {title} ({displayedRange})
          </h3>

          {search && (
            <div className="search">
              <input
                type="text"
                placeholder="Search  "
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </div>
          )}
        </div>

        <DataTable
          className="table_block mt-3"
          highlightOnHover={true}
          selectableRowsHighlight={true}
          onRowClicked={clickedrow}
          onSelectedRowsChange={checkboxchange}
          columns={columns}
          pagination={false}
          customStyles={{
            table: {
              style: {
                border: "1px solid white",
              },
            },
            headCells: {
              style: {
                color: "#A8A8BD",
                fontSize: 16,
              },
            },
            rows: {
              style: {
                borderBottom: "1px solid #C5C5D3",
                padding: 20,
              },
            },
          }}
          data={currentItems}
          selectableRows={selectedRows}
        />
      </div>

      {/* Render custom pagination outside the scrolling div */}
      <CustomPagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onFirstPage={() => setCurrentPage(1)}
        onLastPage={() => setCurrentPage(totalPages)}
      />
    </Card>
  );
};

export default DataTableComponent;
