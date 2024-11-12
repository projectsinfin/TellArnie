const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TokenSchema = new Schema(
  {
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", TokenSchema, "Token");
module.exports = Token;
