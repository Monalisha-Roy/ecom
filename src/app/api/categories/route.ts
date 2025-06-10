import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const result = await pool.query('SELECT id, name, slug FROM categories');
        return NextResponse.json({ categories: result.rows });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}