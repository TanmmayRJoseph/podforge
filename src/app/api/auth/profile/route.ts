/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/utils/prisma";

export async function GET(request: NextRequest) {
    try {
        // Get token from cookie
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
        }

        // Verify token
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        } catch {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }

        //  Fetch user from DB
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (err) {
        console.error("Profile API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// API Response
/*
{
    "user": {
        "id": "0c421ae1-fd83-4210-965a-dcbd320dd30b",
        "email": "user@example.com",
        "name": "User Name",
        "createdAt": "2025-07-05T16:48:37.121Z"
    }
}
*/
