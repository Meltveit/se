import Link from "next/link";

export default function CategoryTabs() {
  return (
    <div className="flex justify-between mb-6 border-b">
      <Link
        href="/"
        className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600"
      >
        Businesses
      </Link>
      <Link href="/news-feed" className="px-4 py-2 font-medium text-gray-500">
        News Feed
      </Link>
      <Link href="/map" className="px-4 py-2 font-medium text-gray-500">
        Map
      </Link>
      <Link href="/about" className="px-4 py-2 font-medium text-gray-500">
        About
      </Link>
    </div>
  );
}