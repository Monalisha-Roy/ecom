import React from "react";
import Navbar from "@/components/ui/navbar";
import Carousel from "@/components/ui/carousel";
import Categories from "@/components/ui/categories";
//import ProductCard from "@/components/products/productCard";

export default function Home() {
    return (
        <main className="min-h-screen w-full bg-gray-50">
            <Navbar/>
            <Carousel />
            <div className="w-11/12 mx-auto mb-20 ">
            <Categories/>
            </div>
            {/* <ProductCard products={mock_products} />    */}
        </main>
        
    );
}