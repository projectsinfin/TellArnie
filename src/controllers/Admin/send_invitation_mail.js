const User = require("../../models/User");
const Validation = require("../../utils/Validation");
const nodemailer = require("nodemailer");

const send_invitation_mail = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "User not found.", status: 401 });
    }

    // Check if user has company ID
    if (!user.company_id) {
      return res.status(401).json({ message: "User does not belong to any company.", status: 401 });
    }

    const { email } = req.body;

    if (!Validation().email(email)) {
      return res.status(400).json({ status: 400, message: "Email is not valid" });
    }

    const existingUser = await User.findOne({ email: email });

    if (user.assigned_role == "rm_superadmin") {
      if (existingUser) {
        let transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
            user: "noreply@tellarnie.com",
            pass: "Ng$`+p-;bdhJt~S4E.cvGwBr*{W=8[ZDHsQ5^FK(]?2U!A3fYz",
          },
        });

        let email_html = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">Hi, ${existingUser.first_name} ${existingUser.last_name}</h2>
            <p>You are invited to login to Tellarnie with mobile app credentials.</p>
           <p>Please visit <a href="https://beta.tellarnie.com/">https://beta.tellarnie.com/</a> to login.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `;

        await transporter.sendMail({
          from: "noreply@tellarnie.com",
          to: email,
          subject: "Invitation to login to Tellarnie",
          html: email_html,
        });

        return res.status(200).json({
          message: `Invitation sent to ${email}.`,
          status: 200,
        });
      }
    }

    return res.status(400).json({ message: "No action taken.", status: 400 });
  } catch (error) {
    console.log(error);
    if (Validation().validateDuplicacy(error) === true) {
      res.status(500).json({ message: error.message, status: 500 });
    } else {
      res.status(401).json({ message: Validation().validateDuplicacy(error), status: 401 });
    }
  }
};

module.exports = send_invitation_mail;
