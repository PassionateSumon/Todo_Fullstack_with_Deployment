import * as nodemailer from "nodemailer";
import dotenv from "dotenv";
import { EmailJob } from "../../../common/interfaces/Email.interface.js";
dotenv.config();

// Validate environment variables
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  connectionTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("SMTP server is ready");
  }
});

export const queueEmail = async (job: EmailJob, retries = 3) => {
  const { to, subject, text } = job;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await transporter.sendMail({
        from: `"Task Management App Invitation" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
      });
      console.log(`Email sent to ${to}`);
      return true;
    } catch (err: any) {
      console.error(`Failed to send email to ${to} (attempt ${attempt}/${retries}): ${err.message}`);
      
      if (attempt === retries) {
        throw err;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  return false;
};