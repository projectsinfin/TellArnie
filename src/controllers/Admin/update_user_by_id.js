const User = require("../../models/User");
const Validation = require("../../utils/Validation");
const config = require("../../../config/config");
const nodemailer = require("nodemailer");

const update_user_by_id = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming this is the authenticated user making the request
    const { user_id, email, first_name, last_name, location_id, contact_number, country_code, assigned_role, permissions, is_firstaid_certified, firstaid_certificate, firstaid_certificate_date } = req.body; // Destructure request body

    const user = await User.findById(userId);

    // Check if authenticated user exists
    if (!user) {
      return res.status(401).json({ message: "Authenticated user not found.", status: 401 });
    }

    // Check if authenticated user has company ID
    if (!user.company_id) {
      return res.status(401).json({ message: "Authenticated user does not belong to any company.", status: 401 });
    }

    const userToUpdate = await User.findById(user_id);

    // Check if the user to be updated exists
    if (!userToUpdate) {
      return res.status(404).json({ message: "User to be updated not found.", status: 404 });
    }

    // Validate email if provided
    if (email && !Validation().email(email)) {
      return res.status(400).json({ status: 400, message: "Email is not valid" });
    }

    // Check if email already exists
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== user_id) {
        return res.status(400).json({ message: "Email already exists.", status: 400 });
      }
    }

    const { SERVER_BASE_URL } = config;

    // Update user data
    if (email) userToUpdate.email = email;
    if (first_name) userToUpdate.first_name = first_name;
    if (last_name) userToUpdate.last_name = last_name;
    if (location_id) userToUpdate.location_id = location_id;
    if (contact_number) userToUpdate.contact_number = contact_number;
    if (country_code) userToUpdate.country_code = country_code;
    if (assigned_role) userToUpdate.assigned_role = assigned_role;
    if (permissions) userToUpdate.permissions = permissions;
    if (is_firstaid_certified !== undefined) userToUpdate.is_firstaid_certified = is_firstaid_certified;
    if (firstaid_certificate_date) userToUpdate.firstaid_certificate_date = firstaid_certificate_date;

    // Process file uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.fieldname === "firstaid_certificate") {
          userToUpdate.firstaid_certificate = `${SERVER_BASE_URL}firstaid_certificates/${file.filename}`;
        }
      });
    }

    // Save updated user
    await userToUpdate.save();

    // Send update notification email if the email has been changed
    if (email) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: 'noreply@tellarnie.com',
          pass: 'Ng$`+p-;bdhJt~S4E.cvGwBr*{W=8[ZDHsQ5^FK(]?2U!A3fYz',
        },
      });

      const email_html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">Hi, ${first_name} ${last_name}</h2>
          <p>Your profile has been updated successfully.</p>
          <p>If you did not request this update, please contact support immediately.</p>
        </div>
      `;

      await transporter.sendMail({
        from: "noreply@tellarnie.com",
        to: email,
        subject: "Profile Updated Successfully",
        text: "Your profile has been updated successfully.",
        html: email_html,
      });
    }

    return res.status(200).json({
      message: "User profile updated successfully.",
      user_id: userToUpdate._id,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

module.exports = update_user_by_id;
