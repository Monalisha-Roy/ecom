// 'use client';
// import React, { useRef, useEffect, useState } from "react";
// import ProductCard from "./productCard";
// import { Product } from "@/types/types";

// const ProductCarousel = () => {
//     const carouselRef = useRef<HTMLDivElement>(null);
//     const [products, setProducts] = useState<Product[]>([]);

//     // Mouse drag state
//     const isDown = useRef(false);
//     const startX = useRef(0);
//     const scrollLeft = useRef(0);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             const res = await fetch("/api/getRandomProducts");
//             const data = await res.json();
//             setProducts(data.items || []);
//             console.log(products);
//         };
//         fetchProducts();
//     }, []);

//     const handleMouseDown = (e: React.MouseEvent) => {
//         isDown.current = true;
//         if (carouselRef.current) {
//             carouselRef.current.classList.add("active");
//             startX.current = e.pageX - carouselRef.current.offsetLeft;
//             scrollLeft.current = carouselRef.current.scrollLeft;
//         }
//     };

//     const handleMouseLeave = () => {
//         isDown.current = false;
//         if (carouselRef.current) {
//             carouselRef.current.classList.remove("active");
//         }
//     };

//     const handleMouseUp = () => {
//         isDown.current = false;
//         if (carouselRef.current) {
//             carouselRef.current.classList.remove("active");
//         }
//     };

//     const handleMouseMove = (e: React.MouseEvent) => {
//         if (!isDown.current || !carouselRef.current) return;
//         e.preventDefault();
//         const x = e.pageX - carouselRef.current.offsetLeft;
//         const walk = (x - startX.current) * 2;
//         carouselRef.current.scrollLeft = scrollLeft.current - walk;
//     };

//     return (
//         <div
//             ref={carouselRef}
//             className="product-carousel"
//             style={{
//                 display: "flex",
//                 overflowX: "auto",
//                 width: "100vw",
//                 cursor: "grab",
//                 gap: "1rem",
//                 padding: "1rem 0",
//                 userSelect: "none",
//             }}
//             onMouseDown={handleMouseDown}
//             onMouseLeave={handleMouseLeave}
//             onMouseUp={handleMouseUp}
//             onMouseMove={handleMouseMove}
//         >
//             {products.map((product) => (
//                 <div key={product.id} style={{ flex: "0 0 auto" }}>
//                     {/* <ProductCard products={product} /> */}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default ProductCarousel;