'use client';
import { useEffect, useState } from 'react';
import { FiShoppingBag, FiTruck, FiCreditCard, FiAlertCircle } from 'react-icons/fi';
import useUser from '@/hooks/useUser';
import Link from 'next/link';
import CartSummary from './cart-summary';
import { useSearchParams } from 'next/navigation';

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  name: string;
  price: number;
  discount_percentage: number;
  image_url: string;
}

export default function CheckoutPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: 'card',
    sameAsShipping: true
  });
  const [error, setError] = useState<string | null>(null);

  // Check if this is a "Buy Now" checkout
  const isBuyNow = searchParams.get('product_id') && searchParams.get('quantity');

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.price * (1 - item.discount_percentage / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        // For "Buy Now", fetch only the specific product
        if (isBuyNow) {
          const productId = searchParams.get('product_id'); console.log('productId', productId);
          const quantity = parseInt(searchParams.get('quantity') || '1'); console.log('quantity', quantity);
          
          const res = await fetch(`/api/products/${productId}`); console.log('res', res);
          const data = await res.json(); console.log('data', data);
          
          if (!res.ok) {
            throw new Error(data.message || 'Failed to fetch product');
          }
          
          const product = data.product;
          setCartItems([{
            id: `buy-now-${Date.now()}`,
            quantity,
            product_id: productId as string,
            name: product.name,
            price: Number(product.price),
            discount_percentage: Number(product.discount_percentage),
            image_url: product.image_url
          }]);
        } else {
          // For normal cart checkout, fetch all cart items
          const res = await fetch('/api/cart');
          const data = await res.json();
          
          if (!res.ok) {
            throw new Error(data.message || 'Failed to fetch cart');
          }
          
          setCartItems(data.items || []);
        }
      } catch (error: unknown) {
        console.error('Error fetching cart:', error);
        setError(error instanceof Error ? error.message : 'Failed to load items');
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();

    // Listen for cart update events (only for cart checkout)
    const handleCartUpdate = () => !isBuyNow && fetchCart();
    window.addEventListener('cartUpdate', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, [user, searchParams, isBuyNow]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const billingAddress = formData.sameAsShipping 
        ? formData.shippingAddress 
        : formData.billingAddress;
      
      // Prepare request body
      const body: {
        shippingAddress: string;
        billingAddress: string;
        paymentMethod: string;
        items?: { productId: string | null; quantity: number }[];
      } = {
        shippingAddress: formData.shippingAddress,
        billingAddress,
        paymentMethod: formData.paymentMethod
      };

      // Add items for Buy Now
      if (isBuyNow) {
        const productId = searchParams.get('product_id');
        const quantity = parseInt(searchParams.get('quantity') || '1');
        
        body.items = [{
          productId,
          quantity
        }];
      }
      
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (res.ok) {
        setOrderSuccess(true);
        setOrderId(data.orderId);
        window.dispatchEvent(new Event('cartUpdate'));
      } else {
        throw new Error(data.message || 'Checkout failed');
      }
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-8 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p>Please log in to proceed with checkout.</p>
          <Link href="/login" className="text-blue-600 hover:underline mt-4 inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess && orderId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <FiShoppingBag className="text-green-600 text-4xl" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-4">Order Confirmed!</h1>
          <p className="text-center mb-6">
            Thank you for your order. Your order ID is: 
            <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-2">
              {orderId}
            </span>
          </p>
          
          <div className="bg-gray-50 p-4 rounded mb-6">
            <p className="text-center mb-2">
              We&aposve sent a confirmation email to {user.email}
            </p>
            <p className="text-center text-gray-600">
              Your items will be shipped within 2-3 business days.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-center"
            >
              View Order History
            </Link>
            <Link
              href="/"
              className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-50 text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:px-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-6 flex items-center">
          <FiAlertCircle className="mr-2" />
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <FiTruck className="text-xl mr-2 text-blue-600" />
                <h2 className="text-xl font-bold">Shipping Address</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Shipping Address</label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    name="sameAsShipping"
                    checked={formData.sameAsShipping}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="sameAsShipping">
                    Billing address same as shipping address
                  </label>
                </div>
              </div>
            </div>
            
            {/* Billing Address - Conditionally rendered */}
            {!formData.sameAsShipping && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <FiCreditCard className="text-xl mr-2 text-blue-600" />
                  <h2 className="text-xl font-bold">Billing Address</h2>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Billing Address</label>
                  <textarea
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    required={!formData.sameAsShipping}
                  />
                </div>
              </div>
            )}
            
            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <FiCreditCard className="text-xl mr-2 text-blue-600" />
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="card">Credit/Debit Card</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="wallet"
                    name="paymentMethod"
                    value="wallet"
                    checked={formData.paymentMethod === 'wallet'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="wallet">Wallet</label>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-medium disabled:opacity-70"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <CartSummary cartItems={cartItems} />
              
              <div className="space-y-3 mt-6 pt-4 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}