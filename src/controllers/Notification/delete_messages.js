const Article = require("../../models/Article");
const Notification = require("../../models/Notifications");

const delete_messages = async (req, res) => {
  try {
    const deleteMessageIds = req.body.deleteMessageIds; // Assuming deleteMessageIds are provided in the request body

    // Check if deleteMessageIds array is empty or not provided
    if (!deleteMessageIds || deleteMessageIds.length === 0) {
      return res.status(400).json({
        message: "No message IDs provided in the request body.",
        status: 400
      });
    }

    // Separate IDs based on type
    const articleIds = [];
    const notificationIds = [];

    deleteMessageIds.forEach((item) => {
      if (item.type === "Article" && item.article_id) {
        articleIds.push(item.article_id);
      } else if (item.type === "Notification" && item.notification_id) {
        notificationIds.push(item.notification_id);
      }
    });

    // Delete articles and notifications in parallel
    const deleteOperations = [];

    if (articleIds.length > 0) {
      deleteOperations.push(Article.deleteMany({ _id: { $in: articleIds } }));
    }
    if (notificationIds.length > 0) {
      deleteOperations.push(Notification.deleteMany({ _id: { $in: notificationIds } }));
    }

    const results = await Promise.all(deleteOperations);

    // Calculate deletion counts
    const articleDeleteCount = results[0] ? results[0].deletedCount : 0;
    const notificationDeleteCount = results[1] ? results[1].deletedCount : 0;

    if (articleDeleteCount === 0 && notificationDeleteCount === 0) {
      return res.status(400).json({
        message: "No messages were deleted.",
        status: 400
      });
    }

    res.status(200).json({
      message: "Messages deleted successfully.",
      status: 200,
      data: {
        articlesDeleted: articleDeleteCount,
        notificationsDeleted: notificationDeleteCount
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500
    });
  }
};

module.exports = delete_messages;
