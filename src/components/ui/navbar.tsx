'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { Category } from "@/types/types";
import { TbFilter } from "react-icons/tb";
import { TiShoppingCart } from "react-icons/ti";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [category_id, setCategoryId] = useState("");
  const [price, setPrice] = useState<number>(500);
  const router = useRouter();

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
    if(!category_id && !price) return;
    else if(!category_id && price) router.push(`/public/filter/0/${price}`);
    else router.push(`/public/filter/${category_id}/${price}`);
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
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary mx-4 text-sm pr-8"
              />
              <button
                type="submit"
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:scale-110 hover:text-black font-bold"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </button>
            </div>
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
            <Link href="/public/home" className="text-gray-700 hover:text-primary  mx-4">
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
                      <li key={idx} className="mb-1">
                        <Link
                          href={`/public/products/${encodeURIComponent((category.name || '').toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-"))}`}
                          className="font-semibold text-gray-700 hover:text-primary text-base block py-2 px-4"
                        >
                          {category.slug}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Link
              href="/public/products"
              className="text-gray-700 flex gap-0.5 hover:text-primary mx-4"
            ><TiShoppingCart size={25} />Cart</Link>
            <Link
              href="/public/login"
              className="text-gray-700  hover:text-primary mx-4"
            >
              Login
            </Link>
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
                        <li key={idx} className="mb-4">
                          <Link
                            href={`/public/products/${encodeURIComponent((category.name || '').toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-"))}`}
                            className=" text-gray-700 hover:text-primary text-base block "
                          >
                            {category.slug}
                          </Link>
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
                          setFilterOpen(false);
                          // Add filter logic here
                        }}
                        className="flex flex-col gap-4"
                      >
                        <div>
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <select className="w-full border rounded px-2 py-1 font-medium">
                            <option value="">All</option>
                            {categories.map((cat, idx) => (
                              <option key={idx} value={cat.name}>
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
                              value={minPrice}
                              onChange={e => setMinPrice(Number(e.target.value))}
                            />
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>₹{minPrice}</span>
                              <span>₹10,000+</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white rounded px-4 py-2 font-semibold"
                        >
                          Apply Filters
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/public/login"
                className="text-gray-700 w-full py-2"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm pr-10"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:scale-110 text-black font-bold"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
