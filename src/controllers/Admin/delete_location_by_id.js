const Location = require("../../models/Location");
const RegisteredKit = require("../../models/RegisteredKit");
const Product = require("../../models/Product");

const delete_location_by_id = async (req, res) => {
  try {
    const locationId = req.query.id; // Assuming location ID is provided in the request parameters

    // Check if locationId is valid
    if (!locationId) {
      return res.status(400).json({
        message: "Location ID is missing in the request parameters.",
        status: 400
      });
    }

    // Find the related kits by location ID
    const kits = await RegisteredKit.find({ location_id: locationId });
    let deletedKitsCount = 0;
    let deletedProductsCount = 0;

    if (kits.length > 0) {
      // Fetch and delete related products for each kit
      const productDeletionPromises = kits.map(async (kit) => {
        const deleteResult = await Product.deleteMany({ kit_id: kit._id });
        deletedProductsCount += deleteResult.deletedCount;
      });
      await Promise.all(productDeletionPromises);

      // Delete the kits
      const kitIds = kits.map(kit => kit._id);
      const kitsDeleteResult = await RegisteredKit.deleteMany({ _id: { $in: kitIds } });
      deletedKitsCount = kitsDeleteResult.deletedCount;
    }

    // Find the location by ID and delete it
    const deletionResult = await Location.deleteOne({ _id: locationId });

    if (deletionResult.deletedCount === 0) {
      return res.status(400).json({
        message: "No location was deleted. Location ID not found.",
        status: 400
      });
    }

    res.status(200).json({
      message: "Location and related kits/products deleted successfully.",
      deletedKitsCount,
      deletedProductsCount,
      status: 200
    });
  } catch (error) {
    // Handle database errors or other exceptions
    console.error('Error deleting location:', error);
    res.status(500).json({
      error: "Internal Server Error",
      status: 500
    });
  }
};

module.exports = delete_location_by_id;
