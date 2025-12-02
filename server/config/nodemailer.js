import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

function looksLikePlaceholder(value) {
  if (!value) return true;
  const v = value.toString().toLowerCase();
  return v.includes('your_') || v.includes('<') || v.includes('example.com') || v.includes('smtp_user') || v.includes('smtp_pass');
}

let transporter;

const hasRealSmtp = !looksLikePlaceholder(process.env.SMTP_USER) && !looksLikePlaceholder(process.env.SMTP_PASS) && process.env.SENDER_EMAIL && !looksLikePlaceholder(process.env.SENDER_EMAIL);

if (hasRealSmtp) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
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

} else {
  // Fallback stub transporter to avoid throwing when creds are missing during startup
  console.warn('⚠️ SMTP credentials look missing or like placeholders. Emails will be logged instead of sent.');
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('📧 Skipped sending email (no SMTP credentials set). Mail options:');
      console.log(mailOptions);
      return { accepted: [], rejected: [], info: 'skipped-no-smtp-credentials' };
    },
  };
}

export default transporter;



