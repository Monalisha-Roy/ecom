'use client';
import Link from "next/link";
import { useState } from "react";
import { categories } from "../../../src/types/types"


export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
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
                        <Link href="/public/home" className="text-gray-700 hover:text-primary hover:underline hover:decoration-primary mx-4">
                            Home
                        </Link>
                        <div className="relative group">
                            <button
                                onClick={() => setProductsOpen(!productsOpen)}
                                className="text-gray-700 hover:text-primary hover:underline hover:decoration-primary mx-4 flex items-center"
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
                                    <ul className="py-8 grid grid-cols-1 md:grid-cols-4 gap-1 w-11/12 mx-auto">
                                        {Object.entries(categories).map(([category, subcategories]) => (
                                            <li key={category} className="mb-4">
                                                <p className="font-semibold text-gray-700 mb-2">{category}</p>
                                                <ul>
                                                    {(subcategories as string[]).map((subcat) => (
                                                        <li key={subcat}>
                                                            <Link
                                                                href={`/public/products/${encodeURIComponent(subcat.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'))}`}
                                                                className="text-gray-500 hover:text-black text-sm block py-1"
                                                            >
                                                                {subcat}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <Link href="/public/cart" className="text-gray-700 hover:text-primary hover:underline hover:decoration-primary mx-4">
                            Cart
                        </Link>
                        <Link
                            href="/public/login"
                            className="text-gray-700 hover:underline hover:text-primary hover:decoration-primary mx-4"
                        >
                            Login
                        </Link>
                    </div>
                    {/* Mobile Hamburger */}
                    {!menuOpen ? (
                        <button
                            className="md:hidden flex items-center px-2 py-1"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Open menu"
                        >
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
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
                            <div className="relative group">
                                <button
                                    onClick={() => setProductsOpen(!productsOpen)}
                                    className="text-gray-700 hover:text-primary hover:underline hover:decoration-primary flex items-center"
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
                                        <ul className="py-8 grid grid-cols-1 md:grid-cols-4 gap-1 w-11/12 mx-auto">
                                            {Object.entries(categories).map(([category, subcategories], catIdx) => (
                                                <li key={category} className="mb-4">
                                                    <p className="font-semibold text-gray-700 mb-2">{category}</p>
                                                    <ul>
                                                        {(subcategories as string[]).map((subcat, subIdx) => (
                                                            <li key={subcat}>
                                                                <Link
                                                                    href={`/public/products/${encodeURIComponent(subcat.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'))}`}
                                                                    className="text-gray-500 hover:text-black text-sm block py-1"
                                                                >
                                                                    {subcat}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <Link href="/public/cart" className="text-gray-700 hover:text-primary hover:underline hover:decoration-primary w-full py-2" onClick={() => setMenuOpen(false)}>
                                Cart
                            </Link>
                            <Link
                                href="/public/login"
                                className="text-gray-700 hover:underline hover:text-primary hover:decoration-primary w-full py-2"
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