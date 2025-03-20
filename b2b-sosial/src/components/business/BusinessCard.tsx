import { Business } from "../../lib/types";
import Link from "next/link";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <Link href={`/businesses/${business.id}`}>
          <div className="flex items-center mb-3 cursor-pointer">
            {/* Logo */}
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <span className="font-bold">{business.name[0]}</span>
            </div>
            {/* Navn og tags */}
            <div className="ml-3">
              <h3 className="font-bold">{business.name}</h3>
              <div className="flex flex-wrap">
                {business.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 mb-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
        <p className="text-sm text-gray-600 mb-3">{business.description}</p>
      </div>
    </div>
  );
}