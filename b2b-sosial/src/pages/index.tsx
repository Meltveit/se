import Link from "next/link";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import BusinessCard from "@/components/business/BusinessCard";
import BusinessCategories from "@/components/business/BusinessCategories";
import CategoryTabs from "@/components/common/CategoryTabs";
import AdBanner from "@/components/common/AdBanner";

const businesses = [
  { id: "fixitt-as", name: "Fixitt AS", tags: ["service", "webdesign"], description: "We handle all your IT needs and make life easier for you." },
  { id: "bon-as", name: "BON AS", tags: ["beverage", "distributor"], description: "We produce the world's best seltzer water without additives." },
  { id: "unknown", name: "Unknown Business", tags: ["Other"], description: "No description available." },
];

export default function HomePage() {
  return (
    <Layout>
      {/* Category Tabs - Strekker seg over hele bredden */}
      <CategoryTabs />

      {/* Featured Businesses */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Featured Businesses</h1>
          <Link href="/businesses" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Link key={business.id} href={`/businesses/${business.id}`}>
              <motion.div
                className="business-card relative"
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <BusinessCard {...business} />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Business Categories */}
      <BusinessCategories />

      {/* Ad Banner */}
      <AdBanner />
    </Layout>
  );
}