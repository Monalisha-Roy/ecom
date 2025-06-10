// import { Product } from "@/types/types";

// export default function ProductCard({ products }: { products: Product[] }) {
//     return (
//         <div className="grid grid-cols-2 md:grid-cols-4 w-full md:w-11/12 mx-auto bg-white md:gap-4">
//             {//</div>products.map((product) => (
//                 // <Link
//                 //     key={product.id}
//                 //     href={`/public/products/${product.id}`}
//                 //     className="flex flex-col border border-gray-400 w-full h-56 md:h-80 hover:shadow-lg transition-shadow"
//                 // >
//                 //     <div className="relative flex items-center justify-center w-full h-46 md:h-60 overflow-clip">
//                 //         {/* Ratings & Reviews Badge */}
//                 //         <div className="absolute top-2 right-2 bg-white/90 rounded px-2 py-1 shadow text-xs flex flex-col items-end z-10">
//                 //             <span className="font-semibold">
//                 //                 {product.ratings ? product.ratings.toFixed(1) : "N/A"} ★  ({product.reviews || 0})
//                 //             </span>
//                 //         </div>
//                 //         <Image
//                 //             src={product.image}
//                 //             alt={product.name}
//                 //             width={195}
//                 //             height={128}
//                 //             className="object-cover md:w-[340px] md:h-[240px]"
//                 //         />
//                 //     </div>
//                 //     <div className="flex flex-col justify-start items-start w-full h-10 ml-2">
//                 //         <h3 className="font-semibold text-sm md:text-base">{product.name}</h3>
//                 //         <p className="text-gray-600 hidden md:block">{product.description}</p>
//                 //         <span className="text-xs md:text-sm font-bold text-green-600">
//                 //             ${product.price}
//                 //         </span>
//                 //     </div>
//                 // </Link>
//             //))
//             }
//         </div>
//     );
// }