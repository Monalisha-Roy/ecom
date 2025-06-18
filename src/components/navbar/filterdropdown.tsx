// FilterDropdown.tsx
import { TbFilter } from "react-icons/tb";

export function FilterDropdown({
  filterOpen,
  setFilterOpen,
  categories,
  category_id,
  setCategoryId,
  price,
  setPrice,
  handleFilter
}: {
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  categories: { id: string; slug: string }[];
  category_id: string; // Changed to string
  setCategoryId: (id: string) => void; // Changed to string
  price: number; // Simplified to single number
  setPrice: (price: number) => void; // Simplified to single number
  handleFilter: () => void;
}) {
  return (
    <div className="relative group">
      <button
        onClick={() => setFilterOpen(true)}
        className="flex items-center gap-1 px-2 py-1 font-semibold text-gray-700 hover:text-primary"
        type="button"
      >
        <TbFilter size={22} />
        Filter
      </button>
      {filterOpen && (
        <div
          className="absolute right-0 top-10 mt-2 bg-white rounded-lg shadow-lg p-6 w-80 z-50"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl"
            onClick={() => setFilterOpen(false)}
            aria-label="Close filter"
          >
            &times;
          </button>
          <h2 className="text-lg font-bold mb-4">Filter Products</h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleFilter();
              setFilterOpen(false);
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full border rounded px-2 py-1 font-medium"
                value={category_id}
                onChange={e => setCategoryId(e.target.value)}
              >
                <option value="">All</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat.id}>
                    {cat.slug}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price Range</label>
              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  min={0}
                  max={10000}
                  step={100}
                  className="w-full accent-blue-400"
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>₹{price}</span>
                  <span>₹10,000+</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              onClick={() => handleFilter()}
              className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// In your Navbar component
