const config = require("../../../config/config");
const RegisteredKit = require("../../models/RegisteredKit");
const User = require("../../models/User");
const Product = require("../../models/Product");
const qr = require("qrcode");
const nodemailer = require("nodemailer");
const pdf = require("html-pdf");

const add_kit_location = async (req, res) => {
  try {
    const {
      location_name,
      area,
      kit_location_pic,
      kit_id,
      location_id,
      is_moving,
      is_empty,
      products,
      lot_number,
      expiry_date,
      kit_pic,
      product_code,
      brand,
      model_number,
      product_name
    } = req.body;

    let parsedProducts;
   if(is_empty == "true" || is_empty == true){
    try {
      console.log("typeof products-----", typeof products);
      parsedProducts = typeof products === 'string' ? JSON.parse(products) : products;
      console.log("parsedProducts-----", parsedProducts);
    } catch (err) {
      return res.status(400).json({ status: 400, message: "Invalid products format" });
    }

    if (!Array.isArray(parsedProducts)) {
      return res.status(400).json({ status: 400, message: "Invalid products format" });
    }
}

    const { SERVER_BASE_URL, QR_URL } = config;
    const { userId } = req.user;
    const user = await User.findById(userId);

    const updateFields = {};

    if (area) {
      updateFields.area = area;
    }

    if (location_name) {
      updateFields.location_name = location_name;
    }

    if (location_id) {
      updateFields.location_id = location_id;
      updateFields.company_id = user.company_id;
    }

    if (is_moving !== undefined) {
      updateFields.is_moving = is_moving;
    }

    if (lot_number) {
      updateFields.lot_number = lot_number;
    }

    if (expiry_date) {
      updateFields.expiry_date = expiry_date;
    }

    if (is_empty == "true" || is_empty == true) {
      updateFields.product_name = product_name;
      updateFields.product_code = product_code;
      updateFields.brand = brand;
      updateFields.kit_picture = kit_pic;
      updateFields.model_number = model_number;
      updateFields.is_empty = false;
    }

    if (req.files.length > 0) {
      if (req.files[0].fieldname === "kit_location_pic") {
        const kit_location_pic_name = req.files[0].filename;
        updateFields.kit_location_pic = `${SERVER_BASE_URL}kit_location_pictures/${kit_location_pic_name}`;
      }
    }

    let kit_found = await RegisteredKit.findById(kit_id);
    console.log("kit----", kit_found);

    if (is_empty == "true" || is_empty == true) {
      console.log('Adding products');
      const productsData = parsedProducts.map(product => ({
        product_name: product.description,
        description: product.description,
        quantity: product.quantity,
        brand: product.brand,
        product_picture: product.product_picture || "",
        product_code: product.product_code,
        current_quantity: product.quantity,
        expiry_date: product.expiry_date || "",
        item_not_expire: product.expiry_date ? false : true,
        is_dump: false,
        kit_id: kit_id, // Associate product with the current kit
      }));

      // Insert products into the database
      await Product.insertMany(productsData);

// Calculate total quantity
    // Ensure quantity is treated as a number during summation
const totalQuantity = parsedProducts.reduce((sum, product) => sum + Number(product.quantity), 0);


    // Update kit quantity
    kit_found.quantity = totalQuantity;
    await kit_found.save(); // Save the updated kit
    }

    const link = `${QR_URL}ID/${kit_found.qr_code}`;
    const qrCodeDataWithLink = `${kit_found.qr_code}\n${link}`;
    const qrCodeDataURL = await qr.toDataURL(qrCodeDataWithLink);
    const base64Image = qrCodeDataURL.split(",")[1];

    // HTML content to convert to PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
              body {
                  font-family: "Inter", sans-serif;
              }
              html {
                  zoom: 50% !important;
              }
          </style>
      </head>
      <body style="padding: 0px; margin: 0px;min-width:1000px;">
          <div class="qr_block" style="padding: 30px; background-image: url(https://api.beta.tellarnie.hsvpclubs.com/dump_pictures/pdfimage.svg); height: 2150px; object-fit: cover; background-repeat: no-repeat; background-size: 100%; background-color: #1A7C3F; overflow: hidden;position:relative;">
               <div class="bottom_green clearfix" style="position:absolute;top:55.5%;right:21%;box-sizing:border-box;padding-left: 35%;padding-top: 15px;  display: flex;">
                  <div class="left" style="float: left;box-sizing:border-box; padding-top: 50px; width: 50%; padding-right: 15px;"></div>
                  <div class="scanner_code_block" style="float: left;box-sizing:border-box;margin-top:-40px;margin-left:-90px; width: 50%; padding-top:0px; padding-left:35px;">
                      <div class="scanner_code" style="width: 485px; height: 485px; background-color: #fff; padding: 10px;">
                          <img src="${kit_found.qr_code_url}" style="width: 100%; height: 100%;">
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

    const options = {
      format: "A4",
      width: "800px",
      height: "1105px",
      base: "./assets",
      childProcessOptions: {
        env: { OPENSSL_CONF: "/dev/null" },
      },
    };

    pdf.create(htmlContent, options).toBuffer(async (err, pdfBuffer) => {
      if (err) {
        console.error("Error generating PDF:", err);
        return res.status(500).json({ status: 500, message: "Error generating PDF" });
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: "noreply@tellarnie.com",
          pass: "Ng$`+p-;bdhJt~S4E.cvGwBr*{W=8[ZDHsQ5^FK(]?2U!A3fYz",
        },
      });

      const currentDate = new Date().toLocaleString("en-GB", { timeZone: "UTC", hour12: false });

      const mailOptions = {
        from: "noreply@tellarnie.com",
        to: user.email,
        subject: "Kit registered successfully",
        text: `Congratulations! Kit successfully registered in ${updateFields.location_name || "location"}, ${updateFields.area || "Area"} on ${currentDate}.`,
        attachments: [
          { filename: "QR Code.pdf", content: pdfBuffer, contentType: "application/pdf" },
          { filename: "QRCode.png", content: Buffer.from(base64Image, 'base64'), contentType: 'image/png' }
        ],
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          return res.status(500).json({ status: 500, message: "Error sending email" });
        }

        console.log("Email sent:", info.response);
        const newupdate = await RegisteredKit.findByIdAndUpdate(kit_id, updateFields);

        return res.status(200).json({
          status: 200,
          message: "Kit location updated successfully.",
          data: updateFields,
        });
      });
    });

  } catch (error) {
    console.error("Error adding location:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = add_kit_location;
