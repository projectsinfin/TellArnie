const nodemailer = require("nodemailer");

// Function to send OTP via email
async function send_otp(email, otp, full_name) {
  try {
    // Create a nodemailer transporter
    let transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'noreply@tellarnie.com',
        pass: 'Ng$`+p-;bdhJt~S4E.cvGwBr*{W=8[ZDHsQ5^FK(]?2U!A3fYz',
      },
    });


    let email_html = `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #333;">Hi, ${full_name}</h2>
                        <p>You are receiving this email for otp verification of your account.</p>

                        <p>your otp: ${otp}</p>
                        
                        <p>If you did not request this account creation, please ignore this email.</p>
                    </div>
                    `;

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: "noreply@tellarnie.com",
      to: email,
      subject: "OTP Verification for registration",
      text: `Your OTP for verification is ${otp}`,
      html: email_html,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred while sending OTP:", error);
    throw error;
  }
}

module.exports = send_otp;
