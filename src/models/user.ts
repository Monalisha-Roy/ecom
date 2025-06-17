import pool from '@/lib/db';
import { User } from '@/types/types';


// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

// Find user by ID
export async function findUserById(id: string): Promise<User | null> {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

// Check if an admin user exists
export async function checkIfAdminExists(): Promise<boolean> {
  const result = await pool.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['admin']);
  return result.rows.length > 0;
}

// Check if a user exists by email
export async function userExists(email: string): Promise<boolean> {
  const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  return result.rows.length > 0;
}

// Create a new user
export async function createUser({
  name,
  email,
  password,
  role = 'user',
}: {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}): Promise<void> {
  await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
    [name, email, password, role]
  );
}

// 🛠️ Optional: Promote a user to admin
export async function promoteToAdmin(email: string): Promise<void> {
  await pool.query('UPDATE users SET role = $1 WHERE email = $2', ['admin', email]);
}
