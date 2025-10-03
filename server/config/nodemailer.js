import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();



const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,  // make sure this is `pass`, not `password`
  },
});

(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection successful");
    console.log("SMTP User:", process.env.SMTP_USER);
    console.log("Sender Email:", process.env.SENDER_EMAIL);
  } catch (err) {
    console.error("❌ SMTP error:", err);
  }
})();

export default transporter;



