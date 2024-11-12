const User = require("../../models/User");

const delete_user = async (req, res) => {
  try {
    const userIds = req.body.userIds; // Assuming userIds are provided in the request body

    // Check if userIds array is empty or not provided
    if (!userIds || userIds.length === 0) {
      return res.status(400).json({
        message: "No user IDs provided in the request body.",
        status: 400
      });
    }

    // Delete multiple users by their IDs
    const deletionResult = await User.deleteMany({ _id: { $in: userIds } });

    if (deletionResult.deletedCount === 0) {
      return res.status(400).json({
        message: "No users were deleted.",
        status: 400
      });
    }

    res.status(200).json({
      message: "Users deleted successfully.",
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500
    });
  }
};

module.exports = delete_user;
