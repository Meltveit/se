import { Metadata } from 'next'; // Fjernet Suspense her
import { Suspense } from 'react'; // Importer Suspense fra 'react'
import { getBusiness } from '@/lib/firebase/db';
import { notFound } from 'next/navigation';
import BusinessDetailClient from './BusinessDetailClient';

// Definer PageProps uten searchParams
export interface PageProps {
  params: Promise<{ id: string }>;
}

// Generer statiske parametere for statisk eksport
export async function generateStaticParams() {
  try {
    const { businesses } = await import('@/lib/firebase/db').then(module => module.getBusinesses(500));
    return businesses.map((business) => ({
      id: business.id,
    }));
  } catch (error) {
    console.error('Feil ved generering av statiske parametere for bedrifter:', error);
    return [{ id: 'placeholder' }];
  }
}

// Generer metadata for bedriftssiden
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    if (id === 'placeholder') {
      return {
        title: 'Bedriftsprofil | B2B Social',
        description: 'Detaljer om bedriftsprofil',
      };
    }
    const business = await getBusiness(id);
    if (!business) {
      return {
        title: 'Bedrift Ikke Funnet',
        description: 'Den forespurte bedriftsprofilen ble ikke funnet',
      };
    }
    return {
      title: `${business.name} | B2B Social`,
      description: business.shortDescription || 'Detaljer om bedriftsprofil',
      openGraph: {
        title: business.name,
        description: business.shortDescription || 'Bedriftsprofil',
        images: business.logoUrl ? [{ url: business.logoUrl }] : [],
      },
    };
  } catch (error) {
    console.error('Feil ved generering av metadata:', error);
    return {
      title: 'Bedriftsprofil',
      description: 'Detaljer om bedriftsprofil',
    };
  }
}

// Serverkomponent for detaljsiden for bedrift
export default async function BusinessDetailPage({ params }: PageProps) {
  try {
    const { id } = await params;
    if (id === 'placeholder') {
      return (
        <Suspense fallback={<div>Loading business details...</div>}>
          <BusinessDetailClient initialBusiness={null} />
        </Suspense>
      );
    }
    const business = await getBusiness(id);
    if (!business) {
      notFound();
    }
    return (
      <Suspense fallback={<div>Loading business details...</div>}>
        <BusinessDetailClient initialBusiness={business} />
      </Suspense>
    );
  } catch (error) {
    console.error('Feil ved lasting av bedrift:', error);
    return (
      <Suspense fallback={<div>Loading business details...</div>}>
        <BusinessDetailClient initialBusiness={null} />
      </Suspense>
    );
  }
}