import React from "react";
import Carousel from "@/components/ui/carousel";
import Categories from "@/components/ui/categories";

export default function Home() {
    return (
        <main className="min-h-screen w-full bg-background">
            <Carousel />
            <div className="w-11/12 mx-auto mb-20 ">
            <Categories/>
            </div>
        </main>
        
    );
}