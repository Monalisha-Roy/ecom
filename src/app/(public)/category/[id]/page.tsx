"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types/types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ProductCard from "@/components/products/productCard";

export default function ProductsByCategory() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/productsbycategory/${id}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProducts();
  }, [id]);

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
