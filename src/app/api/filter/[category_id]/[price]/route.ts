import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category_id: string; price: string }> }
) {
  const { category_id, price } = await params;

  if (category_id === "0") {
    try {
      const result = await pool.query(
        "SELECT * FROM products WHERE price <= $1",
        [price]
      );

      return NextResponse.json({ products: result.rows });
    } catch (error) {
      console.error("Error filtering products:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } else {
    try {
      const result = await pool.query(
        "SELECT * FROM products WHERE category_id = $1 AND price <= $2",
        [category_id, price]
      );

      return NextResponse.json({ products: result.rows });
    } catch (error) {
      console.error("Error filtering products:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
