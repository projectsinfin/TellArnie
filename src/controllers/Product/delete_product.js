const Product = require("../../models/Product");
const RegisteredKit = require("../../models/RegisteredKit");

const delete_product = async (req, res) => {
  try {
    const productId = req.query.id;
   
    // Check if productId is valid
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is missing in the request parameters.",
        status: 400
      });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
        status: 404
      });
    }

    // Get the kit_id from the product
    const kitId = product.kit_id;

    // Delete the product
    const deletionResult = await Product.deleteOne({ _id: productId });

    if (deletionResult.deletedCount === 0) {
      return res.status(400).json({
        message: "No product was deleted. Product ID not found.",
        status: 400
      });
    }

    // Find all products associated with the kit
    const remainingProducts = await Product.find({ kit_id: kitId });

    // Update the kit's expiry date to the earliest expiry date among the remaining products
    if (remainingProducts.length > 0) {
      // Find the earliest expiry date among the remaining products
      const earliestExpiryDate = remainingProducts
        .filter(prod => prod.expiry_date)
        .reduce((earliest, prod) => {
          return (!earliest || new Date(prod.expiry_date) < new Date(earliest))
            ? prod.expiry_date
            : earliest;
        }, null);

      // Update the kit's expiry date
      await RegisteredKit.findByIdAndUpdate(kitId, { expiry_date: earliestExpiryDate });
    } else {
      // If no remaining products, set the kit's expiry date to null
      await RegisteredKit.findByIdAndUpdate(kitId, { expiry_date: null });
    }

    res.status(200).json({
      message: "Product deleted successfully.",
      status: 200
    });
  } catch (error) {
    // Handle database errors or other exceptions
    console.error('Error deleting product:', error);
    res.status(500).json({
      error: "Internal Server Error",
      status: 500
    });
  }
};

module.exports = delete_product;
