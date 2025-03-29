// src/app/map/page.tsx
import { Metadata } from 'next';
import { getBusinesses, getCategories } from '@/lib/firebase/db';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

// Statiske mock-data for land og regioner
const countries = [
  { code: 'no', name: 'Norway', flag: '🇳🇴', phoneCode: '+47', currencies: ['NOK'], languages: ['no'], hasRegions: true },
  { code: 'se', name: 'Sweden', flag: '🇸🇪', phoneCode: '+46', currencies: ['SEK'], languages: ['sv'], hasRegions: true },
  // Legg til flere land
];

const regions = [
  { code: 'oslo', name: 'Oslo', countryCode: 'no' },
  { code: 'stockholm', name: 'Stockholm', countryCode: 'se' },
  // Legg til flere regioner
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Business Map | B2B Social',
    description: 'Explore businesses on an interactive map. Find local connections and opportunities.',
    openGraph: {
      title: 'Business Map | B2B Social',
      description: 'Discover businesses near you or in specific regions.',
    },
  };
}

export default async function MapPage() {
  try {
    // Hent kategorier og bedrifter med lokasjon
    const [categoriesData, businessesData] = await Promise.all([
      getCategories(),
      getBusinesses(100, undefined, [
        { field: 'location', operator: '!=', value: null }
      ])
    ]);

    // Forbered data for klientsiden
    const businessesWithLocation = businessesData.businesses.filter(b => b.location);

    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Business Map</h1>
            <Button variant="outline">
              My Location
            </Button>
          </div>
          
          {/* Statisk kartinnlasting med opprinnelige data */}
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p>Interaktivt kart lastes inn på klientsiden</p>
          </div>
        </div>
      </MainLayout>
    );
  } catch (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Feil ved lasting av kart
            </h2>
            <p className="text-gray-500 mb-6">
              Kunne ikke laste kartdata. Vennligst prøv igjen senere.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }
}