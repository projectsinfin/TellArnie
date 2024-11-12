const Product = require("../../models/Product");
const config = require("../../../config/config");
const User = require("../../models/User");
const csvParser = require("csv-parser");
const fs = require("fs");
const RegisteredKit = require("../../models/RegisteredKit");

const import_products = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        data: null,
        message: "User not found.",
        status: 404,
      });
    }

    const file = req.files[0];
    if (!file) {
      return res.status(400).json({
        data: null,
        message: "No file uploaded.",
        status: 400,
      });
    }

    const products = [];
    let existingCount = 0;
    let createdCount = 0;
    let failedCount = 0; // Initialize failed product count

    const processRow = async (row) => {
      const product_data = {
        brand: row.Brand,
        product_name: row.ProductName,
        kit_ref_id: row.VariantEAN,
        model_number: row.ModelNumber,
        status: "Compliant",
        // expiry_date: row.ExpiryDate,
        kit_picture: row.ProductPicture,
        company_id: "",
        current_quantity: row.Quantity,
        quantity: row.Quantity,
        lot_number: row.LotNumber,
        description: row.Description,
        qr_code: row.VariantEAN,
        product_code: row.ProductCode,
        is_dump: true,
      };

      try {
        const existing_product = await RegisteredKit.findOne({
          qr_code: row.VariantEAN,
        });

        if (existing_product) {
          existingCount++;
        } else {
          const new_product = await RegisteredKit.create(product_data);
          products.push(new_product);
          createdCount++; // Increment created product count
        }
      } catch (error) {
        console.error(`Error creating product: ${JSON.stringify(row)} - ${error.message}`);
        failedCount++; // Increment failed product count
      }
    };

    // Parse the CSV file
    const stream = fs.createReadStream(file.path).pipe(csvParser());

    stream.on("data", (row) => {
      stream.pause();
      processRow(row)
        .then(() => stream.resume())
        .catch((error) => {
          console.error(`Error processing row: ${JSON.stringify(row)} - ${error.message}`);
          stream.resume();
        });
    });

    stream.on("end", () => {
      fs.unlinkSync(file.path);
      res.status(200).json({
        data: {
          products,
          existingCount,
          createdCount, // Include created product count in the response
          failedCount, // Include failed product count in the response
        },
        message: "Products added successfully.",
        status: 200,
      });
    });

    stream.on("error", (error) => {
      console.error(`Error reading CSV file: ${error.message}`);
      fs.unlinkSync(file.path); // Ensure the file is deleted in case of an error
      res.status(500).json({
        data: null,
        status: 500,
        message: "Error processing file.",
      });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = import_products;
