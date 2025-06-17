"use client";
import ProductCard from "@/components/products/productCard";
import { Product } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// Create a separate component that uses useSearchParams
function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) return;
        setLoading(true);
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => setProducts(data.products || []))
            .finally(() => setLoading(false));
    }, [query]);

    if (loading)
        return (
            <div className="w-full min-h-screen flex flex-col justify-center items-center">
                <AiOutlineLoading3Quarters size={50} className="animate-spin" />
                <p className="text-2xl font-bold">Loading</p>
            </div>
        );

    if (products.length === 0)
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                No products found for this category.
            </div>
        );

    return (
        <main className="w-full min-h-screen mt-12 md:mt-0 flex flex-col gap-4 items-center p-4">
            <ProductCard products={products} />
        </main>
    );
}

// Main component that wraps with Suspense
export default function FilterPage() {
    return (
        <Suspense fallback={
            <div className="w-full min-h-screen flex flex-col justify-center items-center">
                <AiOutlineLoading3Quarters size={50} className="animate-spin" />
                <p className="text-2xl font-bold">Loading Search...</p>
            </div>
        }>
            <SearchResults />
        </Suspense>
    );
}