const User = require("../../models/User");
const Distributor = require("../../models/Distributor");

const get_distributor_by_id = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        data: null,
        status: 404,
        message: "User not found",
      });
    }

    const { id } = req.query;

    const distributor = await Distributor.findById(id);

    if (!distributor) {
      return res.status(404).json({
        data: null,
        status: 404,
      });
    }

    return res.status(200).json({
      data: distributor,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = get_distributor_by_id;
