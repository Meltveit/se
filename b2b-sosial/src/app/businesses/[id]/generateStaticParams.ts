// src/app/businesses/[id]/generateStaticParams.ts
import { getBusinesses } from '@/lib/firebase/db';

export async function generateStaticParams() {
  try {
    const { businesses } = await getBusinesses(100);
    return businesses.map((business) => ({
      id: business.id,
    }));
  } catch (error) {
    console.error('Error generating static params for businesses:', error);
    return [{ id: 'placeholder' }];
  }
}