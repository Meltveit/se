// src/pages/profile/user/[userId].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/lib/types";
import ProfileView from "@/components/ProfileView";

export default function UserProfile() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        const userDoc = await getDoc(doc(db, "users", userId as string));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          setError("Brukeren ble ikke funnet.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p>Laster...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Ingen data tilgjengelig.</p>;

  return <ProfileView profile={user} type="user" />;
}