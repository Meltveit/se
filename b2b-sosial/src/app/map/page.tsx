import { Suspense } from 'react';
import { generateMapMetadata } from './metadata';
import MainLayout from '@/components/layout/MainLayout';
import MapContent from './MapContent';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export async function generateMetadata() {
  return await generateMapMetadata();
}

export default function MapPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      }>
        <MapContent />
      </Suspense>
    </MainLayout>
  );
}