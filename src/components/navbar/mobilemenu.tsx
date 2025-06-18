import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

// MobileMenu.tsx
export function MobileMenu({
  menuOpen,
  setMenuOpen,
  productsOpen,
  setProductsOpen,
  categories,
  handleCategoryClick,
  filterOpen,
  setFilterOpen,
  category_id,
  setCategoryId,
  price,
  setPrice,
  handleFilter,
  isLoggedIn,
  user,
  profileOpen,
  setProfileOpen,
  handleLogout,
  loggingOut
}: {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
    productsOpen: boolean;
    setProductsOpen: (open: boolean) => void;
    categories: { id: number; slug: string }[];
    handleCategoryClick: (categoryId: number) => void;
    filterOpen: boolean;
    setFilterOpen: (open: boolean) => void;
    category_id: string | null;
    setCategoryId: (id: string | null) => void;
    price: number | null;
    setPrice: (price: number | null) => void;
    handleFilter: () => void;
    isLoggedIn: boolean;
    user?: { name?: string; email?: string };
    profileOpen: boolean;
    setProfileOpen: (open: boolean) => void;
    handleLogout: () => void;
    loggingOut?: boolean;
}) {
  return menuOpen ? (
    <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full z-50">
      <div className="flex flex-col items-start p-4 gap-4">
        <Link href="/" className="text-gray-700 hover:text-primary hover:underline hover:decoration-primary w-full py-2" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <div className="relative group w-full">
          <button
            onClick={() => setProductsOpen(!productsOpen)}
            className="text-gray-700 hover:text-primary hover:underline hover:decoration-primary flex items-center w-full"
            type="button"
          >
            Products
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {productsOpen && (
            <div className="fixed left-0 top-16 w-full h-96 bg-white z-50 overflow-y-auto">
              <button
                className="absolute top-4 right-6 text-gray-500 hover:text-black text-2xl font-bold"
                onClick={() => setProductsOpen(false)}
                aria-label="Close products dropdown"
              >
                &times;
              </button>
              <ul className="py-8 grid grid-cols-1 md:grid-cols-4 w-11/12 mx-auto shadow-md">
                {categories.map((category, idx) => (
                  <li key={idx} className="font-semibold text-gray-700 hover:text-primary text-base block py-2 px-4">
                    <button onClick={() => handleCategoryClick(category.id)}>
                      {category.slug}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="relative w-full ">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-start text-gray-700 hover:text-primary w-full"
            type="button"
          >
            Filter
          </button>
          {filterOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              onClick={() => setFilterOpen(false)}
            >
              <div
                className="bg-white rounded-lg shadow-lg p-6 w-80 relative"
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
                      value={category_id ?? undefined}
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
                        value={price ?? 0}
                        onChange={e => setPrice(Number(e.target.value))}
                      />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>₹{price ?? 0}</span>
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
            </div>
          )}
        </div>

        {isLoggedIn ? (
          <div className="relative w-full">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-primary w-full px-2 py-2 rounded-md font-semibold"
            >
              <FaUserCircle size={22} />
              <span className="font-medium truncate">{user?.name || "Profile"}</span>
            </button>
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute left-0 top-12 mt-2 bg-white rounded-xl shadow-xl p-4 w-64 z-50 border border-gray-100">
                  <div className="flex flex-col items-start border-b pb-3 mb-3 w-full">
                    <Link href="/profile" className="w-full" onClick={() => setMenuOpen(false)}>
                      <span className="flex items-center gap-2 px-2 py-1 rounded-md font-semibold text-gray-800 hover:bg-gray-100 transition-colors">
                        <FaUserCircle size={18} className="text-primary" />
                        Profile
                      </span>
                    </Link>
                    <span className="text-xs text-gray-500 mt-1 px-2 break-all">{user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md font-medium transition-colors"
                    disabled={loggingOut}
                  >
                    <FiLogOut size={16} />
                    {loggingOut ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            className="text-gray-700 hover:text-primary w-full px-2 py-2 rounded-md font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  ) : null;
}