import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { IoCloudUploadOutline } from "react-icons/io5";
import "./style.css";
import { NavLink } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

function UploadComponentpic() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const inputref = useRef();
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIscomplete] = useState(false);
  const barWidthHandler = () => {
    const totalProgressSteps = 10;
    const percentageInterval = 100 / totalProgressSteps;
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setIscomplete(true);
          clearInterval(interval);
          return 100;
        }
        return prevProgress + percentageInterval;
        setIscomplete(false);
      });
    }, 500);
  };
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const allowedFormats = ["csv", "xls", "xlsx"];
      for (let i = 0; i < files.length; i++) {
        const fileName = files[i].name;
        const fileFormat = fileName.split(".").pop();
        if (!allowedFormats.includes(fileFormat.toLowerCase())) {
          toast.error("Only CSV or XLS format supported");
          return;
        }
        if (selectedFiles.find((file) => file.name === fileName)) {
          toast.error("File already exists");
          return;
        }
      }
      barWidthHandler();
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    const allowedFormats = ["csv", "xls", "xlsx"];
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i].name;
      const fileFormat = fileName.split(".").pop();
      if (!allowedFormats.includes(fileFormat.toLowerCase())) {
        toast.error("Only CSV or XLS format supported");
        return;
      }
      if (selectedFiles.find((file) => file.name === fileName)) {
        toast.error("File already exists");
        return;
      }
    }
    barWidthHandler();
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeBarHandler = (selectedbar) => {
    if (window.confirm("Are you sure want to remove this file ?")) {
      setSelectedFiles(
        selectedFiles.filter((_, index) => index !== selectedbar)
      );
    }
  };

  return (
    <div className="uploadfiles">
      <h3 className="text-center">Upload Supporting Files</h3>
      <hr />
      <div className="browsefile d-flex mt-4">
        <Form.Control
          type="text"
          disabled
          placeholder="Choose files to upload"
          className="custominput"
        />
        <button
          className="btn btn-primary customradius"
          onClick={() => inputref.current.click()}
        >
          Browse Files
        </button>
        <input
          type="file"
          onChange={handleFileChange}
          ref={inputref}
          className="d-none"
          multiple
        />
      </div>
      <hr />
      {!selectedFiles.length > 0 && (
        <div
          className={`dropcontainer ${dragging ? "bg-success text-white" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="inner">
            <IoCloudUploadOutline className="text_gray" size={50} />
            <h3 className="text_gray mt-2">
              {dragging ? "Dropping..." : "Drag and drop here"}{" "}
            </h3>
          </div>
        </div>
      )}

      {selectedFiles &&
        selectedFiles.map((curElm, index) => (
          <div
            className="progresswrapper d-flex align-items-center mt-4"
            key={index}
          >
            <div style={{ width: "97%" }}>
              <div className="d-flex justify-content-between align-items-center pb-2">
                <div className="aboutfile">
                  {progress === 100 && (
                    <div className="inner">
                      <span>{curElm?.name}</span>
                      <span className="text_gray mt-1">({curElm?.size})</span>
                    </div>
                  )}
                </div>
                <h6 className="m-0">{`${progress}%`} </h6>
              </div>

              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  style={{ width: `${isComplete}&& ${progress}%:` }} // Set width based on progress
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
            <div
              className="text_gray cursor"
              onClick={() => removeBarHandler(index)}
            >
              <IoClose size={25} />
            </div>
          </div>
        ))}

      <div className="justify-content-end d-flex mt-5">
        <button className="btn btn-dark me-3" type="button">
          Cancel
        </button>
        <button
          className="btn btn-primary"
          type="button"
          // onClick={"/importproducts"}
        >
          <NavLink to="/uploadproducts" className="btn btn-primary">
            Next
          </NavLink>
        </button>
      </div>
    </div>
  );
}

export default UploadComponentpic;

// import React, { useRef, useState } from "react";
// import { Form } from "react-bootstrap";
// import { IoCloudUploadOutline } from "react-icons/io5";
// import "./style.css";
// import { NavLink } from "react-router-dom";
// import { IoClose } from "react-icons/io5";
// import { toast } from "react-toastify";

// function UploadComponentpic() {
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const inputref = useRef();
//   const [dragging, setDragging] = useState(false);
//   const barWidthHandler = async (data) => {
//     console.log("datafile", data);
//     const totalProgressSteps = 10;
//     const percentageInterval = 100 / totalProgressSteps;

//     const interval = setInterval(() => {
//       if (data.progressBar >= 100) {
//         clearInterval(interval);
//         return 100;
//       }
//       data = { ...data, progressBar: data.progressBar + percentageInterval };
//       setSelectedFiles([...selectedFiles, data]);
//       // });
//     }, 500);
//     console.log("data", selectedFiles.length);
//   };
//   const handleFileChange = (event) => {
//     const files = event.target.files;
//     if (files.length > 0) {
//       const allowedFormats = ["csv", "xls", "xlsx"];
//       for (let i = 0; i < files.length; i++) {
//         const fileName = files[i].name;
//         const fileFormat = fileName.split(".").pop();
//         if (!allowedFormats.includes(fileFormat.toLowerCase())) {
//           toast.error("Only CSV or XLS format supported");
//           return;
//         }
//         if (selectedFiles.find((file) => file.name === fileName)) {
//           toast.error("File already exists");
//           return;
//         }
//       }

//       // setSelectedFiles([...selectedFiles, { files: files, progressBar: 0 }]);
//       barWidthHandler({ files: files, progressBar: 0 });
//     }
//   };
//   console.log("filesselected", selectedFiles);

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     setDragging(true);
//   };

//   const handleDragLeave = (event) => {
//     event.preventDefault();
//     setDragging(false);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     setDragging(false);
//     const files = event.dataTransfer.files;
//     const allowedFormats = ["csv", "xls", "xlsx"];
//     for (let i = 0; i < files.length; i++) {
//       const fileName = files[i].name;
//       const fileFormat = fileName.split(".").pop();
//       if (!allowedFormats.includes(fileFormat.toLowerCase())) {
//         toast.error("Only CSV or XLS format supported");
//         return;
//       }
//       if (selectedFiles.find((file) => file.name === fileName)) {
//         toast.error("File already exists");
//         return;
//       }
//     }
//     barWidthHandler();
//     // setSelectedFiles([...selectedFiles, ...files]);
//   };

//   const removeBarHandler = (selectedbar) => {
//     if (window.confirm("Are you sure want to remove this file ?")) {
//       setSelectedFiles(
//         selectedFiles.filter((_, index) => index !== selectedbar)
//       );
//     }
//   };

//   return (
//     <div className="uploadfiles">
//       <h3 className="text-center">Upload Supporting Files</h3>
//       <hr />
//       <div className="browsefile d-flex mt-4">
//         <Form.Control
//           type="text"
//           disabled
//           placeholder="Choose files to upload"
//           className="custominput"
//         />
//         <button
//           className="btn btn-primary customradius"
//           onClick={() => inputref.current.click()}
//         >
//           Browse Files
//         </button>
//         <input
//           type="file"
//           onChange={handleFileChange}
//           ref={inputref}
//           className="d-none"
//           multiple
//         />
//       </div>
//       <hr />
//       {!selectedFiles.length > 0 && (
//         <div
//           className={`dropcontainer ${dragging ? "bg-success text-white" : ""}`}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//         >
//           <div className="inner">
//             <IoCloudUploadOutline className="text_gray" size={50} />
//             <h3 className="text_gray mt-2">
//               {dragging ? "Dropping..." : "Drag and drop here"}{" "}
//             </h3>
//           </div>
//         </div>
//       )}

//       {selectedFiles &&
//         selectedFiles.map((curElm, index) => (
//           <div
//             className="progresswrapper d-flex align-items-center mt-4"
//             key={index}
//           >
//             <div style={{ width: "97%" }}>
//               <div className="d-flex justify-content-between align-items-center pb-2">
//                 <div className="aboutfile">
//                   {curElm.progressBar === 100 && (
//                     <div className="inner">
//                       <span>{curElm?.name}</span>
//                       <span className="text_gray mt-1">({curElm?.size})</span>
//                     </div>
//                   )}
//                 </div>
//                 <h6 className="m-0">{`${curElm.progressBar}%`} </h6>
//               </div>

//               <div className="progress">
//                 <div
//                   className="progress-bar progress-bar-striped progress-bar-animated"
//                   style={{ width: `${curElm.progressBar}%` }} // Set width based on progress
//                   role="progressbar"
//                   aria-valuemin="0"
//                   aria-valuemax="100"
//                 ></div>
//               </div>
//             </div>
//             <div
//               className="text_gray cursor"
//               onClick={() => removeBarHandler(index)}
//             >
//               <IoClose size={25} />
//             </div>
//           </div>
//         ))}

//       <div className="justify-content-end d-flex mt-5">
//         <button className="btn btn-dark me-3" type="button">
//           Cancel
//         </button>
//         <button
//           className="btn btn-primary"
//           type="button"
//           // onClick={"/importproducts"}
//         >
//           <NavLink to="/uploadproducts" className="btn btn-primary">
//             Next
//           </NavLink>
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UploadComponentpic;
