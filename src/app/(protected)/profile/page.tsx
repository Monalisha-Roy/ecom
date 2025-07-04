import { getServerUser } from '@/lib/server-auth';
import UserProfile from '@/components/profile/profile';

export default async function ProfilePage() {
 const user = await getServerUser();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-8 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <UserProfile  />
    </div>
  );
}