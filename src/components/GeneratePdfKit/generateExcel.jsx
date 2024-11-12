import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const GenerateExcelKit = () => {
  const { PdfKitData } = useSelector((state) => state.KITMANAGEMENT);
  const navigate = useNavigate();
  const [downloadUrl, setDownloadUrl] = useState("");

  if (PdfKitData.length === 0) {
    return <p>No data found to generate Excel</p>;
  }

  const handleGenerateExcel = () => {
    const worksheetData = PdfKitData.map((user) => ({
      QR_link: user.qr_link,
    //   QR_Code_URL: user.qr_code_url,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kit Data");

    // Generate buffer
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Create a download URL and set it to state
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
  };

  const handleClose = () => {
    navigate("/kit");
  };

  return (
    <div className="generateExcelWrapper">
      <div className="generateExcel">
        <button
          onClick={handleClose}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            cursor: "pointer",
            float: "right",
            marginBottom: "1rem",
          }}
        >
          Close
        </button>

        <button
          onClick={handleGenerateExcel}
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            cursor: "pointer",
            marginRight: "1rem",
          }}
        >
          Generate Excel
        </button>

        {downloadUrl && (
          <div style={{ marginTop: "1rem" }}>
            <a
              href={downloadUrl}
              download="kit_data.xlsx"
              style={{
                backgroundColor: "#17a2b8",
                color: "#fff",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "0.25rem",
                textDecoration: "none",
              }}
            >
              Download Excel
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateExcelKit;
