// src/pages/profile/business/[orgNumber].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Business } from "@/lib/types";
import ProfileView from "@/components/ProfileView";

export default function BusinessProfile() {
  const router = useRouter();
  const { orgNumber } = router.query;
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!orgNumber) return;

      try {
        const businessDoc = await getDoc(doc(db, "businesses", orgNumber as string));
        if (businessDoc.exists()) {
          setBusiness(businessDoc.data() as Business);
        } else {
          setError("Bedriften ble ikke funnet.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [orgNumber]);

  if (loading) return <p>Laster...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!business) return <p>Ingen data tilgjengelig.</p>;

  return <ProfileView profile={business} type="business" />;
}