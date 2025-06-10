import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { name, description, price, category_id, image_url, stock, discount_percentage, featured } = await request.json();

        // Validate required fields
        const requiredFields = { name, description, price, category_id, image_url, stock, discount_percentage, featured };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (value === undefined || value === null || value === "") {
                return NextResponse.json({ error: `Field '${key}' is required` }, { status: 400 });
            }
        }

        // Insert product into the database
        const result = await pool.query(
            'INSERT INTO products (name, description, price, category_id, image_url, stock, discount_percentage, featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, description, price, category_id, image_url, stock, discount_percentage, featured]
        );

        return NextResponse.json({ product: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Error adding product:", error);
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}