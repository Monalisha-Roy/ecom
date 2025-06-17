"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types/types";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data: { product: Product } = await res.json();
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="w-full min-h-screen flex flex-col justify-center items-center"><AiOutlineLoading3Quarters size={50} className="font-extrabold animate-spin" /><p className="text-2xl font-bold">Loading</p></div>;
  if (!product) return <div className="w-full min-h-screen flex justify-center items-center">Product not found.</div>;

  return (
    <div className="w-full min-h-screen mt-12 md:mt-0 flex justify-center">
      <div className="flex flex-col my-5 h-2/3 md:flex-row md:justify-around w-full bg-white overflow-hidden">
        <div className="w-full md:w-1/2 flex items-center justify-center  p-4">
          <Image
            alt={`Image of ${product.name}`}
            src={
              product.image_url && product.image_url.startsWith("http")
                ? product.image_url
                : "/default.jpg"
            }
            width={400}
            height={400}
            className="w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain rounded"
            priority
          />
        </div>
        <div className="w-full md:w-1/2 p-4 flex flex-col gap-1 ">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">{product.name}</h1>
          <p className="mb-2 text-sm sm:text-base">{product.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <p className=" font-bold text-lg sm:text-xl ">₹{product.price}</p>
            <span className="text-2xl text-green-600">
              {product.discount_percentage > 0 ? `-${Math.round(product.discount_percentage)}%` : ""}
            </span>
          </div>

          <div className=" flex flex-col sm:flex-row gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Add to Cart
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
