import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        name: data.name,
        mobile: data.mobile,
        email: data.email || null,
        qualification: data.qualification,
        experience: data.experience || null,
        preferredSector: data.preferredSector || null,
        message: data.message || null,
        source: 'candidate_form',
      }
    });

    return NextResponse.json({ success: true, id: candidate.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate lead:', error);
    return NextResponse.json(
      { error: 'Failed to submit registration' },
      { status: 500 }
    );
  }
}
