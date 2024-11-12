const Article = require("../../models/Article");
const Notifications = require("../../models/Notifications");
const User = require("../../models/User");

const get_article_by_id = async (req, res) => {
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
    
    const { id, type } = req.query;
    let notification = null;

    if (type === "Article") {
      notification = await Article.findById(id);
    } else if (type === "Notification") {
      notification = await Notifications.findById(id);
    }

    if (!notification) {
      return res.status(404).json({
        data: null,
        status: 404,
        message: `${type} not found`,
      });
    }

    return res.status(200).json({
      data: notification,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = get_article_by_id;
