import React from "react";
import {
  PDFViewer,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import pfdimage from "../../Assets/Logo/pdflogo.png";
import pfdimageText from "../../Assets/Logo/pdflogo-text.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5,
  },
  column: {
    width: "25%",
    padding: 5,
  },
  cell: {
    border: 1,
    borderColor: "#000",
    borderRadius: 12,
    padding: 5,
  },
  textstyle: {
    padding: 5,
    fontSize: 6,
  },
  image: {
    width: 120,
    // height: 115,
    height: 108,

    borderRadius: 5,
    marginBottom: 5,
  },
  imagePrent: {
    // textAlign: "center",
  },

  barHeading: {
    color: "black",
    fontWeight: "bold", 
    fontSize:"17px",
    // Add this line to set font weight to 700
  },
  imageChildPdf: {
    width: 85,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "0px",
  },
  imagePdfText: {
    width: 120,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "0px",
  },
});

const GeneratePdfKit = () => {
  const { PdfKitData } = useSelector((state) => state.KITMANAGEMENT);
  console.log(PdfKitData, "get pdf data");
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation
  if (PdfKitData.length === 0) {
    return <p>No Pdf Found Yet </p>;
  }

  const handleClose = () => {
    navigate("/kit"); // Navigate back to home page
  };

  return (
    <div className="generatepdfWrapper">
      <div className="generatepdf">
        {/* Close button */}
        {/* <button onClick={handleClose}>Close</button> */}
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

            marginBottom: "1rem", // Bottom padding
          }}
        >
          Close
        </button>

        {/* PDF Viewer */}
        <PDFViewer width="100%" height="600">
          <Document title="kitbatchPDF">
            <Page size="A4" style={styles.page}>
              {PdfKitData &&
                PdfKitData?.map((user, index) => (
                  <View key={index} style={styles.column}>
                    <View style={styles.cell}>
                    <Image src={pfdimageText} style={styles.imagePdfText} />
                      <Image src={user.qr_code_url} style={styles.image} />
                      <View style={styles.imagePrent}>
                        <Image
                          src={pfdimage}
                          alt="pdfimage"
                          style={styles.imageChildPdf}
                        />
                      </View>
                    </View>
                    <Text style={styles.textstyle}>{user.qr_code}</Text>
                  </View>
                ))}
            </Page>
          </Document>
        </PDFViewer>
      </div>
    </div>
  );
};

export default GeneratePdfKit;