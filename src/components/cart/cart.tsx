'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export default function Cart({ userId }: { userId: string }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cart items for the user (replace with your API endpoint)
    fetch(`/api/cart?userId=${userId}`)
      .then(res => res.json())
      .then(data => setCartItems(data.items || []))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <div>Loading your cart...</div>;
  }

  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
      <ul>
        {cartItems.map(item => (
            <li key={item.id} className="flex items-center mb-4">
            <Image
              width={64}
              height={64}
              src={item.image_url || "/default.jpg"}
              alt={item.name}
              className="w-16 h-16 object-cover rounded mr-4"
            />
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div>Quantity: {item.quantity}</div>
              <div className="text-green-600 font-bold">${item.price}</div>
            </div>
            </li>
        ))}
      </ul>
      <div className="mt-6 text-right font-bold text-lg">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}