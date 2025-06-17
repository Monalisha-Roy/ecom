// components/UserProfile.tsx
'use client';

import useUser from '@/hooks/useUser';

export default function UserProfile() {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}