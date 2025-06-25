import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const categoryId = (await params).id;

  try {
    const result = await pool.query(
      `SELECT image_url
       FROM products
       WHERE category_id = $1 AND featured = true
       ORDER BY created_at DESC
       LIMIT 4`,
      [categoryId]
    );

    const images = result.rows.map(product => product.image_url);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
