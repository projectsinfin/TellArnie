const RegisteredKit = require("../../models/RegisteredKit");
const Product = require("../../models/Product");
const Incident = require("../../models/Incident");

const delete_kits_web = async (req, res) => {
  try {
    const kitIds = req.body.kitIds; // Assuming kitIds are provided in the request body

    // Check if kitIds array is empty or not provided
    if (!kitIds || kitIds.length === 0) {
      return res.status(400).json({
        message: "No kit IDs provided in the request body.",
        status: 400
      });
    }

    // Delete related products and incidents
    const productDeletionResult = await Product.deleteMany({ kit_id: { $in: kitIds } });
    const incidentDeletionResult = await Incident.deleteMany({ kit_id: { $in: kitIds } });

    // Delete the kits
    const kitDeletionResult = await RegisteredKit.deleteMany({ _id: { $in: kitIds } });

    if (kitDeletionResult.deletedCount === 0) {
      return res.status(400).json({
        message: "No kits were deleted.",
        status: 400
      });
    }

    res.status(200).json({
      message: `Kits, related products, and incidents deleted successfully.`,
      status: 200,
      details: {
        kitsDeleted: kitDeletionResult.deletedCount,
        productsDeleted: productDeletionResult.deletedCount,
        incidentsDeleted: incidentDeletionResult.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500
    });
  }
};

module.exports = delete_kits_web;
