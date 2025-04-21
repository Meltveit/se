// src/app/api/companies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/config';
import { createCompany, getCompanies, getCompanyBySlug } from '@/lib/db/companies';

// POST - Create a new company
export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse the request body
    const formData = await request.formData();
    const companyData = {
      name: formData.get('name') as string,
      tagline: formData.get('tagline') as string,
      description: formData.get('description') as string,
      website: formData.get('website') as string,
      yearFounded: formData.get('yearFounded') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string,
      sector: formData.get('sector') as string,
      employeeCount: formData.get('employeeCount') as string,
      businessType: formData.get('businessType') as string,
      tags: formData.get('tags') as string,
    };

    // Get logo file if provided
    const logoFile = formData.get('logo') as File || undefined;

    // Basic validation
    if (!companyData.name || !companyData.description || !companyData.email || !companyData.sector) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if a company with the same slug already exists
    const slug = companyData.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    const existingCompany = await getCompanyBySlug(slug);
    if (existingCompany) {
      return NextResponse.json(
        { error: 'A company with a similar name already exists' },
        { status: 400 }
      );
    }

    // Create the company
    const companyId = await createCompany(companyData, currentUser.uid, logoFile);

    return NextResponse.json({ id: companyId, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}

// GET - List companies with optional filters
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sector = url.searchParams.get('sector') || undefined;
    const query = url.searchParams.get('query') || undefined;
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

    // We're not implementing pagination with cursors in this simplified version
    const { companies } = await getCompanies(sector, query, undefined, pageSize);

    return NextResponse.json({ 
      companies,
      page,
      pageSize,
      totalPages: Math.ceil(companies.length / pageSize)
    });
  } catch (error) {
    console.error('Error listing companies:', error);
    return NextResponse.json(
      { error: 'Failed to list companies' },
      { status: 500 }
    );
  }
}