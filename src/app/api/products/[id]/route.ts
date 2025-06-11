import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const productId = (await params).id;

  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [productId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully", }, );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
  const productId = (await params).id;

  try {
    const body = await req.json();

    const {
      name,
      description,
      price,
      stock,
      featured,
      image_url,
      discount_percentage,
      category_id,
    } = body;

    const result = await pool.query(
      `
      UPDATE products
      SET name = $1,
          description = $2,
          price = $3,
          stock = $4,
          featured = $5,
          image_url = $6,
          discount_percentage = $7,
          category_id = $8,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *;
      `,
      [
        name,
        description,
        price,
        stock,
        featured,
        image_url,
        discount_percentage,
        category_id,
        productId,
      ]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
