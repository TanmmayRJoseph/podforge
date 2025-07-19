import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";



export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        // 🛑 Basic validation
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // 🔍 Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });


        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        // 🔒 Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ message: "User registered successfully", user }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


// API Response
/*
{
    "message": "User registered successfully",
    "user": {
        "id": "400a210c-349b-4608-b08a-44a04787372d",
        "email": "user1@example.com",
        "name": "User Name1",
        "createdAt": "2025-07-06T08:18:31.452Z"
    }
}
*/
