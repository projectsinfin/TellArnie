const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IncidentSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  company_id: {
    type: String,
    required: false,
  },
  kit_id: {
    type: String,
    required: true,
  },
  incident_date: {
    type: Date,
    required: true,
  },
  incident_time: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    required: false,
    default: null,
  },
  description: {
    type: String,
    required: false,
    default: null,
  },
  incident_pictures: [{ type: String }],
  category_of_incident: {
    type: String,
    required: false,
    default: null,
  },
  classification: {
    type: String,
    required: false,
    default: null,
  },
  location_of_incident: {
    type: String,
    required: false,
    default: null,
  },
  area_of_incident: {
    type: String,
    required: false,
    default: null,
  },
  item_used: [{
    product_id:String,
    user_id:String,
    title : String,
    full_name: String,
    used_quantity: Number,
  }],
  account_creation: {
    type: Date,
    required: true,
    default: Date.now,
  },
  is_detailed_incident: {
    type: Boolean,
    default: false,
  }
});

const Incident = mongoose.model("Incident", IncidentSchema, "Incident");
module.exports = Incident;
