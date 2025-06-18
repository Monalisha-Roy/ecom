import { RiSearchLine } from "react-icons/ri";

// MobileSearch.tsx
export function MobileSearch({
  searchTerm,
  setSearchTerm,
  handleSearch
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}) {
  return (
    <div className="md:hidden fixed top-16 left-0 w-full bg-white shadow z-40 px-4 py-3 flex items-center">
      <div className="relative flex w-full">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm pr-10"
        />
        <button
          type="submit"
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 hover:scale-110 text-black font-bold"
          aria-label="Search"
        >
          <RiSearchLine size={22} />
        </button>
      </div>
    </div>
  );
}