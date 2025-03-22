import React from 'react';

interface BusinessProfileProps {
  name: string;
  categories: string[];
  email: string;
  phone: string;
  address: string;
  description: string;
  website: string;
  contactPerson: string;
  orgNumber: string;
}

export default function BusinessProfile({
  name,
  categories,
  email,
  phone,
  address,
  description,
  website,
  contactPerson,
  orgNumber,
}: BusinessProfileProps) {
  return (
    <main className="w-full max-w-full px-4 py-8">
      {/* Business Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="h-56 bg-gradient-to-r from-blue-500 to-blue-700 relative">
          <div className="absolute -bottom-16 left-8 w-36 h-36 bg-white rounded-full flex items-center justify-center text-blue-600 text-5xl font-bold border-4 border-white shadow-lg">
            {name[0]}
          </div>
        </div>
        <div className="p-8 pt-24">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-3 text-gray-800">{name}</h1>
              <div className="flex flex-wrap mb-4">
                {categories.map((cat) => (
                  <span key={cat} className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2 mb-2 font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium shadow-md">Send Message</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800 mb-4 mt-6">
            <div>
              <p className="font-semibold text-lg mb-1">Email:</p>
              <p className="text-base">{email}</p>
            </div>
            <div>
              <p className="font-semibold text-lg mb-1">Phone:</p>
              <p className="text-base">{phone}</p>
            </div>
            <div>
              <p className="font-semibold text-lg mb-1">Address:</p>
              <p className="text-base">{address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* About Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">About Us</h2>
            <p className="text-gray-800 text-lg leading-relaxed mb-4">{description}</p>
          </div>

          {/* Gallery Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="h-40 bg-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"></div>
              <div className="h-40 bg-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"></div>
              <div className="h-40 bg-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"></div>
              <div className="h-40 bg-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"></div>
              <div className="h-40 bg-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"></div>
              <div className="h-40 bg-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"></div>
            </div>
          </div>

          {/* News Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Company News</h2>
            <p className="text-gray-800 text-lg">No news available.</p>
          </div>
        </div>

        <div>
          {/* Contact & Info Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">More Information</h2>
            <div className="mb-6">
              <p className="font-semibold text-lg mb-1 text-gray-800">Website:</p>
              <a href={website} className="text-blue-600 hover:underline text-base">{website}</a>
            </div>
            <div className="mb-6">
              <p className="font-semibold text-lg mb-1 text-gray-800">Contact Person:</p>
              <p className="text-gray-600 text-base">{contactPerson}</p>
            </div>
            <div className="mb-2">
              <p className="font-semibold text-lg mb-1 text-gray-800">Organization Number:</p>
              <p className="text-gray-600 text-base">{orgNumber}</p>
            </div>
          </div>

          {/* Ad Banner */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-700 font-medium mb-3">Advertisement</p>
            <div className="h-56 bg-gray-200 rounded-lg flex items-center justify-center shadow-inner">
              <p className="text-gray-600 font-medium">Your Ad Here</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}