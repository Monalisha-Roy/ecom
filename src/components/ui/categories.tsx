'use client';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Category } from "@/types/types";

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/category");
                const data = await res.json();
                setCategories(data.products || []);
            } catch (error) {
                console.log("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    if (loading) {
        <div className="my-10 text-black text-2xl font-bold flex justify-center items-center">
            Loading...
        </div>
    }

    return (
        
        <main className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 md:gap-6 my-5">
            
            {categories.map((category) => (
            <Link
                key={category.id}
                href={`public/category/${category.id}`}
                className="border border-gray-200 rounded-lg p-6 h-48 bg-white flex flex-col justify-center items-center shadow-sm hover:shadow-md transition-shadow"
            >
                <h3 className="font-semibold text-lg mb-1">{category.slug}</h3>
            </Link>
            ))}
        </main>
    );
}