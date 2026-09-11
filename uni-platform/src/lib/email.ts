import { Resend } from 'resend';

// Initialize Resend with API Key. If it's missing, this will fail gracefully or throw during initialization.
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export const sendNotificationEmail = async (subject: string, htmlContent: string, toEmail: string = 'uniemployment.in@gmail.com') => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'UniEmployment <onboarding@resend.dev>', // Resend's default test sender
      to: [toEmail], // To send to outside domains, you MUST verify your domain in Resend
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Error sending email via Resend:', error);
      return { success: false, error };
    }

    console.log('Message sent via Resend:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Unexpected error sending email:', error);
    return { success: false, error };
  }
};
