// src/pages/edit-profile/business.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";

export default function EditBusinessProfile() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!user || !userData) return;

      try {
        const businessDoc = await getDoc(doc(db, "businesses", (userData as any).orgNumber));
        if (businessDoc.exists()) {
          setFormData(businessDoc.data());
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
  }, [user, userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Valider e-post og telefonnummer
    if (name === "businessEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? null : "Ugyldig e-postadresse.");
    }
    if (name === "businessPhone") {
      const phoneRegex = /^\d{8}$/;
      setPhoneError(phoneRegex.test(value) ? null : "Telefonnummeret må være 8 siffer.");
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      contact: { ...formData.contact, [name]: value },
    });

    // Valider kontaktpersonens e-post og telefonnummer
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? null : "Ugyldig e-postadresse for kontaktperson.");
    }
    if (name === "phone") {
      const phoneRegex = /^\d{8}$/;
      setPhoneError(phoneRegex.test(value) ? null : "Telefonnummeret må være 8 siffer.");
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev: any) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t: string) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const handleGalleryUpload = (url: string) => {
    setFormData((prev: any) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), url],
    }));
  };

  const handleDeleteGalleryImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_: string, i: number) => i !== index),
    }));
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
      // Oppdater e-post i Firebase Authentication hvis kontaktpersonens e-post har endret seg
      if (formData.contact.email !== user?.email) {
        await updateEmail(user!, formData.contact.email);
      }

      // Oppdater bedriftsdata i Firestore
      await updateDoc(doc(db, "businesses", formData.orgNumber), {
        ...formData,
        updatedAt: new Date().toISOString(),
      });

      router.push(`/profile/business/${formData.orgNumber}`);
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

      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-black">Rediger bedriftsprofil</h1>

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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                  disabled
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
              {emailError && formData.businessEmail === formData.businessEmail && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
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
              {phoneError && formData.businessPhone === formData.businessPhone && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
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
                <label htmlFor="firstName" className="block text-sm font-medium text-black mb-2">
                  Fornavn
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.contact.firstName}
                  onChange={handleContactChange}
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
                  value={formData.contact.lastName}
                  onChange={handleContactChange}
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
                value={formData.contact.email}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                required
              />
              {emailError && formData.contact.email === formData.contact.email && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                Telefonnummer
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.contact.phone}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              />
              {phoneError && formData.contact.phone === formData.contact.phone && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="position" className="block text-sm font-medium text-black mb-2">
                Stilling
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.contact.position}
                onChange={handleContactChange}
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

          <div className="mb-8 border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Bildegalleri</h2>

            <ImageUpload
              label="Last opp bilde til galleriet"
              onUpload={handleGalleryUpload}
              recommendedSize="800x600 px"
              maxSizeMB={5}
            />

            {formData.galleryImages && formData.galleryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.galleryImages.map((image: string, index: number) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Galleri bilde ${index + 1}`} className="w-full h-40 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Lagre endringer
          </button>
        </form>
      </div>
    </div>
  );
}