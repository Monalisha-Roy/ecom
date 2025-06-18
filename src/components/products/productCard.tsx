'use client';
import { useState } from 'react';
import { Product } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export default function ProductCard({ products }: { products: Product[] }) {
  const router = useRouter();
  const { user } = useUser();
  const [addingItems, setAddingItems] = useState<Record<string, boolean>>({});

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/auth?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setAddingItems(prev => ({ ...prev, [productId]: true }));

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

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
              <button
                onClick={(e) => {
                  if (typeof product.id === 'string') {
                    handleAddToCart(e, product.id);
                  }
                }}
                disabled={typeof product.id !== 'string' || addingItems[product.id as string]}
                className={`flex items-center px-3 gap-1 ${typeof product.id === 'string' && addingItems[product.id as string]
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                  } text-white px-3 py-1.5 rounded transition text-sm md:text-base`}
              >
                {typeof product.id === 'string' && addingItems[product.id as string] ? (
                  'Adding...'
                ) : (
                  <>
                    <FiShoppingCart size={16} />
                    Add
                  </>
                )}
              </button>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (!user) {
                    router.push('/auth?redirect=' + encodeURIComponent(window.location.pathname));
                    return;
                  }

                  // Redirect to checkout with product details as query params
                  const params = new URLSearchParams({
                    product_id: String(product.id),
                    quantity: '1'
                  });
                  router.push(`/checkout?${params.toString()}`);
                }}
                className="flex items-center gap-1 px-3 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded transition text-sm md:text-base"
              >
                Buy Now
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}