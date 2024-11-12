const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RiskCalculateSchema = new Schema({
  product_code: {
    type: String,
  },
  risk_level: {
    type: String,
  },
  action:{
    type: String,
  },
  action_number: {
    type: Number,
  }

});

const RiskCalculate = mongoose.model("RiskCalculate", RiskCalculateSchema, "RiskCalculate");
module.exports = RiskCalculate;
