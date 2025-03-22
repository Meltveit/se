// src/pages/edit-profile/user.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";

export default function EditUserProfile() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setFormData(userDoc.data());
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
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Valider e-post og telefonnummer
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? null : "Ugyldig e-postadresse.");
    }
    if (name === "phone") {
      const phoneRegex = /^\d{8}$/;
      setPhoneError(value ? (phoneRegex.test(value) ? null : "Telefonnummeret må være 8 siffer.") : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Sjekk for valideringsfeil
    if (emailError || phoneError) {
      setError("Vennligst fiks valideringsfeilene før du lagrer.");
      return;
    }

    try {
      // Oppdater e-post i Firebase Authentication hvis e-posten har endret seg
      if (formData.email !== user?.email) {
        await updateEmail(user!, formData.email);
      }

      // Oppdater brukerdata i Firestore
      await updateDoc(doc(db, "users", user!.uid), {
        ...formData,
        updatedAt: new Date().toISOString(),
      });

      router.push(`/profile/user/${user!.uid}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Laster...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!formData) return <p>Ingen data tilgjengelig.</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-blue-600 p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center text-white font-bold text-xl hover:text-blue-100">
          <img src="/logo.svg" alt="B2B Logo" className="w-8 h-8 mr-2" />
          B2B Social
        </Link>
      </nav>

      <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-black">Rediger profil</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-black mb-2">
                Fornavn
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-black mb-2">
                Etternavn
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
              E-post
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              required
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
              Telefonnummer
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            />
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="profession" className="block text-sm font-medium text-black mb-2">
              Yrke/Stilling
            </label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="industry" className="block text-sm font-medium text-black mb-2">
              Bransje/Sektor
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            >
              <option value="">Velg bransje/sektor</option>
              <option value="technology">Teknologi</option>
              <option value="finance">Finans</option>
              <option value="marketing">Markedsføring</option>
              <option value="health">Helse</option>
              <option value="other">Annet</option>
            </select>
          </div>

          <div className="mb-8 border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Profilbilde og bakgrunnsbilde</h2>

            <ImageUpload
              label="Last opp profilbilde"
              onUpload={(url) => setFormData({ ...formData, profileImage: url })}
              recommendedSize="200x200 px"
              maxSizeMB={2}
              defaultImage={formData.profileImage}
            />

            <ImageUpload
              label="Last opp bakgrunnsbilde"
              onUpload={(url) => setFormData({ ...formData, backgroundImage: url })}
              recommendedSize="1200x400 px"
              maxSizeMB={5}
              defaultImage={formData.backgroundImage}
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-black">Jeg ønsker å motta nyhetsbrev om tilbud og oppdateringer</span>
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Lagre endringer
          </button>
        </form>
      </div>
    </div>
  );
}