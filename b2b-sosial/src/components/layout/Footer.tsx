import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4">B2B Social</h2>
            <p className="text-gray-400 max-w-md">
              A platform designed to connect businesses together, promote collaboration, and create valuable business opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul>
              <li className="mb-2"><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li className="mb-2"><Link href="/businesses" className="text-gray-400 hover:text-white">Find Businesses</Link></li>
              <li className="mb-2"><Link href="/map" className="text-gray-400 hover:text-white">Business Map</Link></li>
              <li className="mb-2"><Link href="/login" className="text-gray-400 hover:text-white">Sign In</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-400">© 2025 B2B Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
