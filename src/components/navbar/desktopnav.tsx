import Link from "next/link";
import { ProfileDropdown } from "./profiledropdown";
import { TiShoppingCart } from "react-icons/ti";
import { ProductsDropdown } from "./productsdropdown";
import { FilterDropdown } from "./filterdropdown";
import { RiSearchLine } from "react-icons/ri";

// DesktopNav.tsx
export function DesktopNav({
  searchTerm,
  setSearchTerm,
  handleSearch,
  filterOpen,
  setFilterOpen,
  categories,
  category_id,
  setCategoryId,
  price,
  setPrice,
  handleFilter,
  productsOpen,
  setProductsOpen,
  handleCategoryClick,
  cartCount,
  isLoggedIn,
  user,
  profileOpen,
  setProfileOpen,
  handleLogout,
  loggingOut
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  categories: { id: string; slug: string }[]; // Changed to string
  category_id: string; // Changed to string
  setCategoryId: (id: string) => void; // Changed to string
  price: number; // Simplified to single number
  setPrice: (price: number) => void; // Simplified to single number
  handleFilter: () => void;
  productsOpen: boolean;
  setProductsOpen: (open: boolean) => void;
  handleCategoryClick: (categoryId: string) => void; // Changed to string
  cartCount: number;
  isLoggedIn: boolean;
  user?: { name?: string; email?: string };
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  handleLogout: () => void;
  loggingOut?: boolean;
}) {
  return (
    <div className="hidden md:flex text-lg font-bold items-center">
      <form className="relative flex items-center" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary mx-4 text-sm pr-8"
        />
        <button
          type="submit"
          className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:scale-110 hover:text-black font-bold"
          aria-label="Search"
        >
          <RiSearchLine size={22} />
        </button>
      </form>
      
      <FilterDropdown 
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        categories={categories}
        category_id={category_id}
        setCategoryId={setCategoryId}
        price={price}
        setPrice={setPrice}
        handleFilter={handleFilter}
      />
      
      <Link href="/" className="text-gray-700 hover:text-primary  mx-4">
        Home
      </Link>
      
      <ProductsDropdown
        productsOpen={productsOpen}
        setProductsOpen={setProductsOpen}
        categories={categories}
        handleCategoryClick={handleCategoryClick}
      />
      
      <Link
        href="/cart"
        className="text-gray-700 flex gap-0.5 hover:text-primary mx-4 relative"
      >
        <TiShoppingCart size={25} />
        Cart
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>
      
      <ProfileDropdown
        isLoggedIn={isLoggedIn}
        user={user}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        handleLogout={handleLogout}
        loggingOut={loggingOut}
      />
    </div>
  );
}

