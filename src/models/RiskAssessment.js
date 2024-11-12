const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the structure for the kits (mainKit and recommendedKits)
const KitSchema = new Schema({
  product_code: {
    type: String,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  kit_picture: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const RiskAssessmentSchema = new Schema({
  company_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  mainKit: {
    type: [KitSchema], // Array of KitSchema objects for mainKit
    default: [],
  },
  recommendedKits: {
    type: [KitSchema], // Array of KitSchema objects for recommendedKits
    default: [],
  },
  location_id: {
    type: String,
  },
  location_name: {
    type: String,
  },
  area: {
    type: String,
    required: false,
  },
  is_quote_generated: {
    type: Boolean,
    default: false,
  },
});

const RiskAssessment = mongoose.model("RiskAssessment", RiskAssessmentSchema, "RiskAssessment");
module.exports = RiskAssessment;
