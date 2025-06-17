import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, email, password, isInitialSetup } = await req.json();
  
  // Forward to main auth handler
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'register',
      name,
      email,
      password,
      isInitialSetup
    }),
  });
  
  return response;
}