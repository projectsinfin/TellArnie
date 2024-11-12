const RegisteredKit = require("../../models/RegisteredKit");
const User = require("../../models/User");
const Product = require("../../models/Product");
const config = require("../../../config/config");
const qr = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const path = require("path");

const register_kit_admin = async (req, res) => {
  try {
    const {
      product_name,
      lot_number,
      brand,
      product_code,
      model_number,
      expiry_date,
      distributor_id,
      quantity,
      kit_ref_id,
      kit_picture,
      batch_number,
      products
    } = req.body;

    const { userId } = req.user;

    // Validate user ID
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required.",
        status: 400
      });
    }

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        status: 404
      });
    }

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
      console.log("QR code image saved successfully.");

	 // Calculate total quantity from products array
      let totalQuantity = 0;
      for (const product of products) {
        totalQuantity += product.quantity;
      }

      // Create a new kit
      const newKit = new RegisteredKit({
        qr_code,
        qr_code_url: `${SERVER_BASE_URL}qr_code_picture/${qr_code}.jpg`,
        qr_link:link,
        product_name,
        distributor_id,
        kit_ref_id,
        product_code,
        kit_picture: convertProductPictureUrl(kit_picture),
        batch_number,
        brand,
        model_number,
        lot_number,
        company_id: "",
        status: "Compliant",
	   quantity:totalQuantity,
	      current_quantity:totalQuantity,
        expiry_date,
      });

      // Save the kit to the database
      const savedKit = await newKit.save();
      createdKits.push(savedKit);

      // Prepare products data with associated kit_id for insertion
      const productsData = products.map(product => ({
        product_name: product.product_name,
        description: product.product_name,
        quantity: product.quantity,
	product_code:product.product_code,
        current_quantity: product.quantity,
        expiry_date: product.expiry_date||"" ,
        item_not_expire: product.item_not_expire,
        is_dump: false,
        kit_id: savedKit._id, // Associate product with the current kit
      }));

      // Insert products into the database
      await Product.insertMany(productsData);
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

// Helper function to convert product picture URL
const convertProductPictureUrl = (originalUrl) => {
  return originalUrl.replace(
    "tradeportal.reliancemedical.co.uk/images/product/source",
    "online.tellarnie.co.uk/dump_pictures"
  );
};

module.exports = register_kit_admin;
