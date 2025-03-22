// src/pages/register-business.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import ImageUpload from "@/components/ImageUpload";

export default function RegisterBusiness() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    orgNumber: "",
    companyType: "",
    description: "",
    category: "",
    tags: [] as string[],
    businessEmail: "",
    businessPhone: "",
    website: "",
    address: "",
    postalCode: "",
    city: "",
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
    contactPhone: "",
    position: "",
    termsAccepted: false,
    privacyAccepted: false,
    newsletter: false,
    profileImage: "",
    backgroundImage: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.termsAccepted || !formData.privacyAccepted) {
      setError("Du må godta vilkårene og personvernerklæringen.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.contactEmail,
        formData.contactFirstName + "1234"
      );
      const user = userCredential.user;

      await setDoc(doc(db, "businesses", formData.orgNumber), {
        companyName: formData.companyName,
        orgNumber: formData.orgNumber,
        companyType: formData.companyType,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        businessEmail: formData.businessEmail,
        businessPhone: formData.businessPhone,
        website: formData.website,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        contact: {
          firstName: formData.contactFirstName,
          lastName: formData.contactLastName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
          position: formData.position,
        },
        userId: user.uid,
        createdAt: new Date().toISOString(),
        profileImage: formData.profileImage || null,
        backgroundImage: formData.backgroundImage || null,
        galleryImages: [], // Tom liste for bildegalleri ved registrering
      });

      router.push(`/profile/business/${formData.orgNumber}`);
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

      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-black">Registrer din bedrift</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-8 border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Bedriftsinformasjon</h2>

            <div className="mb-4">
              <label htmlFor="companyName" className="block text-sm font-medium text-black mb-2">
                Bedriftsnavn
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                required
              />
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="orgNumber" className="block text-sm font-medium text-black mb-2">
                  Organisasjonsnummer
                </label>
                <input
                  type="text"
                  id="orgNumber"
                  name="orgNumber"
                  value={formData.orgNumber}
                  onChange={handleChange}
                  placeholder="9 siffer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="companyType" className="block text-sm font-medium text-black mb-2">
                  Selskapsform
                </label>
                <select
                  id="companyType"
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                  required
                >
                  <option value="">Velg selskapsform</option>
                  <option value="as">Aksjeselskap (AS)</option>
                  <option value="enkeltpersonforetak">Enkeltpersonforetak</option>
                  <option value="ans">Ansvarlig selskap (ANS)</option>
                  <option value="other">Annet</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
                Kort beskrivelse av bedriften
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Fortell litt om hva bedriften din gjør..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black min-h-[100px]"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-black mb-2">
                Hovedkategori
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                required
              >
                <option value="">Velg kategori</option>
                <option value="technology">Teknologi</option>
                <option value="finance">Finans</option>
                <option value="marketing">Markedsføring</option>
                <option value="health">Helse</option>
                <option value="other">Annet</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">
                Tagger (velg alle som passer)
              </label>
              <div className="flex flex-wrap gap-2">
                {["service", "webdesign", "produsent", "distributør", "leverandør", "grossist", "konsulent", "teknologi"].map((tag) => (
                  <div
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-full cursor-pointer ${
                      formData.tags.includes(tag) ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                    }`}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8 border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Kontaktinformasjon</h2>

            <div className="mb-4">
              <label htmlFor="businessEmail" className="block text-sm font-medium text-black mb-2">
                Bedriftens e-post
              </label>
              <input
                type="email"
                id="businessEmail"
                name="businessEmail"
                value={formData.businessEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="businessPhone" className="block text-sm font-medium text-black mb-2">
                Telefonnummer
              </label>
              <input
                type="tel"
                id="businessPhone"
                name="businessPhone"
                value={formData.businessPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="website" className="block text-sm font-medium text-black mb-2">
                Nettside
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.dinenettside.no"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-black mb-2">
                Adresse
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                required
              />
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="postalCode" className="block text-sm font-medium text-black mb-2">
                  Postnummer
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="city" className="block text-sm font-medium text-black mb-2">
                  Poststed
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-8 border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Kontaktperson</h2>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="contactFirstName" className="block text-sm font-medium text-black mb-2">
                  Fornavn
                </label>
                <input
                  type="text"
                  id="contactFirstName"
                  name="contactFirstName"
                  value={formData.contactFirstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="contactLastName" className="block text-sm font-medium text-black mb-2">
                  Etternavn
                </label>
                <input
                  type="text"
                  id="contactLastName"
                  name="contactLastName"
                  value={formData.contactLastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-black mb-2">
                E-post
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="contactPhone" className="block text-sm font-medium text-black mb-2">
                Telefonnummer
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="position" className="block text-sm font-medium text-black mb-2">
                Stilling
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                required
              />
            </div>
          </div>

          <div className="mb-8 border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Profilbilde og bakgrunnsbilde</h2>

            <ImageUpload
              label="Last opp bedriftslogo"
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
            <label className="flex items-start mb-2">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mr-2 mt-1"
                required
              />
              <span className="text-black">
                Jeg bekrefter at jeg har fullmakt til å registrere denne bedriften og at all informasjon er korrekt
              </span>
            </label>

            <label className="flex items-start mb-2">
              <input
                type="checkbox"
                name="privacyAccepted"
                checked={formData.privacyAccepted}
                onChange={handleChange}
                className="mr-2 mt-1"
                required
              />
              <span className="text-black">
                Jeg godtar <Link href="#" className="text-blue-600 hover:underline">vilkårene for bruk</Link> og{" "}
                <Link href="#" className="text-blue-600 hover:underline">personvernerklæringen</Link>
              </span>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                className="mr-2 mt-1"
              />
              <span className="text-black">Jeg ønsker å motta nyhetsbrev med oppdateringer og tilbud</span>
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Registrer bedrift
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          <p>
            Har du allerede registrert din bedrift?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Logg inn
            </Link>
          </p>
          <p>
            Ønsker du å registrere deg som privatperson?{" "}
            <Link href="/register-user" className="text-blue-600 hover:underline">
              Klikk her
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}