// components/UserProfile.tsx
'use client';

import useUser from '@/hooks/useUser';
import Link from 'next/link';
import { useState } from 'react';

export default function UserProfile() {
  const { user, loading } = useUser();
  const [openProfile, setOpenProfile] = useState(false);

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="p-4 min-h-screen w-11/12 mx-auto">
      <h2 className="text-xl font-bold mb-2">Helo! {user.name}</h2>

      <div className='my-10 flex gap-3'>
        <button onClick={() => setOpenProfile(!openProfile)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          View Profile Details
        </button>
        
        <Link href={`/orders`} className=" inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          View Order History  
        </Link>
      </div>
      {openProfile && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        )}
    </div>
  );
}