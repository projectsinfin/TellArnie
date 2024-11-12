const config = require("../../../config/config");
const Distributor = require("../../models/Distributor");
const User = require("../../models/User");
const csvWriter = require('csv-writer').createObjectCsvStringifier;

const export_distributors = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    const { startDate, endDate, columns, is_all } = req.body;

    if ((!is_all && (!startDate || !endDate)) || !columns || columns.length === 0) {
      return res.status(400).json({
        data: null,
        status: 400,
        message: "Missing required fields: startDate, endDate, columns, or is_all.",
      });
    }

    let distributors;

    if (is_all) {
      
      distributors = await Distributor.find({
      }).lean();

    } else {
      // Validate date format (assuming dates are in 'YYYY-MM-DD' format)
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          data: null,
          status: 400,
          message: "Invalid date format.",
        });
      }


      distributors = await Distributor.find({
        account_creation: { $gte: start, $lte: end },
      }).select(columns.join(' ')).lean();
    }

    if (distributors.length === 0) {
      return res.status(404).json({
        data: null,
        status: 404,
        message: "No distributors found.",
      });
    }

    // Prepare CSV data
    const csvHeaders = columns.map(column => ({ id: column, title: column }));
    const csvStringifier = csvWriter({ header: csvHeaders });
    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(distributors);

    // Send CSV file as response
    res.setHeader('Content-disposition', 'attachment; filename=Distributor.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csvData);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = export_distributors;
