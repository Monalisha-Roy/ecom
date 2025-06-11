import { Product } from "@/types/types";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ products }: { products: Product[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full md:w-11/12 mx-auto px-2">
            {products.map((product) => (
                <Link
                    key={product.id}
                    href={`/public/products/${product.id}`}
                    className="flex flex-col items-center justify-between border border-gray-300 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow w-full h-full"
                >
                    <div className="relative flex items-center justify-center w-full aspect-square overflow-hidden rounded-t-lg">
                        <Image
                            alt={`Image of ${product.name}`}
                            src={
                                product.image_url && product.image_url.startsWith("http")
                                    ? product.image_url
                                    : "/default.jpg"
                            }
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col justify-between items-start w-full p-3">
                        <h3 className="text-base font-bold w-full truncate" title={product.name}>
                            {product.name.length > 80 ? product.name.slice(0, 80) + "…" : product.name}
                        </h3>
                        <div className="flex justify-between items-center w-full mt-2">
                            <div className="flex items-center gap-2">
                                <p className="text-base md:text-lg font-bold">
                                    ₹{product.price}
                                </p>
                                <span className="text-sm text-green-600">
                                    {product.discount_percentage > 0 ? `-${Math.round(product.discount_percentage)}%` : ""}
                                </span>
                            </div>
                            <button className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition text-sm md:text-base">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
