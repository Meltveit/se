import { getBusinesses } from "../../lib/firestore";
import BusinessCard from "../../components/BusinessCard";
import FilterSidebar from "../../components/FilterSidebar";

export default async function BusinessesPage() {
  const businesses = await getBusinesses();
  return (
    <div className="flex">
      <FilterSidebar />
      <div className="grid grid-cols-3 gap-4 p-4">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
}