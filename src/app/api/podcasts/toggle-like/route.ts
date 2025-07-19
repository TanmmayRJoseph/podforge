import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        // 🔐 Authenticate
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

        // 📥 Get podcastId
        const { podcastId } = await request.json();

        if (!podcastId) {
            return NextResponse.json({ error: "Podcast ID is required" }, { status: 400 });
        }

        // 🔍 Check if like exists
        const existingLike = await prisma.like.findUnique({
            where: {
                podcastId_userId: {
                    podcastId,
                    userId,
                },
            },
        });

        let action = "";
        if (existingLike) {
            // 🗑 Unlike
            await prisma.like.delete({
                where: {
                    podcastId_userId: {
                        podcastId,
                        userId,
                    },
                },
            });
            action = "unliked";
        } else {
            // ❤️ Like
            await prisma.like.create({
                data: {
                    podcastId,
                    userId,
                },
            });
            action = "liked";
        }

        // 🔢 Get updated like count
        const likeCount = await prisma.like.count({
            where: { podcastId },
        });

        return NextResponse.json({
            message: `Podcast ${action}`,
            likeCount,
        }, { status: 200 });

    } catch (err) {
        console.error("Toggle Like API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
