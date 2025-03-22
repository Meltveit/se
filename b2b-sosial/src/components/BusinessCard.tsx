import Link from "next/link";
import { Business } from "../lib/types";

export default function BusinessCard({ business }: { business: Business }) {
  return (
    <div className="border rounded-lg p-4 shadow">
      <h3>{business.name}</h3>
      <p>{business.description}</p>
      <Link href={`/businesses/${business.id}`}>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">View Profile</button>
      </Link>
    </div>
  );
}