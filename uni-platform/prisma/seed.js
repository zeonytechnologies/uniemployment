const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // 1. Seed Admin User
  const adminEmail = 'admin@uni.org';
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  });

  const passwordHash = await bcrypt.hash('admin123', 10);

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email: adminEmail,
        username: 'admin',
        name: 'UNI Admin',
        password_hash: passwordHash,
        role: 'ADMIN'
      }
    });
    console.log('✓ Admin user created: admin@uni.org / admin123');
  } else {
    await prisma.admin.update({
      where: { email: adminEmail },
      data: { password_hash: passwordHash }
    });
    console.log('✓ Admin user updated: admin@uni.org / admin123');
  }

  // 2. Seed Partner Clients
  const clientCount = await prisma.client.count();
  if (clientCount === 0) {
    const clients = [
      {
        companyName: 'Tata Motors Limited',
        logoUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        industry: 'Automotive & Manufacturing',
        location: 'Chennai & Pune',
        description: 'Leading automobile manufacturing enterprise offering industrial apprenticeships and engineering careers.',
        partnerSince: '2021',
        websiteUrl: 'https://www.tatamotors.com',
        status: 'Active Partner',
        isFeatured: true
      },
      {
        companyName: 'Larsen & Toubro (L&T)',
        logoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        industry: 'Engineering & Construction',
        location: 'Coimbatore & Chennai',
        description: 'Major technology, engineering, construction, and manufacturing conglomerate partnering for technical hiring.',
        partnerSince: '2020',
        websiteUrl: 'https://www.larsentoubro.com',
        status: 'Active Partner',
        isFeatured: true
      },
      {
        companyName: 'Apollo Health Enterprises',
        logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        industry: 'Healthcare & Pharma',
        location: 'Tamil Nadu',
        description: 'Pioneering healthcare network partnering for nursing, technical support, and hospital operations staffing.',
        partnerSince: '2022',
        websiteUrl: 'https://www.apollohospitals.com',
        status: 'Active Partner',
        isFeatured: true
      },
      {
        companyName: 'TVS Motor Company',
        logoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        industry: 'Automotive & Precision Engineering',
        location: 'Hosur & Madurai',
        description: 'Two-wheeler and three-wheeler manufacturing leader partnering for diploma and ITI apprentice placements.',
        partnerSince: '2021',
        websiteUrl: 'https://www.tvsmotor.com',
        status: 'Active Partner',
        isFeatured: true
      },
      {
        companyName: 'Saint-Gobain India',
        logoUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        industry: 'Manufacturing & Materials',
        location: 'Sriperumbudur',
        description: 'World leader in light and sustainable construction materials, partnering for plant technicians and quality inspectors.',
        partnerSince: '2023',
        websiteUrl: 'https://www.saint-gobain.com',
        status: 'Active Partner',
        isFeatured: true
      }
    ];

    for (const client of clients) {
      await prisma.client.create({ data: client });
    }
    console.log(`✓ Seeded ${clients.length} partner clients`);
  }

  // 3. Seed Jobs
  const jobCount = await prisma.job.count();
  let createdJobs = [];
  if (jobCount === 0) {
    const jobs = [
      {
        title: 'CNC Machine Operator & Programmer',
        company: 'Tata Motors Limited',
        companyLogoUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        location: 'Coimbatore, Tamil Nadu',
        industry: 'Engineering & Manufacturing',
        qualification: 'Diploma in Mechanical / ITI Machinist or Turner',
        experience: '1 - 3 Years',
        salary: '₹22,000 - ₹28,000 / month + Shift Allowance',
        vacancies: 8,
        jobType: 'Full-time',
        isOverseas: false,
        description: 'We are seeking skilled CNC Operators to set up and operate computer numerical control machines to fabricate metallic components according to technical blueprints.',
        responsibilities: '• Prepare and operate CNC machines to perform tasks such as turning, milling, and drilling.\n• Understand specifications of the task through engineering drawings.\n• Inspect and measure finished products with precision instruments.\n• Perform routine machine maintenance and clean work stations.',
        requirements: '• ITI / Diploma in Mechanical or relevant trade.\n• 1+ years experience in operating Fanuc / Siemens CNC controls.\n• Ability to read technical drawings and use micrometer/vernier calipers.',
        benefits: 'Subsidized canteen, transport facility, medical insurance, ESI & PF.',
        status: 'ACTIVE'
      },
      {
        title: 'Junior Site Civil Engineer',
        company: 'Larsen & Toubro (L&T)',
        companyLogoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        location: 'Chennai, Tamil Nadu',
        industry: 'Construction & Infrastructure',
        qualification: 'B.E / B.Tech / Diploma in Civil Engineering',
        experience: '0 - 2 Years (Freshers Welcome)',
        salary: '₹25,000 - ₹32,000 / month',
        vacancies: 5,
        jobType: 'Full-time',
        isOverseas: false,
        description: 'Responsible for supervising on-site construction works, quality checks, material tracking, and coordinate with senior project engineers.',
        responsibilities: '• Oversee day-to-day site operations and labor management.\n• Verify reinforcement and concrete pour activities as per design.\n• Maintain site measurements, daily progress reports (DPR), and material logs.',
        requirements: '• Diploma or Degree in Civil Engineering.\n• Strong commitment to workplace health and safety protocols.\n• Basic knowledge of AutoCAD is an advantage.',
        benefits: 'Accommodation provided, PF, ESI, project bonuses.',
        status: 'ACTIVE'
      },
      {
        title: 'Electrical Quality Inspector',
        company: 'TVS Motor Company',
        companyLogoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        location: 'Hosur, Tamil Nadu',
        industry: 'Automotive & Precision Engineering',
        qualification: 'Diploma / ITI in Electrical & Electronics (EEE)',
        experience: '1 - 2 Years',
        salary: '₹20,000 - ₹26,000 / month',
        vacancies: 6,
        jobType: 'Full-time',
        isOverseas: false,
        description: 'Conduct quality inspections on electrical wiring harnesses, electronic sensors, and battery systems in two-wheeler assembly line.',
        responsibilities: '• Inspect incoming wiring components and test electrical connections.\n• Perform multimeter and continuity testing on vehicle sub-assemblies.\n• Record non-conformances and report defect rates to line managers.',
        requirements: '• Diploma or ITI in Electrical / ECE trade.\n• Good understanding of wiring diagrams and test equipment.',
        benefits: 'Free canteen food, bus commute, uniform, health coverage.',
        status: 'ACTIVE'
      },
      {
        title: 'Staff Nurse - ICU & Critical Care',
        company: 'Apollo Health Enterprises',
        companyLogoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        location: 'Madurai, Tamil Nadu',
        industry: 'Healthcare & Pharma',
        qualification: 'B.Sc Nursing / GNM with State Nursing Council Registration',
        experience: '1+ Years',
        salary: '₹24,000 - ₹35,000 / month',
        vacancies: 10,
        jobType: 'Full-time',
        isOverseas: false,
        description: 'Provide professional, compassionate patient nursing care in critical care units. Monitor patient vitals, administer medications, and coordinate with attending physicians.',
        responsibilities: '• Monitor and record patient vital signs and medical condition changes.\n• Administer IV fluids, oral medications, and operate vital patient monitors.\n• Maintain high standards of infection prevention and clinical documentation.',
        requirements: '• Valid Tamil Nadu Nursing Council registration.\n• BLS/ACLS certification preferred.',
        benefits: 'Hostel facility available, subsidized meals, health cover for family.',
        status: 'ACTIVE'
      }
    ];

    for (const job of jobs) {
      const created = await prisma.job.create({ data: job });
      createdJobs.push(created);
    }
    console.log(`✓ Seeded ${createdJobs.length} active jobs`);
  } else {
    createdJobs = await prisma.job.findMany({ take: 4 });
  }

  // 4. Seed Job Applications (to showcase "how many applied for this job")
  const appCount = await prisma.jobApplication.count();
  if (appCount === 0 && createdJobs.length > 0) {
    const firstJob = createdJobs[0];
    const secondJob = createdJobs[1] || createdJobs[0];

    const sampleApplications = [
      {
        jobId: firstJob.id,
        candidateName: 'Karthik S.',
        email: 'karthik.s@gmail.com',
        phone: '+91 98451 23456',
        qualification: 'Diploma in Mechanical Engineering',
        experience: '2 Years',
        resumeUrl: 'https://drive.google.com/sample-resume-karthik',
        coverNote: 'I have 2 years hands-on experience running CNC lathe machines at an auto component manufacturer in Coimbatore.',
        status: 'SHORTLISTED'
      },
      {
        jobId: firstJob.id,
        candidateName: 'Vigneshwaran M.',
        email: 'vignesh.m@yahoo.com',
        phone: '+91 97890 87654',
        qualification: 'ITI Machinist',
        experience: '1.5 Years',
        resumeUrl: 'https://drive.google.com/sample-resume-vignesh',
        coverNote: 'Certified ITI machinist eager to work in high-precision automotive tooling with Tata Motors.',
        status: 'REVIEWED'
      },
      {
        jobId: firstJob.id,
        candidateName: 'Praveen Kumar',
        email: 'praveen.k@gmail.com',
        phone: '+91 94432 11223',
        qualification: 'Diploma in Tool & Die Making',
        experience: '3 Years',
        resumeUrl: '',
        coverNote: 'Experienced in Siemens control programming and component inspection.',
        status: 'PENDING'
      },
      {
        jobId: secondJob.id,
        candidateName: 'Divya Bharathi',
        email: 'divya.b@outlook.com',
        phone: '+91 99654 33211',
        qualification: 'B.E Civil Engineering (2025 Passout)',
        experience: 'Fresher',
        resumeUrl: 'https://drive.google.com/sample-resume-divya',
        coverNote: 'Completed my degree with 8.4 CGPA and completed 2-month internship at commercial construction site.',
        status: 'SHORTLISTED'
      }
    ];

    for (const app of sampleApplications) {
      await prisma.jobApplication.create({ data: app });
    }
    console.log(`✓ Seeded ${sampleApplications.length} sample job applications`);
  }

  // 5. Seed Placements
  const placementCount = await prisma.placement.count();
  if (placementCount === 0) {
    const placements = [
      {
        candidateName: 'Aravind Swaminathan',
        qualification: 'Diploma Mechanical',
        position: 'Junior CNC Technician',
        company: 'Tata Motors Limited',
        companyLogoUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        industry: 'Automotive',
        location: 'Coimbatore',
        salaryPackage: '₹3.2 LPA',
        experience: 'Fresher',
        placementDate: new Date('2026-02-15'),
        status: 'Successfully Placed',
        isPublic: true,
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&auto=format&q=80'
      },
      {
        candidateName: 'Subramanian R.',
        qualification: 'B.E Civil Engineering',
        position: 'Site Quality Supervisor',
        company: 'Larsen & Toubro (L&T)',
        companyLogoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        industry: 'Construction & Infra',
        location: 'Chennai',
        salaryPackage: '₹3.8 LPA',
        experience: '1 Year',
        placementDate: new Date('2026-02-20'),
        status: 'Successfully Placed',
        isPublic: true,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&auto=format&q=80'
      },
      {
        candidateName: 'Pavithra Murugan',
        qualification: 'B.Sc Nursing',
        position: 'Critical Care Staff Nurse',
        company: 'Apollo Health Enterprises',
        companyLogoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        industry: 'Healthcare',
        location: 'Madurai',
        salaryPackage: '₹3.6 LPA',
        experience: 'Fresher',
        placementDate: new Date('2026-03-01'),
        status: 'Successfully Placed',
        isPublic: true,
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces&auto=format&q=80'
      },
      {
        candidateName: 'Gokulnath K.',
        qualification: 'ITI Electrical',
        position: 'Assembly Line Electrical Inspector',
        company: 'TVS Motor Company',
        companyLogoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        industry: 'Automotive',
        location: 'Hosur',
        salaryPackage: '₹2.8 LPA',
        experience: 'Fresher',
        placementDate: new Date('2026-03-04'),
        status: 'Successfully Placed',
        isPublic: true,
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80'
      }
    ];

    for (const pl of placements) {
      await prisma.placement.create({ data: pl });
    }
    console.log(`✓ Seeded ${placements.length} candidate placements`);
  }

  // 6. Seed Candidate Registrations (Candidate Leads)
  const candidateCount = await prisma.candidateLead.count();
  if (candidateCount === 0) {
    const candidates = [
      {
        name: 'Manoj Kumar S.',
        mobile: '+91 98941 55678',
        email: 'manoj.k@gmail.com',
        qualification: 'B.E Mechanical Engineering',
        experience: '1-3 Years',
        preferredSector: 'Automobile & Production',
        source: 'candidate_form',
        status: 'NEW',
        message: 'Looking for production or quality engineer position in Coimbatore or Chennai region.'
      },
      {
        name: 'Kavitha Ramachandran',
        mobile: '+91 97512 88990',
        email: 'kavitha.rc@gmail.com',
        qualification: 'Diploma in Electronics & Communication',
        experience: 'Fresher',
        preferredSector: 'Electronics / Manufacturing',
        source: 'candidate_form',
        status: 'CONTACTED',
        message: 'Immediate joiner with good knowledge of PCB soldering and testing.'
      },
      {
        name: 'Suresh Babu N.',
        mobile: '+91 94420 33445',
        email: 'suresh.babu@gmail.com',
        qualification: 'ITI Fitter',
        experience: '3-5 Years',
        preferredSector: 'Heavy Engineering',
        source: 'candidate_form',
        status: 'SHORTLISTED',
        message: '5 years experience in machine erection and hydraulic maintenance.'
      }
    ];

    for (const c of candidates) {
      await prisma.candidateLead.create({ data: c });
    }
    console.log(`✓ Seeded ${candidates.length} candidate registrations`);
  }

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
