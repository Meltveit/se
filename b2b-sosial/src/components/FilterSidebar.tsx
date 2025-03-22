export default function FilterSidebar() {
    return (
      <div className="border rounded-lg p-4">
        <h3>Filter Businesses</h3>
        <input type="text" placeholder="Search businesses..." className="border p-2 w-full mb-4" />
        <div>
          <h4>Categories</h4>
          <label><input type="checkbox" /> Technology</label>
          <label><input type="checkbox" /> Finance</label>
          <label><input type="checkbox" /> Marketing</label>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Apply Filters</button>
      </div>
    );
  }