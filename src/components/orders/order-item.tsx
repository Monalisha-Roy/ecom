import Image from 'next/image';
import Link from 'next/link';

interface OrderItemProps {
  item: {
    id: string;
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    discount_percentage: number;
    image_url: string;
  };
}

export default function OrderItem({ item }: OrderItemProps) {
  const discountedPrice = item.unit_price * (1 - item.discount_percentage / 100);
  const total = discountedPrice * item.quantity;

  return (
    <div className="flex items-center border-b pb-4">
      <div className="relative w-40 h-40 mr-4 flex-shrink-0">
        <Image
          src={item.image_url || '/default-product.jpg'}
          alt={item.product_name}
          className="object-contain"
          width={120}
          height={120}
        />
      </div>
      
      <div className="flex-1">
        <Link 
          href={`/product/${item.product_id}`}
          className="font-medium hover:text-blue-600 transition-colors"
        >
          {item.product_name}
        </Link>
        <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1">
          <span className="mr-3">
            ₹{discountedPrice.toFixed(2)}
            {item.discount_percentage > 0 && (
              <span className="ml-1 line-through text-gray-400">
                ₹{Number(item.unit_price).toFixed(2)}
              </span>
            )}
          </span>
          <span className="mr-3">Qty: {item.quantity}</span>
          <span className="font-medium">Total: ₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}