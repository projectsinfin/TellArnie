const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: false
  },
  sub_title: {
    type: String,
    required: false
  },
  company_id:{
    type: String,
    required: false
  },
  content: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  revision: {
    type: Number,
    required: false
  },
  publish_on:{
    type: String,
    required: false
  },
  category:{
    type:String,
    required: false
  },
  feature_article:{
    type:String,
    required: false
  },
  send_notification:{
    type:String,
    required: false
  },
  article_creation: {
    type: Date,
    required: true,
    default: Date.now,
  },
  created_by:{
    type:String,
    required: false
  },
  updated_by:{
    type:String,
    required: false,
  },
  featured_image:{
    type:String,
    default:"" ,
  }
});

const Article = mongoose.model("Article", ArticleSchema, "Article");
module.exports = Article;
