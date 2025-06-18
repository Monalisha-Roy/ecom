import { FiX, FiPackage, FiCalendar, FiCreditCard, FiTruck } from 'react-icons/fi';
import OrderItem from './order-item';

interface OrderDetailsProps {
  order: {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    payment_method: string;
    shipping_address: string;
    billing_address: string;
    items: {
      id: string;
      product_id: string;
      product_name: string;
      unit_price: number;
      quantity: number;
      discount_percentage: number;
      image_url: string;
    }[];
  };
  onClose: () => void;
}

// const statusColors: Record<string, string> = {
//   pending: 'bg-yellow-100 text-yellow-800',
//   processing: 'bg-blue-100 text-blue-800',
//   shipped: 'bg-indigo-100 text-indigo-800',
//   delivered: 'bg-green-100 text-green-800',
//   cancelled: 'bg-red-100 text-red-800',
// };

export default function OrderDetails({ order, onClose }: OrderDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
        
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <FiPackage className="mr-2" />
              Order #{order.id.slice(0, 8)}
            </h2>
            <div className="mt-1 flex items-center text-gray-600">
              <FiCalendar className="mr-1" />
              Placed on {new Date(order.created_at).toLocaleString()}
            </div>
          </div>
          
          {/* <div className="mt-4 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div> */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center">
              <FiTruck className="mr-2" />
              Shipping Address
            </h3>
            <p className="text-gray-700">{order.shipping_address}</p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center">
              <FiCreditCard className="mr-2" />
              Billing Address
            </h3>
            <p className="text-gray-700">{order.billing_address}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex justify-end">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{Number(order.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between py-2 border-t mt-2 pt-2 font-bold text-lg">
                <span>Total</span>
                <span>₹{Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onClose}
            className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-50 text-center"
          >
            Back to Orders
          </button>
            <button
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-center"
            onClick={() => {
              // Placeholder for download invoice logic
              alert('Download Invoice feature coming soon!');
            }}
            >
            Download Invoice
            </button>
        </div>
      </div>
    </div>
  );
}