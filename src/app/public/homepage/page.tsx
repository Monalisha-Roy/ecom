import React from "react";
import Navbar from "@/components/ui/navbar";
import Carousel from "@/components/ui/carousel";
import Categories from "@/components/ui/categories";

export default function Homepage() {
    return (
        <main className="min-h-screen w-full bg-gray-50">
                <Navbar/>
                <Carousel />
                <div className="w-11/12 mx-auto mb-20 ">
                    <Categories/>
                </div>
                

        <footer className="bg-white border-t py-4 text-center text-gray-500 w-full fixed bottom-0 left-0">
            &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
        </footer>
        </main>
        
    );
}