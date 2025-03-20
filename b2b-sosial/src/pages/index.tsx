import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CategoryTabs from "../components/layout/CategoryTabs";
import BusinessCard from "../components/business/BusinessCard";
import BusinessCategories from "../components/business/BusinessCategories";
import AdBanner from "../components/common/AdBanner";

interface Business {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export default function HomePage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const querySnapshot = await getDocs(collection(db, "businesses"));
      const businessData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Business[];
      setBusinesses(businessData);
    };
    fetchBusinesses();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Category Tabs */}
        <CategoryTabs />

        {/* Featured Businesses */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Featured Businesses</h2>
            <a href="/browse" className="text-blue-600">View All</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businesses.slice(0, 3).map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>

        {/* Business Categories */}
        <BusinessCategories />

        {/* Ad Banner */}
        <AdBanner />
      </main>
      <Footer />
    </div>
  );
}