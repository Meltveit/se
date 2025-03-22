// src/pages/businesses/index.tsx
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import BusinessCard from "@/components/business/BusinessCard";
import { useState, useEffect } from "react";

export interface Business {
  id: string;
  name: string;
  tags: string[];
  description: string;
}

export async function getStaticProps() {
  // Mock-data for nå; senere kan du hente fra Firestore ved build-tid
  const mockBusinesses: Business[] = [
    {
      id: "fixitt-as",
      name: "Fixitt AS",
      tags: ["service", "webdesign"],
      description: "We handle all your IT needs and make life easier for you.",
    },
    {
      id: "bon-as",
      name: "BON AS",
      tags: ["beverage", "distributor"],
      description: "We produce the world's best seltzer water without additives.",
    },
    {
      id: "unknown",
      name: "Unknown Business",
      tags: ["Other"],
      description: "No description available.",
    },
  ];

  return {
    props: {
      initialBusinesses: mockBusinesses,
    },
    // Optional: Re-generer siden etter et visst intervall (f.eks. hver time)
    revalidate: 3600, // 1 time i sekunder
  };
}

interface BrowseBusinessesProps {
  initialBusinesses: Business[];
}

export default function BrowseBusinesses({ initialBusinesses }: BrowseBusinessesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [region, setRegion] = useState("All Regions");
  const [country, setCountry] = useState("All Countries");
  const [sortBy, setSortBy] = useState("Newest");
  const [isMounted, setIsMounted] = useState(false);

  const categories = ["Technology", "Finance", "Marketing", "Health", "Education"];
  const filteredBusinesses = initialBusinesses; // Senere: Filtrer på klienten eller hent dynamisk

  // Vent med å rendre dynamisk innhold til klienten er klar
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hvis klienten ikke er klar ennå, vis kun statisk innhold
  if (!isMounted) {
    return (
      <Layout>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 bg-white rounded-lg shadow-md p-4 md:mr-6 mb-6 md:mb-0">
            <h2 className="text-lg font-bold mb-4">Filter Businesses</h2>
            {/* Statisk placeholder */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search businesses..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled
              />
            </div>
          </div>
          <div className="md:w-3/4">
            <h1 className="text-2xl font-bold mb-6">Browse Businesses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialBusinesses.map((business) => (
                <Link key={business.id} href={`/businesses/${business.id}`}>
                  <BusinessCard {...business} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Filters */}
        <div className="md:w-1/4 bg-white rounded-lg shadow-md p-4 md:mr-6 mb-6 md:mb-0">
          <h2 className="text-lg font-bold mb-4">Filter Businesses</h2>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search businesses..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedCategories.includes(category)}
                    onChange={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(category)
                          ? prev.filter((c) => c !== category)
                          : [...prev, category]
                      )
                    }
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Region */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option>All Regions</option>
              <option>Oslo</option>
              <option>Bergen</option>
              <option>Trondheim</option>
              <option>Stavanger</option>
            </select>
          </div>

          {/* Country */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option>All Countries</option>
              <option>Norway</option>
              <option>Sweden</option>
              <option>Denmark</option>
              <option>Finland</option>
            </select>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Apply Filters
          </button>
        </div>

        {/* Business List */}
        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Browse Businesses</h1>
            <div className="flex items-center">
              <span className="mr-2">Sort by:</span>
              <select
                className="border border-gray-300 rounded-md px-2 py-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Newest</option>
                <option>Alphabetical</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          {/* Business Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Link key={business.id} href={`/businesses/${business.id}`}>
                <BusinessCard {...business} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow">
              <a href="#" className="px-4 py-2 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50">
                Previous
              </a>
              <a href="#" className="px-4 py-2 bg-white border-t border-b border-gray-300 text-blue-600 font-medium">
                1
              </a>
              <a href="#" className="px-4 py-2 bg-white border-t border-b border-gray-300 hover:bg-gray-50">
                2
              </a>
              <a href="#" className="px-4 py-2 bg-white border-t border-b border-gray-300 hover:bg-gray-50">
                3
              </a>
              <a href="#" className="px-4 py-2 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50">
                Next
              </a>
            </nav>
          </div>
        </div>
      </div>
    </Layout>
  );
}