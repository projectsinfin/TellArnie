const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArchiveSchema = new Schema({
  location_id: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Archive = mongoose.model("Archive", ArchiveSchema, "Archive");
module.exports = Archive;
