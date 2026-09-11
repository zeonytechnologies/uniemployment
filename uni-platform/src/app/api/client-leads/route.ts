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

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const clientLeads = await prisma.clientLead.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ clientLeads });
  } catch (error) {
    console.error('Error fetching client leads:', error);
    return NextResponse.json({ error: 'Failed to fetch employer inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.companyName || !data.contactPerson || !data.mobile || !data.requirementDescription) {
      return NextResponse.json(
        { error: 'Company Name, Contact Person, Mobile, and Requirement Description are required' },
        { status: 400 }
      );
    }

    const clientLead = await prisma.clientLead.create({
      data: {
        companyName: data.companyName.trim(),
        contactPerson: data.contactPerson.trim(),
        mobile: data.mobile.trim(),
        email: data.email ? data.email.trim() : null,
        requirementDescription: data.requirementDescription.trim(),
        source: 'employer_form',
        status: 'NEW'
      }
    });

    // Send Admin Notification
    const adminHtml = `
      <h3>New Employer Requirement Submitted</h3>
      <p><strong>Company Name:</strong> ${clientLead.companyName}</p>
      <p><strong>Contact Person:</strong> ${clientLead.contactPerson}</p>
      <p><strong>Mobile:</strong> ${clientLead.mobile}</p>
      <p><strong>Email:</strong> ${clientLead.email || 'N/A'}</p>
      <p><strong>Requirements:</strong><br/>${clientLead.requirementDescription?.replace(/\n/g, '<br/>') || 'N/A'}</p>
    `;
    sendNotificationEmail('New Employer Lead', adminHtml).catch(console.error);

    // Send Client Confirmation if email provided
    if (clientLead.email) {
      const clientHtml = `
        <h3>Thank you for reaching out to UniEmployment!</h3>
        <p>Dear ${clientLead.contactPerson},</p>
        <p>We have successfully received your manpower requirements for <strong>${clientLead.companyName}</strong>. Our business development team will review the details and contact you shortly to discuss how we can assist you.</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>UniEmployment Team</strong></p>
      `;
      sendNotificationEmail('Requirement Received - UniEmployment', clientHtml, clientLead.email).catch(console.error);
    }

    return NextResponse.json({ success: true, id: clientLead.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating client lead:', error);
    return NextResponse.json(
      { error: 'Failed to submit requirement' },
      { status: 500 }
    );
  }
}
