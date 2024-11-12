const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportGroupSchema = new Schema({
  group_name: {
    type: String,
    required: true,
  },
  company_id: {
    type: String,
    required: false,
  },
  group_member:[{
    user_id:String,
    full_name: String,
    assigned_role:String
  }],
  created_at: { type: Date, default: Date.now }
});

const ReportGroup = mongoose.model("ReportGroup", ReportGroupSchema, "ReportGroup");
module.exports = ReportGroup;
