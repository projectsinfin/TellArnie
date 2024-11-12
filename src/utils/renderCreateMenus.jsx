import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Import from "../Assets/svgs/headingSvgs/Button.svg";
import Create from "../Assets/svgs/headingSvgs/Button (2).svg";
import Export from "../Assets/svgs/headingSvgs/Button (1).svg";
import Invite from "../Assets/svgs/headingSvgs/Button (3).svg";
import CustomExportModal from "../components/Common/CustomExportFileModal";
import { useState } from "react";
import CustomImportFileModal from "../components/Common/CustomImportFileModal";
import CustomMultipleFileModal from "../components/Common/CustomMultiPleFileModal";
import LocationPopup from "../pages/BusinessProfile/LocationPopup/LocationPopup";
import DistributorModal from "../pages/Distributors/DistributorInformation/DistributorPopup/DIstributorPopup";

// custom map array for importmapheader

const mappedArrayForProduct = [
  // {
  //   label: "Skip",
  //   value: "skip",
  // },
  {
    label: "ProductName",
    value: "product_name",
  },
  {
    label: "ProductCode",
    value: "product_code",
  },
  {
    label: "Brand",
    value: "brand",
  },
  {
    label: "Description",
    value: "description",
  },
  {
    label: "VariantEAN",
    value: "variant_ean",
  },
  {
    label: "ModelNumber",
    value: "model_number",
  },
  {
    label: "BatchNumber",
    value: "batch_number",
  },
  // {
  //   label: "ExpiryDate",
  //   value: "expiry_date",
  // },
  {
    label: "LotNumber",
    value: "lot_number",
  },
  {
    label: "KitRefId",
    value: "kit_ref_id",
  },
 
  {
    label: "ProductPicture",
    value: "product_picture",
  },
  {
    label: "Quantity",
    value: "quantity",
  },
];

const mappedArrayForKits=[
 
  {
    label: " Product Name",
    value: "product_name",
  },
  {
    label: "Product Code",
    value: "product_code",
  },
  {
    label: "UAN Number",
    value: "kit_ref_id",
  },
  {
    label: "Registered Date",
    value: "registered",
  },
  {
    label: "Kit Picture",
    value: "kit_picture",
  },
  {
    label: "QR Code",
    value: "qr_code",
  },
  {
    label: "Quantity",
    value: "quantity",
  },
  {
    label: "Brand",
    value: "brand",
  },
  {
    label: "Location",
    value: "location_name",
  },
  {
    label: "Area",
    value: "area",
  },
  {
    label: "Batch Number  ",
    value: "batch_number",
  },
  {
    label: "LOT Number",
    value: "lot_number",
  },
  {
    label: "Expiry Date",
    value: "expiry_date",
  },
  {
    label: "Status",
    value: "status",
  },
  // {
  //   label: "Status",
  //   value: "status",
  // },
]
const mappedArrayForUser = [
  // {
  //   label: "Skip",
  //   value: "skip",
  // },
  {
    label: "FirstName",
    value: "first_name",
  },
  {
    label: "LastName",
    value: "last_name",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "ContactNumber",
    value: "contact_number",
  },
  {
    label: "CountryCode",
    value: "country_code",
  },
 
  {
    label: "ProfilePicUrl",
    value: "profile_pic",
  },
  {
    label: "IsMentallyFit",
    value: "is_mentally_fit",
  },
  {
    label: "JobTitle",
    value: "job_title",
  },
  // {
  //   label: "Firstaid Certificate",
  //   value: "firstaid_certificate",
  // },
  // {
  //   label: "FirstaidCertificate Date",
  //   value: "firstaid_certificate_date",
  // },
 
  {
    label: "AssignedRole",
    value: "assigned_role",
  },
  // {
  //   label: "Permissions",
  //   value: "permissions",
  // },
];

const mappedArrayForDistributor = [
  {
    label: "Skip",
    value: "skip",
  },
  {
    label: "Distributor Name",
    value: "distributor_name",
  },
  {
    label: "Street",
    value: "street",
  },
  {
    label: "County",
    value: "county",
  },
  {
    label: "Country",
    value: "country",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Postal Code",
    value: "postal_code",
  },
  {
    label: "Country Code",
    value: "country_code",
  },
  {
    label: "Contact Number",
    value: "contact_number",
  },
  {
    label: "Company Logo",
    value: "company_logo",
  },
  {
    label: "Company White Logo",
    value: "company_white_logo",
  },
  {
    label: "Alternate Distributor Name",
    value: "alternate_distributor_name",
  },
  {
    label: "Role",
    value: "role",
  },
];

export const createMenus = {
  "/": null,
  "/businessprofile": null,
  "/products": [
    // {
    //   title: "Create Products",
    //   icon: <img src={Create} alt="Product Icon" />,
    //   link: "",
    // },
    {
      title: "Import Products",
      icon: <img src={Import} alt="Import Icon" />,
      link: "",
      modalname: "Import",
      mapArray: mappedArrayForProduct,
      csvtitle: "Reliance_Import_Product",
    },
    {
      title: "Export Products",
      icon: <img src={Export} alt="Export Icon" />,
      link: "",
      modalname: "Export",
      mapArray: mappedArrayForProduct,
    },
  ],
  "/kit": [
    {
      title: "Batch Create Kits",
      icon: <img src={Create} alt="Kit Icon" />,
      link: "/createkit",
    },
    // {
    //   title: "Import Kits",
    //   icon: <img src={Import} alt="Import Icon" />,
    //   link: "",
    // },
    // {
    //   title: "Export Kits",
    //   icon: <img src={Export} alt="Export Icon" />,
    //   link: "",
    //   modalname: "Export",
    // },
    {
      title: "Create Empty Kits",
      icon: <img src={Create} alt="Kit Icon" />,
      link: "/createemptykit",
    },
    {
      title: "Export Kits",
      icon: <img src={Export} alt="Export Icon" />,
      link: "",
      modalname: "Export",
      mapArray: mappedArrayForKits,
    },
  ],
  "/users": [
    // {
    //   title: "Invite Admin",
    //   icon: <img src={Invite} alt="User Icon" />,
    //   link: "/user-management",
    // },
    {
      title: "Invite User",
      icon: <img src={Create} alt="User Icon" />,
      link: "/create-users",
    },
    {
      title: "Import Users",
      icon: <img src={Import} alt="Import Icon" />,
      link: "",
      modalname: "Import",
      mapArray: mappedArrayForUser,
      csvtitle: "Reliance_Import_User",
    },
    {
      title: "Export Users",
      icon: <img src={Export} alt="Export Icon" />,
      link: "",
      modalname: "Export",
      mapArray: mappedArrayForUser,
    },
  ],
  "/distributors": [
    {
      title: "Create Distributor",
      icon: <img src={Create} alt="Distributor Icon" />,
      link: "/distributorinfo",
      modalname:"DistributorModal"
    },
    {
      title: "Import Distributors",
      icon: <img src={Import} alt="Import Icon" />,
      link: "",
      modalname: "Import",
      mapArray: mappedArrayForDistributor,
      csvtitle: "Reliance_Import_Distributor",
    },
    {
      title: "Export Distributors",
      icon: <img src={Export} alt="Export Icon" />,
      link: "",
      modalname: "Export",
      mapArray: mappedArrayForDistributor,
    },
  ],
  "/reports": [
    {
      title: "Create Report",
      icon: <img src={Create} alt="Report Icon" />,
      link: "/reporteditor",
    },
    {
      title: "Create Group",
      icon: <img src={Create} alt="Create Group Icon" />,
      link: "/creategroupreport",
    },
  ],
  "/resource": [
    {
      title: "Upload Files",
      icon: <img src={Create} alt="Resource Icon" />,
      link: "",
      modalname: "UploadMultiple",
    },
  ],
  "/messaging": [
    {
      title: "Create article",
      icon: <img src={Create} alt="Messaging Icon" />,
      link: "/editarticle",
    },
    {
      title: "Create Notification",
      icon: <img src={Create} alt="Create Notification Icon" />,
      link: "/edit-notification",
    },
  ],

  "/distributor/usermanagement": [
    // {
    //   title: "Invite Admin",
    //   icon: <img src={Invite} alt="User Icon" />,
    //   link: "/distributor/invite/admin",
    // },
    {
      title: "Invite User",
      icon: <img src={Create} alt="User Icon" />,
      link: "/distributor/createuser",
    },
    {
      title: "Import Users",
      icon: <img src={Import} alt="Import Icon" />,
      link: "",
      modalname: "Import",
      mapArray: mappedArrayForDistributor,
    },
    {
      title: "Export Users",
      icon: <img src={Export} alt="Export Icon" />,
      link: "",
      modalname: "Export",
      mapArray: mappedArrayForDistributor,
    },
  ],

  // custom destributor

  "/notifications": null,
};

const CreateActions = ({
  title,
  icon,
  link,
  modalname,
  mapArray,
  csvtitle,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showMultipleFileModal, setShowMultipleFileModal] = useState(false);
  const [showDistributorModal, setShowDistributorModal] = useState(false);


  return (
    <div className="top-btns">
      <Card style={{ borderRadius: 16, border: "none" }}>
        {!link ? (
          <Button
            variant="primary"
            className="icon-button"
            onClick={() => {
              if (modalname === "Import") {
                setShowImportModal(true);
              } else if (modalname === "Export") {
                setShowModal(true);
              
            }
           

              if (modalname === "DistributorModal") {
                setShowDistributorModal(true);
              }
               if (modalname === "UploadMultiple") {
                setShowMultipleFileModal(true);
              }
            }}
          >
            {icon}
            <h3 className="button-text m-1">{title}</h3>
          </Button>
        ) : (
          <Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
            <Button variant="primary" className="icon-button">
              {icon} 
              <h3 className="button-text m-1">{title}</h3>
            </Button>
          </Link>
        )}
      </Card>
      {showModal && (
        <CustomExportModal
          icon={icon}
          show={showModal}
          hide={setShowModal}
          heading={title}
          mapArray={mapArray}
        />
      )}
      {showImportModal && (
        <CustomImportFileModal
          csvtitle={csvtitle}
          icon={icon}
          show={showImportModal}
          hide={setShowImportModal}
          heading={title}
          mapArray={mapArray}
        />
      )}

      {showMultipleFileModal && (
        <CustomMultipleFileModal
          icon={icon}
          show={showMultipleFileModal}
          hide={setShowMultipleFileModal}
          heading={title}
        />
      )}
       {showDistributorModal && (
        <DistributorModal
          icon={icon}
          show={showDistributorModal}
          hide={setShowDistributorModal}
          heading={title}
        />
      )}




    </div>
  );
};

const RenderCreateMenus = ({ pathname }) => {
  return (
    <div className="kits_row px-0">
      {createMenus[pathname].map((menuItem, i) => {
        return (
          <CreateActions
            key={i}
            title={menuItem.title}
            icon={menuItem.icon}
            link={menuItem.link !== "" ? menuItem.link : null}
            modalname={menuItem.modalname}
            mapArray={menuItem?.mapArray}
            csvtitle={menuItem?.csvtitle}
          />
        );
      })}
    </div>
  );
};

export default RenderCreateMenus;
