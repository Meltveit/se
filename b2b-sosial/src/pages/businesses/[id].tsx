import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { Business } from "../../lib/types";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function BusinessDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchBusiness = async () => {
      const docRef = doc(db, "businesses", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBusiness({ id: docSnap.id, ...docSnap.data() } as Business);
      }
    };
    fetchBusiness();
  }, [id]);

  if (!business) return <div>Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 relative">
            <div className="absolute -bottom-16 left-8 w-32 h-32 bg-white rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-white">
              {business.name[0]}
            </div>
          </div>
          <div className="p-6 pt-20">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">{business.name}</h1>
                <div className="flex flex-wrap mb-4">
                  {business.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 mb-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Send Message
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 mb-4">
              <div>
                <p className="font-medium">Email:</p>
                <p>{business.email || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Phone:</p>
                <p>{business.phone || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Address:</p>
                <p>{business.address || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}