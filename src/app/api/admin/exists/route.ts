import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await pool.query(
            'SELECT COUNT(*) FROM users WHERE role = $1',
            ['admin']
        );

        const adminCount = parseInt(result.rows[0].count, 10);
        return NextResponse.json({ exists: adminCount > 0 });
    } catch (error) {
        return NextResponse.json({ message: 'Error checking admin status' }, { status: 500 });
    }
}
