const RegisteredKit = require("../../models/RegisteredKit");
const config = require("../../../config/config");
const User = require("../../models/User");
const qr = require("qrcode");
const {v4 : uuidv4} = require("uuid");
const nodemailer = require("nodemailer");

const register_kit = async (req, res) => {
  try {
    const { SERVER_BASE_URL } = config;
    const { LOCAL_BASE_URL } = config;

    const {
      brand,
      model_number,
      product_code,
      product_name,
      lot_number,
      expiry_date,
      kit_picture,
    } = req.body;

    const { userId } = req.user; // Get the logged-in user's ID and email
    const user = await User.findById(userId);

    const kit_data = {};

     const qr_code = uuidv4();

    //  const link = `https://tellarnie.co.uk/ID/${qr_code}`;
        
       // const qrCodeDataWithLink = `${qr_code} \n ${link}`;
  
       // const qrCodeData = await qr.toDataURL(qrCodeDataWithLink);


    kit_data.qr_code = qr_code

    console.log(req.user);


    // Convert the data URI to a buffer
   // const buffer = Buffer.from(qrCodeData.split(",")[1], "base64");



    // Constructing kit_data object
    if (brand) {
      kit_data.brand = brand;
    }
    if (product_code) {
      kit_data.model_number = product_code;
      kit_data.company_id = user.company_id;
      kit_data.status = "Compliant";
    }
    if (product_code) {
      kit_data.product_code = product_code;
    }
    if (product_name) {
      kit_data.product_name = product_name;
    }
    if (lot_number) {
      kit_data.lot_number = lot_number;
    }
    if (expiry_date) {
      kit_data.expiry_date = expiry_date;
    }
    if (req.files.length > 0) {
      if (req.files[0].fieldname == "kit_picture") {
        console.log("here i am");
        const kit_picture_name = req.files[0].filename;
        kit_data.kit_picture = `${SERVER_BASE_URL}kit_pictures/${kit_picture_name}`;
      }
    
    }

    // Creating the registered kit
    let new_kit = await RegisteredKit.create(kit_data);

  
    return res.status(200).json({
      data: {
        kit_id: new_kit._id,
        qr_code: qr_code
      },
      message: "Kit registered successfully.",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      status: 500,
      message: error,
    });
  }
};

module.exports = register_kit;
