const RegisteredKit = require("../../models/RegisteredKit");
const Product = require("../../models/Product"); // Import the Product model

const delete_kit_by_id = async (req, res) => {
  try {
    const kitId = req.query.id;

    if (!kitId) {
      return res.status(400).json({
        message: "Kit ID is missing in the request parameters.",
        status: 400
      });
    }

    // Delete the kit from the RegisteredKit collection
    const kitDeletionResult = await RegisteredKit.deleteOne({ _id: kitId });

    if (kitDeletionResult.deletedCount === 0) {
      return res.status(400).json({
        message: "No kit was deleted. Kit ID not found.",
        status: 400
      });
    }

    // Delete associated products from the Product collection
    const productDeletionResult = await Product.deleteMany({ kit_id: kitId });

    res.status(200).json({
      message: "Kit and associated products deleted successfully.",
      status: 200,
      kitDeletionResult,
      productDeletionResult
    });
  } catch (error) {
    // Handle database errors or other exceptions
    console.error('Error deleting kit and associated products:', error);
    res.status(500).json({
      error: "Internal Server Error",
      status: 500
    });
  }
};

module.exports = delete_kit_by_id;
