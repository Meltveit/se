// src/pages/register-user.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import ImageUpload from "@/components/ImageUpload";

export default function RegisterUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profession: "",
    industry: "",
    termsAccepted: false,
    newsletter: false,
    profileImage: "",
    backgroundImage: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.termsAccepted) {
      setError("Du må godta vilkårene og personvernerklæringen.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passordene stemmer ikke overens.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        profession: formData.profession,
        industry: formData.industry,
        newsletter: formData.newsletter,
        createdAt: new Date().toISOString(),
        profileImage: formData.profileImage || null,
        backgroundImage: formData.backgroundImage || null,
      });

      router.push(`/profile/user/${user.uid}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-blue-600 p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center text-white font-bold text-xl hover:text-blue-100">
          <img src="/logo.svg" alt="B2B Logo" className="w-8 h-8 mr-2" />
          B2B Social
        </Link>
      </nav>

      <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-black">Registrer deg som privatperson</h1>

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
              placeholder="din@epost.no"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              required
            />
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
              placeholder="12345678"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                Passord
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                required
              />
              <p className="text-sm text-gray-600 mt-1">Minst 8 tegn med tall og bokstaver</p>
            </div>
            <div className="flex-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
                Bekreft passord
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                required
              />
            </div>
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
            />

            <ImageUpload
              label="Last opp bakgrunnsbilde (valgfritt)"
              onUpload={(url) => setFormData({ ...formData, backgroundImage: url })}
              recommendedSize="1200x400 px"
              maxSizeMB={5}
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <span className="text-black">
                Jeg godtar <Link href="#" className="text-blue-600 hover:underline">vilkårene for bruk</Link> og{" "}
                <Link href="#" className="text-blue-600 hover:underline">personvernerklæringen</Link>
              </span>
            </label>

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
            Registrer deg
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          <p>
            Har du allerede en konto?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Logg inn
            </Link>
          </p>
          <p>
            Ønsker du å registrere deg som bedrift?{" "}
            <Link href="/register-business" className="text-blue-600 hover:underline">
              Klikk her
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}