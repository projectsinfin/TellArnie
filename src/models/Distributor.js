const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DistributorSchema = new Schema({
  distributor_name: {
    type: String,
    required: true,
  },
  company_id: {
    type: String,
    required: false,
    default:null
  },
  street: {
    type: String,
    required: true,
  },
  county: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    default: null,
  },
  postal_code: {
    type: String,
    required: true
  },
  country_code: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false
  },
  company_logo: {
    type: String,
    default: "",
  },
  company_white_logo: {
    type: String,
    default: "",
  },
  alternate_distributor_name: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: false,
    default: null
  },
  reset_password_token: {
    type: String,
    default: null,
  },
  reset_password_expires: {
    type: Date,
    default: null,
  },
  account_creation: {
    type: Date, // Use Date type for timestamps
    required: true,
    default: Date.now, // Use Date.now as default value for timestamps
  },
  permissions: 
  [{ type: String,default: null }],
  created_by:{
    type:String,
    required:false
  },
});

const Distributor = mongoose.model("Distributor", DistributorSchema, "Distributor");
module.exports = Distributor;
