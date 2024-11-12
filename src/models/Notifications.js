const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  company_id:{
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  send_message_to: [{
    type: String,
    enum: ["general_users", "user_admin", "user_super_admin","general_distributors", "distributor_admin", "distributor_super_admin","rm_admin", "rm_super_admin"],
    required: true,
  }],
  location: {
    type: String,
    required: false
  },
  industry:{
    type:String,
    required: true
  },
  status:{
    type:String,
    required: true
  },
  revisions:{
    type:String,
    required: true
  },
  publish_on:{
    type:String,
    required: true
  },
  category:{
    type:String,
    required: true
  },
  restrict_notification : [{
    type:String,
    required: false
  }],
  notification_creation: {
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
});

const Notifications = mongoose.model("Notifications", NotificationSchema, "Notifications");
module.exports = Notifications;
