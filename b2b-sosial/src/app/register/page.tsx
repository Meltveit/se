import { registerBusiness } from "../../lib/auth";
import { addBusiness } from "../../lib/firestore";
import { redirect } from "next/navigation";

export default function RegisterPage() {
  const handleRegister = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const userCredential = await registerBusiness(email, password);

    const business = {
      name: formData.get("name") as string,
      email,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      description: formData.get("description") as string,
      categories: formData.getAll("categories") as string[],
      contactPerson: formData.get("contactPerson") as string,
      orgNumber: formData.get("orgNumber") as string,
    };

    await addBusiness(business);
    redirect("/businesses");
  };

  return (
    <form action={handleRegister} className="p-4 max-w-md mx-auto">
      <h2>Register Your Business</h2>
      <input name="name" placeholder="Business Name" className="border p-2 w-full mb-2" />
      <input name="email" placeholder="Email" className="border p-2 w-full mb-2" />
      <input name="password" type="password" placeholder="Password" className="border p-2 w-full mb-2" />
      <input name="phone" placeholder="Phone" className="border p-2 w-full mb-2" />
      <input name="address" placeholder="Address" className="border p-2 w-full mb-2" />
      <textarea name="description" placeholder="Description" className="border p-2 w-full mb-2" />
      <input name="contactPerson" placeholder="Contact Person" className="border p-2 w-full mb-2" />
      <input name="orgNumber" placeholder="Org Number" className="border p-2 w-full mb-2" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
    </form>
  );
}