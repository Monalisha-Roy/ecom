'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { Category } from "@/types/types";
import { TbFilter } from "react-icons/tb";
import { TiShoppingCart } from "react-icons/ti";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { RiSearchLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import useUser from "@/hooks/useUser"; 

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [category_id, setCategoryId] = useState("");
  const [price, setPrice] = useState<number>(500);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { user } = useUser();
  const isLoggedIn = !!user;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data.products || []);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleFilter = () => {
    if (!category_id && !price) return;
    else if (price == 0) router.push(`/category/${category_id}`);
    else if (!category_id && price) router.push(`/filter/0/${price}`);
    else router.push(`/filter/${category_id}/${price}`);
    setFilterOpen(false);
    setMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setMenuOpen(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setProductsOpen(false);
    setMenuOpen(false);
    router.push(`/category/${categoryId}`);
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
        credentials: "include"
      });

      if (res.ok) {
        // Optionally clear any client-side user state here if needed
        window.dispatchEvent(new Event('authChange'));
        setProfileOpen(false);
        setMenuOpen(false);
        router.refresh?.(); 
        router.push("/");
      } else {
        // Optionally show an error message to the user
        console.error("Logout failed: Server returned error");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-background shadow z-50">
        <div className="w-11/12 h-16 flex items-center justify-between mx-auto">
          <div className="items-start">
            <p className="text-3xl text-primary font-bold">SHOPEase</p>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex text-lg font-bold items-center">
            <form
              className="relative flex items-center"
              onSubmit={handleSearch}
            >
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
              )}
            </div>
            <Link href="/" className="text-gray-700 hover:text-primary  mx-4">
              Home
            </Link>
            <div className="relative group">
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                className="text-gray-700 hover:text-primary mx-4 flex items-center"
                type="button"
              >
                Products
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {productsOpen && (
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setProductsOpen(false)}
                >
                  <ul
                    className="absolute right-20 top-14 mt-2 bg-white shadow-lg rounded-b-md py-2 w-64 z-50"
                    onClick={e => e.stopPropagation()}
                  >
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
            <Link
              href="/cart"
              className="text-gray-700 flex gap-0.5 hover:text-primary mx-4"
            ><TiShoppingCart size={25} />Cart</Link>

            {/* Conditionally render login or profile dropdown */}
            {isLoggedIn ? (
                <div className="relative ml-4">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary"
                >
                  <FaUserCircle size={24} />
                  <span className="font-medium">{user?.name || "Profile"}</span>
                </button>

                {profileOpen && (
                  <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-10 mt-2 bg-white rounded-xl shadow-xl p-4 w-56 z-50 border border-gray-100">
                    <div className="flex flex-col items-start border-b pb-3 mb-3">
                    <Link href="/profile" className="w-full">
                      <span className="flex items-center gap-2 px-2 py-1 rounded-md font-semibold text-gray-800 hover:bg-gray-100 transition-colors">
                      <FaUserCircle size={20} className="text-primary" />
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
                    <FiLogOut size={18} />
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
                className="text-gray-700  hover:text-primary mx-4"
              >
                Login
              </Link>
            )}
          </div>
          {/* Mobile Hamburger */}
          {!menuOpen ? (
            <div className="flex gap-1 items-center justify-center md:hidden">
              <Link
                href="/public/products"
                className="text-gray-700 flex gap-0.5 "
              ><TiShoppingCart size={25} />Cart</Link>
              <button
                className=" flex items-center px-2 py-1 text-gray-700"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <RxHamburgerMenu size={30} />
              </button></div>
          ) : (
            <button
              className="absolute top-4 right-6 text-gray-500 text-5xl font-extralight md:hidden hover:text-black"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>
          )}
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full z-50">
            <div className="flex flex-col items-start p-4 gap-4">
              <Link href="/public/home" className="text-gray-700 hover:text-primary hover:underline hover:decoration-primary w-full py-2" onClick={() => setMenuOpen(false)}>
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
              <div className="relative w-full">
                <button
                  onClick={() => setFilterOpen(true)}
                  className="flex items-start text-gray-700 hover:text-primary w-full"
                  type="button"
                >
                  Filter
                </button>
                {filterOpen && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    onClick={() => setFilterOpen(false)}
                  >
                    <div
                      className="relative mt-2 bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-xs mx-auto z-50"
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
                            {categories.map((category, idx) => (
                              <li key={idx} className="mb-1">
                                <Link
                                  href={`/public/category/${category.id}`}
                                  className="font-semibold text-gray-700 hover:text-primary text-base block py-2 px-4"
                                >
                                  {category.slug}
                                </Link>
                              </li>
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

              {/* Conditionally render login or profile in mobile */}
              {isLoggedIn ? (
                <>
                  <div className="w-full py-2 flex items-center gap-3">
                    <FaUserCircle size={24} />
                    <div>
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded"
                  >
                    <FiLogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="text-gray-700 w-full py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Mobile Search Bar */}
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
    </>
  );
}