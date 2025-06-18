import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

interface OrderItem {
        product_id: number;
        name: string;
        price: number;
        quantity: number;
        discount_percentage: number;
        image_url: string;
      }

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = (decoded as jwt.JwtPayload).id;

    const body = await req.json();
    const { shippingAddress, billingAddress, paymentMethod, items } = body;

    if (!shippingAddress || !billingAddress || !paymentMethod) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      let orderItems: OrderItem[] = [];
      let total = 0;

      // Handle "Buy Now" flow
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const productRes = await client.query(
            'SELECT * FROM products WHERE id = $1',
            [item.productId]
          );

          if (productRes.rows.length === 0) {
            return NextResponse.json(
              { message: `Product not found: ${item.productId}` },
              { status: 400 }
            );
          }

          const product = productRes.rows[0];
          
          // Check stock
          if (product.stock < item.quantity) {
            return NextResponse.json(
              { message: `Insufficient stock for ${product.name}` },
              { status: 400 }
            );
          }

          orderItems.push({
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            discount_percentage: product.discount_percentage,
            image_url: product.image_url
          });

          const discountedPrice = product.price * (1 - product.discount_percentage / 100);
          total += discountedPrice * item.quantity;
        }
      } 
      // Handle cart flow
      else {
        const cartResult = await client.query(
          `SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, 
                  p.discount_percentage, p.image_url, p.stock
           FROM carts c
           JOIN cart_items ci ON c.id = ci.cart_id
           JOIN products p ON ci.product_id = p.id
           WHERE c.user_id = $1`,
          [userId]
        );

        const cartItems = cartResult.rows;

        if (cartItems.length === 0) {
          return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
        }

        // Check stock for all cart items
        for (const item of cartItems) {
          if (item.stock < item.quantity) {
            return NextResponse.json(
              { message: `Insufficient stock for ${item.name}` },
              { status: 400 }
            );
          }
        }

        orderItems = cartItems.map((item: {
          product_id: number;
          name: string;
          price: number;
          quantity: number;
          discount_percentage: number;
          image_url: string;
        }): OrderItem => ({
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          discount_percentage: item.discount_percentage,
          image_url: item.image_url
        }));

        total = cartItems.reduce((sum, item) => {
          const discountedPrice = item.price * (1 - item.discount_percentage / 100);
          return sum + discountedPrice * item.quantity;
        }, 0);
      }

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (
          user_id, total_amount, status, payment_method,
          shipping_address, billing_address
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
        [userId, total, 'pending', paymentMethod, shippingAddress, billingAddress]
      );

      const orderId = orderResult.rows[0].id;

      // Create order items
      for (const item of orderItems) {
        await client.query(
          `INSERT INTO order_items (
            order_id, product_id, product_name,
            unit_price, quantity, discount_percentage
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            orderId,
            item.product_id,
            item.name,
            item.price,
            item.quantity,
            item.discount_percentage
          ]
        );

        // Update product stock
        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }

      // Clear cart if it was a cart checkout
      if (!items) {
        await client.query(
          `DELETE FROM cart_items
           WHERE cart_id IN (
             SELECT id FROM carts WHERE user_id = $1
           )`,
          [userId]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        orderId,
        message: 'Order placed successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}