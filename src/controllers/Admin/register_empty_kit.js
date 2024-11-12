const RegisteredKit = require("../../models/RegisteredKit");
const config = require("../../../config/config");
const qr = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const path = require("path");

const register_empty_kit = async (req, res) => {
  try {
    const {
      quantity
    } = req.body;

    const { SERVER_BASE_URL } = config;
    const { QR_URL } = config;

    const createdKits = [];

    for (let i = 0; i < quantity; i++) {
      const qr_code = uuidv4();
      const link = `${QR_URL}ID/${qr_code}`;
      const qrCodeDataWithLink = `${qr_code}\n${link}`;
      const qrCodeData = await qr.toDataURL(qrCodeDataWithLink);

      // Save QR code image to file
      const buffer = Buffer.from(qrCodeData.split(",")[1], "base64");
      const uploadDirectory = path.join(__dirname, "../../../uploads/qr_code_picture");
      const filePath = path.join(uploadDirectory, `${qr_code}.jpg`);

      await fs.writeFile(filePath, buffer);

      const newKit = new RegisteredKit({
        qr_code,
        qr_code_url: `${SERVER_BASE_URL}qr_code_picture/${qr_code}.jpg`,
 qr_link:link,
        company_id: "",
        status: "Compliant",
	      quantity:0,
	      current_quantity:0,
	is_empty:true
      });

      // Save the kit to the database
      const savedKit = await newKit.save();
      createdKits.push(savedKit);

    }

    return res.status(200).json({
      data: createdKits,
      message: "Kits and associated products registered successfully.",
      status: 200,
    });
  } catch (error) {
    console.error("Error registering kits and products:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: 500,
    });
  }
};



module.exports = register_empty_kit;
