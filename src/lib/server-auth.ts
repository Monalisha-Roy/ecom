// lib/server-auth.ts
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function getServerUser(): Promise<CurrentUser | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;
  
  if (!token) return null;
  
  try {
    interface JwtPayload {
      id: string;
      name?: string;
      email?: string;
      role?: string;
      // add other fields if needed
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT id, name, email, role FROM users WHERE id = $1',
        [decoded.id]
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  } catch (error) {
    return null;
  }
}