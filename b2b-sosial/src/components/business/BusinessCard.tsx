interface BusinessCardProps {
  name: string;
  tags: string[];
  description: string;
}

export default function BusinessCard({ name, tags, description }: BusinessCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-800">
            <span className="font-bold">{name[0]}</span>
          </div>
          <div className="ml-3">
            <h3 className="font-bold">{name}</h3>
            <div className="flex flex-wrap">
              {tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 mb-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      </div>
    </div>
  );
}
