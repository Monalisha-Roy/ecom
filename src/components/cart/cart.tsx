// components/cart/cart-page.tsx
'use client';
import { useState, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import useUser from '@/hooks/useUser';
import Link from 'next/link';
import Image from 'next/image';

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  name: string;
  price: number;
  discount_percentage: number;
  image_url: string;
}

export default function CartPage() {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;
    
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          setCartItems(data.items || []);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
    
    // Listen for cart update events
    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cartUpdate', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, [user]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    
    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: newQuantity })
      });
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    
    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.price * (1 - item.discount_percentage / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-8 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p>Please log in to view your cart.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FiShoppingCart size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Start adding some products!</p>
        <Link 
          href="/" 
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center border-b py-4">
              <div className="relative w-24 h-24 mr-4">
                <Image 
                  src={item.image_url || '/default.jpg'} 
                  alt={item.name} 
                  className="w-full h-full object-contain"
                  height={96}
                  width={96}
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-600">
                  ₹{(item.price * (1 - item.discount_percentage / 100)).toFixed(2)}
                  {item.discount_percentage > 0 && (
                    <span className="ml-2 line-through text-gray-400">
                      ₹{Number(item.price).toFixed(2)}
                    </span>
                  )}
                </p>
                
                <div className="flex items-center mt-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={updating[item.id]}
                    className="px-3 py-1 bg-gray-200 rounded-l"
                  >
                    -
                  </button>
                  
                  <span className="px-3 py-1 bg-gray-100">
                    {updating[item.id] ? '...' : item.quantity}
                  </span>
                  
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={updating[item.id]}
                    className="px-3 py-1 bg-gray-200 rounded-r"
                  >
                    +
                  </button>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    disabled={updating[item.id]}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t">
              <span>Total</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-medium"
            onClick={() => window.location.href = '/checkout'}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}