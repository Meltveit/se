import { loginBusiness } from "../../lib/auth";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const handleLogin = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await loginBusiness(email, password);
    redirect("/businesses");
  };

  return (
    <form action={handleLogin} className="p-4 max-w-md mx-auto">
      <h2>Log In</h2>
      <input name="email" placeholder="Email" className="border p-2 w-full mb-2" />
      <input name="password" type="password" placeholder="Password" className="border p-2 w-full mb-2" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Log In</button>
    </form>
  );
}