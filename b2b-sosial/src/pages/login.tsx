// src/pages/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Logg inn brukeren med e-post og passord
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect til hjemmesiden etter vellykket innlogging
      router.push("/");
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

      <div className="max-w-md mx-auto mt-12 bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Logg inn</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-post
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Passord
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
          >
            Logg inn
          </button>

          <div className="mt-5 text-center">
            <Link href="#" className="text-blue-600 hover:underline mx-2">
              Glemt passord?
            </Link>
          </div>
        </form>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Har du ikke en konto?{" "}
            <Link href="/register-user" className="text-blue-600 hover:underline">
              Registrer deg som privatperson
            </Link>{" "}
            eller{" "}
            <Link href="/register-business" className="text-blue-600 hover:underline">
              som bedrift
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}