const Product = require("../../models/Product");
const config = require("../../../config/config");
const User = require("../../models/User");
const RegisteredKit = require("../../models/RegisteredKit");

const add_product = async (req, res) => {
  try {
    const {
      barcode,
      brand,
      product_picture,
      description,
      quantity,
      lot_number,
      expiry_date,
      kit_id,
      product_code,
      item_not_expire
    } = req.body;

    const { userId } = req.user;
    const user = await User.findById(userId);
    const kit = await RegisteredKit.findById(kit_id);

    const { SERVER_BASE_URL } = config;

    const product_data = {};

    if (brand) {
      product_data.brand = brand;
      product_data.company_id = user.company_id;
    }
    if (barcode) {
      const existing_barcode = await Product.findOne({
        barcode: barcode,
        kit_id: kit_id
      });

      if (existing_barcode) {
        return res.status(200).json({
          message: "This product is already added to the kit.",
          status: 200,
          is_product_added: false
        });
      }
      product_data.barcode = barcode;
    }

    if (description) {
      product_data.description = description;
    }

    if (quantity) {
      product_data.quantity = quantity;
      product_data.current_quantity = quantity;
    }

    if (lot_number) {
      product_data.lot_number = lot_number;
    }

    if (product_code) {
      product_data.product_code = product_code;
    }

    if (item_not_expire) {
      product_data.item_not_expire = item_not_expire;
    }

    if (item_not_expire == true || item_not_expire == 'true') {
      product_data.expiry_date = null;
    } else {
      product_data.expiry_date = expiry_date;
    }

    if (kit_id) {
      product_data.kit_id = kit_id;
    }

    if (req.files.length > 0) {
      if (req.files[0].fieldname == "product_picture") {
        const product_picture_name = req.files[0].filename;
        product_data.product_picture = `${SERVER_BASE_URL}product_pictures/${product_picture_name}`;
      }
    }

    console.log(product_data, "product");

    // Create the new product
    let new_product = await Product.create(product_data);

    // Update the current_quantity of the kit by adding the quantity of the new product
    if (kit) {
      kit.current_quantity = (kit.current_quantity || 0) + parseInt(quantity); // Add the quantity to current_quantity
      
      // Check if the product's expiry date is earlier than the kit's expiry date
      if (expiry_date && (!kit.expiry_date || new Date(expiry_date) < new Date(kit.expiry_date))) {
        kit.expiry_date = expiry_date; // Update the kit's expiry date
      }
      
      await kit.save(); // Save the updated kit
    }

    return res.status(200).json({
      data: {
        product_id: new_product._id,
        qr_code: kit ? kit.qr_code : null
      },
      message: "Product added successfully.",
      status: 200,
      is_product_added: true
    });
  } catch (error) {
    console.error(error);
    // Handle errors
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message
    });
  }
};

module.exports = add_product;
