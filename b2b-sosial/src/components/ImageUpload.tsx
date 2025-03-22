// src/components/ImageUpload.tsx
import { useState, ChangeEvent } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface ImageUploadProps {
  label: string;
  onUpload: (url: string) => void;
  recommendedSize: string;
  maxSizeMB: number;
  defaultImage?: string;
}

export default function ImageUpload({ label, onUpload, recommendedSize, maxSizeMB, defaultImage }: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Sjekk filstørrelse
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Konverter MB til bytes
    if (file.size > maxSizeBytes) {
      setError(`Filen er for stor. Maksimal størrelse er ${maxSizeMB}MB.`);
      return;
    }

    try {
      // Last opp til Firebase Storage
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Oppdater forhåndsvisning og send URL til forelder
      setPreview(downloadURL);
      onUpload(downloadURL);
      setError(null);
    } catch (err: any) {
      setError("Kunne ikke laste opp bildet: " + err.message);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-black mb-2">{label}</label>
      <p className="text-sm text-gray-600 mb-2">Anbefalt størrelse: {recommendedSize}, maks {maxSizeMB}MB</p>
      {preview && <img src={preview} alt="Forhåndsvisning" className="w-32 h-32 object-cover mb-2 rounded" />}
      <input type="file" accept="image/*" onChange={handleFileChange} className="text-black" />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}