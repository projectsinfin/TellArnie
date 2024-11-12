const Location = require("../../models/Location");

const delete_location = async (req, res) => {
  try {
    const locationId = req.query.id;
    console.log(req) // Assuming location ID is provided in the request parameters

    // Check if locationId is valid
    if (!locationId) {
      return res.status(400).json({
        message: "Location ID is missing in the request parameters.",
        status: 400
      });
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
      message: "Location deleted successfully.",
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

module.exports = delete_location;
