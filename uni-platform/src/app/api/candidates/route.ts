import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { sendNotificationEmail } from '@/lib/email';

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { mobile: { contains: q } },
        { email: { contains: q } },
        { qualification: { contains: q } },
        { preferredSector: { contains: q } }
      ];
    }

    const [candidates, totalCount] = await Promise.all([
      prisma.candidateLead.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.candidateLead.count({ where })
    ]);

    return NextResponse.json({ candidates, totalCount });
  } catch (error) {
    console.error('Error fetching candidate leads:', error);
    return NextResponse.json({ error: 'Failed to fetch candidate registrations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.name || !data.mobile || !data.qualification) {
      return NextResponse.json(
        { error: 'Name, mobile, and qualification are required fields' },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidateLead.create({
      data: {
        name: data.name.trim(),
        mobile: data.mobile.trim(),
        email: data.email ? data.email.trim() : null,
        qualification: data.qualification.trim(),
        experience: data.experience ? data.experience.trim() : null,
        preferredSector: data.preferredSector ? data.preferredSector.trim() : null,
        message: data.message ? data.message.trim() : null,
        resumeUrl: data.resumeUrl ? data.resumeUrl.trim() : null,
        source: data.source || 'candidate_form',
        status: 'NEW'
      }
    });

    // Send Admin Notification
    const adminHtml = `
      <h3>New Candidate Registration</h3>
      <p><strong>Name:</strong> ${candidate.name}</p>
      <p><strong>Mobile:</strong> ${candidate.mobile}</p>
      <p><strong>Email:</strong> ${candidate.email || 'N/A'}</p>
      <p><strong>Qualification:</strong> ${candidate.qualification}</p>
      <p><strong>Experience:</strong> ${candidate.experience || 'N/A'}</p>
      <p><strong>Sector:</strong> ${candidate.preferredSector || 'N/A'}</p>
      <p><strong>Source:</strong> ${candidate.source}</p>
      ${candidate.resumeUrl ? `<p><strong>Resume:</strong> <a href="${candidate.resumeUrl}">View Resume</a></p>` : ''}
      ${candidate.message ? `<p><strong>Message:</strong> ${candidate.message}</p>` : ''}
    `;
    // We do not await this so the API response isn't delayed
    sendNotificationEmail('New Candidate Registration', adminHtml).catch(console.error);

    // Send User Confirmation if email provided
    if (candidate.email) {
      const userHtml = `
        <h3>Thank you for registering with UniEmployment!</h3>
        <p>Dear ${candidate.name},</p>
        <p>We have successfully received your registration details. Our team will review your profile and get back to you shortly with suitable opportunities.</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>UniEmployment Team</strong></p>
      `;
      sendNotificationEmail('Registration Successful - UniEmployment', userHtml, candidate.email).catch(console.error);
    }

    return NextResponse.json({ success: true, id: candidate.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate lead:', error);
    return NextResponse.json(
      { error: 'Failed to submit registration' },
      { status: 500 }
    );
  }
}
