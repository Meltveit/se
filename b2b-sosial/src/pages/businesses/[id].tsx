import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import BusinessProfile from "@/components/business/BusinessProfile";

interface Business {
  name: string;
  categories: string[];
  email: string;
  phone: string;
  address: string;
  description: string;
  website: string;
  contactPerson: string;
  orgNumber: string;
}

const mockBusinesses: Record<string, Business> = {
  "bon-as": {
    name: "BON AS",
    categories: ["Drikkevarer", "Distributør", "Produsent"],
    email: "christopher@nielsenit.no",
    phone: "95863224",
    address: "Lensmannslia 4",
    description: "We produce the world's best seltzer water without additives. Best in tests across the world.",
    website: "https://www.strijana.com",
    contactPerson: "Christopher Meltveit Nielsen",
    orgNumber: "929783018",
  },
};

export default function BusinessPage() {
  const router = useRouter();
  const { id } = router.query;

  // Find the business based on ID, otherwise show an error message
  const business = id ? mockBusinesses[id as string] : undefined;

  if (!business) {
    return (
      <Layout>
        <div className="text-center text-red-500">Business not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BusinessProfile {...business} />
    </Layout>
  );
}