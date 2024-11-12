const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({

  product_name: {
    type: String,
    required: false,
  },
  company_id:{
    type:String,
    required:false
  },
  kit_ref_id: {
    type: String,
    required: false,
  },
  kit_id:{
    type:String,
    required:false,
  },
  product_code:{
    type:String,
    required:false,
  },
  brand: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true,
    default : null
  },
  model_number: {
    type: String,
    required: false,
  },
  batch_number: {
    type: String,
    required: false
  },
  expiry_date: {
    type: Date,
    required: false
  },
  lot_number: {
    type: String,
    required: false,
  },
  barcode: {
    type: String,
    required: false,
  },
  product_picture: {
    type: String,
    required: false,
    default: ""
  },
  quantity: {
    type: Number,
    required: true,
  },
  current_quantity: {
    type: Number,
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
  is_dump:{
    type: Boolean,
    default:false
  },
  item_not_expire:{
    type: Boolean,
    default:true
  }
});

const Product = mongoose.model("Product", ProductSchema, "Product");
module.exports = Product;
