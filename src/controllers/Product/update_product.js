const Product = require("../../models/Product");
const RegisteredKit = require("../../models/RegisteredKit");

const update_product = async (req, res) => {
  try {
    const productId = req.query.productId;
    const {
      quantity,
      lot_number,
      expiry_date,
      item_not_expire,
      kit_id
    } = req.body;

    console.log(productId);
    const product = await Product.findById(productId);

    const kit = await RegisteredKit.findById(kit_id);

    const updateFields = {};

    if (quantity) {
      updateFields.current_quantity = quantity ;
      updateFields.quantity = quantity ;
      updateFields.product_name = product.product_name;
      updateFields.description = product.description;
      updateFields.product_picture = product.product_picture;
      updateFields.product_code = product.product_code;
    }

    if (lot_number) {
      updateFields.lot_number = lot_number;
    }

    if (expiry_date) {
      updateFields.expiry_date = expiry_date;
    }

if (item_not_expire == true) {
updateFields.expiry_date = "";
}

    if (item_not_expire) {
      updateFields.item_not_expire = item_not_expire;
    }

    if (kit_id) {
      updateFields.kit_id = kit_id;
      updateFields.is_dump = false;
    }

    console.log(updateFields);

    const updatedProduct = await Product.create(updateFields);

        // Update the current_quantity of the kit by adding the quantity of the new product
        if (kit) {
          kit.current_quantity = (kit.current_quantity || 0) + parseInt(quantity); // Add the quantity to current_quantity

 // Check if the product's expiry date is earlier than the kit's expiry date
      if (expiry_date && (!kit.expiry_date || new Date(expiry_date) < new Date(kit.expiry_date))) {
        kit.expiry_date = expiry_date; // Update the kit's expiry date
      }
          await kit.save(); // Save the updated kit
        }


    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found.",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Product updated successfully.",
      status: true,
      product: updatedProduct,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      status: false,
    });
  }
};

module.exports = update_product;
