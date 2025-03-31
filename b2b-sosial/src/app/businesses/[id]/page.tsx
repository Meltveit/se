// src/app/businesses/[id]/page.tsx
import { Metadata } from 'next';
import { getBusiness, getBusinesses } from '@/lib/firebase/db';
import { notFound } from 'next/navigation';
import BusinessDetailClient from './BusinessDetailClient';
import { Business } from '@/types'; // Importer Business-typen

// Definer PageParams-interfacet helt øverst
interface PageParams {
  id: string;
}

// Definer PageProps-interfacet helt øverst
interface PageProps {
  params: PageParams; // Bruk PageParams-interfacet
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Generer statiske parametere direkte i sidefilen
export async function generateStaticParams() {
  try {
    const { businesses } = await getBusinesses(500);
    return businesses.map((business) => ({
      id: business.id,
    }));
  } catch (error) {
    console.error('Feil ved generering av statiske parametere for bedrifter:', error);
    return [{ id: 'placeholder' }];
  }
}

// Funksjon for metadatagenerering
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Håndter plassholder-tilfellet under bygging
    if (params.id === 'placeholder') {
      return {
        title: 'Bedriftsprofil | B2B Social',
        description: 'Detaljer om bedriftsprofil'
      };
    }

    const business = await getBusiness(params.id);

    if (!business) {
      return {
        title: 'Bedrift Ikke Funnet',
        description: 'Den forespurte bedriften ble ikke funnet'
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
      description: 'Detaljer om bedriftsprofil'
    };
  }
}

// Sidekomponent
const BusinessDetailPage: React.FC<PageProps> = async ({ params, searchParams }) => {
  try {
    const { id } = params;

    if (id === 'placeholder') {
      return <BusinessDetailClient initialBusiness={null} searchParams={searchParams} />;
    }

    const business = await getBusiness(id);

    if (!business) {
      notFound();
    }

    return <BusinessDetailClient initialBusiness={business} searchParams={searchParams} />;
  } catch (error) {
    console.error('Feil ved lasting av bedrift:', error);
    return <BusinessDetailClient initialBusiness={null} searchParams={searchParams} />;
  }
};

export default BusinessDetailPage;

export interface LayoutProps {
  children?: React.ReactNode;
  params?: { id: string };
}