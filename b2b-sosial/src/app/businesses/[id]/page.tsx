import { getBusinessById } from "../../../lib/firestore";
import Link from "next/link";

export default async function BusinessProfilePage({ params }: { params: { id: string } }) {
  const business = await getBusinessById(params.id);
  if (!business) return <p>Business not found</p>;

  return (
    <div className="p-4">
      <div className="bg-blue-600 h-40 rounded-t-lg"></div>
      <div className="border rounded-b-lg p-4">
        <h1>{business.name}</h1>
        <p>Email: {business.email}</p>
        <p>Phone: {business.phone}</p>
        <p>Address: {business.address}</p>
        <p>{business.description}</p>
        <Link href={`/businesses/${params.id}/edit`}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Edit Profile</button>
        </Link>
      </div>
    </div>
  );
}