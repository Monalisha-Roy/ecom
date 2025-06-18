'use client';
import { useState } from 'react';
import { FiPackage, FiCalendar, FiCreditCard, FiTruck } from 'react-icons/fi';
import OrderItem from './order-item';
import OrderDetails from './order-details';
import useUser from '@/hooks/useUser';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItemType {
    id: string;
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    discount_percentage: number;
    image_url: string;
}

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    payment_method: string;
    shipping_address: string;
    billing_address: string;
    items: OrderItemType[];
}

interface OrdersPageProps {
    orders: Order[];
}

// const statusColors: Record<string, string> = {
//     pending: 'bg-yellow-100 text-yellow-800',
//     processing: 'bg-blue-100 text-blue-800',
//     shipped: 'bg-indigo-100 text-indigo-800',
//     delivered: 'bg-green-100 text-green-800',
//     cancelled: 'bg-red-100 text-red-800',
// };

export default function OrdersPage({ orders }: OrdersPageProps) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const user = useUser();
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md p-8 bg-white rounded shadow">
                    <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                    <p>Please log in to view your order history.</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 p-4 rounded-full">
                            <FiPackage className="text-gray-500 text-4xl" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
                    <p className="text-gray-600 mb-6">
                        You haven&apos;t placed any orders yet. Start shopping to see your order history here.
                    </p>

                    <div className="flex justify-center">
                        <Link
                            href="/"
                            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const viewOrderDetails = (order: Order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
                    <p className="text-gray-600">
                        View your order history and track recent purchases
                    </p>
                </div>

                {selectedOrder ? (
                    <OrderDetails order={selectedOrder} onClose={closeOrderDetails} />
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="grid grid-cols-12 bg-gray-50 py-3 px-4 text-sm font-medium text-gray-500 border-b">
                            <div className="col-span-3">Order</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-2">Total</div>
                            <div className="col-span-2">Payment</div>
                            <div className="col-span-1"></div>
                        </div>

                        <div className="divide-y">
                            {orders.map((order: Order) => (
                                <div key={order.id} className="py-4 px-4">
                                    <div
                                        className="grid grid-cols-12 items-center cursor-pointer"
                                        onClick={() => toggleOrderDetails(order.id)}
                                    >
                                        <div className="col-span-3 flex items-center">
                                            <Image
                                                width={96}
                                                height={96}
                                                src={order.items[0]?.image_url}
                                                alt={order.items[0]?.product_name || 'Product'}
                                                className="w-36 h-36 object-cover rounded mr-3 border"
                                            />
                                            {/* <span className="font-medium">{order.items[0]?.product_name}</span> */}
                                            {order.items.length > 1 && (
                                                <span className="ml-2 text-xs text-gray-500">
                                                    +{order.items.length - 1} more
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            <FiCalendar className="mr-1" />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            ₹{Number(order.total_amount).toFixed(2)}
                                        </div>
                                        <div className="col-span-2 flex items-center capitalize">
                                            <FiCreditCard className="mr-1" />
                                            {order.payment_method}
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    viewOrderDetails(order);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>

                                    {expandedOrder === order.id && (
                                        <div className="mt-4 pl-2 border-l-2 border-blue-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h3 className="font-medium mb-2 flex items-center">
                                                        <FiTruck className="mr-2" />
                                                        Shipping Address
                                                    </h3>
                                                    <p className="text-gray-700">{order.shipping_address}</p>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h3 className="font-medium mb-2 flex items-center">
                                                        <FiCreditCard className="mr-2" />
                                                        Billing Address
                                                    </h3>
                                                    <p className="text-gray-700">{order.billing_address}</p>
                                                </div>
                                            </div>

                                            <h3 className="font-medium mt-6 mb-3">Items</h3>
                                            <div className="space-y-4">
                                                {order.items.map((item: OrderItemType) => (
                                                    <OrderItem key={item.id} item={item} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}