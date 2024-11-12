const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  company_id: {
    type: String,
    required: true,
  },
  location_name: {
    type: String,
  },
  business_email:{
    type: String,
    required: true,
  },
  latitude:{
    type: String,
    required:false
  },
  longitude:{
    type: String,
    required:false
  },
  building_name: {
    type: String,
    required: false,
    default: null,
  },
  street: {
    type: String,
    required: false,
    default: null,
  },
  city: {
    type: String,
    required: false,
    default: null,
  },
  county: {
    type: String,
    required: false,
    default: null,
  },
  country: {
    type: String,
    required: false,
    default: null,
  },
  zip_code: {
    type: String,
    required: false,
    default: null,
  },
  telephone: {
    type: String,
    required: false,
    default: null,
  },
  industry: {
    type: String,
    required: false,
    default: null,
  },
  assigned_admin_id: {
    type: String,
    required: false,
    default: null,
  },
  assigned_approver_id: {
    type: String,
    required: false,
    default: null,
  },
});

const Location = mongoose.model("Location", LocationSchema, "Location");
module.exports = Location;
