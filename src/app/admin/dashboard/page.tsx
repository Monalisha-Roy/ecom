// app/admin/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/server-auth';
import AddProduct from "@/components/admin/addProducts";
import DeleteAndEditProducts from "@/components/admin/deleteAndEdit";

export default async function AdminDashboard() {
  const user = await getServerUser();
  
  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/');

  return (
    <div className="w-full min-h-screen mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AddProduct />
      <DeleteAndEditProducts />
    </div>
  );
}