const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  company_name: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  domain:{
    type:String,
    require:false
  },
  business_email:{
    type: String,
    required: false
  },
  business_logo:{
    type: String,
    required: false
  },
  assigned_super_admin:{
    type: String,
    required: false
  },
  assigned_approver:{
    type: String,
    required: false
  },
  distributor_name:{
    type: String,
    required: true
  },
  distributor_email: {
    type: String,
    required: true
  },
  distributor_id: {
    type: String,
    required: false,
    default: null
  },
  street:{
    type:String,
    required: true
  },
  city:{
    type:String,
    required: true
  },
  county:{
    type:String,
    required: true
  },
  country:{
    type:String,
    required: true
  },
  zip_code:{
    type:String,
    required: true
  },
  company_type: {
    type: String,
    enum: ["RM", "Distributor", "Company"],
    required: false,
    default: "Company"
  },
  account_creation: {
    type: Date,
    required: true,
    default: Date.now,
  }
});

const Company = mongoose.model("Company", CompanySchema, "Company");
module.exports = Company;
