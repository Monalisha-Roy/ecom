// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = (decoded as jwt.JwtPayload).id;
    
    const { productId, quantity } = await req.json();
    
    // Validate input
    if (!productId || !quantity) {
      return NextResponse.json(
        { message: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }
    
    const client = await pool.connect();
    
    try {
      // Get user's cart or create one if doesn't exist
      const cartResult = await client.query(
        'SELECT id FROM carts WHERE user_id = $1',
        [userId]
      );
      
      let cartId;
      if (cartResult.rows.length === 0) {
        // Create a new cart
        const newCart = await client.query(
          'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
          [userId]
        );
        cartId = newCart.rows[0].id;
      } else {
        cartId = cartResult.rows[0].id;
      }
      
      // Check if product already exists in cart
      const existingItem = await client.query(
        'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
        [cartId, productId]
      );
      
      if (existingItem.rows.length > 0) {
        // Update quantity if product already in cart
        const newQuantity = existingItem.rows[0].quantity + quantity;
        await client.query(
          'UPDATE cart_items SET quantity = $1 WHERE id = $2',
          [newQuantity, existingItem.rows[0].id]
        );
      } else {
        // Add new item to cart
        await client.query(
          `INSERT INTO cart_items (cart_id, product_id, quantity) 
           VALUES ($1, $2, $3)`,
          [cartId, productId, quantity]
        );
      }
      
      return NextResponse.json({ message: 'Product added to cart' });
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && (error as { name: string }).name === 'JsonWebTokenError') {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = (decoded as jwt.JwtPayload).id;
    
    const client = await pool.connect();
    
    try {
      // Get cart items with product details
      const result = await client.query(
        `SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.discount_percentage, p.image_url
         FROM carts c
         JOIN cart_items ci ON c.id = ci.cart_id
         JOIN products p ON ci.product_id = p.id
         WHERE c.user_id = $1`,
        [userId]
      );
      
      return NextResponse.json({ items: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = (decoded as jwt.JwtPayload).id;
    
    const { itemId, quantity } = await req.json();
    
    // Validate input
    if (!itemId || !quantity) {
      return NextResponse.json(
        { message: 'Item ID and quantity are required' },
        { status: 400 }
      );
    }
    
    const client = await pool.connect();
    
    try {
      // Update cart item quantity
      await client.query(
        `UPDATE cart_items ci
         SET quantity = $1
         FROM carts c
         WHERE ci.id = $2
         AND ci.cart_id = c.id
         AND c.user_id = $3`,
        [quantity, itemId, userId]
      );
      
      return NextResponse.json({ message: 'Cart updated' });
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && (error as { name: string }).name === 'JsonWebTokenError') {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = (decoded as jwt.JwtPayload).id;
    
    const { itemId } = await req.json();
    
    // Validate input
    if (!itemId) {
      return NextResponse.json(
        { message: 'Item ID is required' },
        { status: 400 }
      );
    }
    
    const client = await pool.connect();
    
    try {
      // Delete cart item
      await client.query(
        `DELETE FROM cart_items ci
         USING carts c
         WHERE ci.id = $1
         AND ci.cart_id = c.id
         AND c.user_id = $2`,
        [itemId, userId]
      );
      
      return NextResponse.json({ message: 'Item removed from cart' });
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && (error as { name: string }).name === 'JsonWebTokenError') {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    console.error('Error removing item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}