import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  discount_percentage: number;
  // Removed image_url since it doesn't exist in your schema
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  payment_method: string;
  shipping_address: string;
  billing_address: string;
  items: OrderItem[];
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = (decoded as jwt.JwtPayload).id;

    const client = await pool.connect();
    try {
      // Fetch orders
      const ordersResult = await client.query(
        `SELECT id, created_at, total_amount, status, 
                payment_method, shipping_address, billing_address
         FROM orders 
         WHERE user_id = $1 
         ORDER BY created_at DESC`,
        [userId]
      );
      
      // Fetch items for each order
      const ordersWithItems: Order[] = await Promise.all(
        ordersResult.rows.map(async (order) => {
            const itemsResult = await client.query(
            `SELECT oi.id, oi.product_id, oi.product_name, oi.unit_price, 
                oi.quantity, oi.discount_percentage, p.image_url
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = $1`,
            [order.id]
            );
          
          return {
            ...order,
            items: itemsResult.rows
          };
        })
      );
      
      return NextResponse.json({ orders: ordersWithItems }, { status: 200 });
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { 
        error: 'Invalid authentication token',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 401 }
    );
  }
}