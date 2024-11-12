const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RegisteredKitSchema = new Schema({
  product_name: {
    type: String,
    required: false,
  },
  company_id: {
    type: String,
    required: false,
  },
  product_code: {
    type: String,
    required: false,
  },
  kit_ref_id: {
    type: String,
    required: false,
  },
  distributor_id: {
    type: String,
    required: false,
    default: null
  },
  registered: {
    type: Date,
    default: Date.now 
  },
  deleted: {
    type: Date,
    required: false,
    default: null,
  },
  kit_picture: {
    type: String,
    required: false,
    default: ""
  },
  qr_code: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: false,
  },
  current_quantity: {
    type: Number,
    required: false,
  },
  multi: {
    type: Boolean,
    required: false,
    default: false,
  },
  location_id: {
    type: String,
    required: false
  },
  brand: {
    type: String,
    required: true,
    default: false,
  },
  model_number: {
    type: String,
    required: true,
    default: false,
  },
  location_name: {
    type: String,
    required: false
  },
  area: {
    type: String,
    required: false
  },
  batch_number: {
    type: String,
    required: false,
  },
  lot_number: {
    type: String,
    required: false,
  },
  expiry_date: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    required:true
  },  
  is_moving:{
    type:Boolean,
    default:false
  },
  is_assessment:{
    type:Boolean,
    default:false
  },
  kit_location_pic:{
    type:String,
  },
  qr_code_url :{
    type:String,
  },
  is_dump:{
    type:Boolean,
    default:false
  },
  is_empty:{
    type:Boolean,
    default:false
  },
 qr_link:{
    type:String,
  }

});

const RegisteredKit = mongoose.model(
  "RegisteredKit",
  RegisteredKitSchema,
  "RegisteredKit"
);
module.exports = RegisteredKit;
