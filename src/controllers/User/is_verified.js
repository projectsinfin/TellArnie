const User = require("../../models/User");

const is_verified = async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await User.findById(userId);

    res.status(200).json({
      data: {
        verified: result.verified
      },
      message: "user verfification status.",
      status: 200,
      
    });
  } catch (error) {
    res.status(500).json({
      data:null,
      message: error,
      status:500
    });
  }


};

module.exports = is_verified;
