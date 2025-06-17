// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET as string;

// app/api/auth/me/route.ts
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded !== 'object' || decoded === null || !('id' in decoded)) {
      return NextResponse.json(
        { message: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const userId = (decoded as jwt.JwtPayload).id;

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, name, email, role FROM users WHERE id = $1',
        [userId]
      );
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ user: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    // Specific error handling
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as { name?: string }).name === 'TokenExpiredError'
    ) {
      return NextResponse.json(
        { message: 'Token expired' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }
}