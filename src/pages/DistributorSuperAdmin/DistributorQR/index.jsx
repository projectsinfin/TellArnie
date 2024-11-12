import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDistributorQRData } from "../../../redux/slice/DistributorQrSlice";

function DistQR() {
  const { status, DistributorQRData } = useSelector(
    (state) => state.DISTRIBUTORQR
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDistributorQRData());
  }, [dispatch]);

  // Ensure the data has been fetched before trying to use it
  const qrLink = DistributorQRData // Adjust based on actual data structure
  console.log(qrLink, "qrlink");

  const handleDownload = () => {
    if (qrLink) {
      fetch(qrLink)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'qrcode.jpg'; // Filename for the download
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error downloading the image:', error));
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>QR Code</h1>
      {/* Display the image if the URL is available */}
      {qrLink ? (
        <img
          src={qrLink}
          alt="QR Code"
          style={{ maxWidth: "50%", height: "auto" }}
        />
      ) : (
        <p>Loading QR code...</p>
      )}
      <div style={{ margin: "20px 0" }}>
        {/* Display the link if the URL is available */}
        {qrLink && (
          <a href={qrLink} target="_blank" rel="noopener noreferrer">
            {qrLink}
          </a>
        )}
      </div>
      <div>
        {qrLink && (
          <button
            onClick={handleDownload}
            style={{
              textDecoration: "none",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Download QR Code
          </button>
        )}
      </div>
    </div>
  );
}

export default DistQR;
