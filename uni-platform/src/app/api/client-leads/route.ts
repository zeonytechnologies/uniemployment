import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        mobile: data.mobile,
        email: data.email || null,
        requirementDescription: data.requirementDescription,
        source: 'employer_form',
      }
    });

    return NextResponse.json({ success: true, id: clientLead.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating client lead:', error);
    return NextResponse.json(
      { error: 'Failed to submit requirement' },
      { status: 500 }
    );
  }
}
