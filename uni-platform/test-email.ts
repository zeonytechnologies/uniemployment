import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function testMail() {
  try {
    console.log('Testing SMTP connection with user:', process.env.SMTP_EMAIL);
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      subject: "Test Mail",
      html: "<b>Test</b>",
    });
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

testMail();
