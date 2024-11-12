const mongoose = require("mongoose");
const IncidentCategories = require("../models/IncidentCategories");

async function incident_categories_seeder() {
  try {
    // Clear existing data
    await IncidentCategories.deleteMany();

    // Data to be seeded
    const incidentsData = [
      {
        name: "Amputation",
        description: [
          "Minor: partial loss of digit or limb",
          "Moderate: significant loss, but limb salvageable",
          "Major: complete loss",
          "Severe: multiple amputations",
        ],
      },
      {
        name: "Suspected broken bone/Fracture",
        description: [
          "Minor: hairline fracture",
          "Moderate: partial fracture, visible displacement",
          "Major: complete fracture, displaced",
          "Severe: multiple fractures",
        ],
      },
      {
        name: "Broken/Fracture(fingers/thumbs/toes)",
        description: [
          "Minor: hairline fracture",
          "Moderate: partial fracture, visible displacement",
          "Major: complete fracture, displaced",
          "Severe: multiple fractures",
        ],
      },
      {
        name: "Burns",
        description: [
          "Minor: First and Second degree burns that cover less than 10% of the body",
          "Moderate: Second-degree burns that cover about 10% of the body",
          "Moderate: Burns on the hands, feet, face or genitals",
          "Severe: Third-degree burns that cover more than 1% of the body",
          "Severe: Burns on the hands, feet, face or genitals",
        ],
      },
      {
        name: "Chemicals",
        description: [
          "Inhalation: breathing in harmful substances",
          "Skin Contact: contact with hazardous chemicals",
          "Ingestion: swallowing harmful substances",
        ],
      },
      {
        name: "Crushing",
        description: [
          "Objects: crushing by heavy objects",
          "Machinery: caught in or between machinery",
          "Structural: crushing by collapsing structures",
        ],
      },
      {
        name: "Cut/Graze",
        description: [
          "Minor: small cuts or grazes",
          "Moderate: deeper cuts, may require stitches",
          "Major: severe cuts, significant blood loss",
          "Severe: life-threatening cuts or amputations",
        ],
      },
      {
        name: "Electrical",
        description: [
          "Minor: minor shock, no lasting damage",
          "Moderate: moderate shock, temporary injury",
          "Major: severe shock, lasting damage",
          "Severe: fatal electrocution",
        ],
      },
      {
        name: "Fatalities",
        description: [
          "Single Fatality: one person deceased",
          "Multiple Fatalities: more than one person deceased",
        ],
      },
      {
        name: "Gas Related",
        description: [
          "Inhalation: breathing in harmful gases",
          "Skin Contact: contact with hazardous gases",
          "Ignition: combustion of gases",
          "Explosion: sudden release of gases",
        ],
      },
      {
        name: "Hearing loss",
        description: [
          "Temporary: short-term hearing impairment",
          "Permanent: irreversible hearing loss",
          "Noise-induced: caused by loud noises",
          "Trauma-induced: caused by physical trauma",
        ],
      },
      {
        name: "Impact to head",
        description: [
          "Minor: minor head injury, no loss of consciousness",
          "Moderate: moderate head injury, temporary confusion",
          "Major: severe head injury, loss of consciousness",
          "Severe: life-threatening head injury or skull fracture",
        ],
      },
      {
        name: "Impact to eye",
        description: [
          "Minor: minor eye injury, no lasting damage",
          "Moderate: moderate eye injury, temporary impairment",
          "Major: severe eye injury, permanent damage",
        ],
      },
      {
        name: "Musculoskeletal",
        description: [
          "Strain: overstretching or tearing of muscles or tendons",
          "Sprain: stretching or tearing of ligaments",
          "Dislocation: displacement of bones",
        ],
      },
      {
        name: "Poison",
        description: [
          "Ingestion: swallowing toxic substances",
          "Inhalation: breathing in poisonous fumes",
          "Skin contact: contact with poisonous substances",
        ],
      },
      {
        name: "Slips/Falls",
        description: [
          "Slip: loss of traction leading to a fall",
          "Trip: stumbling over an obstacle leading to a fall",
          "Fall: falling from a height",
          "Staircase: falling on stairs",
        ],
      },
      {
        name: "Sprain",
        description: [
          "Minor: slight stretch or partial tear",
          "Moderate: partial tear with some loss of function",
          "Major: complete tear, significant loss of function",
          "Severe: total tear, complete loss of function",
        ],
      },
      {
        name: "Temperature Related",
        description: [
          "Heat-related: caused by exposure to high temperatures",
          "Cold-related: caused by exposure to low temperatures",
          "Frostbite: freezing of skin and underlying tissues",
          "Hypothermia",
          "Other heat-induced illness",
        ],
      },
    ];

    // Insert data into the database
    await IncidentCategories.insertMany(incidentsData);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the connection if necessary
    mongoose.connection.close();
  }
}

module.exports = incident_categories_seeder;
