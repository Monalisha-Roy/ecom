'use client';
import { Suspense } from 'react';
import CheckoutPage from '@/components/checkout/checkout-page';
import LoadingSpinner from '@/components/ui/loading-spinner'; 

export default function Checkout() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CheckoutPage />
    </Suspense>
  );
}