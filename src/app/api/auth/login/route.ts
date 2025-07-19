import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        //  Basic validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // 🔍 Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 🔐 Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // 🪪 Create JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        // ✅ Create response and set cookie
        const response = NextResponse.json(
            { token, message: "Login successful", user },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}



// API Response
/*
{
    "token": "",
    "message": "Login successful",
    "user": {
        "id": "0c421ae1-fd83-4210-965a-dcbd320dd30b",
        "email": "user@example.com",
        "password": "$2b$10$cBaKV41.4RLioxkX/EruJOLklmc30ln85hK.SKDKH70b2s9KksH3i",
        "name": "User Name",
        "createdAt": "2025-07-05T16:48:37.121Z"
    }
}
*/