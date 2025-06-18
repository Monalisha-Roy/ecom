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

export default function CartSummary({ cartItems }: { cartItems: CartItem[] }) {
  if (cartItems.length === 0) {
    return <p className="text-gray-500">Your cart is empty</p>;
  }

  return (
    <div className="space-y-4">
      {cartItems.map(item => (
        <div key={item.id} className="flex items-center border-b pb-4">
          <div className="relative w-16 h-16 mr-3">
            <Image
              src={item.image_url || '/default.jpg'}
              alt={item.name || 'Product Image'}
              className="w-full h-full object-contain"
              height={64}
              width={64}
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-gray-600 text-sm">
              ₹{(item.price * (1 - item.discount_percentage / 100)).toFixed(2)}
              {item.discount_percentage > 0 && (
                <span className="ml-2 line-through text-gray-400">
                  ₹{Number(item.price).toFixed(2)}
                </span>
              )}
            </p>
            <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
          </div>
        </div>
      ))}
    </div>
  );
}