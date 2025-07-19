/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/utils/prisma";

export async function GET(request: NextRequest) {
    try {
        // 🔑 Get token from cookie
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
        }

        // 🔒 Verify token
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        } catch {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }

        const userId = decoded.id;

        // 🎧 Fetch podcasts uploaded by this user
        const podcasts = await prisma.podcast.findMany({
            where: { uploadedBy: userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                imageUrl: true,
                description: true,
                audioUrl: true,
                tags: true,
                createdAt: true
            }
        });

        return NextResponse.json({ podcasts }, { status: 200 });

    } catch (err) {
        console.error("MyPodcasts API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
