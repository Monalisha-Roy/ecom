'use server';
import { cookies, headers } from 'next/headers';
import OrdersPage from '@/components/orders/orders-page';
import Link from 'next/link';

function isErrorWithMessage(err: unknown): err is { message: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as Record<string, unknown>).message === 'string'
  );
}

export default async function Orders() {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-8 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p>Please log in to view your order history.</p>
        </div>
      </div>
    );
  }
  let errorMessage = 'Failed to load order history. Please try again later.';
  try {
    // Dynamically determine origin (works on Vercel and localhost)
    const host = (await headers()).get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const origin = `${protocol}://${host}`;
    const apiUrl = `${origin}/api/orders`;

    const response = await fetch(apiUrl, {
      headers: {
        Cookie: `token=${token}`  // assuming you have the token value
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      throw new Error(errorData.error || 'Failed to fetch orders');
    }

    const data = await response.json();
    return <OrdersPage orders={data.orders} />;
  } catch (error: unknown) {
    console.error('Order fetch error:', error);

   
    let errorDetails = '';
    if (isErrorWithMessage(error)) {
      const message = error.message;
      errorDetails = message;
      if (message.includes('401') || message.includes('Invalid authentication token')) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (message.includes('404')) {
        errorMessage = 'Orders API endpoint not found. Please contact support.';
      } else if (message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your connection.';
      }
    } else {
      errorDetails = String(error);
    }
    return <div>{errorDetails}</div>;
  }


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-600 mb-4">{errorMessage}</p>
        <p className="text-sm text-gray-500 mb-4">Details: {errorMessage}</p>

        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="text-blue-600 hover:underline text-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
