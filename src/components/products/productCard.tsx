import Image from "next/image";
import { Product } from "@/types/types";

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="flex flex-col w-full mx-auto bg-white p-4">
            <div className="flex flex-row border border-black h-96">
                <div className="flex items-center justify-center w-1/2">
                    <Image
                        src={product.image}
                        alt={product.name}
                        height={200}
                        width={200}
                        className="object-cover rounded-lg"
                    />
                </div>
                <div className="flex flex-col justify-start pl-6  ml-14 items-start my-8">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <p className="text-gray-500 mb-2">
                        Ratings: {product.ratings ? product.ratings.toFixed(1) : "N/A"} ({product.reviews || 0} reviews)
                    </p>
                    <span className="text-xl font-bold text-green-600">${product.price}</span>
                </div>
            </div>

        </div>
    )
}