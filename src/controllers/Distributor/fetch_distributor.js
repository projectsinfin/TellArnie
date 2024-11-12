const Distributor = require('../../models/Distributor');

// POST route to fetch kit details along with related products
const fetch_distributor = async (req, res) => {
  try {

    const distributors = await Distributor.find({},'distributor_name county country role alternate_distributor_name');

    res.status(200).json({
      data: {
        distributors: distributors
      },
      message: `Distributors found successfully.`,
      status: 200
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetch_distributor;
