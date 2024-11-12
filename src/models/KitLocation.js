const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const KitLocationSchema = new Schema({
  location_id: {
    type: String,
    required: true,
  },
  kit_id: {
    type: String,
    default:""
  },
  location_name:{
    type: String,
  },
  area: {
    type: String,
    required:false
  },
  is_moving:{
    type:Boolean,
    default:false
  },
  kit_location_pic:{
    type:String,
  }
});

const KitLocation = mongoose.model("KitLocation", KitLocationSchema, "KitLocation");
module.exports = KitLocation;
