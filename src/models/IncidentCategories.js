const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incidentCategoriesSchema = new Schema({
    name: {type: String},
    description: [{ type: String }]
});

const IncidentCategories = mongoose.model("IncidentCategories", incidentCategoriesSchema, "IncidentCategories");
module.exports = IncidentCategories;