import React from "react";
import Navbar from "@/components/ui/navbar";
import Carousel from "@/components/ui/carousel";
import Categories from "@/components/ui/categories";
import ProductCard from "@/components/products/productCard";
import { Product } from "@/types/types";

const products: Product[] = [
    {
        id: 1,
        name: "Product 1",
        description: "This is a great product.",
        price: 29.99,
        ratings: 4.5,
        reviews: 120,
        image: "/img1.jpg"
    },
    {
        id: 2,
        name: "Product 2",
        description: "This is another great product.",
        price: 39.99,
        ratings: 4.0,
        reviews: 80,
        image: "/img2.jpg"
    },
    {
        id: 3,
        name: "Product 3",
        description: "This product is amazing.",
        price: 49.99,
        ratings: 4.8,
        reviews: 200,
        image: "/img1.jpg"
    }
];

export default function Homepage() {
    return (
        <main className="min-h-screen w-full bg-gray-50">
            <Navbar/>
            <Carousel />
            <div className="w-11/12 mx-auto mb-20 ">
            <Categories/>
            </div>
            {products.map(product => (
            <ProductCard key={product.id} product={product} />
            ))}    
        </main>
        
    );
}