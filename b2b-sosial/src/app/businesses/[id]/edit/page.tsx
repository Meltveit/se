import { getBusinessById, updateBusiness } from "../../../../lib/firestore";
import { uploadImage } from "../../../../lib/storage";

export default async function EditProfilePage({ params }: { params: { id: string } }) {
  const business = await getBusinessById(params.id);
  if (!business) return <p>Business not found</p>;

  const handleSubmit = async (formData: FormData) => {
    "use server";
    const updatedData: Partial<Business> = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      description: formData.get("description") as string,
    };

    const profileImage = formData.get("profileImage") as File;
    if (profileImage) {
      const url = await uploadImage(profileImage, `businesses/${params.id}/profile.jpg`);
      updatedData.profileImage = url;
    }

    await updateBusiness(params.id, updatedData);
  };

  return (
    <form action={handleSubmit} className="p-4">
      <input name="name" defaultValue={business.name} className="border p-2 w-full mb-2" />
      <input name="email" defaultValue={business.email} className="border p-2 w-full mb-2" />
      <input name="phone" defaultValue={business.phone} className="border p-2 w-full mb-2" />
      <input name="address" defaultValue={business.address} className="border p-2 w-full mb-2" />
      <textarea name="description" defaultValue={business.description} className="border p-2 w-full mb-2" />
      <input type="file" name="profileImage" className="mb-2" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}