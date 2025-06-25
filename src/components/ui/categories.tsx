'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Category } from "@/types/types";
import Image from "next/image";

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryImages, setCategoryImages] = useState<{ [key: string]: string[] }>({});

    // Fetch categories from API
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/category");
                const data = await res.json();
                setCategories(data.products || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    // Function to fetch images for one category
    async function fetchImages(categoryId: string) {
        try {
            const res = await fetch(`/api/getImages/${categoryId}`); // ✅ corrected line
            if (!res.ok) {
                throw new Error('Failed to fetch images');
            }
            const data = await res.json();
            return data.images || [];
        } catch (error) {
            console.error("Error fetching images:", error);
            return [];
        }
    }

    // Fetch all category images when categories are loaded
    useEffect(() => {
        async function fetchAllImages() {
            const imagesMap: { [key: string]: string[] } = {};
            await Promise.all(
                categories.map(async (category) => {
                    const images = await fetchImages(category.id);
                    imagesMap[category.id] = images;
                })
            );
            setCategoryImages(imagesMap);
        }
        if (categories.length > 0) {
            fetchAllImages();
        }
    }, [categories]);

    if (loading) {
        return (
            <div className="my-10 text-black text-2xl font-bold flex justify-center items-center">
                Loading...
            </div>
        );
    }

    return (
        <main className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 md:gap-6 my-5">
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`category/${category.id}`}
                    className="border border-gray-200 rounded-lg p-6 h-72 bg-white flex flex-col justify-center items-center shadow-sm hover:shadow-md transition-shadow"
                >
                    <h3 className="font-sans text-md mb-1">{category.slug}</h3>
                    <div className="grid grid-cols-2 gap-2 md:gap-5">
                        {categoryImages[category.id] === undefined && (
                            <span className="text-gray-400 text-xs">Loading images...</span>
                        )}
                        {categoryImages[category.id]?.slice(0, 4).map((imgUrl, idx) => (
                            <Image
                                key={idx}
                                src={imgUrl}
                                alt={category.slug}
                                width={48}
                                height={48}
                                className="w-24 h-24 object-cover rounded"
                            />
                        ))}
                    </div>
                </Link>
            ))}
        </main>
    );
}
