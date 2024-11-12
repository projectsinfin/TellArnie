const Report = require("../../models/Report");

const delete_reports = async (req, res) => {
  try {
    const reportIds = req.body.reportIds; // Assuming userIds are provided in the request body

    // Check if userIds array is empty or not provided
    if (!reportIds || reportIds.length === 0) {
      return res.status(400).json({
        message: "No report IDs provided in the request body.",
        status: 400
      });
    }

    // Delete multiple users by their IDs
    const deletionResult = await Report.deleteMany({ _id: { $in: reportIds } });

    if (deletionResult.deletedCount === 0) {
      return res.status(400).json({
        message: "No report were deleted.",
        status: 400
      });
    }

    res.status(200).json({
      message: "Reoprt deleted successfully.",
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500
    });
  }
};

module.exports = delete_reports;
