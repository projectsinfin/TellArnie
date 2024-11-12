const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  report_name: {
    type: String,
    required: true,
  },
  company_id:{
    type: String,
    required: false,
  },
  start_on: {
    type: Date,
    required: false,
  },
  frequency_units: {
    type: String,
    required: false,
  },
  how_often: {
    type: String,
    required: false,
  },
  send_to_group: [
    {
      group_id: String,
      group_name: String,
    }
  ],
  send_to_user: [
    {
      user_id: String,
      full_name: String,
    }
  ],
  report_widget_id: [{ type: String, required: false }],
  created_at: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", ReportSchema, "Report");
module.exports = Report;
