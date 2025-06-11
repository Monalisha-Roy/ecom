import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const result = await pool.query('SELECT * from products');
        return NextResponse.json({ products: result.rows });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}