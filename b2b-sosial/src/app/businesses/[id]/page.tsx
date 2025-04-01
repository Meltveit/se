import { Metadata } from 'next';
import { getBusiness } from '@/lib/firebase/db';
import { notFound } from 'next/navigation';
import BusinessDetailClient from './BusinessDetailClient';

// Definer PageProps med riktig type for params og searchParams som Promises
export interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | undefined;
}

// Generer statiske parametere for statisk eksport
export async function generateStaticParams() {
  try {
    // Hent opptil 500 bedrifter for statisk generering
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
    // Oppløs Promise for params
    const { id } = await params;

    // Håndter placeholder-tilfellet under bygging
    if (id === 'placeholder') {
      return {
        title: 'Bedriftsprofil | B2B Social',
        description: 'Detaljer om bedriftsprofil',
      };
    }

    // Hent bedriftsdata
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
export default async function BusinessDetailPage({ params, searchParams }: PageProps) {
  try {
    // Oppløs Promise for params
    const { id } = await params;

    // Oppløs Promise for searchParams hvis det finnes
    const resolvedSearchParams = searchParams ? await searchParams : undefined;

    // Håndter placeholder-tilfellet under bygging
    if (id === 'placeholder') {
      return <BusinessDetailClient initialBusiness={null} searchParams={resolvedSearchParams} />;
    }

    // Hent bedriftsdata
    const business = await getBusiness(id);

    // Håndter tilfelle der bedriften ikke blir funnet
    if (!business) {
      notFound();
    }

    return <BusinessDetailClient initialBusiness={business} searchParams={resolvedSearchParams} />;
  } catch (error) {
    console.error('Feil ved lasting av bedrift:', error);
    // Sørg for å oppløse searchParams også i feiltilfellet
    const resolvedSearchParams = searchParams ? await searchParams : undefined;
    return <BusinessDetailClient initialBusiness={null} searchParams={resolvedSearchParams} />;
  }
}