const Article = require("../../models/Article");
const User = require("../../models/User");
const config = require("../../../config/config");
const Validation = require("../../utils/Validation");

const create_article = async (req, res) => {
  try {
    const { SERVER_BASE_URL } = config;
    const { userId } = req.user;

    const user = await User.findById(userId);

    const {
      title,
      sub_title,
      content,
      status,
      revision,
      publish_on,
      category,
      feature_article,
      send_notification,
      role,
    } = req.body;

    const updateData = {};

    if (title) {
      updateData.title = title;
    }

    if (sub_title) {
      updateData.sub_title = sub_title;
    }

    if (content) {
      updateData.content = content;
    }

    if (status) {
      updateData.status = status;
    }

    if (revision) {
      updateData.revision = revision;
    }

    if (publish_on) {
      updateData.publish_on = publish_on;
    }
    if (category) {
      updateData.category = category;
    }
    if (feature_article) {
      updateData.feature_article = feature_article;
    }
    if (send_notification) {
      updateData.send_notification = send_notification;
    }
    if (role) {
      updateData.role = role;
    }

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.fieldname === "featured_image") {
          const featured_image_name = file.filename;
          updateData.featured_image = `${SERVER_BASE_URL}featured_image/${featured_image_name}`;
        }
      });
    }

    updateData.created_by = user._id;
    updateData.company_id = user.company_id;

    const new_article = await Article.create(updateData);

    return res.status(200).json({
      data: {
        message: "Article created successfully.",
        article_id: new_article._id,
      },
      status: 200,
    });
  } catch (error) {
    if (Validation().validateDuplicacy(error) === true) {
      res.status(500).json({
        data: null,
        status: 500,
        message: error.message,
      });
    } else {
      res.status(401).json({
        data: null,
        status: 401,
        message: Validation().validateDuplicacy(error),
      });
    }
  }
};

module.exports = create_article;
