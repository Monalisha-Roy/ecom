import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET as string;
const TOKEN_EXPIRY = '1h'; // 1 hour

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

// Add this function to check admin existence
async function checkAdminExists() {
  try {
    const result = await pool.query(
      'SELECT EXISTS(SELECT 1 FROM users WHERE role = $1)',
      ['admin']
    );
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, ...data } = await req.json();

    if (action === 'register') {
      return await handleRegister(data);
    } else if (action === 'login') {
      return await handleLogin(data);
    } else if (action === 'logout') {
      return handleLogout(req);
    } else {
      return NextResponse.json(
        { message: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in auth handler:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleRegister({
  name,
  email,
  password,
  isInitialSetup,
}: {
  name: string;
  email: string;
  password: string;
  isInitialSetup?: boolean;
}) {
  // Validate input
  if (!name || !email || !password) {
    return NextResponse.json(
      { message: 'All fields are required' },
      { status: 400 }
    );
  }

  try {
    // Check if user exists
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (userExists.rows.length > 0) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Determine role
    let role = 'user';
    if (isInitialSetup) {
      const adminExists = await checkAdminExists();
      
      if (adminExists) {
        return NextResponse.json(
          { message: 'Admin setup already completed' },
          { status: 403 }
        );
      }
      role = 'admin';
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword, role]
    );

    // Create JWT
    const token = jwt.sign(
      { 
        id: newUser.rows[0].id, 
        email: newUser.rows[0].email, 
        role: newUser.rows[0].role,
        name: newUser.rows[0].name
      }, 
      JWT_SECRET, 
      { expiresIn: TOKEN_EXPIRY }
    );

    // Set cookie
    const response = NextResponse.json(
      { 
        message: 'User created successfully', 
        user: newUser.rows[0],
        isAdminSetup: isInitialSetup && role === 'admin'
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60, // 1 hour
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  // Validate input
  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: 400 }
    );
  }

  try {
    // Find user
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const user = userResult.rows[0];
    
    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name
      }, 
      JWT_SECRET, 
      { expiresIn: TOKEN_EXPIRY }
    );

    // Return JSON response
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60, // 1 hour
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function handleLogout(req: NextRequest) {
  // Get the origin (protocol + host)
  const origin = req.nextUrl.origin;
  const response = NextResponse.redirect(`${origin}/`, { status: 302 });

  // Clear cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return response;
}