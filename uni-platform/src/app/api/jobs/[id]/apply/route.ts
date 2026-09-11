import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
