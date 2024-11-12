const Distributor = require("../../models/Distributor");

const delete_distributor = async (req, res) => {
  try {
    const distributorIds = req.body.distributorIds; // Assuming userIds are provided in the request body

    // Check if userIds array is empty or not provided
    if (!distributorIds || distributorIds.length === 0) {
      return res.status(400).json({
        message: "No user IDs provided in the request body.",
        status: 400
      });
    }

    // Delete multiple users by their IDs
    const deletionResult = await Distributor.deleteMany({ _id: { $in: distributorIds } });

    if (deletionResult.deletedCount === 0) {
      return res.status(400).json({
        message: "No distributor were deleted.",
        status: 400
      });
    }

    res.status(200).json({
      message: "Distributor deleted successfully.",
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500
    });
  }
};

module.exports = delete_distributor;
