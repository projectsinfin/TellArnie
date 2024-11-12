const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IncidentPeopleSchema = new Schema({
  incident_id: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: false,
  },
  user_id:{
    type: String,
    required: false
  },
  company_id:{
    type: String,
    required: false
  },
  contact_number: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  outcome: {
    type: String,
    required: false,
  },
  injury_classification: {
    type: String,
    required: false,
  },
  injury_type: {
    type: String,
    required: false,
  },
  injury_details: {
    type: String,
    required: false,
  },
  more_details: {
    type: String,
    required: false,
  }
});

const IncidentPeople = mongoose.model(
  "IncidentPeople",
  IncidentPeopleSchema,
  "IncidentPeople"
);
module.exports = IncidentPeople;
