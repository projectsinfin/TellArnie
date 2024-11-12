const csvParser = require("csv-parser");
const fs = require("fs");
const User = require("../../models/User");

const import_users = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        data: null,
        message: "User not found.",
        status: 404,
      });
    }

    const file = req.files[0];
    if (!file) {
      return res.status(400).json({
        data: null,
        message: "No file uploaded.",
        status: 400,
      });
    }

    const users = [];
    let existingCount = 0;
    let createdCount = 0;
    let failedCount = 0; // Initialize failed user count

    const processRow = async (row) => {
      const user_data = {
        company_id: "",
        first_name: row.FirstName.trim(),
        last_name: row.LastName ? row.LastName.trim() : null,
        email: row.Email.trim(),
        contact_number: row.ContactNumber ? row.ContactNumber.trim() : null,
        country_code: row.CountryCode ? row.CountryCode.trim() : null,
        profile_pic: row.ProfilePicUrl ? row.ProfilePicUrl.trim() : "",
        verified: 'true',
        job_title: row.JobTitle ? row.JobTitle.trim() : null,
        employee_id: row.EmployeeId ? row.EmployeeId.trim() : null,
        assigned_role: row.AssignedRole ? row.AssignedRole.trim() : null,
      };

      try {
        const existing_user = await User.findOne({ email: row.email.trim() });

        if (existing_user) {
          existingCount++;
        } else {
          const new_user = await User.create(user_data);
          users.push(new_user);
          createdCount++; // Increment created user count
        }
      } catch (error) {
        console.error(`Error creating user: ${JSON.stringify(row)} - ${error.message}`);
        failedCount++; // Increment failed user count
      }
    };

    // Parse the CSV file
    const stream = fs.createReadStream(file.path).pipe(csvParser());

    stream.on("data", (row) => {
      stream.pause();
      processRow(row)
        .then(() => stream.resume())
        .catch((error) => {
          console.error(`Error processing row: ${JSON.stringify(row)} - ${error.message}`);
          stream.resume();
        });
    });

    stream.on("end", () => {
      fs.unlinkSync(file.path);
      res.status(200).json({
        data: {
          users,
          existingCount,
          createdCount, // Include created user count in the response
          failedCount, // Include failed user count in the response
        },
        message: "Users added successfully.",
        status: 200,
      });
    });

    stream.on("error", (error) => {
      console.error(`Error reading CSV file: ${error.message}`);
      fs.unlinkSync(file.path); // Ensure the file is deleted in case of an error
      res.status(500).json({
        data: null,
        status: 500,
        message: "Error processing file.",
      });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = import_users;
