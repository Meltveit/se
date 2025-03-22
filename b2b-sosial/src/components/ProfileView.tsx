// src/components/ProfileView.tsx
import Link from "next/link";
import { Business, User } from "@/lib/types";

interface ProfileViewProps {
  profile: Business | User;
  type: "business" | "user";
}

export default function ProfileView({ profile, type }: ProfileViewProps) {
  const isBusiness = type === "business";
  const businessProfile = isBusiness ? (profile as Business) : null;
  const userProfile = !isBusiness ? (profile as User) : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-blue-600 p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center text-white font-bold text-xl hover:text-blue-100">
          <img src="/logo.svg" alt="B2B Logo" className="w-8 h-8 mr-2" />
          B2B Social
        </Link>
      </nav>

      <div className="relative">
        {/* Bakgrunnsbilde */}
        {profile.backgroundImage ? (
          <img
            src={profile.backgroundImage}
            alt="Bakgrunnsbilde"
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-300" />
        )}

        {/* Profilbilde */}
        <div className="absolute top-48 left-10">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt="Profilbilde"
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-400 border-4 border-white flex items-center justify-center">
              <span className="text-white text-2xl">
                {isBusiness ? businessProfile?.name[0] : userProfile?.firstName[0]}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-20 bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-black">
          {isBusiness ? businessProfile?.name : `${userProfile?.firstName} ${userProfile?.lastName}`}
        </h1>

        {isBusiness && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Bedriftsinformasjon</h2>
            <p><strong>Organisasjonsnummer:</strong> {businessProfile?.orgNumber}</p>
            <p><strong>Selskapsform:</strong> {businessProfile?.companyType}</p>
            <p><strong>Kategori:</strong> {businessProfile?.category}</p>
            <p><strong>Beskrivelse:</strong> {businessProfile?.description}</p>
            <p><strong>Tagger:</strong> {businessProfile?.tags.join(", ")}</p>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">{isBusiness ? "Kontaktinformasjon" : "Personlig informasjon"}</h2>
          <p><strong>E-post:</strong> {isBusiness ? businessProfile?.businessEmail : userProfile?.email}</p>
          <p><strong>Telefon:</strong> {isBusiness ? businessProfile?.businessPhone : userProfile?.phone || "Ikke oppgitt"}</p>
          {isBusiness && businessProfile?.website && (
            <p><strong>Nettside:</strong> <a href={businessProfile.website} className="text-blue-600 hover:underline">{businessProfile.website}</a></p>
          )}
          {isBusiness && (
            <p><strong>Adresse:</strong> {businessProfile?.address}, {businessProfile?.postalCode} {businessProfile?.city}</p>
          )}
          {!isBusiness && userProfile?.profession && <p><strong>Yrke:</strong> {userProfile.profession}</p>}
          {!isBusiness && userProfile?.industry && <p><strong>Bransje:</strong> {userProfile.industry}</p>}
          {!isBusiness && <p><strong>Nyhetsbrev:</strong> {userProfile?.newsletter ? "Ja" : "Nei"}</p>}
        </div>

        {isBusiness && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Kontaktperson</h2>
            <p><strong>Navn:</strong> {businessProfile?.contact.firstName} {businessProfile?.contact.lastName}</p>
            <p><strong>E-post:</strong> {businessProfile?.contact.email}</p>
            {businessProfile?.contact.phone && <p><strong>Telefon:</strong> {businessProfile?.contact.phone}</p>}
            <p><strong>Stilling:</strong> {businessProfile?.contact.position}</p>
          </div>
        )}

        {isBusiness && businessProfile?.galleryImages && businessProfile.galleryImages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Bildegalleri</h2>
            <div className="grid grid-cols-3 gap-4">
              {businessProfile.galleryImages.map((image, index) => (
                <img key={index} src={image} alt={`Galleri bilde ${index + 1}`} className="w-full h-40 object-cover rounded" />
              ))}
            </div>
          </div>
        )}

        <Link
          href={isBusiness ? "/edit-profile/business" : "/edit-profile/user"}
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Rediger profil
        </Link>
      </div>
    </div>
  );
}