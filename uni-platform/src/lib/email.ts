import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendNotificationEmail = async (subject: string, htmlContent: string, toEmail: string = process.env.SMTP_EMAIL as string) => {
  try {
    const info = await transporter.sendMail({
      from: `"UniEmployment Notifications" <${process.env.SMTP_EMAIL}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
