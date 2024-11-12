const Article = require("../../models/Article");
const User = require("../../models/User");
const config = require("../../../config/config");

const update_article_by_id = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    const { SERVER_BASE_URL } = config;

    const {
      title,
      sub_title,
      content,
      status,
      publish_on,
      category,
      feature_article,
      send_notification,
      id
    } = req.body;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        data: null,
        status: 404,
        message: "Article not found",
      });
    }

    if (title) article.title = title;
    if (sub_title) article.sub_title = sub_title;
    if (content) article.content = content;
    if (status) article.status = status;
    if (publish_on) article.publish_on = publish_on;
    if (category) article.category = category;
    if (feature_article) article.feature_article = feature_article;
    if (send_notification) article.send_notification = send_notification;

      article.updated_by = user._id;
      article.revision = article.revision +1;

      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          if (file.fieldname === "featured_image") {
            const featured_image_name = file.filename;
            article.featured_image = `${SERVER_BASE_URL}featured_image/${featured_image_name}`;
          }
        });
      }
  

    // Save the updated article
    await article.save();

    return res.status(200).json({
      data: {
        message: "Article updated successfully.",
        article_id: article._id,
      },
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = update_article_by_id;


