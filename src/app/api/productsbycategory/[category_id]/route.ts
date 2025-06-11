import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ category_id: string }> }
) {
  const category_id = (await params).category_id;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM products
      WHERE category_id = $1
      `,
      [category_id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "No products found for this category" }, { status: 404 });
    }

    return NextResponse.json({ products: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}