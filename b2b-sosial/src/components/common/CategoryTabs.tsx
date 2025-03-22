import Link from "next/link";
import { useRouter } from "next/router";

export default function CategoryTabs() {
  const router = useRouter();
  const tabs = [
    { name: "Businesses", href: "/" },
    { name: "News Feed", href: "/news-feed" },
    { name: "Map", href: "/map" },
    { name: "About", href: "/about" },
  ];

  return (
    <div className="flex justify-between mb-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <Link key={tab.name} href={tab.href}>
          <div
            className={`px-4 py-2 font-medium ${
              router.pathname === tab.href
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab.name}
          </div>
        </Link>
      ))}
    </div>
  );
}