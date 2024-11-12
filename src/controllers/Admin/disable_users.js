const User = require("../../models/User");

const disable_users = async (req, res) => {
  try {
    const userIds = req.body.userIds; // Assuming userIds are provided in the request body

    // Check if userIds array is empty or not provided
    if (!userIds || userIds.length === 0) {
      return res.status(400).json({
        message: "No user IDs provided in the request body.",
        status: 400
      });
    }

    // Update the `is_disabled` field for the specified users
    const updateResult = await User.updateMany(
      { _id: { $in: userIds } }, // Match users by their IDs
      { $set: { is_disabled: true } } // Set `is_disabled` to true
    );

    if (updateResult.nModified === 0) {
      return res.status(400).json({
        message: "No users were updated.",
        status: 400
      });
    }

    res.status(200).json({
      message: "Users disabled successfully.",
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500
    });
  }
};

module.exports = disable_users;
