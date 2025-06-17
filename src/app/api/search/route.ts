// pages/api/search/route.ts (or route.js)
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get("q");

  if (!searchQuery) {
    return NextResponse.json({ error: "Search query required" }, { status: 400 });
  }

  const keywords = searchQuery.trim().split(/\s+/); // split by spaces

  // Build dynamic SQL
  const conditions = keywords
    .map((_, i) => `(LOWER(name) LIKE LOWER($${i + 1}) OR LOWER(description) LIKE LOWER($${i + 1}))`)
    .join(" AND ");

  const values = keywords.map(k => `%${k}%`);

  try {
    const result = await pool.query(
      `SELECT * FROM products WHERE ${conditions}`,
      values
    );

    return NextResponse.json({ products: result.rows });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
