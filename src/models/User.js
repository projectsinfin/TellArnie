const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  company_id: {
    type: String,
    required: false,
    default:null
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact_number: {
    type: String,
    required: false
  },
  country_code: {
    type: String,
    required:false
  },
  password: {
    type: String,
    required: false,
    default:null
  },
  profile_pic: {
    type: String,
    default: "",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  is_mentally_fit: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
  },
  otp_expiration_time: {
    type: Date,
    default: null,
  },
  job_title: {
    type: String,
    required: false,
    default:null
  },
  is_firstaid_certified:{
    type:Boolean,
    default:false
  },
  firstaid_certificate: {
    type: String,
    default: "",
  },
  firstaid_certificate_date: {
    type: Date,
    default: null,
  },
  employee_id: {
    type: String,
    required: false,
    default: null,
  },
  gdpr_approval: {
    type: Date,
    required: false,
    default: null,
  },
  assigned_role: {
    type: String,
    enum: ["rm_superadmin","rm_admin","distributor_superadmin","distributor_user","superadmin", "admin", "approver", "user", "salesrepresentative",null],
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
  location_id: {
    type:String,
    required:false
  },
  created_by:{
    type:String,
    required:false
  },
  is_disable:{
    type:Boolean,
    required:false,
    default:false
  },
  is_approved:{
    type:Boolean,
    required:false
  }
});

const User = mongoose.model("User", UserSchema, "User");
module.exports = User;
