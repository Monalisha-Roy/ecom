import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}

interface LoginBody {
    email?: string;
    password?: string;
}

export async function POST(req: Request) {
    try {
        const body: LoginBody = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // In real case, verify from DB
        if (email === "admin@example.com" && password === "admin123") {
            const token = jwt.sign({ email }, SECRET as string, { expiresIn: "1h" });
            return NextResponse.json({ token });
        }

        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
