const User = require("../../models/User");
const Distributor = require("../../models/Distributor");

const config = require("../../../config/config");
const qr = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const path = require("path");

const get_distributor_qr = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    const { SERVER_BASE_URL } = config;
    const { QR_URL } = config;

    const qr_code = uuidv4();
    const qr_code_data = `https://testflight.apple.com/join/WVJEW39E/email:${user.email}`;
    const qrCodeData = await qr.toDataURL(qr_code_data);


    // Save QR code image to file
    const buffer = Buffer.from(qrCodeData.split(",")[1], "base64");
    const uploadDirectory = path.join(
      __dirname,
      "../../../uploads/qr_code_picture"
    );
    const filePath = path.join(uploadDirectory, `${qr_code}.jpg`);

    await fs.writeFile(filePath, buffer);

    const qr_code_url = `${SERVER_BASE_URL}qr_code_picture/${qr_code}.jpg`;

    if (!user) {
      return res.status(404).json({
        data: null,
        status: 404,
        message: "User not found",
      });
    }



    return res.status(200).json({
      data: qr_code_url,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = get_distributor_qr;
