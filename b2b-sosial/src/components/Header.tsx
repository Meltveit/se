import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="flex justify-between">
        <Link href="/">B2B Social</Link>
        <div>
          <Link href="/businesses" className="mx-2">Businesses</Link>
          <Link href="/login" className="mx-2">Login</Link>
        </div>
      </nav>
    </header>
  );
}