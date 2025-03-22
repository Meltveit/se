// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Business, User } from "@/lib/types";

interface AuthContextType {
  user: FirebaseUser | null;
  userType: "business" | "user" | "unknown" | null;
  userData: Business | User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userType: null,
  userData: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userType, setUserType] = useState<"business" | "user" | "unknown" | null>(null);
  const [userData, setUserData] = useState<Business | User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserType = async (uid: string) => {
    // Sjekk om brukeren er knyttet til en bedrift
    const businessQuery = query(collection(db, "businesses"), where("userId", "==", uid));
    const businessSnapshot = await getDocs(businessQuery);
    if (!businessSnapshot.empty) {
      const businessData = businessSnapshot.docs[0].data() as Business;
      setUserType("business");
      setUserData(businessData);
      return { type: "business", data: businessData };
    }

    // Sjekk om brukeren er en privatperson
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      setUserType("user");
      setUserData(userData);
      return { type: "user", data: userData };
    }

    setUserType("unknown");
    setUserData(null);
    return { type: "unknown", data: null };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await checkUserType(firebaseUser.uid);
      } else {
        setUser(null);
        setUserType(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userType, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);