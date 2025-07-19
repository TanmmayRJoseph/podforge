import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        // 🔑 Authenticate
        const cookieToken = request.cookies.get("token")?.value;
        const headerToken = request.headers.get("Authorization")?.replace("Bearer ", "");
        const token = cookieToken || headerToken;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        } catch {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }

        const userId = decoded.id;

        // 📥 Get body data
        const { podcastId } = await request.json();

        if (!podcastId) {
            return NextResponse.json({ error: "Podcast ID is required" }, { status: 400 });
        }

        // 💾 Create like
        const like = await prisma.like.create({
            data: {
                podcastId,
                userId,
            },
        });

        return NextResponse.json({ message: "Podcast liked", like }, { status: 201 });

    } catch (err: any) {
        // Handle unique constraint error
        if (err.code === "P2002") {
            return NextResponse.json({ error: "You already liked this podcast" }, { status: 409 });
        }

        console.error("Like API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
