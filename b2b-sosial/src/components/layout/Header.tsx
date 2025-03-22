import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.svg" alt="B2B Social" className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold">B2B Social</h1>
        </div>
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search businesses..."
            className="px-4 py-2 rounded-lg text-gray-800 w-64"
          />
        </div>
        <nav className="flex items-center">
          <button className="p-2 rounded hover:bg-blue-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link href="/login" className="ml-4 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}