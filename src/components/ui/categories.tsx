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
                const res = await fetch("/api/categories");
                const data = await res.json();
                if (Array.isArray(data.categories)) {
                    setCategories(data.categories);
                } else {
                    setCategories([]);
                    console.error("Unexpected data format:", data);
                }
            } catch (error) {
                console.log("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    if (loading) {
        <div className="my-10 flex justify-center items-center">
            Loading...
        </div>
    }

    return (
        
        <main className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
            
            {categories.map((category) => (
            <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="border border-gray-200 rounded-lg p-6 h-48 bg-white flex flex-col justify-center items-center shadow-sm hover:shadow-md transition-shadow"
            >
                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                <span className="text-gray-500 text-sm">{category.slug}</span>
            </Link>
            ))}
        </main>
    );
}