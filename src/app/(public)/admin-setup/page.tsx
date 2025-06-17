'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSetupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const response = await fetch('/api/admin/exists');
        const data = await response.json();
        setAdminExists(data.exists);
        console.log('Admin exists:', data.exists);
      } catch (err) {
        console.error('Failed to check admin status', err);
      }
    };
    
    checkAdminExists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name,
          email,
          password,
          role: 'admin',
          isInitialSetup: true
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create admin');
      }
      
      router.push('/admin/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to create admin');
      } else {
        setError('Failed to create admin');
      }
    } finally {
      setLoading(false);
    }
  };

  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Admin Setup Already Completed</h1>
          <p>An admin account already exists. Please log in to access the admin dashboard.</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Initial Admin Setup</h1>
        <p className="mb-6 text-gray-600">
          Welcome! It looks like this is your first time setting up the system. 
          Please create an admin account.
        </p>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating Admin...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
}