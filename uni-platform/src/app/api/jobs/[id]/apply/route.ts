import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNotificationEmail } from '@/lib/email';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job opening not found' }, { status: 404 });
    }

    const data = await request.json();

    if (!data.candidateName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone number are required' },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        candidateName: data.candidateName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        qualification: data.qualification ? data.qualification.trim() : null,
        experience: data.experience ? data.experience.trim() : null,
        resumeUrl: data.resumeUrl ? data.resumeUrl.trim() : null,
        coverNote: data.coverNote ? data.coverNote.trim() : null,
        status: 'PENDING'
      }
    });

    // Send Admin Notification
    const adminHtml = `
      <h3>New Job Application Received</h3>
      <p><strong>Job Applied:</strong> ${job.title} at ${job.company}</p>
      <p><strong>Candidate Name:</strong> ${application.candidateName}</p>
      <p><strong>Email:</strong> ${application.email}</p>
      <p><strong>Phone:</strong> ${application.phone}</p>
      <p><strong>Qualification:</strong> ${application.qualification || 'N/A'}</p>
      <p><strong>Experience:</strong> ${application.experience || 'N/A'}</p>
      ${application.resumeUrl ? `<p><strong>Resume:</strong> <a href="${application.resumeUrl}">View Resume</a></p>` : ''}
      ${application.coverNote ? `<p><strong>Cover Note:</strong> ${application.coverNote}</p>` : ''}
    `;
    sendNotificationEmail(`New Application: ${job.title}`, adminHtml).catch(console.error);

    // Send Candidate Confirmation
    const candidateHtml = `
      <h3>Application Received - UniEmployment</h3>
      <p>Dear ${application.candidateName},</p>
      <p>Thank you for applying for the <strong>${job.title}</strong> position at <strong>${job.company}</strong> through UniEmployment.</p>
      <p>We have successfully received your application. Our recruitment team will review your profile, and if your qualifications match the requirements, we will contact you for the next steps.</p>
      <br/>
      <p>Best Regards,</p>
      <p><strong>UniEmployment Team</strong></p>
    `;
    sendNotificationEmail(`Application Received: ${job.title}`, candidateHtml, application.email).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        message: 'Your job application has been submitted successfully!',
        applicationId: application.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting job application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again later.' },
      { status: 500 }
    );
  }
}
